import { Scanner } from "../types";
import { ScannerPipeline } from "../scannerPipeline/ScannerPipeline";
import { CodeScannerPipelineTask } from "../scannerPipeline/CodeScannerPipelineTask";

export class ScannerPipelineFactory {

  public static getScannerPipeline(source: Scanner.ScannerSource):ScannerPipeline {
    switch (source) {
      case Scanner.ScannerSource.CODE:
        return new CodeScannerPipelineTask();
        break;
      default:
        return null;
        break;
    }
  }

}
