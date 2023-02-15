import path from "path";
import { PreviewDTO } from "../../api/dto";
import {workspace} from "../workspace/Workspace";
import {ObfuscationModule} from "../modules/Obfuscation/ObfuscationModule";

class ObfuscateService {
  public async obfuscatePreview(words: Array<string>): Promise<PreviewDTO> {
    const p = workspace.getOpenedProjects()[0];
    const obf = new ObfuscationModule(words,'');
    p.setObfuscatedList(words);
    p.metadata.save();
    const fToObfuscate = p.getTree().getFilesToObfuscate();

    for (const filePath of fToObfuscate.keys()) {
      let auxPath = path.join(path.parse(filePath).dir, path.parse(filePath).name);
      const { ext } = path.parse(filePath);
      auxPath = obf.adapt(auxPath)
      const obfuscatedPath =  ext !== "" ? `${auxPath}${ext}` : auxPath; // add extension if it has one ;
      fToObfuscate.set(filePath, obfuscatedPath);
    }

    const summary = obf.getSummary();
    return {
      files: fToObfuscate,
      summary
    };
  }


}


export const obfuscateService = new ObfuscateService();

