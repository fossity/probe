import i18next from "i18next";
import fs from "fs";
import path from 'path';
import { Scanner } from '../scannerTask/types';
import { IProjectInfoMetadata, ScannerStage } from '../../../api/types';
import { Project } from "../../workspace/Project";
import { AppDefaultValues } from "../../../config/AppDefaultValues";
import { fileExist } from "../../util";

export class AttachFileTask implements Scanner.IPipelineTask {

  private project: Project;

  private fileNumber = 0;

  private softwareCompositionUriFiles = [];

  constructor(project: Project) {
    this.project = project;
  }

  getStageProperties(): Scanner.StageProperties {
    return {
      name: ScannerStage.ATTACH_FILES,
      label: i18next.t('Title:ScanHints.AttachingFiles'),
      isCritical: true,
    };
  }

  private async copyFiles(target: string, files: Array<string>) {
    for(let i=0; i < files.length ; i+=1) {
      if(await fileExist(files[i])) {
        const fileNumber = this.fileNumber.toString(10).padStart(4, '0').toUpperCase();
        this.fileNumber += 1;
        const fileName = `SCA${fileNumber}_${path.parse(files[i]).base}`;
        await fs.promises.copyFile(files[i], path.join(target, fileName));
        this.softwareCompositionUriFiles.push(fileName);
      }
    }
  }


  public async run(params: void): Promise<boolean> {
   const metadata =  await fs.promises.readFile(path.join(this.project.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.OUTPUT_METADATA),'utf-8');
   const projectMetadata: IProjectInfoMetadata =  JSON.parse(metadata);
   const targetPath = path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT);

   // Attach sbom.json
   if (projectMetadata.software_composition_known_uri) {
     await fs.promises.copyFile(projectMetadata.software_composition_known_uri, path.join(targetPath,AppDefaultValues.PROJECT.COMPOSITION_KNOWN_FILE_NAME));
     projectMetadata.software_composition_known_uri = AppDefaultValues.PROJECT.COMPOSITION_KNOWN_FILE_NAME;
   }

   // Attach ignore.json
   if (projectMetadata.software_composition_ignore_uri) {
     await fs.promises.copyFile(projectMetadata.software_composition_ignore_uri, path.join(targetPath,AppDefaultValues.PROJECT.COMPOSITION_IGNORE_FILE_NAME));
     projectMetadata.software_composition_ignore_uri = AppDefaultValues.PROJECT.COMPOSITION_IGNORE_FILE_NAME;
   }

   if (projectMetadata.software_composition_ignore_uri || projectMetadata.software_composition_known_uri)
    await fs.promises.writeFile(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.OUTPUT_METADATA),JSON.stringify(projectMetadata));

   // Attach software composition uri
   if (!projectMetadata.software_composition_uri) return true; // avoid to write project metadata file
   await this.copyFiles(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT),projectMetadata.software_composition_uri);
   projectMetadata.software_composition_uri = this.softwareCompositionUriFiles;
   await fs.promises.writeFile(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.OUTPUT_METADATA),JSON.stringify(projectMetadata));return true;
  }

}
