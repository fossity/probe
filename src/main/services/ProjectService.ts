import log from 'electron-log';
import path from 'path';
import {Project} from '../workspace/Project';
import {workspace} from '../workspace/Workspace';
import {ProjectFilterPath} from '../workspace/filters/ProjectFilterPath';
import {FingerprintPipelineTask} from '../task/scanner/scannerPipeline/FingerprintPipelineTask';
import { NewProjectDTO, ObfuscationDTO } from '../../api/dto';
import { WFPObfuscationTask } from '../task/obfuscation/WFPObfuscationTask';
import fs from 'fs';

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
    log.transports.file.resolvePath = () =>  path.join(p.metadata.getMyPath(), 'project.log');

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

  public async obfuscateWFP(words: Array<string>) : Promise<ObfuscationDTO>{
    const wordsToObfuscate = words.sort((a,b)=> b.length - a.length);
    const p = workspace.getOpenedProjects()[0];
    const response = await new WFPObfuscationTask(p.getMyPath(), path.join(p.getMyPath(),'obfuscated','winnowing.wfp'),wordsToObfuscate).run();
    return response;
  }

  public async deofuscateWFP() : Promise<ObfuscationDTO>{
    const p = workspace.getOpenedProjects()[0];
    const dictionary = await fs.promises.readFile(path.join(p.getMyPath(),'obfuscationMapper.json'),'utf-8');
    const mapper = JSON.parse(dictionary);
    const response = await new WFPObfuscationTask(p.getMyPath(), path.join(p.getMyPath(),'obfuscated','winnowing.wfp'),mapper).run();
    return response;
  }



}

export const projectService = new ProjectService();
