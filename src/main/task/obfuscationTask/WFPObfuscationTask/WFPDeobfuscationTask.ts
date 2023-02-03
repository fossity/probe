import { Common } from '../Common';
import { DeobfuscationModule } from '../../../modules/Obfuscation/DeobfuscationModule';
import {WFPExtractPath} from "../../../modules/Obfuscation/extractPath/WFPExtractPath";

export class WFPDeobfuscationTask extends Common<DeobfuscationModule>{
  constructor(projectPath: string,inputFile: string,mapper:Record<string, string>) {
    super(projectPath,inputFile,new DeobfuscationModule(mapper), new WFPExtractPath());
  }

}
