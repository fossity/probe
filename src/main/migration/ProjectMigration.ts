import { Migration } from './Migration';


export class ProjectMigration extends Migration {
  private scripts: Record<string, Array<(data: string) => void>>;

  private projPath: string;

  constructor(appVersion: string, projPath: string) {
    super(appVersion);
    this.projPath = projPath;
    this.scripts = {
      '0.1.0': [], // Min version supported
    };
  }

  public getScripts(): Record<string, Array<(data: string) => any>> {
    return this.scripts;
  }

  public getPath() {
    return this.projPath;
  }
}
