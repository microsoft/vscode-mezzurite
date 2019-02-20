import * as vscode from 'vscode';
import { ExtensionConstants, CommandConstants } from './constants/extension-constants';
import { MezzuriteExtension } from './mezzurite-extension-main';

/* This method is called when your extension is activated
*  extension is activated depending on the activation events specified in the package.json file
*  We can also activate an extension on commands which needs to be configured in package.json file
*/
export async function activate (context: vscode.ExtensionContext) {
    // create a new Mezzurite extension
  let mezzuriteExtension = new MezzuriteExtension();

    // Create file system watcher for .ts and .html files
  let tsFileSystemWatcher = vscode.workspace.createFileSystemWatcher(ExtensionConstants.pathForTypescriptFiles, false, true, false);
  let htmlFileSystemWatcher = vscode.workspace.createFileSystemWatcher(ExtensionConstants.pathForHtmlFiles, false, true, false);

    // Check if mezzurite dependency is found or not
  let mezzuriteDependency: any = await mezzuriteExtension.verifyMezzurite();
  if (mezzuriteDependency) {
    mezzuriteExtension.displayLandingPage(context);
  }

    // Check for marked and unmarked components and modules
  let ruleResults = await mezzuriteExtension.executeMezzuriteRules(mezzuriteDependency, undefined);

    // Command for validate mezzurite on current workspace
  let validateMezzurite = vscode.commands.registerCommand(CommandConstants.validateMezzuriteCommand, async () => {
    let updatedResults = await mezzuriteExtension.executeMezzuriteRules(mezzuriteDependency, undefined);
    mezzuriteExtension.displayComponentsTreeView(updatedResults, context);
    mezzuriteExtension.displayModulesTreeView(updatedResults, context);
  });

    // Display components treeview
  mezzuriteExtension.displayComponentsTreeView(ruleResults, context);

    // Display modules treeview
  mezzuriteExtension.displayModulesTreeView(ruleResults, context);

    // Command for On Save of a .ts or .html file
  vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (document.languageId === ExtensionConstants.typescript) {
      ruleResults = await mezzuriteExtension.onEditOrCreateTsFile(ruleResults, mezzuriteDependency, document.fileName, context);
    } else if (document.languageId === ExtensionConstants.html) {
      ruleResults = await mezzuriteExtension.onEditOrCreateHtmlFile(ruleResults, document.fileName, context);
    }
  });

    // Command for On Delete of a .ts file
  tsFileSystemWatcher.onDidDelete(async function (e) {
    ruleResults = await mezzuriteExtension.onDeleteTsFile(ruleResults, e.fsPath, context);
  });

    // Command for On Delete of a .html file
  htmlFileSystemWatcher.onDidDelete(async function (e) {
    ruleResults = await mezzuriteExtension.onDeleteHtmlFile(ruleResults, e.fsPath, context);
  });

    // Command for displaying the landing page
  let landingPageCommand = vscode.commands.registerCommand(CommandConstants.displayLandingPageCommand, () => {
    mezzuriteExtension.displayLandingPage(context);
  });

    // Command for selecting a node in components tree view
  let componentsTreeView = vscode.commands.registerCommand(CommandConstants.trackComponentCommand, (item: any) => {
    if (item.path === ExtensionConstants.notFoundId) {
      vscode.commands.executeCommand(CommandConstants.openUrl, vscode.Uri.parse(ExtensionConstants.mezzuGithubUrl));
    } else {
      vscode.workspace.openTextDocument(item.path).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  });

    // Command for selecting a node in modules tree view
  let modulesTreeView = vscode.commands.registerCommand(CommandConstants.trackModuleCommand, (item: any) => {
    if (item.path === ExtensionConstants.notFoundId) {
      vscode.commands.executeCommand(CommandConstants.openUrl, vscode.Uri.parse(ExtensionConstants.mezzuGithubUrl));
    } else {
      vscode.workspace.openTextDocument(item.path).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  });

  context.subscriptions.push(validateMezzurite);
  context.subscriptions.push(landingPageCommand);
  context.subscriptions.push(componentsTreeView);
  context.subscriptions.push(modulesTreeView);

}// activate() function

// This method is called when your extension is deactivated
export function deactivate () { /* no-op */ }
