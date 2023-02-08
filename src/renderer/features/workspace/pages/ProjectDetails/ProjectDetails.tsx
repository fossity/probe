import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  IconButton,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
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
        <section id="ProjectDetails" className="app-page app-main">
          <main className="app-content">
              <div className='content'>

                  <CheckCircleOutlineIcon color="success" fontSize="large"/>
                  <h4>Your samples have been collected!</h4>

                    <div className="d-flex">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={e => navigate('/workspace', { replace: true })}
                      >
                        {t('Button:ShowFiles')}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"

                        onClick={e => navigate('/workspace', { replace: true })}
                      >
                        {t('Button:CreateFossityPackage')}
                      </Button>
                    </div>
                    <Button
                      size="small"
                      className="mt-4"
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

export default ProjectDetails;
