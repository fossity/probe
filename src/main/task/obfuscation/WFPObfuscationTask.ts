import { Common } from './Common';
import { ObfuscationModule } from '../../modules/Obfuscation/ObfuscationModule';

export class WFPObfuscationTask extends Common<ObfuscationModule>{
  constructor(projectPath: string,inputFile: string,obfuscatedWords: Array<string>) {
    super(projectPath,inputFile,new ObfuscationModule(obfuscatedWords));
  }
}
