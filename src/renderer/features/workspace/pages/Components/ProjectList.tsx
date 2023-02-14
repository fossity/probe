import React from 'react';
import {
  IconButton,
  Link,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProject, ScanState } from '@api/types';
import { Trans, useTranslation } from 'react-i18next';
import PreviewIcon from '@mui/icons-material/Preview';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import ProjectItem from '@components/ProjectItem';

import papers from '@assets/imgs/papers.png';
import AddProjectButton from './AddProjectButton/AddProjectButton';


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
  const { t } = useTranslation();

  const { projects, searchQuery } = props;
  const filterProjects = filter(projects, searchQuery);

  // loading
  if (!projects) {
    return <p>{t('Common:LoadingProjects')}</p>;
  }

  // no projects found
  if (projects && projects.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-list">
          <img src={papers} />
          <p className="mt-2 mb-4">{t('Common:NoProjectsFound')}</p>
          <AddProjectButton
            onNewProject={props.onProjectCreate}
          />
        </div>
      </div>
    );
  }

  // no projects found with filter
  if (projects && filterProjects.length === 0 ) {
    return (
      <div className="empty-container">
        <div className="empty-list">
          <Trans
            i18nKey="Common:NoProjectsFoundWith"
            components={{
              strong: <strong/>,
            }}
            values={{ searchQuery }}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="projects-list">
              { filterProjects.map((project) => (
                  <ProjectItem
                    project={project}
                    key={project.name}
                    onClick={() => props.onProjectClick(project)}
                  >
                      <div className="btn-actions">
                        { isProjectFinished(project) &&
                          <>
                            <Tooltip title={t('Tooltip:Review')}>
                              <IconButton
                                aria-label="show-files"
                                className="btn-show"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  props.onProjectShowFiles(project);
                                }}
                                size="large"
                              >
                                <PreviewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('Tooltip:Export')}>
                              <IconButton
                                aria-label="download"
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
                          </>
                        }
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
                    </div>
                  </ProjectItem>
              ))}
        </section>
  );
};

export default ProjectList;
