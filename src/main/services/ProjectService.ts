import log from 'electron-log';
import path from 'path';
import {Project} from '../workspace/Project';
import {workspace} from '../workspace/Workspace';
import {ProjectFilterPath} from '../workspace/filters/ProjectFilterPath';
import {FingerprintPipelineTask} from '../task/scanner/scannerPipeline/FingerprintPipelineTask';
import { NewProjectDTO } from '../../api/dto';

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



}

export const projectService = new ProjectService();
