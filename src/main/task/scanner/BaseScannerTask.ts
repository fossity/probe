import {
  Scanner,
  ScannerEvents,
} from 'scanoss';
import log from 'electron-log';
import fs from "fs";
import { ScanState } from '../../../api/types';
import { Project } from '../../workspace/Project';
import { IpcChannels } from '../../../api/ipc-channels';
import { broadcastManager } from '../../broadcastManager/BroadcastManager';
import { Scanner as ScannerModule } from './types';
import {IDispatch} from "./dispatcher/IDispatch";
import {IScannerInputAdapter} from "./adapter/IScannerInputAdapter";
import {utilModel} from "../../model/UtilModel";

export abstract class BaseScannerTask<TDispatcher extends IDispatch ,TInputScannerAdapter extends IScannerInputAdapter> implements ScannerModule.IPipelineTask {
  protected scanner: Scanner;

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
    this.setScannerConfig();
    this.cleanWorkDirectory();
    let {processedFiles} = this.project;

    this.scanner.on(ScannerEvents.DISPATCHER_NEW_DATA, async (response) => { // NEW CONTENT

      processedFiles += response.getNumberOfFilesScanned();

      this.sendToUI(IpcChannels.SCANNER_UPDATE_STATUS, {
        processed:
          (100 * processedFiles) /
          this.project.filesSummary.include,
      });

    });

    this.scanner.on(
      ScannerEvents.RESULTS_APPENDED,
      (response, filesNotScanned) => {

        this.project.processedFiles += response.getNumberOfFilesScanned();

        for (const file of response.getFilesScanned())
          this.dispatcher.dispatch(this.project,file);

        this.project.tree.attachResults(response.getServerResponse());
        response.getFilesScanned()
        Object.assign(
          this.project.filesNotScanned,
          this.project.filesNotScanned
        );
        this.project.save();
      }
    );

    this.scanner.on(
      ScannerEvents.SCAN_DONE,  // WINNOWING_FINISH
      async (resultPath, filesNotScanned) => {
        log.info(`%cScannerEvents.SCAN_DONE`, 'color: green');
      }
    );

    this.scanner.on(ScannerEvents.SCANNER_LOG, (message, level) => {
      log.info(`%c${message}`, 'color: green');
    });

    this.scanner.on('error', async (error) => {
      this.project.save();
      await this.project.close();
      this.sendToUI(IpcChannels.SCANNER_ERROR_STATUS, error);
    });
  }

  public async done() {
    const resultPath = `${this.project.getMyPath()}/result.json`;
    const result: Record<any, any> = await utilModel.readFile(resultPath);
    for (const [key, value] of Object.entries(result)) {
      if(!key.startsWith("/")) {
        result[`/${key}`] = value;
        delete result[key];
      }
    }
    await fs.promises.writeFile(resultPath, JSON.stringify(result,null,2));

    this.project.metadata.setScannerState(ScanState.FINISHED);
    this.project.metadata.save();
    this.project.getTree().updateFlags();
  }

  protected setScannerConfig() {
    this.scanner.setWorkDirectory(this.project.getMyPath());
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
    await this.scanner.scan(scanIn);
  }


  public cleanWorkDirectory() {
    this.scanner.cleanWorkDirectory();
  }




}
