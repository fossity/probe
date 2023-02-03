import { Common } from '../Common';
import { ObfuscationModule } from '../../../modules/Obfuscation/ObfuscationModule';
import {WFPExtractPath} from "../../../modules/Obfuscation/extractPath/WFPExtractPath";

export class WFPObfuscationTask extends Common<ObfuscationModule>{
  constructor(projectPath: string,wfpFilePath: string,obfuscatedWords: Array<string>, dictionaryPath:string) {
    super(projectPath, wfpFilePath, new ObfuscationModule(obfuscatedWords,dictionaryPath), new WFPExtractPath());
  }
}
