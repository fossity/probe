import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox, FormControl,
  FormControlLabel,
  FormLabel, Grid,
  IconButton,
  Radio, RadioGroup,
  TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { NewProjectDTO } from '@api/dto';
import { useTranslation } from 'react-i18next';
import { selectWorkspaceState, setNewProject, setScanPath } from '@store/workspace-store/workspaceSlice';
import { workspaceService } from '@api/services/workspace.service';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import AddIcon from '@mui/icons-material/Add';
import { Scanner } from '../../../../../main/task/scannerTask/types';
import ScannerType = Scanner.ScannerType;
import ScannerSource = Scanner.ScannerSource;
import { dialogController } from '../../../../controllers/dialog-controller';
import { AppDefaultValues } from '@config/AppDefaultValues';


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
          project.name.trim().toLowerCase() ===
          pName.trim().toLowerCase()
      );

    setProjectNameExists(existProjectName(newProject.name));

    // eslint-disable-next-line no-control-regex
    const re = /^[^\s^\x00-\x1f\\?*:"";<>|/.][^\x00-\x1f\\?*:"";<>|/]*[^\s^\x00-\x1f\\?*:"";<>|/.]+$/;
    setProjectValidName(newProject.name.trim() !== '' && re.test(newProject.name));
  };

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
                  {t('Project Information')}
                </h2>
                <h5 className="mt-0 mb-0">{scanPath.path}</h5>
              </div>
            </div>
          </header>
          <main className="app-content">
              <Grid container spacing={8} rowSpacing={2}>
                <Grid item xs={6}>

                  <div className="form-field mb-5">
                    <label className="input-label">{t('Title:ProjectName')}</label>
                      <TextField
                        spellCheck={false}
                        error={projectNameExists || !projectValidName}
                        fullWidth
                        disabled={isEdition}
                        value={newProject.name}
                        InputProps={{ style: { fontSize: 20, fontWeight: 500 } }}
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
                    <FormLabel>{t('Name')} <span className="optional">- {t('Optional')}</span></FormLabel>
                    <TextField
                      name="name"
                      size="small"
                      fullWidth
                      value={newProject.projectInfo.contact.name}
                      onChange={(e) => inputHandler(e, 'contact')} />
                  </div>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div className="form-field">
                        <FormLabel>{t('Email Address')}</FormLabel>
                        <TextField
                          name="email"
                          type="email"
                          size="small"
                          fullWidth
                          required
                          value={newProject.projectInfo.contact.email}
                          onChange={(e) => inputHandler(e, 'contact')} />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="form-field">
                        <FormLabel>{t('Phone Number')} <span className="optional">- {t('Optional')}</span></FormLabel>
                        <TextField
                          name="phone"
                          size="small"
                          fullWidth
                          value={newProject.projectInfo.contact.phone}
                          onChange={(e) => inputHandler(e, 'contact')} />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>

                  <div className="d-flex align-center">
                    <label className="input-label">{t('Known Software Composition')}</label>
                    <IconButton
                      className="ml-2 mb-1"
                      title={t('Tooltip:AttachFile')}
                      tabIndex={-1}
                      color="inherit"
                      size="small"
                      onClick={onAttachFile}
                    >
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </div>

                  <TextField
                      fullWidth
                      multiline
                      placeholder="Enter here the list of known Open Source components used and/or attach an SBOM (only text files allowed, .i.e. SPDX, CycloneDX, CSV, TXT)."
                      maxRows={2}
                      minRows={2}
                      value={newProject.projectInfo.software_composition}
                      onChange={e => dispatch(setNewProject({...newProject, projectInfo: {...newProject.projectInfo, software_composition: e.target.value} }))}
                      helperText={newProject.projectInfo.software_composition_uri?.length > 0 ? `${newProject.projectInfo.software_composition_uri.length} file(s) attached.` : ''}
                    />
                  <FormGroup className="mt-2">
                    <FormControlLabel
                      control={<Checkbox required defaultChecked={isEdition} />}
                      label={<small>I confirm that the information hereby provided does not contain any sensitive information such as company or product names.</small>}
                    />
                  </FormGroup>

                  <>
                    <label className="input-label mt-5">{t('Licensing')}</label>
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

                    <div className="input-container input-container-license mt-1 mb-3">
                      <Autocomplete
                        disabled={license === 'proprietary'}
                        size="small"
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
                          <TextField
                            {...params}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <SearchIcon />,
                              disableUnderline: true,
                            }}
                          />
                        )}
                      />
                    </div>
                    <TextField
                      fullWidth
                      multiline
                      placeholder="Enter here any additional details about actual licensing of the software being scanned."
                      minRows={2}
                      maxRows={2}
                      value={newProject.projectInfo.extra_license}
                      onChange={e => dispatch(setNewProject({...newProject, projectInfo: {...newProject.projectInfo, extra_license: e.target.value}}))}
                    />
                    <FormGroup className="mt-2">
                      <FormControlLabel
                        control={<Checkbox required defaultChecked={isEdition} />}
                        label={<small>I confirm that the information hereby provided does not contain any sensitive information such as company or product names.</small>}
                      />
                    </FormGroup>
                  </>

                </Grid>
              </Grid>
          </main>
          <footer className='app-footer'>
          <div className="button-container">
            <Button
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              color="primary"
              type="submit"
              disabled={!projectValidName || projectNameExists}
            >
              {t('Button:Continue')}
            </Button>
          </div>
        </footer>
      </section>
    </form>
  );
};

export default ProjectSettings;
