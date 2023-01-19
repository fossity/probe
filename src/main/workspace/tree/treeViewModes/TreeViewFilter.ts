import { QueryBuilderCreator } from '../../../model/queryBuilder/QueryBuilderCreator';
import Node from '../Node';
import { TreeViewMode } from './TreeViewMode';

export abstract class TreeViewFilter extends TreeViewMode {
  private filter: any;

  constructor(filter: any) {
    super();
    this.filter = filter;
  }

  public async getFiles(): Promise<Record<string, number>> {
    return null;
  }

  public abstract getTree(node: Node): Promise<Node>;
}
