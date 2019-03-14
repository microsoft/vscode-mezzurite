import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';

import { generateIconPath, generateDescription, generateFulfilled } from '../utilities/treeItemUtilities';
import ConditionTreeItem from './ConditionTreeItem';
import MezzuriteComponent from './MezzuriteComponent';

class MezzuriteTreeItem extends TreeItem {
  public label: string;

  constructor (
    private component: MezzuriteComponent,
    private rootPath: string
  ) {
    super(component.filePath, TreeItemCollapsibleState.Collapsed);
    this.label = component.name;
  }

  get children (): TreeItem[] {
    return Object.keys(this.component.checks)
    .map((check) => {
      return new ConditionTreeItem(this.component.checks[check], check, this.rootPath);
    });
  }

  get description (): string {
    return generateDescription(this.fulfilled);
  }

  get fulfilled (): boolean {
    return generateFulfilled(this.component);
  }

  get tooltip (): string {
    return this.component.filePath;
  }

  get iconPath (): string {
    return generateIconPath(this.component.type, this.fulfilled, this.rootPath);
  }

  get resourceUri (): Uri {
    return Uri.parse(this.component.filePath);
  }

}

export default MezzuriteTreeItem;
