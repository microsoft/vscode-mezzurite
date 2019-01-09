import * as vscode from 'vscode';
import {workspace} from 'vscode';
import {LandingPage} from './landing-page';
import {MezzuriteDependency} from './verify-mezzurite-dependency';
import {ExecuteMezzuriteFrameworkRules} from './execute-mezzurite-framework-rules';
import {ComponentsProvider} from './treeview/components-treeview'
import {ModulesProvider} from './treeview/modules-treeview';
import {MezzuriteUtils} from './utils/mezzurite-utils';
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
     * This method updates the output results whenever a typescript file is created or edited and then saved
     * @param list of old modules or components output data
     * @param mezzurite dependency object
     * @param filepath of changed file
     * @param context which is editor context needed to display the output
     * @return returns array of modules or components
     */
    public async onEditOrCreateTsFile(ruleResults: any, mezzuriteDependency: any, filePath: string, context: any){
        let updatedResults = await this.executeMezzuriteRules(mezzuriteDependency, filePath);
        updatedResults = this.mergeResultsAfterSave(ruleResults, updatedResults);
        this.displayComponentsTreeView(updatedResults, context);
        this.displayModulesTreeView(updatedResults, context);
        return updatedResults;
    }

    /**
     * This method updates the output results whenever a typescript file is deleted
     * @param list of old modules or components output data
     * @param filepath of changed file
     * @param context which is editor context needed to display the output
     * @return returns array of modules or components
     */
    public async onDeleteTsFile(ruleResults: any, filePath: string, context: any){
        var updatedResults: any = {};
        updatedResults["listOfComponents"] = MezzuriteExtension.removeComponentOnDelete(ruleResults.listOfComponents, filePath);
        updatedResults["listOfModules"] = MezzuriteExtension.removeModuleOnDelete(ruleResults.listOfModules, filePath);
        this.displayComponentsTreeView(updatedResults, context);
        this.displayModulesTreeView(updatedResults, context);
        return updatedResults;
    }

    /**
     * This method updates the output results whenever a html file is created or edited and then saved
     * @param list of old modules or components output data
     * @param filepath of changed file
     * @param context which is editor context needed to display the output
     * @return returns array of modules or components
     */
    public async onEditOrCreateHtmlFile(ruleResults: any, filePath: string, context: any){
        let updatedResults = await this.verifyHtmlComponent(ruleResults, filePath);
        this.displayComponentsTreeView(updatedResults, context);
        return updatedResults;
    }

    /**
     * This method updates the output results whenever a html file is deleted
     * @param list of old modules or components output data
     * @param filepath of changed file
     * @param context which is editor context needed to display the output
     * @return returns array of modules or components
     */
    public async onDeleteHtmlFile(ruleResults: any, filePath: string, context: any){
        var updatedResults: any = {};
        updatedResults["listOfComponents"] = MezzuriteExtension.removeHtmlComponentOnDelete(ruleResults.listOfComponents, filePath);
        updatedResults["listOfModules"] = ruleResults.listOfModules;
        this.displayComponentsTreeView(updatedResults, context);
        return updatedResults;
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

    /**
     * This method merge the old output data with a newly saved or created module or component data
     * @param list of old modules or components output data
     * @param list of newly saved or created modules or component
     * @return returns merged array of modules or components
     */
    public mergeResultsAfterSave(oldResults: any, newResults: any){
        var updatedResults;
        // Merge components
        if(newResults.listOfComponents.length > 0){
            updatedResults = MezzuriteExtension.mergeComponentsAfterSave(oldResults, newResults);
        }
        // Merge Modules
        if(newResults.listOfModules.length > 0){
            updatedResults = MezzuriteExtension.mergeModulesAfterSave(oldResults,newResults);
        }
        return updatedResults;
    }

    /**
     * This method merge the old components output data with a newly saved or created component data
     * @param list of old components output data
     * @param list of newly saved or created component
     * @return returns merged array of components to be displayed
     */
    public static mergeComponentsAfterSave(oldResults: any, newResults: any){
        var found = false;
        for(var i=0;i<oldResults.listOfComponents.length;i++){
            if(oldResults.listOfComponents[i].filePath === newResults.listOfComponents[0].filePath){
                oldResults.listOfComponents[i] = newResults.listOfComponents[0];
                found = true;
                break;
            }
        }
        if(!found){
            oldResults.listOfComponents.push(newResults.listOfComponents[0]);
        }
        return oldResults;
    }

    /**
     * This method merge the old modules output data with a newly saved or created module data
     * @param list of old modules output data
     * @param list of newly saved or created module
     * @return returns merged array of modules to be displayed
     */
    public static mergeModulesAfterSave(oldResults: any, newResults: any){
        var found = false;
        for(var i=0;i<oldResults.listOfModules.length;i++){
            if(oldResults.listOfModules[i].filePath === newResults.listOfModules[0].filePath){
                oldResults.listOfModules[i] = newResults.listOfModules[0];
                found = true;
                break;
            }
        }
        if(!found){
            oldResults.listOfModules.push(newResults.listOfModules[0]);
        }
        return oldResults;
    }

    /**
     * This method removes the deleted component from the display list
     * @param list of old components output data
     * @param deleted file path
     * @return returns merged array of components to be displayed
     */
    public static removeComponentOnDelete(listOfComponents: any, filePath: string){
        return listOfComponents.filter(function(componentObject: any) { 
            return componentObject.filePath != filePath; 
        });
    }

    /**
     * This method removes the deleted module from the display list
     * @param list of old modules output data
     * @param deleted file path
     * @return returns merged array of modules to be displayed
     */
    public static removeModuleOnDelete(listOfModules: any, filePath: string){
        return listOfModules.filter(function(moduleObject: any) { 
            return moduleObject.filePath != filePath; 
        });
    }

    /**
     * This method removes the deleted html component from the display list
     * @param list of old components output data
     * @param deleted html file path
     * @return returns merged array of components to be displayed
     */
    public static removeHtmlComponentOnDelete(listOfComponents: any, filePath: string){
        var fileName = MezzuriteUtils.getFileNameFromPath(filePath);
        return listOfComponents.filter(function(componentObject: any) { 
            return componentObject.templateUrl.indexOf(fileName) === -1; 
        });
    }

    /**
     * This method verifies mezzurite intrumentation checks for extenal html component file which is aved by the user
     * @param list of components output
     * @param filepath of the saved html file
     * @return returns array of components to be displayed
     */
    public async verifyHtmlComponent(oldResults: any, filePath: string){
        var fileName = MezzuriteUtils.getFileNameFromPath(filePath);
        for(var i=0;i<oldResults.listOfComponents.length;i++){
            if(oldResults.listOfComponents[i].templateUrl.indexOf(fileName) > -1){
                var found = await MezzuriteUtils.parseExternalHTMLFile(fileName, workspace);
                if(found){
                    oldResults.listOfComponents[i].status = ExtensionConstants.marked;
                }
                else{
                    oldResults.listOfComponents[i].status = ExtensionConstants.unmarked;
                }
                return oldResults;
            }
        }
    }
}
