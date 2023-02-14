import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const AddProjectButton = ({ onNewProject }) => {
  const { t } = useTranslation();

  return (
    <>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onNewProject}>
          {t('Button:NewAuditProject')}
        </Button>
    </>
  );
};

export default AddProjectButton;
