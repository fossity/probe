/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import * as os from 'os';

import {
  app, BrowserWindow, shell, ipcMain, dialog,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import i18next from 'i18next';
import AppConfig from '../config/AppConfigModule';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { workspace } from './workspace/Workspace';
import { userSettingService } from './services/UserSettingService';
import { AppI18n, AppI18nContext } from '../shared/i18n';

// handlers
import '../api/handlers/project.handler';
import '../api/handlers/workspace.handler';
import '../api/handlers/license.handler';
import '../api/handlers/userSetting.handler';
import '../api/handlers/obfuscate.handler';
import '../api/handlers/app.handler';

import { broadcastManager } from './broadcastManager/BroadcastManager';

autoUpdater.autoDownload = false;
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'fossity',
  repo: 'probe',
  releaseType: 'release',
});

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1300,
    height: 820,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  broadcastManager.set(mainWindow.webContents);
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    autoUpdater.checkForUpdates();
  });

  // Check for updates
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
  });

  // Handle available update
  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);

    // eslint-disable-next-line promise/catch-or-return
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: `Version ${info.version} is available.`,
      detail: 'Would you like to download it now?',
      buttons: ['Download', 'Later'],
      cancelId: 1,
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download progress: ${progressObj.percent.toFixed(2)}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info);

    // eslint-disable-next-line promise/catch-or-return
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: `Version ${info.version} has been downloaded.`,
      detail: 'The application will restart to install the update.',
      buttons: ['Restart Now', 'Later'],
      cancelId: 1,
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (error) => {
    log.error('Update error:', error);

    let errorMessage = error.message;

    // If this is a 404 error for the ZIP file, suggest trying the DMG manually
    if (error.message.includes('404') && error.message.includes('.zip')) {
      const version = app.getVersion();
      const { arch } = process;
      errorMessage = 'The automatic update failed. Please download the latest version manually from:\n\nhttps://github.com/fossity/probe/releases/latest';
    }
    dialog.showErrorBox('Update Error', errorMessage);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  AppI18n.setLng(userSettingService.get().LNG);
  AppI18n.init(AppI18nContext.MAIN);

  AppI18n.getI18n().on('languageChanged', async (e) => {
    const { response } = await dialog.showMessageBox(
      BrowserWindow.getFocusedWindow(),
      {
        buttons: [i18next.t('Button:RestartLater'), i18next.t('Button:RestartNow')],
        message: i18next.t('Dialog:YouNeedRestartQuestion'),
      },
    );

    if (response === 1) {
      app.relaunch();
      app.exit();
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    // allow locize plugin open new window
    if (edata.url.endsWith('mini.locize.com/')) return { action: 'allow' };

    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  app.quit();
});

app
  .whenReady()
  .then(async () => {
    await init();
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

async function init() {
  const root = path.join(os.homedir(), AppConfig.DEFAULT_WORKSPACE_NAME);
  await workspace.read(root);
  await userSettingService.read(root);
}
