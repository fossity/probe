import React, { useContext } from 'react';
import { Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AppDefaultValues } from '@config/AppDefaultValues';
import FlowStepper from '@components/FlowStepper/FlowStepper';
import FlowHeader from '@components/FlowHeader';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ProjectInfo from '../Components/ProjectInfo/ProjectInfo';
import { useSelector } from 'react-redux';
import { selectWorkspaceState } from '@store/workspace-store/workspaceSlice';
import { IProject } from '@api/types';
import { AppContext, IAppContext } from '@context/AppProvider';


const ProjectDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { downloadProject, showProjectFiles } = useContext(AppContext) as IAppContext;
  const { currentProject } = useSelector(selectWorkspaceState);

  const onShowFilesHandler = async (project: IProject) => showProjectFiles(project);

  const onDownloadHandler = async (project: IProject) => downloadProject(project);

  return (
    <section id="ProjectDetail" className="app-page app-pipeline">
          <header className="app-header">
            <FlowHeader
              title={currentProject.name.toUpperCase()}
              subtitle={currentProject.scan_root}
            />
          </header>
          <main className="app-content">
              <ProjectInfo />
          </main>
          <footer className='app-footer'>
            <div className="button-container">
              <Button
                color="inherit"
                variant="contained"
                type="button"
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon className="color-primary mr-1" fontSize="small" />
              </Button>
            </div>
            <div className="button-container end">
              <Tooltip
                arrow
                title="Review the samples generated before package the content.">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={e => onShowFilesHandler(currentProject)}
                >
                  {t('Button:Review')}
                </Button>
              </Tooltip>
              <Tooltip
                arrow
                title="Export a encrypted .fossity file with all your samples.">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={e => onDownloadHandler(currentProject)}
                >
                  {t('Button:Export')}
                </Button>
              </Tooltip>
            </div>
          </footer>
        </section>
  );
};

export default ProjectDetail;
