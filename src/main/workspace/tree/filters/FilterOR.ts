import {Filter} from "./Filter";
import File  from '../File'

export class FilterOR extends Filter {

  private filterA;

  private filterB;

  constructor(filterA: Filter , filterB: Filter) {
    super();
    this.filterA =  filterA;
    this.filterB =  filterB;
  }

  public evaluate(file: File): boolean {
    return this.filterA.evaluate(file) || this.filterB.evaluate(file);
  }

}
