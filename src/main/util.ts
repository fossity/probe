/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import fs, {constants} from "fs";

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export function fileExist(path:string) {
  return new Promise<boolean>((resolve, reject)=>{
    fs.access(path,constants.F_OK,(err)=>{
      if(err) resolve(false);
      resolve(true);
    })
  });
}

export const getAssetFolderPath = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  return isDev
    ? path.join(__dirname, '../../assets')
    : path.join(__dirname, './assets')
}
