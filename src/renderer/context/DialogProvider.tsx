import React, { useState, useEffect, ReactNode } from 'react';
import { IpcChannels } from '@api/ipc-channels';
import { useTranslation } from 'react-i18next';
import {
  DIALOG_ACTIONS, DialogResponse, InventoryForm, InventorySelectorResponse, LoaderController,
} from './types';
import { ConfirmDialog } from '../ui/dialog/ConfirmDialog';
import { LicenseDialog } from '../ui/dialog/LicenseDialog';
import SettingsDialog from '../ui/dialog/SettingsDialog';
import { AlertDialog } from '../ui/dialog/AlertDialog';
import { ProgressDialog } from '../ui/dialog/ProgressDialog';
import OnBoardingDialog from '../ui/dialog/OnBoardingDialog';

export interface IDialogContext {
  openConfirmDialog: (title?: string, message?: string, button?: any, hideDeleteButton?: boolean) => Promise<DialogResponse>;
  openAlertDialog: (message?: string, buttons?: any[]) => Promise<DialogResponse>;
  openSettings: () => Promise<DialogResponse>;
  openOnBoardingDialog: () => Promise<DialogResponse>;
  createProgressDialog: (message: ReactNode) => Promise<LoaderController>;
}

export const DialogContext = React.createContext<IDialogContext | null>(null);

export const DialogProvider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title?: string;
    message?: string;
    button?: any;
    hideDeleteButton?: boolean;
    onClose?:(response: DialogResponse) => void;
  }>({ open: false });

  const openConfirmDialog = (
    title = '',
    message = 'Are you sure?',
    button: {
      label: string;
      role: 'accept' | 'cancel' | 'delete';
    } = {
      label: t('Button:Yes'),
      role: 'accept',
    },
    hideDeleteButton = false,
  ): Promise<DialogResponse> => new Promise<DialogResponse>((resolve) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      button,
      hideDeleteButton,
      onClose: (response) => {
        setConfirmDialog((dialog) => ({ ...dialog, open: false }));
        resolve(response);
      },
    });
  });

  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    message?: string;
    buttons?: any[];
    onClose?:(response: DialogResponse) => void;
  }>({ open: false, buttons: [] });

  const openAlertDialog = (
    message = 'Are you sure?',
    buttons: {
      label: string;
      role: 'accept' | 'cancel' | 'delete' | 'action';
    }[] = [
      {
        label: 'OK',
        role: 'accept',
      },
    ],
  ): Promise<DialogResponse> => new Promise<DialogResponse>((resolve) => {
    setAlertDialog({
      open: true,
      message,
      buttons,
      onClose: (response) => {
        setAlertDialog((dialog) => ({ ...dialog, open: false }));
        resolve(response);
      },
    });
  });

  const [progressDialog, setProgressDialog] = useState<{
    open: boolean;
    loader?: boolean;
    message?: React.ReactNode;
  }>({ open: false, loader: false });

  const createProgressDialog = (message: React.ReactNode = 'Wait a moment please'): Promise<LoaderController> => new Promise<LoaderController>((resolve) => {
    setProgressDialog({
      open: false,
      message,
    });
    resolve({
      present: ({ message } = {}) => setProgressDialog((dialog) => ({
        ...dialog, open: true, loader: true, ...(message ? { message } : {}),
      })),
      finish: ({ message }) => setProgressDialog((dialog) => ({ ...dialog, message, loader: false })),
      dismiss: (props) => new Promise((resolve) => {
        setTimeout(() => {
          setProgressDialog((dialog) => ({ ...dialog, open: false }));
          resolve(true);
        }, props?.delay || 0);
      }),
    });
  });

  const [settingsDialog, setSettingsDialog] = useState<{
    open: boolean;
    onClose?:(response: DialogResponse) => void;
  }>({ open: false });

  const openSettings = () => new Promise<DialogResponse>((resolve) => {
    setSettingsDialog({
      open: true,
      onClose: (response) => {
        setSettingsDialog((dialog) => ({ ...dialog, open: false }));
        resolve(response);
      },
    });
  });

  const [onBoardingDialog, setOnBoardingDialog] = useState<{
    open: boolean;
    onClose?:(response: DialogResponse) => void;
  }>({ open: false });

  const openOnBoardingDialog = () => new Promise<DialogResponse>((resolve) => {
    setOnBoardingDialog({
      open: true,
      onClose: (response) => {
        setOnBoardingDialog((dialog) => ({ ...dialog, open: false }));
        resolve(response);
      },
    });
  });

  const handleOpenSettings = () => {
    openSettings();
  };

  const handleOpenOnBoardingDialog = () => {
    openOnBoardingDialog();
  };

  const setupAppMenuListeners = (): (() => void) => {
    const subscriptions = [];
    subscriptions.push(window.electron.ipcRenderer.on(IpcChannels.MENU_OPEN_SETTINGS, handleOpenSettings));
    subscriptions.push(window.electron.ipcRenderer.on(IpcChannels.MENU_OPEN_ONBOARDING, handleOpenOnBoardingDialog));
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  };

  // setup listeners
  useEffect(setupAppMenuListeners, []);

  return (
    <DialogContext.Provider
      value={{
        openConfirmDialog,
        openAlertDialog,
        openSettings,
        openOnBoardingDialog,
        createProgressDialog,
      }}
    >
      {children}

      {settingsDialog.open && (
        <SettingsDialog
          open={settingsDialog.open}
          onCancel={() => settingsDialog.onClose && settingsDialog.onClose(null)}
          onClose={(response) => settingsDialog.onClose && settingsDialog.onClose(response)}
        />
      )}

      {onBoardingDialog.open && (
        <OnBoardingDialog
          open={onBoardingDialog.open}
          onCancel={() => onBoardingDialog.onClose && onBoardingDialog.onClose(null)}
          onClose={(response) => onBoardingDialog.onClose && onBoardingDialog.onClose(response)}
        />
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        hideDeleteButton={confirmDialog.hideDeleteButton}
        message={confirmDialog.message}
        button={confirmDialog.button}
        onClose={(response) => confirmDialog.onClose && confirmDialog.onClose(response)}
      />

      <AlertDialog
        open={alertDialog.open}
        message={alertDialog.message}
        buttons={alertDialog.buttons}
        onClose={(response) => alertDialog.onClose && alertDialog.onClose(response)}
      />

      <ProgressDialog open={progressDialog.open} message={progressDialog.message} loader={progressDialog.loader} />
    </DialogContext.Provider>
  );
};

export default DialogProvider;
