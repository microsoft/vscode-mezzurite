import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionConstants, CommandConstants, TreeviewTitleConstants } from '../constants/extension-constants';

export class ModulesProvider implements vscode.TreeDataProvider<ModuleItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<ModuleItem | undefined> = new vscode.EventEmitter<ModuleItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<ModuleItem | undefined> = this._onDidChangeTreeData.event;

  constructor (private listOfModules: any, private context: any) {
  }

  refresh (): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem (element: ModuleItem): vscode.TreeItem {
    return element;
  }

  getChildren (element?: ModuleItem): Thenable<ModuleItem[]> {
    if (element == null) {
      return Promise.resolve(this.getModules(this.listOfModules));
    } else {
      return Promise.resolve([]);
    }
  }

  private getTitleForUnmarkedModules (moduleObject: any) {
    let title = '';
    if (!moduleObject.importStmt) {
      title = title + TreeviewTitleConstants.missingMezzuImport;
    }
    if (!moduleObject.forRoot) {
      title = title + TreeviewTitleConstants.missingMezzuForRoot;
    }
    if (!moduleObject.routerStart) {
      title = title + TreeviewTitleConstants.missingMezzuStart;
    }
    return title;
  }

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 * @param list of modules to be displayed on UI
	 */
  private getModules (listOfModules: any): ModuleItem[] {
    let moduleItems = [];
    let rootPath: any = this.context.extensionPath;
    if (listOfModules && listOfModules.length > 0) {
      let item;
      for (let module = 0;module < listOfModules.length; module++) {
        let moduleObject = listOfModules[module];
        let icon = rootPath;
        if (moduleObject.importStmt && moduleObject.forRoot && moduleObject.routerStart) {
          icon = path.join(rootPath, ExtensionConstants.resourcesFolder,ExtensionConstants.greenIcon);
          item = new ModuleItem(moduleObject.moduleName, moduleObject.filePath, icon, TreeviewTitleConstants.markedModule,
                     vscode.TreeItemCollapsibleState.None);
          item.command = {
            command: CommandConstants.trackModuleCommand,
            title: '',
            arguments: [item]
          };
        } else {
          icon = path.join(rootPath, ExtensionConstants.resourcesFolder,ExtensionConstants.redIcon);
          let title = this.getTitleForUnmarkedModules(moduleObject);
          item = new ModuleItem(moduleObject.moduleName, moduleObject.filePath, icon, title,
                     vscode.TreeItemCollapsibleState.None);
          item.command = {
            command: CommandConstants.trackModuleCommand,
            title: '',
            arguments: [item]
          };
        }
        moduleItems.push(item);
      }

      return moduleItems;
    } else {
      let message = new ModuleItem(ExtensionConstants.modulesNotFound, ExtensionConstants.notFoundId, '', ExtensionConstants.githubRepo,
				vscode.TreeItemCollapsibleState.None);
      message.command = {
        command: CommandConstants.trackModuleCommand,
        title: '',
        arguments: [message]
      };

      moduleItems.push(message);
      return moduleItems;
    }

    return [];
  }

}

export class ModuleItem extends vscode.TreeItem {

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

  contextValue = 'modules';

}
