/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, IAppContext } from '@context/AppProvider';
import { IProject, ScanState } from '@api/types';
import { workspaceService } from '@api/services/workspace.service';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { DIALOG_ACTIONS } from '@context/types';
import SearchBox from '@components/SearchBox/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@store/workspace-store/workspaceThunks';
import {
  clean,
  selectWorkspaceState,
  setCurrentProject,
  setNewProject, setObfuscateList,
  setScanPath
} from '@store/workspace-store/workspaceSlice';
import { useTranslation } from 'react-i18next';
import ProjectList from '../Components/ProjectList';
import AddProjectButton from '../Components/AddProjectButton/AddProjectButton';
import { AppDefaultValues } from '@config/AppDefaultValues';

const Workspace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { projects } = useSelector(selectWorkspaceState);

  const { newProject, downloadProject, showProjectFiles } = useContext(AppContext) as IAppContext;
  const dialogCtrl = useContext(DialogContext) as IDialogContext;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const init = async () => {
    try {
      showGettingStarted();
      dispatch(fetchProjects());
    } catch (error) {
      alert(error);
    }
  };

  const cleanup = () => {};

  const showGettingStarted = () => {
    if (localStorage.getItem(AppDefaultValues.GETTING_STARTED) !== 'true') {
      dialogCtrl.openOnBoardingDialog();
      localStorage.setItem(AppDefaultValues.GETTING_STARTED, 'true');
    }
  }

  const onNewProjectHandler = () => newProject();

  const onShowScanHandler = async (project: IProject) => {
    const { uuid, name, scan_root } = project;
    dispatch(clean());
    dispatch(setScanPath({ path: project.scan_root, action: 'scan' }));
    dispatch(setCurrentProject(project));
    dispatch(setObfuscateList(project.obfuscatedList));
    dispatch(setNewProject({
      uuid,
      name,
      scan_root,
      projectInfo: project.data,
    }));

    const route = project.scannerState !== ScanState.FINISHED ? '/workspace/new/settings' : '/workspace/detail';
    navigate(route);
  };

  const onShowFilesHandler = async (project: IProject) => showProjectFiles(project);

  const onDownloadHandler = async (project: IProject) => downloadProject(project);

  const onTrashHandler = async (project: IProject) => {
    const { action } = await dialogCtrl.openConfirmDialog(t('Title:DeleteAuditProject'), t('Dialog:DeleteQuestion'), {
      label: t('Button:Yes'),
      role: 'delete',
    });
    if (action === DIALOG_ACTIONS.OK) {
      await workspaceService.deleteProject(project.work_root);
      init();
    }
  };

  useEffect(() => {
    init();
    return cleanup;
  }, []);

  return (
    <>
      <section id="Workspace" className="app-page">
        <header className="app-header d-flex space-between align-center">
          <h1 className="header-title">{t('Title:MyAuditProjects')}</h1>
          <AddProjectButton
            onNewProject={onNewProjectHandler}
          />
        </header>
        <main className="app-content mb-5">
          <section className="mb-5">
            <div className="search-box">
              {projects && projects.length > 0 && (
                <SearchBox onChange={(value) => setSearchQuery(value.trim().toLowerCase())} />
              )}
            </div>
          </section>

          <ProjectList
            projects={projects}
            searchQuery={searchQuery}
            onProjectClick={onShowScanHandler}
            onProjectDelete={onTrashHandler}
            onProjectDownload={onDownloadHandler}
            onProjectShowFiles={onShowFilesHandler}
            onProjectCreate={onNewProjectHandler}
          />
        </main>
      </section>
    </>
  );
};

export default Workspace;
