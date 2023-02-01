import { Filter } from "./Filter";
import File  from '../File'

export class FilterWFP extends Filter {

  public evaluate(file :File): boolean{
    return file.getAction() === 'scan';
  }

}
