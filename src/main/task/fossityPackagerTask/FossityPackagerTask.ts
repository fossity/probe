import { ITask } from '../Task';
import { IFossityPackager } from './IFossityPackager';

const AdmZip = require('adm-zip');

export class FossityPackagerTask implements ITask<IFossityPackager, void> {
  public async run(params: IFossityPackager): Promise<void>{
      const zip = new AdmZip();
      zip.addLocalFolder(params.inputPath);
      zip.writeZip(params.outputPath);
    }

}
