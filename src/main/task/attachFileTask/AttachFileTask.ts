import i18next from "i18next";
import fs from "fs";
import path from 'path';
import { Scanner } from '../scannerTask/types';
import { IProjectInfoMetadata, ScannerStage } from '../../../api/types';
import { Project } from "../../workspace/Project";
import { AppDefaultValues } from "../../../config/AppDefaultValues";

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
      label: i18next.t('Title:AttachingFiles'),
      isCritical: true,
    };
  }

  public async run(params: void): Promise<boolean> {
   const metadata =  await fs.promises.readFile(path.join(this.project.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.OUTPUT_METADATA),'utf-8');
   const projectMetadata: IProjectInfoMetadata =  JSON.parse(metadata);
   if(!projectMetadata.software_composition_uri) return true; // avoid to write project metadata file
   await this.copyFiles(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT),projectMetadata.software_composition_uri);
   projectMetadata.software_composition_uri = this.softwareCompositionUriFiles;
   await fs.promises.writeFile(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.OUTPUT_METADATA),JSON.stringify(projectMetadata));
   return true;
  }

  private async copyFiles(target: string, files: Array<string>) {
    const promises = files.map((f) => {
      const fileNumber = this.fileNumber.toString(10).padStart(4, '0').toUpperCase();
      this.fileNumber += 1;
      const file = `SCA${fileNumber}_${path.parse(f).base}`;
      this.softwareCompositionUriFiles.push(file);
      return fs.promises.copyFile(f, path.join(target, file));
    });
    const results = await Promise.all(promises.map(p => p.catch(e => e)));
    console.log(results);
    const errors = results.filter(result => (result instanceof Error));
    console.log(errors);
  }


}
