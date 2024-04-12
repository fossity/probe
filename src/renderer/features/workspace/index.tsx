import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProjectScan from './pages/ProjectScan/ProjectScan';
import ProjectSettings from './pages/ProjectSettings/ProjectSettings';
import Workspace from './pages/Workspace/Workspace';
import ProjectObfuscation from './pages/ProjectObfuscation/ProjectObfuscation';
import ProjectSummary from './pages/ProjectSummary/ProjectSummary';
import ProjectResult from './pages/ProjectResult/ProjectResult';
import ProjectDetail from './pages/ProjecDetail/ProjectDetail';

const WorkspaceModule = () => (
  <Routes>
    <Route index element={<Workspace />} />
    <Route path="new/settings" element={<ProjectSettings />} />
    <Route path="new/scan" element={<ProjectScan />} />
    <Route path="new/obfuscation" element={<ProjectObfuscation />} />
    <Route path="new/summary" element={<ProjectSummary />} />
    <Route path="new/result" element={<ProjectResult />} />
    <Route path="detail" element={<ProjectDetail />} />
  </Routes>
);

export default WorkspaceModule;
