import React, { useEffect } from 'react';
import { Chip, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectWorkspaceState } from '@store/workspace-store/workspaceSlice';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
              <Panel title={t('Title:ContactInformation')}>
                <Data label={t('Title:Name')} value={newProject.projectInfo.contact.name} />
                <Data label={t('Title:EmailAddress')} value={newProject.projectInfo.contact.email} />
                <Data label={t('Title:PhoneNumber')} value={newProject.projectInfo.contact.phone} />
              </Panel>

              <Panel title={t('Title:KnownSoftwareComposition')}>
                <Data
                  label={t('Title:FilesAttached')}
                  value=
                    { newProject.projectInfo.software_composition_uri?.length > 0 ?
                      <Tooltip title={newProject.projectInfo.software_composition_uri.join(', ')}>
                        <small className="d-flex align-center">
                          <span className="mr-1">{t('NFilesAttached', { count: newProject.projectInfo.software_composition_uri.length })}</span>
                          <InfoOutlinedIcon fontSize="inherit" />
                        </small>
                      </Tooltip>
                      : <>{t('NoFilesAttached')}</>
                    }
                  size="small"
                />

                <Data label={t('Title:AdditionalInformation')} value={newProject.projectInfo.software_composition} size="small" />
              </Panel>

              <Panel title={t('Title:Licensing')}>
                <Data label={t('Title:License')} value={newProject.projectInfo.default_license || t('Title:Proprietary')} />
                <Data label={t('Title:AdditionalInformation')} value={newProject.projectInfo.extra_license} size="small" />
              </Panel>

              <Panel title={t('Title:Obfuscation')}>
                <Data
                  label={t('Title:BannedList')}
                  value={t('NBannedList', { count: obfuscateList?.length || 0 })}
                  size="small" />

                <div className="word-list">
                  {obfuscateList.map( (item) => <Chip className="light" color="primary" size="small" key={item} label={item} />)}
                </div>
              </Panel>
            </div>
  );
};

export default ProjectInfo;
