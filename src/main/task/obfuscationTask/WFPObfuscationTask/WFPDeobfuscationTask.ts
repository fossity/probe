import { Common } from './Common';
import { DeobfuscationModule } from '../../../modules/Obfuscation/DeobfuscationModule';

export class WFPDeobfuscationTask extends Common<DeobfuscationModule>{
  constructor(projectPath: string,inputFile: string,mapper:Record<string, string>) {
    super(projectPath,inputFile,new DeobfuscationModule(mapper));
  }

}
