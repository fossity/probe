import React, { useContext, useEffect, useState } from 'react';
import {
  Button, Grid,
  IconButton, Tooltip, Typography
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { selectWorkspaceState, setNewProject, setScanPath } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDefaultValues } from '@config/AppDefaultValues';

const Panel = ({ title, children }) => (
  <section className='panel'>
    <header>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
    </header>
    <main>
      {children}
    </main>
  </section>
);

const Data = ({label = null, value}) => (
  <>
    {label &&
      <Typography variant="h6">
        {label}
      </Typography>
    }
    <Typography variant="subtitle1" gutterBottom>
      {value || '-'}
    </Typography>
  </>
);

const ProjectSummary = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scanPath, newProject, obfuscateList } = useSelector(selectWorkspaceState);

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
                <h2 className="header-subtitle back">
                  {t('Summary')}
                </h2>
                <h5 className="mt-0 mb-0">{scanPath.path}</h5>
              </div>
            </div>
          </header>
          <main className="app-content">
              <div className='content'>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Panel title={t('Contact Information')}>
                      <Data label="Name" value={newProject.projectInfo.contact.name} />
                      <Data label="Email Address" value={newProject.projectInfo.contact.email} />
                      <Data label="Phone Number" value={newProject.projectInfo.contact.phone} />
                    </Panel>
                  </Grid>
                  <Grid item xs={4}>
                    <Panel title={t('Known Software Composition')}>
                      <Data value={newProject.projectInfo.software_composition} />
                      { newProject.projectInfo.software_composition_uri?.length > 0 &&
                        <Tooltip title={newProject.projectInfo.software_composition_uri.join(', ')}>
                          <small className="d-flex align-center">
                            <span className="mr-1">{newProject.projectInfo.software_composition_uri.length} file(s) attached</span>
                            <InfoOutlinedIcon fontSize="inherit" />
                          </small>
                        </Tooltip>
                      }
                    </Panel>
                  </Grid>
                  <Grid item xs={4}>
                    <Panel title={t('Licensing')}>
                      <Data label="Name" value={newProject.projectInfo.contact.name} />
                      <Data label="Phone Number" value={newProject.projectInfo.contact.phone} />
                    </Panel>
                  </Grid>
                  <Grid item xs={4}>
                    <Panel title={t('Obfuscation')}>
                      <Data value={obfuscateList.join(' - ')} />
                    </Panel>
                  </Grid>
                </Grid>
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
