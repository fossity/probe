import { Project } from '../../../workspace/Project';
import { Scanner } from '../types';
import { ScannerPipeline } from './ScannerPipeline';
import { CodeIndexTreeTask } from '../../IndexTreeTask/CodeIndexTreeTask';
import { ScanState } from '../../../../api/types';

export class CodeScannerPipelineTask extends ScannerPipeline{
  public async run(project: Project): Promise<boolean> {
    const { metadata } = project;

    // decompress
/*    if (metadata.getScannerConfig().type.includes(ScannerType.UNZIP))
      this.queue.push(new DecompressTask(project));

    // index
    if (
      metadata.getScannerConfig().mode === Scanner.ScannerMode.SCAN ||
      metadata.getScannerConfig().mode === Scanner.ScannerMode.RESCAN
    )*/
      this.queue.push(new CodeIndexTreeTask(project));
      project.metadata.setScannerState(ScanState.FINISHED);
      await project.save();

   /* // scan
    const scanTask: BaseScannerTask<IDispatch,IScannerInputAdapter> =
      metadata.getScannerConfig().mode === Scanner.ScannerMode.SCAN
        ? new CodeScanTask(project)
        : new ResumeScanTask(project)

    if (metadata.getScannerConfig().type.includes(ScannerType.CODE)) {
      this.queue.push(scanTask);
    }*/

    for await (const [index, task] of this.queue.entries()) {
      await this.executeTask(task, index);
    }

    await this.done(project);

    return true;
  }
}
