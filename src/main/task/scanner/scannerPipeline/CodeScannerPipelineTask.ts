import { CodeScanTask } from '../scan/CodeScanTask';
import { BaseScannerTask } from '../BaseScannerTask';
import { Project } from '../../../workspace/Project';
import { Scanner } from '../types';
import { ResumeScanTask } from '../resume/ResumeScanTask';
import { DecompressTask } from '../../decompress/DecompressTask';
import ScannerType = Scanner.ScannerType;
import {ScannerPipeline} from "./ScannerPipeline";
import {CodeIndexTreeTask} from "../../IndexTreeTask/CodeIndexTreeTask";
import {IScannerInputAdapter} from "../adapter/IScannerInputAdapter";
import {IDispatch} from "../dispatcher/IDispatch";

export class CodeScannerPipelineTask extends ScannerPipeline{
  public async run(project: Project): Promise<boolean> {
    const { metadata } = project;

    // decompress
    if (metadata.getScannerConfig().type.includes(ScannerType.UNZIP))
      this.queue.push(new DecompressTask(project));

    // index
    if (
      metadata.getScannerConfig().mode === Scanner.ScannerMode.SCAN ||
      metadata.getScannerConfig().mode === Scanner.ScannerMode.RESCAN
    )
      this.queue.push(new CodeIndexTreeTask(project));

    // scan
    const scanTask: BaseScannerTask<IDispatch,IScannerInputAdapter> =
      metadata.getScannerConfig().mode === Scanner.ScannerMode.SCAN
        ? new CodeScanTask(project)
        : new ResumeScanTask(project)

    if (metadata.getScannerConfig().type.includes(ScannerType.CODE)) {
      this.queue.push(scanTask);
    }

    for await (const [index, task] of this.queue.entries()) {
      await this.executeTask(task, index);
    }

    await this.done(project);

    return true;
  }
}
