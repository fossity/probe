import {ITask} from "../Task";
import {ICipherTask} from "./ICipherTask";
import {Cipher} from "../../modules/Cipher/Cipher";
import fs from "fs";


export class CipherTask implements ITask<ICipherTask, void> {


  async run(params: ICipherTask): Promise<void> {
    const data = await fs.promises.readFile(params.inputPath)

    const cipher = new Cipher(params.rsaPubKey);
    const chiperText = await cipher.cipherFossityPackage(data);

    await fs.promises.writeFile(params.outputPath, chiperText);
  }

}
