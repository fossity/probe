/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProject, ScanState } from '@api/types';
import { Trans, useTranslation } from 'react-i18next';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';

const filter = (items, query) => {
  if (!items) return null;

  const result = items.filter((item) => {
    const name = item.name.toLowerCase();
    return name.includes(query.toLowerCase());
  });

  return result;
};

const format = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const useStyles = makeStyles((theme) => ({
  md: {
    maxWidth: 130,
    textAlign: 'center',
  },
}));

const isProjectFinished = (project: IProject): boolean => project.scannerState === ScanState.FINISHED;

interface ProjectListProps {
  projects: IProject[];
  searchQuery: string;
  onProjectClick: (project: IProject) => void;
  onProjectDelete: (project: IProject) => void;
  onProjectShowFiles: (project: IProject) => void;
  onProjectDownload: (project: IProject) => void;
  onProjectCreate: () => void;
}

const ProjectList = (props: ProjectListProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { projects, searchQuery } = props;
  const filterProjects = filter(projects, searchQuery);

  return (
    <>
      {projects && projects.length > 0 ? (
        <TableContainer component={Paper}>
          <Table className="projects-table" aria-label="projects table">
            <TableHead>
              <TableRow>
                <TableCell width="50%">{t('Table:Header:Name')}</TableCell>
                <TableCell>{t('Table:Header:Date')}</TableCell>
                <TableCell>{t('Table:Header:TotalFiles')}</TableCell>
                <TableCell width={30} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filterProjects.length !== 0 ? (
                filterProjects.map((project) => (
                  <TableRow
                    className={`
                      ${isProjectFinished(project) ? 'scanning-complete' : 'scanning-not-complete'}
                    `}
                    hover
                    key={project.name}
                    onClick={() => isProjectFinished(project) && props.onProjectClick(project)}
                  >
                    <TableCell component="th" scope="row">
                      <div className="project-name">
                        <span>{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(project.date)}</TableCell>
                    <TableCell>{project.files}</TableCell>
                    <TableCell className="row-actions">
                      <div className="btn-actions">
                        <>
                            <Tooltip title={t('Tooltip:ShowFiles')}>
                              <IconButton
                                aria-label="show-files"
                                className="btn-show"
                                disabled={!isProjectFinished(project)}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  props.onProjectShowFiles(project);
                                }}
                                size="large"
                              >
                                <PreviewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('Tooltip:CreateFossityPackage')}>
                              <IconButton
                                aria-label="download"
                                disabled={!isProjectFinished(project)}
                                className="btn-download"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  props.onProjectDownload(project);
                                }}
                                size="large"
                              >
                                <SystemUpdateAltOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('Tooltip:RemoveProject')}>
                            <IconButton
                              aria-label="delete"
                              className="btn-delete"
                              onClick={(event) => {
                                event.stopPropagation();
                                props.onProjectDelete(project);
                              }}
                              size="large"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          </>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <p className="text-center">
                      <Trans
                        i18nKey="Common:NoProjectsFoundWith"
                        components={{
                          strong: <strong/>,
                        }}
                        values={{ searchQuery }}
                      />
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : !projects ? (
        <p>{t('Common:LoadingProjects')}</p>
      ) : (
        <div className="empty-container">
          <div className="empty-list">
            <h3>{t('Common:NoProjectsFound')}</h3>
            <p>
              <Trans
                i18nKey="Common:StartNewProject"
                components={{
                  link1: <Link onClick={() => props.onProjectCreate()} underline="hover" />,
                }}
                />
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;
