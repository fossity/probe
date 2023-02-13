import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { IpcChannels } from '@api/ipc-channels';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { clean, setScanPath } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from './DialogProvider';
import { dialogController } from '../controllers/dialog-controller';
import { IProject } from '@api/types';
import { projectService } from '@api/services/project.service';
import { Button } from '@mui/material';

export interface IAppContext {
  newProject: () => void;
  downloadProject: (project: IProject) => void;
  showProjectFiles: (project: IProject) => void;
}

export const AppContext = React.createContext<IAppContext | null>(null);

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dialogCtrl = useContext(DialogContext) as IDialogContext;

  const newProject = async () => {
    const paths = await dialogController.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (paths && paths.length > 0) {
      dispatch(clean());
      dispatch(setScanPath({ path: paths[0], action: 'scan' }));
      navigate('/workspace/new/settings');
    }
  };

  const downloadProject = async (project: IProject) => {
    const path = await dialogController.showSaveDialog({
      filters: [{ name: 'Fossity Package Archive', extensions: ['fossity'] }],
      defaultPath: project.name,
    });

    if (!path) return;

    const dialog = await dialogCtrl.createProgressDialog(t('Creating Fossity Package').toUpperCase());
    dialog.present();

    try {
      await projectService.packageProject({
        projectPath: project.work_root,
        targetPath: path,
      });

      setTimeout(async () => {
        const timeout = setTimeout(() => dialog.dismiss(), 8000);
        const dismiss = () => {
          clearTimeout(timeout);
          dialog.dismiss();
        };
        dialog.finish({
          message: (
            <footer className="d-flex space-between">
              <span>SUCCESSFUL PACKAGED</span>
              <div>
                <Button
                  className="mr-3 text-uppercase"
                  size="small"
                  variant="text"
                  color="primary"
                  style={{ padding: 0, lineHeight: 1, minWidth: 0 }}
                  onClick={() => dismiss()}
                >
                  {t('Button:Close')}
                </Button>
                <Button
                  className="text-uppercase"
                  size="small"
                  variant="text"
                  color="primary"
                  style={{ padding: 0, lineHeight: 1, minWidth: 0 }}
                  onClick={() => {
                    dismiss();
                    window.shell.showItemInFolder(path);
                  }}
                >
                  {t('Button:Open')}
                </Button>
              </div>
            </footer>
          ),
        });
      }, 2000);

    } catch (err) {
      dialog.dismiss();
      const errorMessage = `<strong>Packaging Error</strong>
        <span style="font-style: italic;">${err || ''}</span>`;

      await dialogCtrl.openConfirmDialog(
        `${errorMessage}`,
        {
          label: 'OK',
          role: 'accept',
        },
        true
      );
    }
  };

  const showProjectFiles = (project: IProject) => {
    window.shell.openPath(`${project.work_root}\\output`);
  };

  const setupAppMenuListeners = (): () => void => {
    const subscriptions = [];
    subscriptions.push(window.electron.ipcRenderer.on(IpcChannels.MENU_NEW_PROJECT, newProject));
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  };

  useEffect(setupAppMenuListeners, []);

  return (
    <AppContext.Provider
      value={{
        newProject,
        downloadProject,
        showProjectFiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
