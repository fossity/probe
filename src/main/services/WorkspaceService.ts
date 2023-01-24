import { IProject } from '@api/types';
import fs from 'fs';
import { workspace } from '../workspace/Workspace';

class WorkspaceService {

  public async getAllProjects(): Promise<Array<IProject>> {
    const projects = [];
   const projectMetadata =  workspace.getProjectsMetadata();
   for(let i = 0; i<projectMetadata.length; i+=1){
     const projectInfoMetadata = await fs.promises.readFile(
       `${projectMetadata[i].work_root}/obfuscated/projectMetadata.json`,
       'utf8'
     );
     const pim = JSON.parse(projectInfoMetadata);
     const iProject = Object.assign({} as IProject,projectMetadata[i]);
     iProject.data = pim;
     projects.push(iProject);
   }
   return projects;
  }

}
export const workspaceService = new WorkspaceService();
