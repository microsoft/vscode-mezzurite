import { join } from 'path';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';

class ConditionTreeItem extends TreeItem {
  constructor (
    public isMet: boolean,
    public label: string,
    public rootPath: string
  ) {
    super(label, TreeItemCollapsibleState.None);
  }

  get description (): string {
    return this.isMet ? '' : 'Not met';
  }

  get tooltip (): string {
    return this.label;
  }

  get iconPath (): string {
    const iconType = this.isMet ? 'tracked' : 'notTracked';
    return join(this.rootPath, 'client', 'res', 'icons', `${iconType}.svg`);
  }
}

export default ConditionTreeItem;
