import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IpcChannels } from '@api/ipc-channels';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { projectService } from '@api/services/project.service';
import { useDispatch, useSelector } from 'react-redux';
import { selectWorkspaceState, setScanPath } from '@store/workspace-store/workspaceSlice';
import { useTranslation } from 'react-i18next';
import { AppDefaultValues } from '@config/AppDefaultValues';
import * as controller from '../../../../controllers/home-controller';
import CircularComponent from '../Components/CircularComponent';

const ProjectScan = () => {
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

      console.log(pipeline, AppDefaultValues.PIPELINE.INDEX);
      if (action === 'scan') {
        const response = (pipeline === AppDefaultValues.PIPELINE.INDEX)
          ? await controller.create(newProject)
          : await controller.scan();
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
        navigate('/workspace/details', { replace: true });
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
     t('Dialog:PauseScannerQuestion'),
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
    <>
      <section id="ProjectScan" className="app-page app-pipeline">
        <header className="app-header">
          { pipeline === AppDefaultValues.PIPELINE.INDEX && (
            <div className='breadcrumb d-flex align-center'>
              <IconButton
                tabIndex={-1}
                onClick={() => navigate(-1)}
                component="span"
                size="large"
              >
                <ArrowBackIcon />
              </IconButton>
              <div>
                <h4 className="header-subtitle back">
                  {t('New Project')}
                </h4>
                <h2 className="mt-0 mb-0">{scanPath.path}</h2>
              </div>
            </div>
          )}
        </header>
        <main className="app-content">
          <div className="progressbar">
            <div className="circular-progress-container">
              <CircularComponent
                stage={stage}
                progress={progress}
                pauseScan={() => onPauseHandler()}
              />
            </div>
          </div>
        </main>
        <footer className='app-footer' />
      </section>
    </>
  );
};

export default ProjectScan;
