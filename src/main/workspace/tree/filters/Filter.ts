import File  from '../File'
export abstract class Filter {
  public abstract evaluate (file : File): boolean;

}
