import {IExtractPath} from "./IExtractPath";

export class DependencyExtractPath implements IExtractPath {
  extractPath(line: string): string {
      const path = line.match(/\s*"file":\s*"(?<path>.+)",$/)?.groups;
      if(!path)  return null;
      return path.path;
  }

}
