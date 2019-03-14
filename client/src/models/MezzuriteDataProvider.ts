import { TreeDataProvider, TreeItem, EventEmitter, Event } from 'vscode';

import MezzuriteComponent from './MezzuriteComponent';
import MezzuriteTreeItem from './MezzuriteTreeItem';

class MezzuriteDataProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<TreeItem> = new EventEmitter<TreeItem>();
  readonly onDidChangeTreeData: Event<TreeItem> = this._onDidChangeTreeData.event;

  constructor (
    private components: MezzuriteComponent[],
    private rootPath: string
  ) {}

  getChildren (element: MezzuriteTreeItem): Thenable<TreeItem[]> {
    if (element == null) {
      return new Promise((resolve) => {
        resolve(this.components
          .map((component: MezzuriteComponent) => new MezzuriteTreeItem(component, this.rootPath))
          .sort(this.mezzuriteTreeItemComparator)
        );
      });
    } else {
      return new Promise((resolve) => {
        resolve(element.children);
      });
    }
  }

  private mezzuriteTreeItemComparator (first: MezzuriteTreeItem, second: MezzuriteTreeItem): number {
    if (first.fulfilled === second.fulfilled) {
      if (first.iconPath === second.iconPath) {
        return first.label.localeCompare(second.label);
      } else {
        return first.iconPath.localeCompare(second.iconPath);
      }
    } else {
      return Number(second.fulfilled) - Number(first.fulfilled);
    }
  }

  getTreeItem (element: MezzuriteTreeItem): TreeItem {
    return element;
  }

  refresh (): void {
    this._onDidChangeTreeData.fire();
  }
}

export default MezzuriteDataProvider;
