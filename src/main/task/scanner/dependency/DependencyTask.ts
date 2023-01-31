import { LocalDependencies } from 'scanoss';
import fs from 'fs';
import log from 'electron-log';
import i18next from 'i18next';
import path from 'path';
import { BlackListDependencies } from '../../../workspace/tree/blackList/BlackListDependencies';
import { Project } from '../../../workspace/Project';
import { Scanner } from '../types';
import { ScannerStage } from '../../../../api/types';
import {AppDefaultValues} from "../../../../config/AppDefaultValues";

export class DependencyTask implements Scanner.IPipelineTask {
  private project: Project;
  constructor(project: Project) {
    this.project = project;
  }

  public getStageProperties(): Scanner.StageProperties {
    return {
      name: ScannerStage.DEPENDENCY,
      label: i18next.t('Title:AnalyzingDependencies'),
      isCritical: false,
    };
  }

  public async run(): Promise<boolean> {
    log.info('[ DependencyTask init ]');
    await this.scanDependencies();
    await this.project.save();
    return true;
  }

  private async scanDependencies() {
    try {
      const allFiles = [];
      const rootPath = this.project.metadata.getScanRoot();
      this.project.tree
        .getRootFolder()
        .getFiles(new BlackListDependencies())
        .forEach((f: File) => {
          allFiles.push(rootPath + f.path);
        });
      const dependencies = await new LocalDependencies().search(allFiles);
      dependencies.files.forEach((f) => {
        f.file = f.file.replace(rootPath, '');
      });
      this.project.tree.addDependencies(dependencies);
      await fs.promises.writeFile(path.join(this.project.metadata.getMyPath(),AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.DEPENDENCIES),
        JSON.stringify(dependencies, null, 2)
      );
    } catch (e) {
      log.error(e);
    }
  }
}
