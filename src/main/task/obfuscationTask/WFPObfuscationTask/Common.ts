import fs from 'fs';
import * as readline from 'readline';
import path from 'path';
import { IAdapter } from '../../../modules/Obfuscation/IAdapter';
import { ITask } from '../../Task';
import { ObfuscationDTO } from '@api/dto';

export class Common <Adapter extends IAdapter> implements ITask<void, ObfuscationDTO>{

  protected obfuscation: Adapter;

  protected inputFile: string;

  protected outputFile:string;

  protected projectPath:string;

  constructor(projectPath:string, inputFile: string, adapter: Adapter) {
    this.obfuscation = adapter;
    this.inputFile = inputFile;
    this.projectPath = projectPath;
    this.outputFile =  path.join(projectPath,"aux.wfp");
  }

  public run(param: void): Promise<ObfuscationDTO> {
    return new Promise((resolve, reject) => {
      const outputFile = fs.createWriteStream(this.outputFile);
      const rl = readline.createInterface({
        input: fs.createReadStream(this.inputFile)
      });

// Handle any error that occurs on the write stream
      outputFile.on('err', err => {
        // handle error
        reject(err);
        console.log(err)
      })

// Once done writing, rename the output to be the input file name
      outputFile.on('close', async () => {
        console.log('done writing');
        const mapper = await this.obfuscation.done(this.projectPath);
        await fs.promises.rename(this.outputFile, this.inputFile);
        resolve({
          path: this.inputFile,
          dictionary: mapper
        });
      });


// Read the file and replace any text that matches
      rl.on('line', line => {
        let text = line;
        if (text.search(/file=([A-Za-z0-9]+(,[A-Za-z0-9]+((.*))))/g) >= 0) { // TODO: We can change this REGEX by /file=.*/g
          const pathToProcess = line.split(',')[2];
            const auxPath = path.join(path.parse(pathToProcess).dir, path.parse(pathToProcess).name);
            const { ext } = path.parse(pathToProcess);
             const obfuscatedPath = this.obfuscation.adapt(auxPath);
            const obfuscation = ext !== "" ? `${obfuscatedPath}${ext}` : obfuscatedPath; // add extension if it has one
            text = line.replace(pathToProcess,obfuscation);
        }
        // write text to the output file stream with new line character
        outputFile.write(`${text}\n`)
      });

// Done reading the input, call end() on the write stream
      rl.on('close', () => {
        outputFile.end()
      })

    });
  }





}





