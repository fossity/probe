import React, { useContext, useEffect, useState } from 'react';
import { Button, Chip, FormControl, Grid, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectWorkspaceState, setObfuscateList } from '@store/workspace-store/workspaceSlice';
import { DialogContext, IDialogContext } from '@context/DialogProvider';
import { obfuscateService } from '@api/services/obfuscate.service';
import { groupByFirstLetter, isBanned } from '@shared/utils/search-utils';
import FlowStepper from '@components/FlowStepper/FlowStepper';
import FlowHeader from '@components/FlowHeader';
import Panel, { Data } from '@components/Panel';
import TextInput from '@components/TextInput';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextIncreaseOutlinedIcon from '@mui/icons-material/TextIncreaseOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const ProjectObfuscation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {obfuscateList, newProject} = useSelector(selectWorkspaceState);
  const dialogCtrl = useContext(DialogContext) as IDialogContext;

  const inputRef = React.createRef<any>();


  const [value, setValue] = React.useState<string[]>(obfuscateList || []);
  const [group, setGroup] = React.useState< {[key: string]: string[]}>({});
  const [results, setResults] = React.useState<any[]>([]);
  const [obfuscatedData, setObfuscatedData] = React.useState<any>(null);
  const [bannedWord, setBannedWord] = React.useState<string>();

  const init = async () => { };

  const onNewTagHandler = (e) => {
    const tag = inputRef.current.value.trim();

    const banned = isBanned(tag);
    setBannedWord(banned ? tag : null);

    if ( (e.key && e.key !== 'Enter') || tag.length === 0 || banned) return;

    const tags = [...new Set([...value, tag])];
    setValue(tags);

    inputRef.current.value = '';
  };

  const onDeleteHandler = (tag: string) => {
    const tags = value.filter(item => item !== tag )
    setValue(tags);
  }

  const preview = async () => {
    const previewData = await obfuscateService.obfuscatePreview(value);
    setObfuscatedData(previewData);
    setResults(Array.from(previewData.files, ([key, value]) => ({ key, value })));
    dispatch(setObfuscateList(value));
  }

  const submit = async (e) => {
    navigate('/workspace/new/summary');
  };



  useEffect(() => {
      preview();
      setGroup(groupByFirstLetter(value));
  }, [value]);

  useEffect(() => {
    init();
  }, []);

  return (
    <>

        <section id="ProjectObfuscation" className="app-page app-pipeline">
          <header className="app-header">
            <FlowHeader
              title={t('Title:ProjectObfuscation')}
              subtitle={t('Title:ProjectObfuscationSubtitle')}
            />
          </header>
          <main className="app-content">
              <div className='content'>
                <FormControl
                  className="input-area"
                >
                  <TextInput
                    error={!!bannedWord}
                    placeholder={t('Title:BannedInputPlaceholder')}
                    helperText={bannedWord ? t('NoBannedWord', { word: bannedWord }) : ' '}
                    name="word"
                    onKeyUp={onNewTagHandler}
                    inputRef={inputRef}
                    InputProps={{
                      autoFocus: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <TextIncreaseOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex={-1}
                            onClick={onNewTagHandler}
                            edge="end"
                            size="small"
                          >
                            <ArrowForwardIosOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    />
                </FormControl>

                <Panel title={t('Title:NBannedList', { count: value.length })}>
                  <div className="word-list">
                    {
                      Object.keys(group).map((key) => (
                        <>
                          <h6 className="mb-0 mt-1" key={key} >{ key }</h6>
                          {
                            group[key].map( (item) => <Chip
                            color="secondary"
                            size="small"
                            onDelete={(e) => onDeleteHandler(item)}
                            key={item}
                            label={`${item} (${obfuscatedData?.summary?.obfuscationSummary[item] || '0'})`} />)
                          }
                        </>
                      ))
                    }
                  </div>
                </Panel>

                <Panel title={  t('Title:ObfuscationPreview', { count: obfuscatedData?.summary.totalFilesObfuscated, total: obfuscatedData?.summary.totalFiles })}>
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
                        <Column label={t('Table:Header:Original')} dataKey="key"  width={width / 2} flexGrow={0} flexShrink={0} />
                        <Column label={t('Table:Header:Obfuscated')} dataKey="value" width={width / 2} flexGrow={0} flexShrink={0} />
                      </Table>
                    )}
                  </AutoSizer>
                </Panel>
              </div>
          </main>
          <footer className='app-footer'>
            <div className="button-container">
              <Button
                color="inherit"
                variant="contained"
                type="button"
                onClick={() => navigate(-2)}
              >
                <ArrowBackIcon className="color-primary mr-1" fontSize="small" />
              </Button>
            </div>
            <FlowStepper step={1} />
            <div className="button-container end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={submit}
              >
                {t('Button:Next')}
              </Button>
            </div>
          </footer>
        </section>
    </>
  );
};

export default ProjectObfuscation;
