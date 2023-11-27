import {Common} from "../Common";
import {ObfuscationModule} from "../../../modules/Obfuscation/ObfuscationModule";
import {DependencyExtractPath} from "../../../modules/Obfuscation/extractPath/DependencyExtractPath";

export class DependencyObfuscationTask extends Common<ObfuscationModule> {
  constructor(projectPath: string,wfpFilePath: string,obfuscatedWords: Array<string>, dictionaryPath:string) {
    super(projectPath, wfpFilePath, new ObfuscationModule(obfuscatedWords,dictionaryPath), new DependencyExtractPath());
  }

}
