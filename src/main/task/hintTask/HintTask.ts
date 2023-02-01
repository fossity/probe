import { FileCount } from 'scanoss';
import fs from 'fs';
import log from 'electron-log';
import i18next from 'i18next';
import { Scanner } from '../scanner/types';
import { ScannerStage } from '../../../api/types';
import { Project } from '../../workspace/Project';
import path from 'path';
import { Format } from 'scanoss/build/main/sdk/FileCount/Interfaces';
import {AppDefaultValues} from "../../../config/AppDefaultValues";
import {FilterOR} from "../../workspace/tree/filters/FilterOR";
import {FilterWFP} from "../../workspace/tree/filters/FilterWFP";
import {FilterDependency} from "../../workspace/tree/filters/FilterDependency";

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
    this.createFileMap();

    return true;
  }

  private createFileMap() {
   const files = this.project.getTree().getRootFolder().getFilesByFilter(new FilterOR(new FilterWFP(), new FilterDependency()));
   const fileMapper = new Map<string,string | null>();
   files.forEach((f) =>  fileMapper.set(f,null));
   this.project.getTree().setFilesToObfuscate(fileMapper);
  }

  private async  createFileCount() {
    const csv = await FileCount.walk(this.project.getScanRoot(),{ output: Format.CSV });
    await fs.promises.writeFile(path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.FILE_COUNT) ,csv.toString());
  }
}


