import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox, FormControl,
  FormControlLabel,
  Grid,
  IconButton, InputAdornment,
  Radio, RadioGroup,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import { useDispatch, useSelector } from 'react-redux';

import { selectWorkspaceState, setNewProject, setScanPath } from '@store/workspace-store/workspaceSlice';
import { workspaceService } from '@api/services/workspace.service';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { AppDefaultValues } from '@config/AppDefaultValues';
import FlowStepper from '@components/FlowStepper/FlowStepper';
import { DIALOG_ACTIONS } from '@context/types';
import { projectService } from "@api/services/project.service";
import TextInput from '@components/TextInput';
import FlowHeader from '@components/FlowHeader';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';

import { dialogController } from '../../../../controllers/dialog-controller';

const useStyles = makeStyles((theme) => ({
  size: {
    '& .MuiDialog-paperWidthMd': {
      width: '600px',
    },
  },
  search: {
    padding: '8px 16px 8px 8px',
    outline: 'none',
  },
  new: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: theme.palette.primary.light,
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    '& span.middle': {
      fontSize: '0.8rem',
      color: '#6c6c6e',
    },
  },
}));

const ProjectSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();


  const { projects, scanPath, newProject } = useSelector(selectWorkspaceState);
  const dialogCtrl = useContext(DialogContext) as IDialogContext;

  const [isEdition, setIsEdition] = useState<boolean>(!!newProject.uuid);

  const [licenses, setLicenses] = useState([]);
  const [license, setLicense] = useState<string>(isEdition && newProject.projectInfo.default_license ? 'other' : 'proprietary');

  const [projectValidName, setProjectValidName] = useState(false);
  const [projectNameExists, setProjectNameExists] = useState(false);

  const init = async () => {
    const data = await workspaceService.getLicenses();
    setLicenses(data);

    const { path } = scanPath;
    const projectName: string = isEdition ? newProject.name : path.split(window.path.sep)[path.split(window.path.sep).length - 1]

    dispatch(setNewProject({
      ...newProject,
      scan_root: path,
      name: projectName,
    }));
  };

  const onAttachFile = async () => {
    const paths = await dialogController.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Text files', extensions: ['json', 'txt'] }],
    });

    if (paths && paths.length > 0) {
      const files = [... new Set([...(newProject.projectInfo.software_composition_uri || []), ...paths])];
      dispatch(setNewProject({
        ...newProject, projectInfo: {...newProject.projectInfo, software_composition_uri: files}
      }))
    }
  };

  const inputHandler = (e, group) => {
    dispatch(setNewProject({
      ...newProject, projectInfo:{...newProject.projectInfo,
      [group]: {
        ...newProject.projectInfo[group],
        [e.target.name]: e.target.value,
      }
    }}));
  };

  const setProjectName = () => {
    const existProjectName = (pName) =>
      projects.some(
        (project) =>
          project.name.trim().toLowerCase() === pName.trim().toLowerCase() &&
          project.uuid !== newProject?.uuid
      );

    setProjectNameExists(existProjectName(newProject.name));

    // eslint-disable-next-line no-control-regex
    const re = /^[^\s^\x00-\x1f\\?*:"";<>|/.][^\x00-\x1f\\?*:"";<>|/]*[^\s^\x00-\x1f\\?*:"";<>|/.]+$/;
    setProjectValidName(newProject.name.trim() !== '' && re.test(newProject.name));
  };

  const onExitHandler = async () => {
    const { action } = await dialogCtrl.openConfirmDialog('Back to list', 'Are you sure to exit? Project will be saved as a draft.');
    if (action === DIALOG_ACTIONS.OK) {
       if (!projectNameExists) await projectService.update(newProject);
      navigate('/workspace', { replace: true });
    }
  }

  const submit = async () => {
    dispatch(setScanPath({ ...scanPath, projectName: newProject.name }));
    // dispatch(setNewProject(projectSettings));
    navigate('/workspace/new/scan', { state: { pipeline: AppDefaultValues.PIPELINE.INDEX } });
  };

  const handleClose = (e) => {
    e.preventDefault();
    submit();
  };

  useEffect(() => {
    if (license === 'proprietary') {
      dispatch(setNewProject({
        ...newProject, projectInfo: {...newProject.projectInfo, default_license: null}
      }))
    }
  }, [license]);

  useEffect(() => {
    setProjectName();
  }, [newProject.name, projects]);

  useEffect(() => {
    init();
  }, []);

  return (
    <form onSubmit={(e) => handleClose(e)}>
      <section id="ProjectSettings" className="app-page app-pipeline">
          <header className="app-header">
            <FlowHeader
              title={t('Project Information')}
              subtitle={t('Complete all the Audit Project information')}
            />
          </header>
          <main className="app-content">
              <Grid container spacing={8} rowSpacing={2}>
                <Grid item xs={6}>
                  <div className="form-field mb-0">
                    <label className="input-label">{t('Title:ProjectName')}</label>
                      <TextInput
                        label="Project Name"
                        error={projectNameExists || !projectValidName}
                        disabled={isEdition}
                        value={newProject.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <InsertDriveFileOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) =>
                          dispatch(setNewProject({
                            ...newProject,
                            name: e.target.value,
                          }))
                        }
                      />
                    <div className="error-message">
                      {projectNameExists && t('Common:ProjectNameAlreadyExists')}
                      {!projectValidName && t('Common:ProjectNameInvalid')}
                    </div>
                  </div>

                  <label className="input-label">{t('Contact Information')}</label>
                  <div className="form-field">
                    <TextInput
                      name="name"
                      label={t('Name')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}
                      value={newProject.projectInfo.contact.name}
                      onChange={(e) => inputHandler(e, 'contact')} />
                  </div>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div className="form-field">
                        <TextInput
                          name="email"
                          label={t('Email Address')}
                          type="email"
                          required
                          value={newProject.projectInfo.contact.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlinedIcon  />
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) => inputHandler(e, 'contact')} />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="form-field">
                        <TextInput
                          name="phone"
                          label={t('Phone Number')}
                          value={newProject.projectInfo.contact.phone}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalPhoneOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) => inputHandler(e, 'contact')} />
                      </div>
                    </Grid>
                  </Grid>

                  <div className="d-flex align-center">
                    <label className="input-label mt-3">{t('Known Software Composition')}</label>
                    <IconButton
                      className="ml-1"
                      title={t('Tooltip:AttachFile')}
                      tabIndex={-1}
                      color="inherit"
                      size="small"
                      onClick={onAttachFile}
                    >
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </div>

                  <TextInput
                    multiline
                    placeholder="Enter here the list of known Open Source components used and/or attach an SBOM (only text files allowed, .i.e. SPDX, CycloneDX, CSV, TXT)."
                    maxRows={3}
                    minRows={3}
                    value={newProject.projectInfo.software_composition}
                    onChange={e => dispatch(setNewProject({...newProject, projectInfo: {...newProject.projectInfo, software_composition: e.target.value} }))}
                    helperText={newProject.projectInfo.software_composition_uri?.length > 0 ? `${newProject.projectInfo.software_composition_uri.length} file(s) attached.` : ''}
                  />
                  <FormGroup className="mt-2">
                    <FormControlLabel
                      control={<Checkbox required defaultChecked={isEdition} />}
                      label={<small className="checkbox-label">I confirm that the information hereby provided does not contain any sensitive information such as company or product names.</small>}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <>
                    <label className="input-label">{t('Licensing')}</label>
                    <FormControl>
                      <RadioGroup
                        defaultValue={license}
                        name="license"
                        onChange={e => setLicense(e.target.value)}
                      >
                        <FormControlLabel value="proprietary" control={<Radio />} label="Proprietary" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    </FormControl>

                    <div className="mt-1 mb-2">
                      <Autocomplete
                        disabled={license === 'proprietary'}
                        onChange={(e, value) =>
                          dispatch(setNewProject({
                            ...newProject, projectInfo:{...newProject.projectInfo, default_license: value?.spdxid}
                          }))
                        }
                        fullWidth
                        value={
                          licenses.length > 0 && newProject.projectInfo.default_license
                            ? licenses.find((license) => license.spdxid === newProject.projectInfo.default_license)
                            : ''
                        }
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        options={licenses}
                        isOptionEqualToValue={(option: any, value: any) => {
                          return option.spdxid === value.spdxid
                        }}
                        getOptionLabel={(option: any) =>
                          option ? `${option.name  } (${  option.spdxid  })` : ''
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <div className={classes.option}>
                              <span>{option.name}</span>
                              <span className="middle">{option.spdxid}</span>
                            </div>
                          </li>
                        )}
                        filterOptions={(options, params) => {
                          return options.filter(
                            (option) =>
                              option.name
                                .toLowerCase()
                                .includes(params.inputValue.toLowerCase()) ||
                              option.spdxid
                                .toLowerCase()
                                .includes(params.inputValue.toLowerCase())
                          );
                        }}
                        renderInput={(params) => (
                          <TextInput
                            {...params}
                            label={t('SPDX License List')}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <InputAdornment position="start"><SearchIcon /> </InputAdornment>,
                              disableUnderline: true,
                            }}
                          />
                        )}
                      />
                    </div>
                    <TextInput
                      multiline
                      placeholder="Enter here any additional details about actual licensing of the software being scanned."
                      minRows={3}
                      maxRows={3}
                      value={newProject.projectInfo.extra_license}
                      onChange={e => dispatch(setNewProject({...newProject, projectInfo: {...newProject.projectInfo, extra_license: e.target.value}}))}
                    />
                    <FormGroup className="mt-2">
                      <FormControlLabel
                        control={<Checkbox required defaultChecked={isEdition} />}
                        label={<small className="checkbox-label">I confirm that the information hereby provided does not contain any sensitive information such as company or product names.</small>}
                      />
                    </FormGroup>
                  </>

                </Grid>
              </Grid>
          </main>
         <footer className='app-footer'>
          <div className="button-container">
            <Button
              color="inherit"
              variant="contained"
              type="button"
              onClick={onExitHandler}
            >
              <ArrowBackIcon className="color-primary mr-1" fontSize="small" />
            </Button>
          </div>
          <FlowStepper step={0} />
          <div className="button-container end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              {t('Button:Next')}
            </Button>
          </div>
        </footer>
      </section>
    </form>
  );
};

export default ProjectSettings;
