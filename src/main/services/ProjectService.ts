import log from 'electron-log';
import path from 'path';
import { IProjectInfoMetadata } from '@api/types';
import fs from 'fs';
import {AppDefaultValues} from "../../config/AppDefaultValues";
import {Project} from '../workspace/Project';
import {workspace} from '../workspace/Workspace';
import {ProjectFilterPath} from '../workspace/filters/ProjectFilterPath';
import {FingerprintPipelineTask} from '../task/scanner/scannerPipeline/FingerprintPipelineTask';
import { NewProjectDTO, ObfuscationDTO, ProjectPackageDTO } from '../../api/dto';
import { WFPObfuscationTask } from '../task/obfuscation/WFPObfuscationTask';
import { FossityPackagerTask } from '../task/fossityPackagerTask/FossityPackagerTask';

class ProjectService {
  public async createProject(projectDTO: NewProjectDTO) {
    const p = await this.create(projectDTO);
    await new FingerprintPipelineTask().run(p);
  }

  public async resume(projectPath: string) {
    await workspace.closeAllProjects();
    const p = await workspace.getProject(new ProjectFilterPath(projectPath));
  }

  private async createNewProject(projectDTO: NewProjectDTO): Promise<Project> {
    const p = await workspace.createProject(projectDTO);
    log.transports.file.resolvePath = () =>  path.join(p.metadata.getMyPath(), AppDefaultValues.PROJECT.PROJECT_LOG);

    p.save();
    return p;
  }

  private async create(
    projectDTO: NewProjectDTO,
    event: Electron.WebContents = null
  ): Promise<Project> {
    await workspace.closeAllProjects();
    const p = await this.createNewProject(projectDTO);
    return p;
  }

  public async obfuscateWFP(words: Array<string>): Promise<ObfuscationDTO>{
    const wordsToObfuscate = words.sort((a, b)=> b.length - a.length);
    const p = workspace.getOpenedProjects()[0];
    const response = await new WFPObfuscationTask(p.getMyPath(), path.join(p.getMyPath(),  AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.WINNOWING_WFP),wordsToObfuscate).run();
    return response;
  }

  public async deofuscateWFP(): Promise<ObfuscationDTO> {
    const p = workspace.getOpenedProjects()[0];
    const dictionary = await fs.promises.readFile(path.join(p.getMyPath(),AppDefaultValues.PROJECT.OBFUSCATION_MAPPER),'utf-8');
    const mapper = JSON.parse(dictionary);
    const response = await new WFPObfuscationTask(p.getMyPath(), path.join(p.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.WINNOWING_WFP), mapper).run();
    return response;
  }

  public async fossityPackager(params: ProjectPackageDTO) {
    if(!params.targetPath.toLowerCase().endsWith('.fossity')) params.targetPath = `${params.targetPath}.fossity`;
    if (path.extname(params.targetPath).toLowerCase() !== '.fossity')
      throw new Error('File type not supported');

    if (!(await this.isValidObfuscatedFile(params.projectPath))) {
      throw new Error("Invalid project metadata");
    }

    await new FossityPackagerTask().run({inputPath: path.join(params.projectPath,  AppDefaultValues.PROJECT.OUTPUT), outputPath: params.targetPath});
  }

  private async isValidObfuscatedFile(projectPath:string): Promise<boolean> {
    let validFiles = true;
    const requiredFiles = [AppDefaultValues.PROJECT.WINNOWING_WFP, AppDefaultValues.PROJECT.OUTPUT_METADATA, AppDefaultValues.PROJECT.FILE_COUNT];
    const folderFiles = new Set<string>();
    const dirContent = await fs.promises.readdir(path.join(projectPath, AppDefaultValues.PROJECT.OUTPUT));
    for (const file of dirContent) {
      folderFiles.add(file);
    }
    for(let i = 0; i < requiredFiles.length ; i+=1 ) {
      if (!folderFiles.has(requiredFiles[i])) {
        validFiles = false;
        break;
      }
    }
    const metadata = await fs.promises.readFile(path.join(projectPath,AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.OUTPUT_METADATA),'utf-8');
    const projectMetadata: IProjectInfoMetadata = JSON.parse(metadata);

    if (!validFiles  ||  projectMetadata.contact.email === undefined  || projectMetadata.contact.email === "")
      return false;

    return true;
  }
}

export const projectService = new ProjectService();
