import i18next from "i18next";
import { ScannerStage, ScanState } from "../../../../api/types";
import { BaseScannerTask } from "../BaseScannerTask";
import { Scanner } from "../types";
import { IDispatch } from "../dispatcher/IDispatch";
import { IScannerInputAdapter } from "../adapter/IScannerInputAdapter";


export abstract class ScanTask<TDispatcher extends IDispatch, TInputScannerAdapter extends IScannerInputAdapter> extends BaseScannerTask <TDispatcher, TInputScannerAdapter>  {

  public getStageProperties(): Scanner.StageProperties {
    return {
      name: ScannerStage.SCAN,
      label: i18next.t('Title:Scanning'),
      isCritical: true,
    };
  }

  public async set(): Promise<void> {
    this.project.metadata.setScannerState(ScanState.SCANNING);
  }
}
