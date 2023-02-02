import path from "path";
import i18next from "i18next";
import { Scanner } from "../scanner/types";
import { Project } from "../../workspace/Project";
import { ScannerStage } from "../../../api/types";
import { WFPObfuscationTask } from "./WFPObfuscationTask/WFPObfuscationTask";
import { AppDefaultValues } from "../../../config/AppDefaultValues";

export class ObfuscationTask implements Scanner.IPipelineTask {
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  getStageProperties(): Scanner.StageProperties {
    return {
      name: ScannerStage.OBFUSCATE,
      label: i18next.t('Title:Obfuscating'),
      isCritical: true,
    };
  }

  public async run(params: void): Promise<boolean> {
    const wfpPath = path.join(this.project.getMyPath(),AppDefaultValues.PROJECT.OUTPUT,AppDefaultValues.PROJECT.WINNOWING_WFP);
    await new WFPObfuscationTask(this.project.getMyPath(),wfpPath,this.project.getBannedList());
    return true;
  }

}
