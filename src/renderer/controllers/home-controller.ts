import { projectService } from '@api/services/project.service';
import { workspaceService } from '@api/services/workspace.service';
import { NewProjectDTO } from '@api/dto';
import { IMetadata } from '@api/types';


export const create = async (project: NewProjectDTO): Promise<IMetadata> => {
  return projectService.create(project);
};

export const scan = async () => {
  await projectService.createFingerprints();
};


export const resume = async (path: string) => {
  const response = await projectService.resume(path);
};

export const rescan = async (path: string) => {
  await projectService.rescan(path);
};

export const open = async (path: string) => {
  const response = await projectService.load(path);
  return response;
};
