import { BasePipeline } from "./BasePipeline";
import { Project } from "../../../workspace/Project";
import { CodeIndexTreeTask } from "../../indexTreeTask/CodeIndexTreeTask";
import {ProjectState} from "@api/types";
import {broadcastManager} from "../../../broadcastManager/BroadcastManager";
import {IpcChannels} from "@api/ipc-channels";

export class IndexPipelineTask extends BasePipeline {
  public async run(project: Project): Promise<boolean> {
    this.queue.push(new CodeIndexTreeTask(project));

    for await (const [index, task] of this.queue.entries()) {
      await this.executeTask(task, index);
    }

    await this.done(project);
    return true;
  }


}
