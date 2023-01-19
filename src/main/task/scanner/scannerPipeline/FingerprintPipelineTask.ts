import { Project } from '../../../workspace/Project';
import { ScannerPipeline } from './ScannerPipeline';
import { CodeIndexTreeTask } from '../../IndexTreeTask/CodeIndexTreeTask';
import { FingerprintTask } from '../scan/FingerprintTask';

export class FingerprintPipelineTask extends ScannerPipeline{
  public async run(project: Project): Promise<boolean> {
    const { metadata } = project;
      this.queue.push(new CodeIndexTreeTask(project));
      this.queue.push(new FingerprintTask(project));

    for await (const [index, task] of this.queue.entries()) {
      await this.executeTask(task, index);
    }

    await this.done(project);

    return true;
  }
}
