import {
  Fingerprint,
  ScannerEvents,
} from 'scanoss';
import log from 'electron-log';
import fs from "fs";
import path from 'path';
import { ScanState } from '../../../api/types';
import { Project } from '../../workspace/Project';
import { IpcChannels } from '../../../api/ipc-channels';
import { broadcastManager } from '../../broadcastManager/BroadcastManager';
import { Scanner as ScannerModule } from './types';
import {IDispatch} from "./dispatcher/IDispatch";
import {IScannerInputAdapter} from "./adapter/IScannerInputAdapter";
import {utilModel} from "../../model/UtilModel";

export abstract class BaseScannerTask<TDispatcher extends IDispatch ,TInputScannerAdapter extends IScannerInputAdapter> implements ScannerModule.IPipelineTask {
  protected fingerprint: Fingerprint;

  protected scannerState: ScanState;

  protected project: Project;

  protected dispatcher : TDispatcher;

  protected inputAdapter: TInputScannerAdapter;

  public abstract getStageProperties(): ScannerModule.StageProperties;

   constructor(project: Project ,dispatch: TDispatcher,inputAdapter: TInputScannerAdapter) {
    this.project = project;
    this.dispatcher =  dispatch;
    this.inputAdapter = inputAdapter;
  }

  protected sendToUI(eventName, data: any) {
    broadcastManager.get().send(eventName, data);
  }

 public abstract set(): Promise<void>;

  public  init() {
    this.fingerprint = new Fingerprint();
    this.setFingerprintConfig();
    let {processedFiles} = this.project;

    this.fingerprint.on(ScannerEvents.WINNOWING_NEW_CONTENT, async (response) => {

      processedFiles += response.getNumberFilesFingerprinted();

      this.sendToUI(IpcChannels.SCANNER_UPDATE_STATUS, {
        processed:
          (100 * processedFiles) /
          this.project.filesSummary.include,
      });
    });

    this.fingerprint.on(
      ScannerEvents.WINNOWING_FINISHED,
      async (resultPath, filesNotScanned) => {
        this.project.metadata.setScannerState(ScanState.FINISHED);
        await  this.project.save();
        log.info(`%cScannerEvents.SCAN_DONE`, 'color: green');
      }
    );

    this.fingerprint.on('error', async (error) => {
      this.project.save();
      await this.project.close();
      this.sendToUI(IpcChannels.SCANNER_ERROR_STATUS, error);
    });
  }

  public async done() {
    this.project.metadata.setScannerState(ScanState.FINISHED);
    this.project.metadata.save();
  }

  protected setFingerprintConfig() {
    const winnowingPath = path.join(this.project.getMyPath(),'encrypted','winnowing.wfp');
    this.fingerprint.setFingerprintPath(winnowingPath);
  }

  public async run(): Promise<boolean> {
    log.info('[ BaseScannerTask init scanner]');
    await this.set();
    await this.init();
    await this.scan();
    await this.done();
    this.project.save();
    return true;
  }

  private async scan() {
    const scanIn = this.inputAdapter.adapterToScannerInput(this.project, this.project.filesToScan);
    await this.fingerprint.start(scanIn);
  }


}
