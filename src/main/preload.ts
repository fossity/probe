import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import * as os from 'os';
import path from 'path';
import {IpcChannels} from "@api/ipc-channels";

const { shell } = require('electron');

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, listener: (_event: IpcRendererEvent, ...args: any[]) => void) {
      // const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => listener(_event, ...args);
      ipcRenderer.on(channel, listener);

      return () => ipcRenderer.removeListener(channel, listener);
    },
    once(channel: Channels, listener: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => listener(...args)); // TODO: use event
    },
    invoke(channel: string, ...args: any[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeListener(channel: string, listener: (...args: any[]) => void) {
      // const subscription = (_event: IpcRendererEvent, ...args: any) => func(...args);
      ipcRenderer.removeListener(channel, listener);
    },
  },
});

contextBridge.exposeInMainWorld('os', {
  homedir: () => {
    return os.homedir();
  },
});

contextBridge.exposeInMainWorld('path', {
  resolve: (p: string, s: string) => {
    return path.resolve(p, s);
  },
  sep: path.sep,
  basename: (filepath, extension) => path.basename(filepath, extension),
  dirname: (filepath) => path.dirname(filepath),
  join: (...paths: string[]) => path.join(...paths),
});

contextBridge.exposeInMainWorld('shell', {
  showItemInFolder: (p: string) => {
    shell.showItemInFolder(p);
  },
  openExternal: async (url: string, options?: Electron.OpenExternalOptions) => {
    await shell.openExternal(url, options);
  },
  openPath: (p: string) => {
    shell.openPath(p);
  },
});

contextBridge.exposeInMainWorld('app', {
  getInfo: async () => {
    return ipcRenderer.invoke(IpcChannels.APP_GET_APP_INFO);
  },
});
