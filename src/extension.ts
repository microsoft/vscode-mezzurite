'use strict';
import * as vscode from 'vscode';
import {commands} from 'vscode';
import {ExtensionConstants, CommandConstants} from './constants/extension-constants';
import {MezzuriteExtension} from './mezzurite-extension-main';

/* This method is called when your extension is activated
*  extension is activated depending on the activation events specified in the package.json file
*  We can also activate an extension on commands which needs to be configured in package.json file
*/
export async function activate(context: vscode.ExtensionContext) { 
    // create a new Mezzurite extension
    let mezzuriteExtension = new MezzuriteExtension();

    // Check if mezzurite dependency is found or not
    var mezzuriteDependency: any = await mezzuriteExtension.verifyMezzurite();
    if(mezzuriteDependency){
        mezzuriteExtension.displayLandingPage(context);
    }

    // Check for marked and unmarked components and modules
    let ruleResults = await mezzuriteExtension.executeMezzuriteRules(mezzuriteDependency, undefined);

    // Command for validate mezzurite on current workspace
    let validateMezzurite = commands.registerCommand( CommandConstants.validateMezzuriteCommand, async () => {
        let updatedResults = await mezzuriteExtension.executeMezzuriteRules(mezzuriteDependency, undefined);
        mezzuriteExtension.displayComponentsTreeView(updatedResults, context);
    });

    // Display components treeview
    mezzuriteExtension.displayComponentsTreeView(ruleResults, context);
    
    // Display modules treeview
    mezzuriteExtension.displayModulesTreeView(ruleResults, context);

    vscode.workspace.onDidSaveTextDocument(async (document) => {
        if(document.languageId === ExtensionConstants.typescript){
            let updatedResults = await mezzuriteExtension.executeMezzuriteRules(mezzuriteDependency, document.fileName);
            updatedResults = mezzuriteExtension.mergeResultsAfterSave(ruleResults, updatedResults);
            mezzuriteExtension.displayComponentsTreeView(updatedResults, context);
        }
        else if(document.languageId === ExtensionConstants.html){
            // @TODO: This is in progress
            // Check if that html file is present inside oldResults.listOfComponents and verifying the 'templateUrl' property
        }
      });

    // Command for displaying the landing page
    let landingPageCommand = commands.registerCommand( CommandConstants.displayLandingPageCommand, () => {
        mezzuriteExtension.displayLandingPage(context);
    });

    // Command for selecting a node in components tree view
    let componentsTreeView = commands.registerCommand(CommandConstants.trackComponentCommand, (item: any) => {
        vscode.workspace.openTextDocument(item.path).then(doc => {
            vscode.window.showTextDocument(doc);
         });
    });

    // Command for selecting a node in components tree view
    let modulesTreeView = commands.registerCommand(CommandConstants.trackModuleCommand, (item: any) => {
        vscode.workspace.openTextDocument(item.path).then(doc => {
            vscode.window.showTextDocument(doc);
         });
    });


    context.subscriptions.push(validateMezzurite);
    context.subscriptions.push(landingPageCommand);
    context.subscriptions.push(componentsTreeView);
    context.subscriptions.push(modulesTreeView);
    
}// activate() function

// This method is called when your extension is deactivated
export function deactivate() {
}