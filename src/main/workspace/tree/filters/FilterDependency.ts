import { Filter } from "./Filter";
import File  from '../File'
export class FilterDependency extends Filter {

public evaluate(file: File): boolean {
  return file.isDependency();
}
}
