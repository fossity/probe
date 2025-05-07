import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { ITask } from '../Task';
import { ICipherTask } from './ICipherTask';
import { Cipher } from '../../modules/Cipher/Cipher';
import packageJson from '../../../../release/app/package.json';

export class CipherTask implements ITask<ICipherTask, void> {
  async run(params: ICipherTask): Promise<void> {
    const data = await fs.promises.readFile(params.inputPath);

    const cipher = new Cipher(params.rsaPubKey);
    const cipherText = await cipher.cipherFossityPackage(data);

    const appVersion = app.isPackaged === true ? app.getVersion() : packageJson.version;
    // Create a buffer with the version footer
    const probeVersion = Buffer.alloc(100);
    probeVersion.write(`FOSSITY_VERSION:${appVersion}`, 'utf-8');

    // Combine the encrypted data with the version footer
    const finalData = Buffer.concat([cipherText, probeVersion]);
    // Write the combined data
    await fs.promises.writeFile(params.outputPath, finalData);

    if (params.wantDecryptScript) {
      const projPath = path.parse(params.outputPath);

      const scriptName = `${projPath.name}_decrypt.sh`;
      const scriptFullPath = path.join(projPath.dir, scriptName);

      const script = cipher.generateDecrypBash(scriptName, projPath.name);
      await fs.promises.writeFile(scriptFullPath, script, { mode: 0o755 });
    }
  }
}
