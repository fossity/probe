import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IpcChannels } from '@api/ipc-channels';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { projectService } from '@api/services/project.service';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectWorkspaceState,
  setCurrentProject,
  setNewProject,
} from '@store/workspace-store/workspaceSlice';

import { useTranslation } from 'react-i18next';
import { AppDefaultValues } from '@config/AppDefaultValues';
import analysis from '@assets/imgs/analysis.png';
import * as controller from '../../../../controllers/home-controller';
import ProgressBar from '../Components/ProgressBar';


function ProjectScan() {
  const navigate = useNavigate();
  const {state} = useLocation();
  const dialogCtrl = useContext(DialogContext) as IDialogContext;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { pipeline } = state;
  const { scanPath, newProject } = useSelector(selectWorkspaceState);
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<any>({
    stageName: 'preparing',
    stageLabel: 'preparing',
    stageStep: '-',
  });

  const init = async () => {
    try {
      const { path, action } = scanPath;

      if (action === 'resume') await controller.resume(path);
      if (action === 'rescan') await controller.rescan(path);

      if (action === 'scan') {
        if (pipeline === AppDefaultValues.PIPELINE.INDEX) { // NEW PROJECT
          const projectMetadata = await controller.create(newProject)
          dispatch(setNewProject({
            ...newProject,
            uuid: projectMetadata.uuid
          }));

          dispatch(setCurrentProject({
            ...projectMetadata,
            data: null,
          }))
        } else { // SCAN PROJECT
          await controller.scan();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onShowScan = (path) => {
    switch (pipeline) {
      case AppDefaultValues.PIPELINE.INDEX:
        navigate('/workspace/new/obfuscation');
        break
      case AppDefaultValues.PIPELINE.FINGERPRINT:
        navigate('/workspace/new/result', { replace: true });
        break
      default:
        break
    }
  };

  const handlerScannerStatus = (e, args) => {
    setProgress(args.processed);
  };

  const handlerScannerStage = (e, args) => {
    setStage(args);
    setProgress(0);
  };

  const handlerScannerError = async (e, err) => {
    const cause = (err.cause.message || err.cause || '').replace(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/gm,  m => {
      return `<a href="${m}" target='_blank'>${m}</a>`;
    })

    const errorMessage = `<strong>${t('Dialog:ScanPaused')}</strong>

    <span style="font-style: italic;">${err.name || ''} ${err.message || ''} ${err.code || ''}</span>
    <pre style="margin-bottom: 0"><small style="-webkit-user-select: all !important">Reason: ${cause}</small></pre>`;

    await dialogCtrl.openConfirmDialog(
      `${errorMessage}`,
      'Scan Error',
      {
        label: t('Button:OK'),
        role: 'accept',
      },
      true
    );
    navigate('/workspace');
  };

  const onPauseHandler = async () => {
    const { action } = await dialogCtrl.openConfirmDialog(
      t('Dialog:PauseProcess'),
      t('Dialog:PauseFingerprintProcessQuestion'),
      {
        label: t('Button:OK'),
        role: 'accept',
      },
      false
    );
    if (action === 'ok') {
      await projectService.stop();
      navigate('/workspace');
    }
  };

  const handlerScannerFinish = (e, args) => {
    if (args.success) {
      onShowScan(args.resultsPath);
    }
  };

  const setupListeners = (): (() => void) => {
    const subscriptions = [];
    subscriptions.push(
      window.electron.ipcRenderer.on(
        IpcChannels.SCANNER_UPDATE_STATUS,
        handlerScannerStatus
      )
    );
    subscriptions.push(
      window.electron.ipcRenderer.on(
        IpcChannels.SCANNER_FINISH_SCAN,
        handlerScannerFinish
      )
    );
    subscriptions.push(
      window.electron.ipcRenderer.on(
        IpcChannels.SCANNER_ERROR_STATUS,
        handlerScannerError
      )
    );
    subscriptions.push(
      window.electron.ipcRenderer.on(
        IpcChannels.SCANNER_UPDATE_STAGE,
        handlerScannerStage
      )
    );
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  };

  // setup listeners
  useEffect(setupListeners, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <section id="ProjectScan" className="app-page app-main">
        <main className="app-content">
          <div className="content">
              <img  className="mt-5" src={analysis} alt='Analysis' height="200" />
              <h1>{t('GatheringMessage')}</h1>

              <ProgressBar
                stage={stage}
                progress={progress}
                showPause={pipeline === AppDefaultValues.PIPELINE.FINGERPRINT}
                pauseScan={() => onPauseHandler()}
              />
          </div>
        </main>
      </section>
  );
}

export default ProjectScan;
