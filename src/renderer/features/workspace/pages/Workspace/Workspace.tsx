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
import { projectService } from '@api/services/project.service';
import { dialogController } from '../../../../controllers/dialog-controller';
import { Button } from '@mui/material';


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
    window.shell.openPath(project.work_root);
  };

  const onDownloadHandler = async (project: IProject) => {
    const path = await dialogController.showSaveDialog({
      filters: [{ name: 'Fossity Package Archive', extensions: ['fossity'] }],
      defaultPath: `${project.name}-package`,
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
