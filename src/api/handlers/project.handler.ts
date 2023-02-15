import { ipcMain } from 'electron';
import log from 'electron-log';
import { NewProjectDTO, ProjectPackageDTO } from '@api/dto';
import {
  FileTreeViewMode,
  IWorkbenchFilter
} from '../types';
import { IpcChannels } from '../ipc-channels';
import { Response } from '../Response';
import { ProjectFilterPath } from '../../main/workspace/filters/ProjectFilterPath';
import { Project } from '../../main/workspace/Project';
import { workspace } from '../../main/workspace/Workspace';
import { projectService } from '../../main/services/ProjectService';
import { WFPObfuscationTask } from '../../main/task/obfuscationTask/WFPObfuscationTask/WFPObfuscationTask';

ipcMain.handle(IpcChannels.PROJECT_OPEN_SCAN, async (event, arg: any) => {
  // TODO: factory to create filters depending on arguments
  const p: Project = await workspace.openProject(new ProjectFilterPath(arg));
  const response = {
    logical_tree: p.getTree().getRootFolder(),
    work_root: p.getMyPath(),
    scan_root: p.getScanRoot(),
    uuid: p.getUUID(),
    metadata: p.metadata,
  };
  return {
    status: 'ok',
    message: 'Project loaded',
    data: response,
  };
});

function getUserHome() {
  // Return the value using process.env
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}

ipcMain.handle(IpcChannels.PROJECT_STOP_SCAN, async (_event) => {
  const projectList = workspace.getOpenedProjects();
  let pPromises = [];
  for (const p of projectList) pPromises.push(p.save());
  await Promise.all(pPromises);

  pPromises = [];
  for (const p of projectList) pPromises.push(p.close());
  await Promise.all(pPromises);
});

ipcMain.handle(
  IpcChannels.PROJECT_RESUME_SCAN,
  async (event, projectPath: string) => {
    try {
      await projectService.resume(projectPath);
      return Response.ok();
    } catch (error: any) {
      console.error(error);
      return Response.fail({ message: error.message });
    }
  }
);

ipcMain.handle(IpcChannels.UTILS_PROJECT_NAME, async (event) => {
  const projectName = workspace.getOpenedProjects()[0].project_name;
  return {
    status: 'ok',
    message: 'Project name retrieve succesfully',
    data: projectName,
  };
});

ipcMain.handle(IpcChannels.UTILS_GET_NODE_FROM_PATH, (event, path: string) => {
  try {
    const p = workspace.getOpenedProjects()[0];
    const node = p.getTree().getNode(path);
    return Response.ok({
      message: 'Node from path retrieve succesfully',
      data: node,
    });
  } catch (e: any) {
    return Response.fail({ message: e.message });
  }
});

ipcMain.handle(IpcChannels.PROJECT_READ_TREE, (event) => {
  try {
    const tree = workspace.getOpenedProjects()[0].getTree().getRootFolder();
    return Response.ok({ message: 'Tree read successfully', data: tree });
  } catch (e: any) {
    return Response.fail({ message: e.message });
  }
});

ipcMain.handle(
  IpcChannels.PROJECT_SET_FILTER,
  async (event, filter: IWorkbenchFilter) => {
    try {
      const p = workspace.getOpenedProjects()[0];
      await p.setGlobalFilter(filter);
      return Response.ok({ message: 'Filter setted succesfully', data: true });
    } catch (e: any) {
      return Response.fail({ message: e.message });
    }
  }
);

ipcMain.handle(
  IpcChannels.PROJECT_SET_FILE_TREE_VIEW_MODE,
  async (event, mode: FileTreeViewMode) => {
    try {
      const p = workspace.getOpenedProjects()[0];
      p.setFileTreeViewMode(mode);
      return Response.ok({ message: 'Filter setted successfully', data: true });
    } catch (e: any) {
      return Response.fail({ message: e.message });
    }
  }
);

ipcMain.handle(
  IpcChannels.PROJECT_CREATE,
  async (_event, projectDTO: NewProjectDTO) => {
    try {
      const project = await projectService.createProject(projectDTO);
      return Response.ok({ data: project, message: 'Project created successfully'});
    } catch (error: any) {
      log.error('[CREATE PROJECT]', error);
      return Response.fail({ message: error.message });
    }
  }
);

ipcMain.handle(
  IpcChannels.PROJECT_UPDATE,
  async (_event, projectDTO: NewProjectDTO) => {
    try {
      const project = await projectService.updateProject(projectDTO);
      return Response.ok({ data: project, message: 'Project updated successfully'});
    } catch (error: any) {
      log.error('[CREATE PROJECT]', error);
      return Response.fail({ message: error.message });
    }
  }
);

ipcMain.handle(
  IpcChannels.PROJECT_CREATE_FOSSITY_PACKAGE,
  async (_event, params: ProjectPackageDTO) => {
    try {
      await projectService.fossityPackager(params);
      return Response.ok({ message: 'Fossity package', data: true });
    } catch (error: any) {
      log.error('[FOSSITY PACKAGER]', error);
      return Response.fail({ message: error.message });
    }
  }
);
ipcMain.handle(
  IpcChannels.PROJECT_CREATE_FINGERPRINTS,
  async (_event) => {
    try {
      await projectService.createFingerprints();
      return Response.ok({ message: 'Fossity package', data: true });
    } catch (error: any) {
      log.error('[FOSSITY PACKAGER]', error);
      return Response.fail({ message: error.message });
    }
  }
);


