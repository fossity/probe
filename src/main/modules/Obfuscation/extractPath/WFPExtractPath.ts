import {IExtractPath} from "./IExtractPath";

export class WFPExtractPath implements IExtractPath {
  extractPath(line: string): string {
    if (line.search(/file=([A-Za-z0-9]+(,[A-Za-z0-9]+((.*))))/g) >= 0) { // TODO: We can change this REGEX by /file=.*/g
      const pathToProcess = line.split(',')[2];
      return pathToProcess;
    }
    return null;
  }


}
