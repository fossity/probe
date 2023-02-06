import { FileCount } from 'scanoss';
import fs from 'fs';
import log from 'electron-log';
import i18next from 'i18next';
import { Scanner } from '../scannerTask/types';
import { ScannerStage } from '../../../api/types';
import { Project } from '../../workspace/Project';
import path from 'path';
import { Format } from 'scanoss/build/main/sdk/FileCount/Interfaces';
import {AppDefaultValues} from "../../../config/AppDefaultValues";


export class HintTask implements Scanner.IPipelineTask {
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  public getStageProperties(): Scanner.StageProperties {
    return {
      name: ScannerStage.HINT,
      label: i18next.t('Title:CreatingHints'),
      isCritical: false,
    };
  }

  public async run(): Promise<boolean> {
    log.info('[ HintTask init ]');
    await this.createFileCount();
    return true;
  }


  private async  createFileCount() {
    const csv = await FileCount.walk(this.project.getScanRoot(),{ output: Format.CSV });
    await fs.promises.writeFile(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.FILE_COUNT) ,csv.toString());
  }
}


