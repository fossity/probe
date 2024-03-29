/* eslint-disable max-classes-per-file */
import fs from 'fs';
import log from 'electron-log';
import {Fingerprint, IDependencyResponse } from 'scanoss';
import path from 'path';
import {
  FileTreeViewMode, IMetadata,
  IProjectCfg,
  IWorkbenchFilter,
  IWorkbenchFilterParams,
  ProjectState
} from '../../api/types';
import { Metadata } from "./Metadata";
import { ProjectMigration } from '../migration/ProjectMigration';
import { Tree } from './tree/Tree';
import { TreeViewModeCreator } from './tree/treeViewModes/TreeViewModeCreator';
import { IpcChannels } from '../../api/ipc-channels';
import {AppDefaultValues} from "../../config/AppDefaultValues";

export class Project {
  work_root: string;

  scan_root: string;

  project_name: string;

  logical_tree: Tree;

  tree: Tree;

  results: any;

  scanner!: Fingerprint;

  filesSummary: any;

  processedFiles = 0;

  filesToScan: any;

  filesNotScanned: any;

  metadata: Metadata;

  state: ProjectState;

  config: IProjectCfg;

  filter: IWorkbenchFilter;

  fileTreeViewMode: FileTreeViewMode;

  bannedList : Array<string>;

  constructor() {
    this.state = ProjectState.CLOSED;
    this.filter = null;
    this.fileTreeViewMode = FileTreeViewMode.DEFAULT;
    this.tree = new Tree(null,null,null);
    this.filesToScan = {};
    this.bannedList = [];
  }

  public static async readFromPath(pathToProject: string): Promise<Project> {
    const mt: Metadata = await Metadata.readFromPath(pathToProject);
    const p: Project = new Project();
    p.setState(ProjectState.CLOSED);
    p.setMetadata(mt);
    return p;
  }

  public async upgrade() {
    if (this.metadata.getVersion() === '11.4.9') {
      this.metadata.setAppVersion('0.8.0');
      this.metadata.save();
    }
    const pMigration = new ProjectMigration(
      this.metadata.getVersion(),
      this.metadata.getMyPath()
    );
    const newVersion: string = await pMigration.up();
    this.metadata = await Metadata.readFromPath(this.metadata.getMyPath());
    this.metadata.setAppVersion(newVersion);
    this.metadata.save();
  }

  public async open(): Promise<boolean> {
    this.state = ProjectState.OPENED;
    log.transports.file.resolvePath = () => path.join(this.metadata.getMyPath(),AppDefaultValues.PROJECT.PROJECT_LOG);
    const project = await fs.promises.readFile( path.join(this.metadata.getMyPath(),AppDefaultValues.PROJECT.TREE),
      'utf8'
    );
    const a = JSON.parse(project);
    this.filesNotScanned = a.filesNotScanned;
    this.processedFiles = a.processedFiles;
    this.filesSummary = a.filesSummary;
    this.metadata = await Metadata.readFromPath(this.metadata.getMyPath());
    this.tree = new Tree(a.tree.rootFolder.label, this.metadata.getMyPath(),a.tree.rootFolder.label);
    this.tree.loadTree(a.tree.rootFolder);
    this.tree.setSummary(a.filesSummary);
    this.tree.setFilesToObfuscate(new Map(Object.entries(a.tree.filesToObfuscate)));
    return true;
  }

  public async close() {
    if (this.scanner) this.scanner.abort();
    log.info(
      `%c[ PROJECT ]: Closing project ${this.metadata.getName()}`,
      'color: green'
    );
    this.state = ProjectState.CLOSED;
    this.scanner = null;
    this.logical_tree = null;
    this.tree = null;
    this.filesToScan = null;
    this.filter = null;
  }

  public save(): void {
    this.metadata.save();
    const self = this;
    const a: any = {
      bannedList: self.bannedList,
      filesNotScanned: self.filesNotScanned,
      processedFiles: self.processedFiles,
      filesSummary: self.filesSummary,
      tree: {...self.tree},
    };
    a.tree.filesToObfuscate = Object.fromEntries(this.tree.getFilesToObfuscate()); // Can't save map
    fs.writeFileSync(path.join(this.metadata.getMyPath(), AppDefaultValues.PROJECT.TREE),
      JSON.stringify(a)
    );
    log.info(
      `%c[ PROJECT ]: Project ${this.metadata.getName()} saved`,
      'color:green'
    );
  }

  public setState(state: ProjectState) {
    this.state = state;
  }

  public getState() {
    return this.state;
  }

  public setMetadata(mt: Metadata) {
    this.metadata = mt;
  }

  public setMyPath(myPath: string) {
    this.metadata.setMyPath(myPath);
    this.metadata.save();
  }

  private async createEncryptedFolder() {
    await fs.promises.mkdir(path.join(this.getMyPath(), AppDefaultValues.PROJECT.OUTPUT));
  }

  public async createProjectFolder(){
    await fs.promises.mkdir(this.getMyPath());
    await this.createEncryptedFolder();
  }


  public getFilesNotScanned() {
    return this.filesNotScanned;
  }

  public getMyPath() {
    return this.metadata.getMyPath();
  }

  public getProjectName() {
    return this.metadata.getName();
  }

  public getUUID(): string {
    return this.metadata.getUUID();
  }

  public getDto(): IMetadata {
    return this.metadata.getDto();
  }

  public getScanRoot(): string {
    return this.metadata.getScanRoot();
  }

  public getTree(): Tree {
    return this.tree;
  }

  public updateTree() {
    this.save();
    this.notifyTree();
  }

  public async notifyTree() {
    const tree = await this.tree.getTree();
    this.tree.sendToUI(IpcChannels.TREE_UPDATED, tree);
  }

  public getNode(path: string) {
    return this.tree.getNode(path);
  }



  public async getDependencies(): Promise<IDependencyResponse> {
    try {
      return JSON.parse(
        await fs.promises.readFile(path.join(this.metadata.getMyPath(), AppDefaultValues.PROJECT.DEPENDENCIES),
          'utf8'
        )
      );
    } catch (e) {
      log.error(e);
      return null;
    }
  }

  public async setGlobalFilter(filter: IWorkbenchFilter) {
    try {
      if (
        !(
          JSON.stringify({ ...filter, path: null }) ===
          JSON.stringify({ ...this.filter, path: null })
        )
      ) {
        this.tree.sendToUI(IpcChannels.TREE_UPDATING, {});
        this.tree.setTreeViewMode(
          TreeViewModeCreator.create(filter, this.fileTreeViewMode)
        );
        this.notifyTree();
      }
      this.filter = filter;
      return true;
    } catch (e) {
      log.error(e);
      return e;
    }
  }

  public getGlobalFilter(): IWorkbenchFilter {
    return this.filter;
  }

  public getFilter(params: IWorkbenchFilterParams): IWorkbenchFilter {
    if (params?.unique) return params.filter;
    return { ...this.filter, ...params?.filter };
  }

  public setFileTreeViewMode(mode: FileTreeViewMode) {
    if (JSON.stringify(this.fileTreeViewMode) === JSON.stringify(mode)) return;
    this.tree.setTreeViewMode(TreeViewModeCreator.create(this.filter, mode));
    this.fileTreeViewMode = mode;
    this.notifyTree();
  }

  public setTree(tree: Tree) {
    this.tree = tree;
  }

  public setObfuscatedList(bannedList: Array<string>) {
    this.metadata.setObfuscatedList(bannedList);
  }

  public getBannedList() {
    return this.metadata.getObfuscatedList();
  }
}
