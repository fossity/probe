import i18next from "i18next";
import fs from "fs";
import path from 'path';
import { Scanner } from '../scannerTask/types';
import { IProjectInfoMetadata, ScannerStage } from '../../../api/types';
import { Project } from "../../workspace/Project";
import { AppDefaultValues } from "../../../config/AppDefaultValues";

export class AttachFileTask implements Scanner.IPipelineTask {

  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  getStageProperties(): Scanner.StageProperties {
    return {
      name: ScannerStage.ATTACH_FILES,
      label: i18next.t('Title:AttachingFiles'),
      isCritical: true,
    };
  }

  public async run(params: void): Promise<boolean> {
   const metadata =  await fs.promises.readFile(path.join(this.project.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.OUTPUT_METADATA),'utf-8');
   const projectMetadata: IProjectInfoMetadata =  JSON.parse(metadata);
   if(!projectMetadata.software_composition_uri) return true; // avoid to write project metadata file
   await this.copyFiles(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT),projectMetadata.software_composition_uri);
   this.renameSoftwareCompositionUriFiles(projectMetadata);
   await fs.promises.writeFile(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.OUTPUT_METADATA),JSON.stringify(projectMetadata));
   return true;
  }

  private renameSoftwareCompositionUriFiles(projectMetadata : IProjectInfoMetadata): IProjectInfoMetadata{
    const fileNames =  projectMetadata.software_composition_uri.map((f)=> path.parse(f).base);
    projectMetadata.software_composition_uri = fileNames;
    return  projectMetadata;
  }


  private async copyFiles(target: string, files: Array<string>){
      return Promise.all(files.map((f) => {
        return fs.promises.copyFile(f, path.join(target,path.parse(f).base));
      }));
  }

}
