import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionConstants, CommandConstants, TreeviewTitleConstants } from '../constants/extension-constants';

export class ComponentsProvider implements vscode.TreeDataProvider<ComponentItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<ComponentItem | undefined> = new vscode.EventEmitter<ComponentItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<ComponentItem | undefined> = this._onDidChangeTreeData.event;

  constructor (private listOfComponents: any, private context: any) {
  }

  refresh (): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem (element: ComponentItem): vscode.TreeItem {
    return element;
  }

  getChildren (element?: ComponentItem): Thenable<ComponentItem[]> {
    if (element == null) {
      return Promise.resolve(this.getComponents(this.listOfComponents));
    } else {
      return Promise.resolve([]);
    }
  }

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
  private getComponents (listOfComponents: any): ComponentItem[] {
    let componentItems = [];
    let rootPath: any = this.context.extensionPath;
    if (listOfComponents && listOfComponents.length > 0) {
      let item;
      for (let component = 0;component < listOfComponents.length; component++) {
        let componentObject = listOfComponents[component];
        let icon = rootPath;
        if (componentObject.status === ExtensionConstants.marked) {
          icon = path.join(rootPath, ExtensionConstants.resourcesFolder,ExtensionConstants.greenIcon);
          item = new ComponentItem(componentObject.componentName, componentObject.filePath, icon, TreeviewTitleConstants.markedComponent,
                     vscode.TreeItemCollapsibleState.None);
          item.command = {
            command: CommandConstants.trackComponentCommand,
            title: '',
            arguments: [item]
          };
        } else {
          icon = path.join(rootPath, ExtensionConstants.resourcesFolder,ExtensionConstants.redIcon);
          item = new ComponentItem(componentObject.componentName, componentObject.filePath, icon, TreeviewTitleConstants.unmarkedComponent,
                     vscode.TreeItemCollapsibleState.None);
          item.command = {
            command: CommandConstants.trackComponentCommand,
            title: '',
            arguments: [item]
          };
        }
        componentItems.push(item);
      }

      return componentItems;
    } else {
      let message = new ComponentItem(ExtensionConstants.componentsNotFound, ExtensionConstants.notFoundId, '', ExtensionConstants.githubRepo,
				vscode.TreeItemCollapsibleState.None);
      message.command = {
        command: CommandConstants.trackComponentCommand,
        title: '',
        arguments: [message]
      };
      componentItems.push(message);
      return componentItems;
    }

    return [];
  }

}

export class ComponentItem extends vscode.TreeItem {

  constructor (
		public readonly label: string,
        private path: string,
        private icon: string,
        private title: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
    super(label, collapsibleState);
  }

  get tooltip (): string {
    return `${this.title}`;
  }

  get description (): string {
    return '';
  }

  get pathName (): string {
    return this.path;
  }

  iconPath = this.icon;

  contextValue = 'components';

}
