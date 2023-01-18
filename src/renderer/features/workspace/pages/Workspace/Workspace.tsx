import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, IAppContext } from '@context/AppProvider';
import { IProject } from '@api/types';
import { workspaceService } from '@api/services/workspace.service';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { DIALOG_ACTIONS } from '@context/types';
import SearchBox from '@components/SearchBox/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@store/workspace-store/workspaceThunks';
import { selectWorkspaceState, setScanPath } from '@store/workspace-store/workspaceSlice';
import { useTranslation } from 'react-i18next';
import ProjectList from '../Components/ProjectList';
import AddProjectButton from '../Components/AddProjectButton/AddProjectButton';
import DownloadIcon from '@mui/icons-material/Download';


const Workspace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { projects } = useSelector(selectWorkspaceState);

  const { newProject } = useContext(AppContext) as IAppContext;
  const dialogCtrl = useContext(DialogContext) as IDialogContext;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const init = async () => {
    try {
      dispatch(fetchProjects());
    } catch (error) {
      alert(error);
    }
  };

  const cleanup = () => {};

  const onShowScanHandler = async (project: IProject) => {

  };

  const onShowFilesHandler = async (project: IProject) => {
    window.shell.openPath(project.work_root.replace('/', '\\'));
  };

  const onDownloadHandler = async (project: IProject) => {

  };

  const deleteProject = async (project: IProject) => {
    await workspaceService.deleteProject(project.work_root);
    init();
  };

  const onNewProjectHandler = () => {
    newProject();
  };

  const onTrashHandler = async (project: IProject) => {
    const { action } = await dialogCtrl.openConfirmDialog(t('Dialog:DeleteQuestion'), {
      label: t('Button:Delete'),
      role: 'delete',
    });
    if (action === DIALOG_ACTIONS.OK) {
      await deleteProject(project);
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
        <header className="app-header">
          <h1 className="header-title">{t('Title:Projects')}</h1>
          <section className="subheader">
            <div className="search-box">
              {projects && projects.length > 0 && (
                <SearchBox onChange={(value) => setSearchQuery(value.trim().toLowerCase())} />
              )}
            </div>
            <AddProjectButton
              onNewProject={onNewProjectHandler}
            />
          </section>
        </header>
        <main className="app-content">
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
