import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { app } from 'electron';
import { IMetadata, ScanState } from '../../api/types';
import packageJson from '../../../release/app/package.json';

export class Metadata implements IMetadata{

  name: string;

  appVersion: string;

  scan_root: string;

  date: string;

  work_root: string;

  uuid: string;

  files : number;

  scannerState: ScanState;

  obfuscatedList: Array<string>;

  constructor(name, scan_root, work_root) {
    this.name = name;
    this.scan_root = scan_root;
    this.work_root = work_root;
    this.obfuscatedList = [];
    this.appVersion =
      app.isPackaged === true ? app.getVersion() : packageJson.version;
    this.date = new Date().toISOString();
    this.uuid = uuidv4();
    this.scannerState = ScanState.CREATED;
  }

  setScannerState(state: ScanState){
    this.scannerState = state;
  }

  getScannerState(){
    return this.scannerState;
  }

  public static async readFromPath(pathToProject: string): Promise<Metadata> {
    const data: Metadata = JSON.parse(
      await fs.promises.readFile(`${pathToProject}/metadata.json`, 'utf8')
    );
    return Object.assign(Object.create(Metadata.prototype), data);
  }

  public save(): void {
    const str = JSON.stringify(this, null, 2);
    fs.writeFileSync(`${this.work_root}/metadata.json`, str);
  }

  public setAppVersion(appVersion: string) {
    this.appVersion = appVersion;
  }

  public getVersion(): string {
    return this.appVersion;
  }

  public setDate(date: string) {
    this.date = date;
  }

  public setMyPath(workRoot: string) {
    this.work_root = workRoot;
  }

  public setScanRoot(scanRoot: string) {
    this.scan_root = scanRoot;
  }

  public setUuid(uuid: string) {
    this.uuid = uuid;
  }

  public getName() {
    return this.name;
  }

  public getMyPath(): string {
    return this.work_root;
  }

  public getUUID(): string {
    return this.uuid;
  }

  public getScanRoot() {
    return this.scan_root;
  }

  public setTotalFiles(files: number){
    this.files = files;
  }

  public setObfuscatedList(obfuscatedList: Array<string>){
    this.obfuscatedList = obfuscatedList;
  }

  public getObfuscatedList(){
   return this.obfuscatedList;
  }

  public getDto(): IMetadata {
    const Ip: IMetadata = {
      appVersion: this.appVersion,
      date: this.date,
      name: this.name,
      work_root: this.work_root,
      scan_root: this.scan_root,
      uuid: this.uuid,
      files: this.files,
      scannerState: this.scannerState,
      obfuscatedList: this.obfuscatedList
    };
    return Ip;
  }
}
