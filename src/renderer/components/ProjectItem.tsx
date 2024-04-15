import React from 'react';
import {
  ButtonBase, Card, CardContent, Chip, Step, StepLabel, Stepper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ScanState } from '@api/types';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '230px',
    borderRadius: 20,
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),

    '&:hover': {
      backgroundColor: '#F6F6F6',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.08)',
    },

    '& > button': {
      width: '100%',
      height: '100%',
    },

    '& .project-item-content': {
      display: 'grid',
      gridTemplateRows: '1.5fr 1fr 80px',
      alignItems: 'center',
      height: '100%',

      '& header': {
        textTransform: 'uppercase',
        fontWeight: 500,
      },
    },
  },
}));

const ProjectItem = ({ project, onClick, children }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card className={classes.root} elevation={0}>
      <ButtonBase onClick={() => onClick(project)}>
        <CardContent className="project-item-content">
          <header>
            { project.name }
          </header>
          <main>
            { project.scannerState !== ScanState.FINISHED && <Chip label={t('Draft')} /> }
          </main>
          <footer>
            {children}
          </footer>

        </CardContent>
      </ButtonBase>
    </Card>
  );
};

export default ProjectItem;
