import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox, Chip, FormControl,
  FormControlLabel,
  FormHelperText, FormLabel, Grid,
  IconButton,
  MenuItem,
  Paper, Radio, RadioGroup,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { selectWorkspaceState, setNewProject, setScanPath } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';


const ProjectObfuscation = () => {
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

  const onTagsHandler = (data) => {

  }

  const submit = async (e) => {
    navigate('/workspace/new/summary');
  };
  return (
    <>
      <form onSubmit={(e) => submit(e)}>
        <section id="ProjectObfuscation" className="app-page app-pipeline">
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
                <Autocomplete
                  multiple
                  fullWidth
                  size="small"
                  options={['license', 'copyright', 'author', 'version']}
                  freeSolo
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      // eslint-disable-next-line react/jsx-key
                      <Chip
                        color="primary"
                        variant="outlined"
                        size="small"
                        label={option}
                        {...getTagProps({ index })}
                        className="bg-primary mr-1"
                      />
                    ))
                  }
                  onChange={(event, data) => onTagsHandler(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoFocus
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                    />
                  )}
                />
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
              {t('Button:Continue')}
            </Button>
          </div>
        </footer>
      </section>
      </form>
    </>
  );
};

export default ProjectObfuscation;
