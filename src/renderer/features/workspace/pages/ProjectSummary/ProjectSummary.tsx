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
import { AppDefaultValues } from '@config/AppDefaultValues';


const ProjectSummary = () => {
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

  const submit = async (e) => {
    // dispatch(setScanPath({ path, action: 'none' }));
    navigate('/workspace/new/scan', { replace: true, state: { pipeline: AppDefaultValues.PIPELINE.FINGERPRINT } });
  };
  return (
    <>
      <form onSubmit={(e) => submit(e)}>
        <section id="ProjectSummary" className="app-page app-pipeline">
          <header className="app-header">
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
          </header>
          <main className="app-content">
              <div className='content'>
                SUMMARY STAGE
              </div>
          </main>
          <footer className='app-footer'>
            <div className="button-container">
              <Button
                endIcon={<ArrowForwardIcon />}
                variant="contained"
                color="primary"
                type="submit"
              >
                {t('Button:CreateFingerprints')}
              </Button>
            </div>
          </footer>
        </section>
      </form>
    </>
  );
};

export default ProjectSummary;
