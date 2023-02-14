import React, { useContext, useEffect, useState } from 'react';
import { Button, LinearProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectWorkspaceState } from '@store/workspace-store/workspaceSlice';
import { AppContext, IAppContext } from '@context/AppProvider';
import { IProject } from '@api/types';

import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import done from '@assets/imgs/done.png'

const ProjectResult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { currentProject } = useSelector(selectWorkspaceState);
  const { downloadProject, showProjectFiles, uploadProject } = useContext(AppContext) as IAppContext;

  const onShowFilesHandler = async (project: IProject) => showProjectFiles(project);

  const onDownloadHandler = async (project: IProject) => downloadProject(project);

  const onUploadHandler = async (project: IProject) => uploadProject(project);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
  };

  return (
    <>
        <section id="ProjectDetails" className="app-page app-main">
          <main className="app-content">
              <div className='content'>

                <img src={done} alt='Done!' width="200" />
                <h1>Your samples have been collected!</h1>

                <div className="progress-bar d-flex align-center mb-6">
                  <LinearProgress color="success" value={100} variant="determinate" sx={{width: 500, height: 20, borderRadius: 5,}}/>
                  <CheckCircleOutlineIcon className="ml-2" color="success" fontSize="medium"/>
                </div>
                <section className='stepper'>
                  <div className='line left' />
                  <div className='line right' />

                  <article>
                    <div className='bullet'>1</div>
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
                  </article>
                  <article>
                    <div className='bullet'>2</div>
                    <Tooltip
                      arrow
                      title="Export a encrypted .fossity file with all your samples.">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={e => onDownloadHandler(currentProject)}
                      >
                        {t('Button:Export')}
                      </Button>
                    </Tooltip>
                  </article>
                  <article>
                    <div className='bullet'>3</div>
                    <Tooltip
                      arrow
                      title="Go to fossity.com and upload your file. We will reach you to start the Audit!">
                      <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<OpenInNewOutlinedIcon fontSize="small" />}
                        onClick={e => onUploadHandler(currentProject)}
                      >
                        {t('Button:Upload')}
                      </Button>
                    </Tooltip>
                  </article>
                </section>

                <Button
                  size="small"
                  className="mt-8"
                  onClick={e => navigate('/workspace', { replace: true })}
                >
                  {t('Button:BackToProjects')}
                </Button>
              </div>
          </main>
        </section>
    </>
  );
};

export default ProjectResult;
