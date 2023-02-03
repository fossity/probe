export interface IAdapter {
  adapt(path:string):string;
  done(projectPath?:string);

  hasWords():boolean;


}
