import React, { useEffect } from 'react';
import { Button, Chip, Grid, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { AppDefaultValues } from '@config/AppDefaultValues';
import { selectWorkspaceState } from '@store/workspace-store/workspaceSlice';
import FlowStepper from '@components/FlowStepper/FlowStepper';
import FlowHeader from '@components/FlowHeader';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',

    '& > main': {
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 16,
      height: '100%',
      overflowY: 'scroll',
    },

    '& .title': {
      fontSize: 18,
      fontWeight: 600,
    },
    '& .label': {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.primary.main
    },
    '& .value': {
      fontSize: 16,
      fontWeight: 400,

      '&.small': {
        fontSize: 12,
      }
    }
  }
}));

const Panel = ({ title, children }) => {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <header>
        <Typography className="title" variant="h5" gutterBottom>
          {title}
        </Typography>
      </header>
      <main>
        {children}
      </main>
    </section>
  );
};

const Data = ({label = null, value, size="normal"}) => (
  <>
    {label &&
      <Typography className="label" variant="subtitle1">
        {label}
      </Typography>
    }
    <Typography className={`value ${size}`} variant="h6" gutterBottom>
      {value || '-'}
    </Typography>
  </>
);

const ProjectInfo = () => {
  const { t } = useTranslation();
  const { newProject, obfuscateList } = useSelector(selectWorkspaceState);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
  };


  return (
    <div id="ProjectInfo" className='content'>
              <Panel title={t('Contact Information')}>
                <Data label="Name" value={newProject.projectInfo.contact.name} />
                <Data label="Email Address" value={newProject.projectInfo.contact.email} />
                <Data label="Phone Number" value={newProject.projectInfo.contact.phone} />
              </Panel>

              <Panel title={t('Known Software Composition')}>
                <Data
                  label="Files Attached"
                  value=
                    { newProject.projectInfo.software_composition_uri?.length > 0 ?
                      <Tooltip title={newProject.projectInfo.software_composition_uri.join(', ')}>
                        <small className="d-flex align-center">
                          <span className="mr-1">{newProject.projectInfo.software_composition_uri.length} file(s) attached</span>
                          <InfoOutlinedIcon fontSize="inherit" />
                        </small>
                      </Tooltip>
                      : <>No files attached</>
                    }
                  size="small"
                />

                <Data label="Additional Information" value={newProject.projectInfo.software_composition} size="small" />
              </Panel>

              <Panel title={t('Licensing')}>
                <Data label="License" value={newProject.projectInfo.default_license || 'Proprietary'} />
                <Data label="Additional Information" value={newProject.projectInfo.extra_license} size="small" />
              </Panel>

              <Panel title={t('Obfuscation')}>
                <Data
                  label="Word List"
                  value={obfuscateList?.length ? `${obfuscateList.length} word(s) obfuscated` : 'No words obfuscated'}
                  size="small" />

                <div className="word-list">
                  {obfuscateList.map( (item) => <Chip className="light" color="primary" size="small" key={item} label={item} />)}
                </div>
              </Panel>
            </div>
  );
};

export default ProjectInfo;
