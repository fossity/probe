import fs from 'fs';
import { modelProvider } from '../services/ModelProvider';

class FileHelper {
  public async fileExist(file: string): Promise<boolean> {
    return fs.promises
      .access(file, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  }

  public async isValidJson(filePath: string){
    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      JSON.parse(fileContent);
      return true; // JSON is valid
    } catch (error) {
      return false; // JSON is not valid
    }
  }
}

export const fileHelper = new FileHelper();
