import fs from 'fs';
import path from 'path';
import { IAdapter } from './IAdapter';

export class ObfuscationModule implements IAdapter {

  private obfuscatedWords : Array<string>;

  private obfuscatedMapper: Record<string, string>;

  private keyNumber:number = 0;

  constructor(obfuscatedWords: Array<string>) {
    this.obfuscatedWords = obfuscatedWords;
    this.obfuscatedMapper = {};
  }

  public adapt(input: string): string {
    let obfuscatedInput = input;
        this.obfuscatedWords.forEach((o) => {
          if(obfuscatedInput.search(new RegExp(o,'gm')) >= 0) {
            let key;
            if (this.obfuscatedMapper[o] !== undefined) key = this.obfuscatedMapper[o];
            else {
              key = this.keyGen();
              this.obfuscatedMapper[o] = key;
            }
            obfuscatedInput = obfuscatedInput.replace(new RegExp(o, 'g'), key);
          }
        });
       return obfuscatedInput;
  }

  private keyGen(): string {
    const key = `FOSSITY_${this.keyNumber.toString(16).padStart(4,'0').toUpperCase()}`;
    this.keyNumber += 1;
    return key;
  }

  public async done(projectPath:string): Promise<Record<string, string>> {
    const mapper = this.getObfuscationMapper(this.obfuscatedMapper);
    await fs.promises.writeFile(path.join(projectPath, 'obfuscationMapper.json'), JSON.stringify(mapper));
    return mapper;
  }

  private getObfuscationMapper(obj: any): Record<string, string> {
   return  Object.fromEntries(Object.entries(obj).map(a => a.reverse()));
  }


}
