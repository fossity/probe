import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { selectWorkspaceState, setNewProject, setScanPath } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { useDispatch, useSelector } from 'react-redux';


const ProjectDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { projects, scanPath } = useSelector(selectWorkspaceState);
  const dialogCtrl = useContext(DialogContext) as IDialogContext;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
  };

  return (
    <>
        <section id="ProjectDetails" className="app-page app-pipeline">
          <header className="app-header">

          </header>
          <main className="app-content">
              <div className='content'>
                PROJECT DETAILS
              </div>
          </main>
          <footer className='app-footer'>
            <div className="button-container">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={e => navigate('/workspace', { replace: true })}
              >
                {t('Button:OpenFolder')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={e => navigate('/workspace', { replace: true })}
              >
                {t('Button:Download')}
              </Button>
            </div>
          </footer>
        </section>
    </>
  );
};

export default ProjectDetails;
