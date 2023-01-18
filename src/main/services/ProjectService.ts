import log from 'electron-log';
import {
  INewProject,
  ProjectState,
} from '../../api/types';
import {Project} from '../workspace/Project';
import {workspace} from '../workspace/Workspace';
import {modelProvider} from './ModelProvider';
import {Scanner} from '../task/scanner/types';
import {userSettingService} from './UserSettingService';
import {ProjectFilterPath} from '../workspace/filters/ProjectFilterPath';
import {CodeScannerPipelineTask} from '../task/scanner/scannerPipeline/CodeScannerPipelineTask';
import {ScannerPipelineFactory} from "../task/scanner/scannerPipelineFactory/ScannerPipelineFactory";
import ScannerType = Scanner.ScannerType;
import ScannerMode = Scanner.ScannerMode;

class ProjectService {
  public async createProject(projectDTO: INewProject) {
    const p = await this.create(projectDTO);
    await new CodeScannerPipelineTask().run(p);
  }

  public async reScan(projectPath: string) {
    await workspace.closeAllProjects();
    const p = await workspace.getProject(new ProjectFilterPath(projectPath));
  /*  p.metadata.getScannerConfig().mode = Scanner.ScannerMode.RESCAN;
    await ScannerPipelineFactory.getScannerPipeline(p.metadata.getScannerConfig().source).run(p);*/
  }

  public async resume(projectPath: string) {
    await workspace.closeAllProjects();
    const p = await workspace.getProject(new ProjectFilterPath(projectPath));
/*    const scanner = new CodeScannerPipelineTask();
    await ScannerPipelineFactory.getScannerPipeline(p.metadata.getScannerConfig().source).run(p);*/
  }

  private async createNewProject(projectDTO: INewProject): Promise<Project> {
    const p = await workspace.createProject(projectDTO);
    log.transports.file.resolvePath = () =>
      `${p.metadata.getMyPath()}/project.log`;
    p.save();
    return p;
  }

  private async create(
    projectDTO: INewProject,
    event: Electron.WebContents = null
  ): Promise<Project> {
    await workspace.closeAllProjects();
    const p = await this.createNewProject(projectDTO);
    return p;
  }



}

export const projectService = new ProjectService();
