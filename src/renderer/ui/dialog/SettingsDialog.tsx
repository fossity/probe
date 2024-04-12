import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, IconButton, MenuItem, Paper, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DialogResponse, DIALOG_ACTIONS } from '@context/types';
import { IWorkspaceCfg } from '@api/types';
import { userSettingService } from '@api/services/userSetting.service';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { AppI18n } from '@shared/i18n';

const useStyles = makeStyles((theme) => ({
  size: {
    '& .MuiDialog-paperWidthMd': {
      width: '600px',
    },
  },
  new: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: theme.palette.primary.light,
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    padding: 6,
    '& span.middle': {
      fontSize: '0.8rem',
      color: '#6c6c6e',
    },
  },
}));

interface SettingDialogProps {
  open: boolean;
  onClose: (response: DialogResponse) => void;
  onCancel: () => void;
}

const SettingDialog = ({ open, onClose, onCancel }: SettingDialogProps) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const [language, setLanguage] = useState<string>('en');

  const submit = async () => {
    const config: Partial<IWorkspaceCfg> = {
      LNG: language || 'en',
    };

    await userSettingService.set(config);
    onClose({ action: DIALOG_ACTIONS.OK });
  };

  const setDefault = (config: Partial<IWorkspaceCfg>) => {
    const { LNG } = config;
    setLanguage(LNG);
  };

  const fetchConfig = async () => {
    const config = await userSettingService.get();
    setDefault(config || {});
  };

  const handleClose = (e) => {
    e.preventDefault();
    submit();
  };

  const handleOnChange = (event, newValue) => {};

  useEffect(() => {
    if (open) {
      fetchConfig();
    }
  }, [open]);

  return (
    <Dialog
      id="SettingsDialog"
      maxWidth="md"
      scroll="body"
      className={`${classes.size} dialog`}
      fullWidth
      open={open}
      onClose={onCancel}
    >
      <header className="dialog-title">
        <span>{t('Title:Settings')}</span>
        <IconButton aria-label="close" tabIndex={-1} onClick={onCancel} size="large">
          <CloseIcon />
        </IconButton>
      </header>

      <form onSubmit={handleClose}>
        <div className="dialog-content">
          <div className="dialog-form-field">
            <label className="dialog-form-field-label">
              <b>{t('Title:Language')}</b>
            </label>
            <Paper className="dialog-form-field-control">
              <Select
                name="usage"
                size="small"
                fullWidth
                disableUnderline
                value={language}
                onChange={(e) => setLanguage(e.target.value as string)}
              >
                {AppI18n.getLanguages().map((item) => <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>)}
              </Select>
            </Paper>
          </div>
        </div>
        <DialogActions>
          <Button tabIndex={-1} color="inherit" onClick={onCancel}>
            {t('Button:Cancel')}
          </Button>
          <Button type="submit" variant="contained" color="secondary">
            {t('Button:Save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SettingDialog;
