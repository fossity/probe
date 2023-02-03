import fs from 'fs';
import path from 'path';
import { IAdapter } from './IAdapter';

export class ObfuscationModule implements IAdapter {

  private obfuscatedWords : Array<string>;

  private dictionaryPath: string;

  private obfuscatedMapper: Record<string, string>;

  private keyNumber:number = 0;

  constructor(obfuscatedWords: Array<string>, pathToDictionary: string) {
    const obfuscatedWordsSorted = obfuscatedWords.sort((a,b) => b.length-a.length);
    this.obfuscatedWords = obfuscatedWordsSorted;
    this.dictionaryPath = pathToDictionary;
    this.obfuscatedMapper = {};
    this.initDictionary();
  }

  private initDictionary() {
    try {
     const obfuscationMapper = fs.readFileSync(this.dictionaryPath, 'utf-8');
     const mapper = JSON.parse(obfuscationMapper);
     this.obfuscatedMapper = mapper.dictionary;
     this.keyNumber = mapper.lastKey + 1;
    } catch (e: any){
      this.obfuscatedMapper = {};
      this.keyNumber = 0;
    }
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
    await fs.promises.writeFile(path.join(projectPath, 'obfuscationMapper.json'), JSON.stringify({ dictionary: this.obfuscatedMapper, lastKey: this.keyNumber - 1 }));
    return this.obfuscatedMapper;
  }

  public hasWords(): boolean {
    return this.obfuscatedWords.length > 0;
  }

}
