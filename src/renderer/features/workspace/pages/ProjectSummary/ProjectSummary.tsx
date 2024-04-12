import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AppDefaultValues } from '@config/AppDefaultValues';
import FlowStepper from '@components/FlowStepper/FlowStepper';
import FlowHeader from '@components/FlowHeader';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProjectInfo from '../Components/ProjectInfo/ProjectInfo';

const ProjectSummary = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = async (e) => {
    navigate('/workspace/new/scan', { replace: true, state: { pipeline: AppDefaultValues.PIPELINE.FINGERPRINT } });
  };

  return (
    <form onSubmit={(e) => submit(e)}>
      <section id="ProjectSummary" className="app-page app-pipeline">
        <header className="app-header">
          <FlowHeader
            title={t('Title:Summary')}
            subtitle={t('Title:SummarySubtitle')}
          />
        </header>
        <main className="app-content">
          <ProjectInfo />
        </main>
        <footer className="app-footer">
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
          <FlowStepper step={2} />
          <div className="button-container end">
            <Button
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
  );
};

export default ProjectSummary;
