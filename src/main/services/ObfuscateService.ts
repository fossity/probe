import {ObfuscationDTO} from "../../api/dto";
import {workspace} from "../workspace/Workspace";
import {WFPObfuscationTask} from "../task/obfuscation/WFPObfuscationTask";
import path from "path";
import {AppDefaultValues} from "../../config/AppDefaultValues";
import fs from "fs";
import {ObfuscationModule} from "../modules/Obfuscation/ObfuscationModule";


class ObfuscateService {
  public async obfuscate(words: Array<string>): Promise<ObfuscationDTO> {
    const p = workspace.getOpenedProjects()[0];
    const response = await new WFPObfuscationTask(p.getMyPath(), path.join(p.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.WINNOWING_WFP), words).run();
    //TODO: Close and save the project here?
    return response;
  }

  public async deofuscateWFP(): Promise<ObfuscationDTO> {
    const p = workspace.getOpenedProjects()[0];
    const dictionary = await fs.promises.readFile(path.join(p.getMyPath(), AppDefaultValues.PROJECT.OBFUSCATION_MAPPER), 'utf-8');
    const mapper = JSON.parse(dictionary);
    const response = await new WFPObfuscationTask(p.getMyPath(), path.join(p.getMyPath(), AppDefaultValues.PROJECT.OUTPUT, AppDefaultValues.PROJECT.WINNOWING_WFP), mapper).run();
    return response;
  }

  public async obfuscatePreview(words: Array<string>): Promise<Map<string, string|null>> {
    const obf = new ObfuscationModule(words);
    const p = workspace.getOpenedProjects()[0];
    const fToObfuscate = p.getTree().getFilesToObfuscate();

    for (const filePath of fToObfuscate.keys())
      fToObfuscate.set(filePath, obf.adapt(filePath));

    return fToObfuscate;

  }

}


export const obfuscateService = new ObfuscateService();

