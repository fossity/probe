import { Project } from '../../../workspace/Project';
import { BasePipeline } from './BasePipeline';
import { FingerprintTask } from '../scan/FingerprintTask';
import { DependencyTask } from '../dependency/DependencyTask';
import { HintTask } from '../../hintTask/HintTask';
import { ObfuscationTask } from "../../obfuscationTask/ObfuscationTask";

export class FingerprintPipelineTask extends BasePipeline {
  public async run(project: Project): Promise<boolean> {
      this.queue.push(new FingerprintTask(project));
      this.queue.push(new DependencyTask(project));
      this.queue.push(new HintTask(project));
      this.queue.push(new ObfuscationTask(project));

    for await (const [index, task] of this.queue.entries()) {
      await this.executeTask(task, index);
    }

    await this.done(project);

    return true;
  }
}
