import fs from 'fs';
import { modelProvider } from '../services/ModelProvider';

class FileHelper {
  public async fileExist(file: string): Promise<boolean> {
    return fs.promises
      .access(file, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  }
}

export const fileHelper = new FileHelper();
