import { Project } from '../../../workspace/Project';
import { BasePipeline } from './BasePipeline';
import { FingerprintTask } from '../scan/FingerprintTask';
import { DependencyTask } from '../dependency/DependencyTask';
import { HintTask } from '../../hintTask/HintTask';
import { ObfuscationTask } from "../../obfuscationTask/ObfuscationTask";
import {ProjectState} from "../../../../api/types";
import {broadcastManager} from "../../../broadcastManager/BroadcastManager";
import {IpcChannels} from "../../../../api/ipc-channels";
import {AttachFileTask} from "../../attachFileTask/AttachFileTask";

export class FingerprintPipelineTask extends BasePipeline {
  public async run(project: Project): Promise<boolean> {
      this.queue.push(new FingerprintTask(project));
      this.queue.push(new DependencyTask(project));
      this.queue.push(new HintTask(project));
      this.queue.push(new ObfuscationTask(project));
      this.queue.push(new AttachFileTask(project));

    for await (const [index, task] of this.queue.entries()) {
      await this.executeTask(task, index);
    }

    await this.done(project);

    return true;
  }

  // @Override
  protected async done(project: Project){
    project.setState(ProjectState.CLOSED);
    project.save();
    broadcastManager.get().send(IpcChannels.SCANNER_FINISH_SCAN, {
      success: true,
      resultsPath: project.metadata.getMyPath(),
    });
  }
}
