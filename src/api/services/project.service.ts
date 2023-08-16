import { NewProjectDTO, ProjectPackageDTO } from '@api/dto';
import { IpcChannels } from '../ipc-channels';
import {
  FileTreeViewMode, IMetadata,
  IProject,
  IWorkbenchFilter,
} from '../types';
import { BaseService } from './base.service';

class ProjectService extends BaseService {
  public async get(args: Partial<IProject>): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.INVENTORY_GET,
      args,
    );
    return response;
  }

  public async resume(path: string): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_RESUME_SCAN,
      path,
    );
    return response;
  }

  public async stop(): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_STOP_SCAN,
    );
    return response;
  }

  public async create(project: NewProjectDTO): Promise<IMetadata> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_CREATE,
      project,
    );
    return this.response(response);
  }

  public async update(project: NewProjectDTO): Promise<IMetadata> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_UPDATE,
      project,
    );
    return this.response(response);
  }

  public async rescan(path: string): Promise<void> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_RESCAN,
      path,
    );
    return this.response(response);
  }

  public async load(path: string): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_OPEN_SCAN,
      path,
    );
    return response;
  }

  public async getProjectName(): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.UTILS_PROJECT_NAME,
    );
    return response;
  }

  public async getNodeFromPath(path: string): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.UTILS_GET_NODE_FROM_PATH,
      path,
    );
    return this.response(response);
  }

  public async getTree(): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_READ_TREE,
    );
    return this.response(response);
  }

  public async setFilter(filter: IWorkbenchFilter): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_SET_FILTER,
      filter,
    );
    return this.response(response);
  }

  public async setFileTreeViewMode(mode: FileTreeViewMode): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_SET_FILE_TREE_VIEW_MODE,
      mode,
    );
    return this.response(response);
  }

  public async packageProject(params: ProjectPackageDTO): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(IpcChannels.PROJECT_CREATE_FOSSITY_PACKAGE, params);
    return this.response(response);
  }

  public async createFingerprints(): Promise<true> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_CREATE_FINGERPRINTS,
    );
    return this.response(response);
  }

  public async validate(newProjectDTO: Partial<NewProjectDTO>): Promise<any> {
    const response = await window.electron.ipcRenderer.invoke(
      IpcChannels.PROJECT_VALIDATE,
      newProjectDTO,
    );
    return this.response(response);
  }
}
export const projectService = new ProjectService();
