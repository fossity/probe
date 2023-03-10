import { IAdapter } from './IAdapter';
import {ObfuscationSummary} from "../../../api/dto";

export class DeobfuscationModule implements IAdapter {
  private mapper: Record<string, string>

  constructor(mapper:Record<string, string>) {
    this.mapper = mapper;
  }


  public adapt(input: string): string {
    let obfuscatedInput = input;
    for (const [key, value] of Object.entries(this.mapper)) {
      if(obfuscatedInput.search(new RegExp(key,'g')) >= 0) {
        obfuscatedInput = obfuscatedInput.replace(new RegExp(key, 'g'), this.mapper[key]);
      }
    }
    return obfuscatedInput;
  }


  public done(): Record<string, string>{
    return this.mapper;
  }

  private getObfuscationMapper(obj: any): Record<string, string> {
    return  Object.fromEntries(Object.entries(obj).map(a => a.reverse()));
  }

  public hasWords(): boolean {
    return Object.keys(this.mapper).length > 0;
  }

  getSummary(): ObfuscationSummary {
    return null;
  }
}
