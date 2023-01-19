import log from "electron-log";
import { app } from 'electron';
import fs from 'fs';
import path from "path";
import { IWorkspaceCfg } from '../../api/types';
import { wsUtils } from '../workspace/WsUtils/WsUtils';
import packageJson from '../../../release/app/package.json';
import { AppI18n } from '../../shared/i18n';
import { WorkspaceMigration } from '../migration/WorkspaceMigration';

class UserSettingService {
  private myPath: string;

  private name: string;

  private store: IWorkspaceCfg;

  private defaultStore: IWorkspaceCfg = {
    SCAN_MODE: 'FULL_SCAN',
    VERSION: app.isPackaged === true ? app.getVersion() : packageJson.version,
    LNG: 'en',
  };

  constructor() {
    this.name = 'workspaceCfg.json';
    this.store = this.defaultStore;
  }

  public set(setting: Partial<IWorkspaceCfg>) {
    if (setting.LNG !== this.store.LNG)
      AppI18n.getI18n().changeLanguage(setting.LNG);

    this.store = { ...this.store, ...setting };

    return this.store;
  }


  public get(): Partial<IWorkspaceCfg> {
    return JSON.parse(JSON.stringify(this.store));
  }

  public getSetting(key: string) {
    const setting = { key: this.store[key] } as Partial<IWorkspaceCfg>;
    return setting;
  }

  public getDefault(): IWorkspaceCfg {
    return this.defaultStore;
  }

  public async read(workspacePath: string) {
    try {
      this.setMyPath(path.join(workspacePath,this.name));
      if (!(await wsUtils.fileExist(this.myPath)))
        await this.save();
      const setting = await fs.promises.readFile(this.myPath,
        'utf8'
      );
      await new WorkspaceMigration(userSettingService.get().VERSION, workspacePath).up();
      this.store =  {...this.store,...JSON.parse(setting)};
    } catch(error:any) {
      log.error("[ WORKSPACE CONFIG ]:", "Invalid workspace configuration");
      const ws =  await fs.promises.readFile(
        this.myPath,
        'utf8'
      );
      await fs.promises.writeFile(`${workspacePath}/workspaceCfg-invalid.json`,ws);
      this.store = this.defaultStore;
    }
  }

  public async save() {
    await fs.promises.writeFile(
      this.myPath,
      JSON.stringify(this.store, undefined, 2),
      'utf8'
    );
  }

  public setMyPath(path: string) {
    this.myPath = path;
  }
}

export const userSettingService = new UserSettingService();
