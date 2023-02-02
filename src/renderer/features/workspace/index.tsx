import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProjectScan from './pages/ProjectScan/ProjectScan';
import ProjectSettings from './pages/ProjectSettings/ProjectSettings';
import Workspace from './pages/Workspace/Workspace';
import ProjectObfuscation from './pages/ProjectObfuscation/ProjectObfuscation';
import ProjectSummary from './pages/ProjectSummary/ProjectSummary';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';

const WorkspaceModule = () => {
  return (
    <Routes>
      <Route index element={<Workspace />} />
      <Route path="new/settings" element={<ProjectSettings />} />
      <Route path="new/scan" element={<ProjectScan />} />
      <Route path="new/obfuscation" element={<ProjectObfuscation />} />
      <Route path="new/summary" element={<ProjectSummary />} />
      <Route path="details" element={<ProjectDetails />} />
    </Routes>
  );
};

export default WorkspaceModule;
