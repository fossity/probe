import { Migration } from './Migration';

export class WorkspaceMigration extends Migration {
  private scripts: Record<string, Array<(data: string) => void>>;

  private wsPath: string;

  constructor(appVersion: string,wsPath: string) {
    super(appVersion);
    this.wsPath = wsPath;
    this.scripts = {
      '0.1.0': [], // Oldest compatible version
    }
  }

  public getScripts(): Record<string, Array<(data: string) => any>>  {
    return this.scripts;
  }

  public getPath() {
    return this.wsPath;
  }
}
