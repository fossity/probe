import fs from 'fs';
import path from 'path';
import { IAdapter } from './IAdapter';
import {ObfuscationSummary} from "../../../api/dto";

export class ObfuscationModule implements IAdapter {

  private obfuscatedWords : Array<string>;

  private dictionaryPath: string;

  private obfuscatedMapper: Record<string, string>;

  private obfuscationSummary: Record<string, number>;

  private totalFiles: number;

  private keyNumber:number = 0;

  private totalFilesObfuscated: number;

  constructor(obfuscatedWords: Array<string>, pathToDictionary: string) {
    const obfuscatedWordsSorted = obfuscatedWords.sort((a,b) => b.length-a.length);
    this.obfuscatedWords = obfuscatedWordsSorted;
    this.dictionaryPath = pathToDictionary;
    this.obfuscatedMapper = {};
    this.obfuscationSummary = {};
    this.totalFiles = 0;
    this.totalFilesObfuscated = 0;
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
    this.totalFiles +=1;
    let obfuscatedInput = input;
    let wasReplaced = false;
        this.obfuscatedWords.forEach((o) => {
          this.updateSummary(o,this.count(o,input));
          if(obfuscatedInput.search(new RegExp(o,'gm')) >= 0) {
            wasReplaced = true;
            let key;
            if (this.obfuscatedMapper[o] !== undefined) key = this.obfuscatedMapper[o];
            else {
              key = this.keyGen();
              this.obfuscatedMapper[o] = key;
            }
            obfuscatedInput = obfuscatedInput.replace(new RegExp(o, 'g'), key);
          }
        });
        if(wasReplaced) this.totalFilesObfuscated+=1;
       return obfuscatedInput;
  }

  private count = (wordToObfuscate: string, input:string) => {
      return (input.match(new RegExp(wordToObfuscate,'gm')) || []).length
  }

  private updateSummary(word:string, replaces:number) {
    if(this.obfuscationSummary[word] === undefined) {
      this.obfuscationSummary[word] = replaces > 0 ? replaces : 0;
    }
    else
      this.obfuscationSummary[word] += replaces < 0 ? 0 :  replaces;
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

  public getSummary(): ObfuscationSummary {
    return {
      totalFiles: this.totalFiles,
      totalFilesObfuscated: this.totalFilesObfuscated,
      obfuscationSummary: this.obfuscationSummary
    }
  }

  public hasWords(): boolean {
    return this.obfuscatedWords.length > 0;
  }

}
