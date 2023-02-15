import fs from "fs";
import { LocalDependencies } from "scanoss";
import { IndexTreeTask } from "./IndexTreeTask";
import Folder from "../../workspace/tree/Folder";
import { Tree } from "../../workspace/tree/Tree";
import { FilterOR } from "../../workspace/tree/filters/FilterOR";
import { FilterWFP } from "../../workspace/tree/filters/FilterWFP";
import { FilterDependency } from "../../workspace/tree/filters/FilterDependency";
import { ScanState } from "../../../api/types";

export class CodeIndexTreeTask  extends IndexTreeTask {

  public async run(params: void):Promise<boolean> {
    const files = this.getProjectFiles(this.project.getScanRoot(),this.project.getScanRoot());
    await this.buildTree(files);
    this.setTreeSummary(this.project.getTree());
    await this.setDependenciesOnFileTree();
    this.createFileMap();
    this.project.metadata.setScannerState(ScanState.INDEXED);
    this.project.save();
    return true;
  }

  private async setDependenciesOnFileTree() {
    const f = this.project.getTree().getRootFolder().getFiles();
    const files = f.map((f)=> f.path);
    const localDependencies = new LocalDependencies();
    const dependenciesFiles = localDependencies.filterFiles(files);
    this.project.tree.addDependencies(dependenciesFiles);
}


  private createFileMap() {
    const files = this.project.getTree().getRootFolder().getFilesByFilter(new FilterOR(new FilterWFP(), new FilterDependency()));
    const fileMapper = new Map<string,string | null>();
    files.forEach((f) =>  fileMapper.set(f,null));
    this.project.getTree().setFilesToObfuscate(fileMapper);
  }

  private getProjectFiles(dir : string, rootPath: string): Array<string> {
    let results: Array<string> = [];
    const dirEntries = fs
      .readdirSync(dir, { withFileTypes: true }) // Returns a list of files and folders
      .sort(this.dirFirstFileAfter)
      .filter((dirent: any) => !dirent.isSymbolicLink());

    for (const dirEntry of dirEntries) {
      const relativePath = `${dir}/${dirEntry.name}`.replace(rootPath, '');
      if (dirEntry.isDirectory()) {
        const f: Folder = new Folder(relativePath, dirEntry.name);
        const subTree = this.getProjectFiles(
          `${dir}/${dirEntry.name}`,
          rootPath
        );

        results = results.concat(subTree);
      } else results.push(relativePath);
    }
    return results;
  }

  // This is a sorter that will sort folders before files in alphabetical order.
  private dirFirstFileAfter(a: any, b: any): number {
    if (!a.isDirectory() && b.isDirectory()) return 1;
    if (a.isDirectory() && !b.isDirectory()) return -1;
    return 0;
  }

  public async buildTree(files: Array<string>): Promise<Tree> {
    this.project.getTree().setRootName(this.project.metadata.getName());
    this.project.getTree().setProjectPath(this.project.getMyPath());
    this.project.getTree().setScanRoot(this.project.metadata.getScanRoot());
    this.project.getTree().build(files);
    this.project.getTree().setFilter();
    return this.project.getTree();
  }

  public setTreeSummary(tree: Tree):void {
    tree.summarize();
    const summary = tree.getSummarize();
    this.project.filesSummary = summary;
    this.project.filesNotScanned = {};
    this.project.processedFiles = 0;
    this.project.metadata.setTotalFiles(summary.include);
  }

}
