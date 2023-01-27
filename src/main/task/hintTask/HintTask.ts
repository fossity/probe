import { FileCount } from 'scanoss';
import fs from 'fs';
import log from 'electron-log';
import i18next from 'i18next';
import { Scanner } from '../scanner/types';
import { ScannerStage } from '../../../api/types';
import { Project } from '../../workspace/Project';
import path from 'path';
import { Format } from 'scanoss/build/main/sdk/FileCount/Interfaces';

export class HintTask implements Scanner.IPipelineTask {
  private project: Project;

  private CSV_FILE = 'file_count.csv';

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
    const csv = await FileCount.walk(this.project.getScanRoot(),{ output: Format.CSV });
    await fs.promises.writeFile(path.join(this.project.getMyPath(),'obfuscated',this.CSV_FILE) ,csv.toString());
    return true;
  }
}


