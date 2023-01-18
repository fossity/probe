import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { IpcChannels } from '@api/ipc-channels';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setScanPath } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from './DialogProvider';
import { dialogController } from '../controllers/dialog-controller';

export interface IAppContext {
  newProject: () => void;
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
      dispatch(setScanPath({ path: paths[0], action: 'scan' }));
      navigate('/workspace/new/settings');
    }
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
