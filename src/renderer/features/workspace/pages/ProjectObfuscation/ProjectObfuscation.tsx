import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox, Chip, dividerClasses, FormControl,
  FormControlLabel,
  FormHelperText, FormLabel, Grid,
  IconButton,
  MenuItem,
  Paper, Radio, RadioGroup,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import {
  AutoSizer,
  Column,
  Table,
  TableHeaderProps,
} from 'react-virtualized';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { selectWorkspaceState, setNewProject, setScanPath } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import { obfuscateService } from '@api/services/obfuscate.service';


const ProjectObfuscation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { projects, scanPath } = useSelector(selectWorkspaceState);
  const dialogCtrl = useContext(DialogContext) as IDialogContext;

  const [value, setValue] = React.useState<string[]>([]);
  const [results, setResults] = React.useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
  };

  const onTagsHandler = (tags: string[]) => {
    const nTags = tags
      .map((tag) => tag.toLowerCase().trim())
      // .map((tag) => SearchUtils.getTerms(tag))
      .flat();

    setValue(nTags);
  };

  const preview = async () => {
    const previewData = await obfuscateService.obfuscatePreview(value);
    setResults(Array.from(previewData, ([key, value]) => ({ key, value })));
    console.log(Array.from(previewData, ([key, value]) => ({ key, value })));
  }

  const submit = async (e) => {
    navigate('/workspace/new/summary');
  };

  useEffect(() => {
      preview();
    }, [value]);

  return (
    <>
      <form onSubmit={(e) => submit(e)}>
        <section id="ProjectObfuscation" className="app-page app-pipeline">
          <header className="app-header">
            <div className='breadcrumb d-flex align-center'>
              <IconButton
                tabIndex={-1}
                onClick={() => navigate(-2)}
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
                <Paper className="mb-5 p-1 pl-3 pr-3">
                  <Autocomplete
                    multiple
                    fullWidth
                    size="small"
                    options={[]}
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
                          placeholder: value.length > 0 ? '' : "Add words to obfuscate...",
                          disableUnderline: true,
                        }}
                      />
                    )}
                  />
                </Paper>

                <div className='results'>
                  <AutoSizer>
                    {({ height, width }) => (
                      <Table
                        height={height}
                        width={width}
                        rowHeight={20}
                        headerHeight={40}
                        rowCount={results.length}
                        rowGetter={({index}) => results[index]}
                      >
                        <Column label={t('Table:Header:OriginalFile')} dataKey="key"  width={width / 2} flexGrow={0} flexShrink={0} />
                        <Column label={t('Table:Header:RenamedFile')} dataKey="value" width={width / 2} flexGrow={0} flexShrink={0} />
                      </Table>
                    )}
                  </AutoSizer>
                </div>
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
