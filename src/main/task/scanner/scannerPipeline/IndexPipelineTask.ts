import { BasePipeline } from "./BasePipeline";
import { Project } from "../../../workspace/Project";
import { CodeIndexTreeTask } from "../../IndexTreeTask/CodeIndexTreeTask";

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
