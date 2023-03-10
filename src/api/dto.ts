import { Dependency, ExportFormat, ExportSource, IProjectInfoMetadata } from '@api/types';


export interface NewDependencyDTO {
  dependencyId?: number;
  purl: string;
  license: string;
  version: string;
}

export interface RejectAllDependeciesDTO {
  dependencyIds?: number[];
  path?: string;
}

export interface RestoreAllDependenciesDTO {
  dependencyIds?: number[];
  path?: string;
}

export interface AcceptAllDependeciesDTO {
  dependencies?: Array<Dependency>;
  path?: string;
}

export interface GetFileDTO {
  path?: string;
  id?: number;
}

export interface FileDTO {
  fileId: number;
  path: string;
  type: string;
  status: string;
}

export interface LicenseDTO {
  id: number;
  name: string;
  spdxid: string;
  url: string;
  official: number;
}

export interface NewLicenseDTO {
  id?: number;
  name: string;
  fulltext: string;
  url?: string;
  spdxid?: string;
}

export interface IAppInfo {
  version: string;
  name: string;
  appPath: string;
  work_root: string;
  platform: string;
  arch: string;
}

export interface NewExportDTO {
  format: ExportFormat;
  source: ExportSource;
  path: string;
}

export enum SourceType {
  detected = 'detected',
  identified = 'identified',
}

export interface NewProjectDTO {
  uuid?: string;
  name: string;
  scan_root: string;
  projectInfo: IProjectInfoMetadata;
}

export interface ObfuscationDTO {
  path: string;
  dictionary: Record<string,string>;
}

export interface ProjectPackageDTO { // PROJECT_CREATE_FOSSITY_PACKAGE
  projectPath: string;
  targetPath: string;
}

export interface PreviewDTO {
  files: Map<string, string|null>,
  summary: ObfuscationSummary,
}

export interface ObfuscationSummary{
  totalFiles: number,
  totalFilesObfuscated: number,
  obfuscationSummary: Record<string, number>
}

