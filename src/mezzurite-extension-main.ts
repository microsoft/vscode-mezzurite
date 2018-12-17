import * as vscode from 'vscode';
import {LandingPage} from './landing-page';
import {MezzuriteDependency} from './verify-mezzurite-dependency';
import {ExecuteMezzuriteFrameworkRules} from './execute-mezzurite-framework-rules';
import {ComponentsProvider} from './treeview/components-treeview'
import {ModulesProvider} from './treeview/modules-treeview'
import { ExtensionConstants } from './constants/extension-constants';
/**
 * Mezzurite extension class
 * After the extension is activated, this class will verify the mezzurite-framework dependency and then, it will display the welcome page
 * Also, it will run the mezzurite validation rules to look for marked and un-marked components specific to the mezzurite-framework dependency
 */
export class MezzuriteExtension{
    
    constructor() { }

    /**
     * Display the welcome page after the extension is activated
     *
     * @param context The context of this extension to get its path regardless where it is installed.
     */
    public displayLandingPage(context: any){
        let landingPage = new LandingPage(context);
        return landingPage.displayLandingPage();
    }

    /**
     * This method verifies whether a mezzurite-framework dependency is found or not
     *
     * @return true if found
     */
    public async verifyMezzurite(){
        let mezzuriteDependency = new MezzuriteDependency();
        return await mezzuriteDependency.verifyMezzuriteDependency();
    }

    /**
     * This method executes mezzurite framework specific rules
     * @param mezzurite dependency object consisiting of framework name and version
     * @return returns results object consisting of list of components and modules
     */
    public async executeMezzuriteRules(mezzuriteDependency: any, filePath: any){
        if(mezzuriteDependency){
            let validateMezzuriteFramework = new ExecuteMezzuriteFrameworkRules(mezzuriteDependency.name, mezzuriteDependency.version, filePath);
            return await validateMezzuriteFramework.executeRules();
        }
    }

    /**
     * This method creates tree view for all the components present in the workspace
     * @param results object consisting of all the components
     */
    public displayComponentsTreeView(ruleResults: any, context: any){
        let treeView = new ComponentsProvider(ruleResults.listOfComponents, context);
        vscode.window.registerTreeDataProvider(ExtensionConstants.componentsTreeview, treeView);
    }

    /**
     * This method creates tree view for all the modules present in the workspace
     * @param results object consisting of all the modules
     */
    public displayModulesTreeView(ruleResults: any, context: any){
        let treeView = new ModulesProvider(ruleResults.listOfModules, context);
        vscode.window.registerTreeDataProvider(ExtensionConstants.modulesTreeview, treeView);
    }

    public mergeResultsAfterSave(oldResults: any, newResults: any){
        for(var i=0;i<oldResults.listOfComponents.length;i++){
            if(oldResults.listOfComponents[i].componentName === newResults.listOfComponents[0].componentName){
                oldResults.listOfComponents[i] = newResults.listOfComponents[0];
            }
        }
        return oldResults;
    }
}
