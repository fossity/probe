import { LicenseModel } from './LicenseModel';

export class ScanModel {
  license: LicenseModel;
  lastID: any;

  constructor(path: string) {
    this.license = new LicenseModel(path);

  }
}
