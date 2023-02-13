import {ITask} from "../Task";
import {ICipherTask} from "./ICipherTask";
import {Cipher} from "../../modules/Cipher/Cipher";
import fs from "fs";
import path from "path";


export class CipherTask implements ITask<ICipherTask, void> {


  async run(params: ICipherTask): Promise<void> {
    const data = await fs.promises.readFile(params.inputPath)

    const cipher = new Cipher(params.rsaPubKey);
    const cipherText = await cipher.cipherFossityPackage(data);

    await fs.promises.writeFile(params.outputPath, cipherText);

    if (params.wantDecryptScript) {
      const projPath =  path.parse(params.outputPath);

      const scriptName = `${projPath.name}_decrypt.sh`
      const scriptFullPath = path.join(projPath.dir, scriptName);

      const script = cipher.generateDecrypBash(scriptName, projPath.name);
      await fs.promises.writeFile(scriptFullPath, script, { mode: 0o755 })
    }


  }
}
