import log from 'electron-log';
import path from 'path';
import fs from 'fs';
import * as os from 'os';
import { app } from 'electron';
import {
  IMetadata, IProjectInfoMetadata, ProjectState, ScanState,
} from '../../api/types';
import { AppDefaultValues } from '../../config/AppDefaultValues';
import { Project } from '../workspace/Project';
import { workspace } from '../workspace/Workspace';
import { ProjectFilterPath } from '../workspace/filters/ProjectFilterPath';
import { NewProjectDTO, ProjectPackageDTO } from '../../api/dto';
import { FossityPackagerTask } from '../task/fossityPackagerTask/FossityPackagerTask';
import { IndexPipelineTask } from '../task/scannerTask/scannerPipeline/IndexPipelineTask';
import { FingerprintPipelineTask } from '../task/scannerTask/scannerPipeline/FingerprintPipelineTask';
import { ProjectFilterName } from '../workspace/filters/ProjectFilterName';
import { broadcastManager } from '../broadcastManager/BroadcastManager';
import { IpcChannels } from '../../api/ipc-channels';
import { CipherTask } from '../task/cipherTask/CipherTask';
import { getAssetFolderPath } from '../util';
import { fileHelper } from '../helpers/FileHelper';
import packageJson from '../../../release/app/package.json';

class ProjectService {
  public async createProject(projectDTO: NewProjectDTO): Promise<IMetadata> {
    let p: Project = null;
    if (!workspace.existProject(projectDTO.name)) {
      p = await this.create(projectDTO);
      await new IndexPipelineTask().run(p);
    } else {
      p = await workspace.openProject(new ProjectFilterName(projectDTO.name));
      await this.updateProjectMetadata(p, projectDTO);
      if (p.metadata.getScannerState() !== ScanState.INDEXED) await new IndexPipelineTask().run(p);
      broadcastManager.get().send(IpcChannels.SCANNER_FINISH_SCAN, {
        success: true,
        resultsPath: p.metadata.getMyPath(),
      });
    }
    return p.getDto();
  }

  public async updateProject(projectDTO: NewProjectDTO): Promise<IMetadata> {
    let p: Project = null;
    if (!workspace.existProject(projectDTO.name)) {
      p = await this.create(projectDTO);
    } else {
      p = await workspace.openProject(new ProjectFilterName(projectDTO.name));
      await this.updateProjectMetadata(p, projectDTO);
    }
    const dto = p.getDto();
    await p.close();
    return dto;
  }

  public async resume(projectPath: string) {
    await workspace.closeAllProjects();
    const p = await workspace.getProject(new ProjectFilterPath(projectPath));
  }

  private async createNewProject(projectDTO: NewProjectDTO): Promise<Project> {
    const p = await workspace.createProject(projectDTO);
    log.transports.file.resolvePath = () => path.join(p.metadata.getMyPath(), AppDefaultValues.PROJECT.PROJECT_LOG);
    p.save();
    return p;
  }

  private async create(
    projectDTO: NewProjectDTO,
    event: Electron.WebContents = null,
  ): Promise<Project> {
    await workspace.closeAllProjects();
    const p = await this.createNewProject(projectDTO);
    return p;
  }

  private async updateProjectMetadata(
    project: Project,
    projectDTO: NewProjectDTO,
  ): Promise<Project> {
    await fs.promises.writeFile(path.join(project.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.OUTPUT_METADATA), JSON.stringify(projectDTO.projectInfo));
    return project;
  }

  public async fossityPackager(params: ProjectPackageDTO) {
    // Zip stage
    if (!params.targetPath.toLowerCase().endsWith('.fossity')) params.targetPath = `${params.targetPath}.fossity`;
    if (path.extname(params.targetPath).toLowerCase() !== '.fossity') throw new Error('File type not supported');

    if (!(await this.isValidObfuscatedFile(params.projectPath))) {
      throw new Error('Invalid project metadata');
    }

    const tmpZipFile = path.join(os.tmpdir(), new Date().getTime().toString(), '-fossity.zip');
    await new FossityPackagerTask().run({ inputPath: path.join(params.projectPath, AppDefaultValues.PROJECT.OUTPUT), outputPath: tmpZipFile });

    // Cipher stage
    const publicKeyPath = path.join(getAssetFolderPath(), 'fossity_pub_key', 'fossity.pub');
    const publicKey = await fs.promises.readFile(publicKeyPath, 'utf-8');
    await new CipherTask().run({
      rsaPubKey: publicKey, inputPath: tmpZipFile, outputPath: params.targetPath, wantDecryptScript: false,
    });

    // TODO Remove the .zip tmp file?
    await fs.promises.unlink(tmpZipFile);
  }

  private async isValidObfuscatedFile(projectPath:string): Promise<boolean> {
    let validFiles = true;
    const requiredFiles = [AppDefaultValues.PROJECT.WINNOWING_WFP, AppDefaultValues.PROJECT.OUTPUT_METADATA, AppDefaultValues.PROJECT.FILE_COUNT];
    const folderFiles = new Set<string>();
    const dirContent = await fs.promises.readdir(path.join(projectPath, AppDefaultValues.PROJECT.OUTPUT));
    for (const file of dirContent) {
      folderFiles.add(file);
    }
    for (let i = 0; i < requiredFiles.length; i += 1) {
      if (!folderFiles.has(requiredFiles[i])) {
        validFiles = false;
        break;
      }
    }
    const metadata = await fs.promises.readFile(path.join(projectPath, AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.OUTPUT_METADATA), 'utf-8');
    const projectMetadata: IProjectInfoMetadata = JSON.parse(metadata);

    if (!validFiles || projectMetadata.contact.email === undefined || projectMetadata.contact.email === '') return false;

    return true;
  }

  public async createFingerprints():Promise<boolean> {
    const project = workspace.getOpenedProjects()[0];
    await new FingerprintPipelineTask().run(project);
    project.setState(ProjectState.CLOSED);
    project.save();
    return true;
  }

  public async validate(newProjectDTO: Partial<NewProjectDTO>) {
    const validProject : any = {
      valid: true,
      fields: {},
    };
    // validate  COMPOSITION_KNOWN_FILE_NAME
    if (newProjectDTO.projectInfo?.software_composition_known_uri) {
      const validSbomFile = await this.validateSbomFile(newProjectDTO.projectInfo.software_composition_known_uri, 'software_composition_known_uri');
      if (!validSbomFile.software_composition_known_uri.valid) validProject.valid = false;
      Object.assign(validProject.fields, validSbomFile);
    }

    // validate  COMPOSITION_KNOWN_IGNORE_NAME
    if (newProjectDTO.projectInfo?.software_composition_ignore_uri) {
      const validSbomFile = await this.validateSbomFile(newProjectDTO.projectInfo.software_composition_ignore_uri, 'software_composition_ignore_uri');
      if (!validSbomFile.software_composition_ignore_uri.valid) validProject.valid = false;
      Object.assign(validProject.fields, validSbomFile);
    }

    return validProject;
  }

  private async validateSbomFile(path: string, field: string) {
    const valid = await fileHelper.isValidJson(path);
    const error = valid ? null : 'Not a valid JSON';
    return {
      [field]: { valid, error },
    };
  }
}

export const projectService = new ProjectService();
