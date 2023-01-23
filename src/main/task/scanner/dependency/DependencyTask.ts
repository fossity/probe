import { LocalDependencies } from 'scanoss';
import fs from 'fs';
import log from 'electron-log';
import i18next from 'i18next';
import path from 'path';
import { BlackListDependencies } from '../../../workspace/tree/blackList/BlackListDependencies';
import { Project } from '../../../workspace/Project';
import { Scanner } from '../types';
import { ScannerStage } from '../../../../api/types';

export class DependencyTask implements Scanner.IPipelineTask {
  private project: Project;

  private DEPENDECY_FILE = 'dependencies.json';

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
      await fs.promises.writeFile(path.join(this.project.metadata.getMyPath(), this.DEPENDECY_FILE),
        JSON.stringify(dependencies, null, 2)
      );
    } catch (e) {
      log.error(e);
    }
  }
}
