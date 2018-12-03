'use strict';
import * as vscode from 'vscode';
import { window, commands} from 'vscode';
import {LandingPage} from './landing-page';
import {ExtensionConstants} from './extension-constants';

// this method is called when your extension is activated
// extension is activated depending on the activation events specified in the package.json file
// We can also activate an extension on commands which needs to be configured in package.sjon file
export async function activate(context: vscode.ExtensionContext) { 

    // create a new Mezzurite extension
    let mezzuriteExtension = new MezzuriteExtension();

    // Check if mezzurite dependency is found or not
    // This will be done by parsing the application's package.json file or searching for mezzuite-framework in node_modules folder
    var mezzuriteFound = mezzuriteExtension.verifyMezzurite();
    if(mezzuriteFound){
        mezzuriteExtension.displayLandingPage(context);
    }

    // Command for validate mezzurite on current workspace
    let validateMezzurite = commands.registerCommand( ExtensionConstants.validateMezzuriteCommand, () => {
        window.showInformationMessage('Mezzurite Extension is activated.');
    });

    // Command for displaying the landing page
    let landingPageCommand = commands.registerCommand( ExtensionConstants.displayLandingPageCommand, () => {
        mezzuriteExtension.displayLandingPage(context);
    });

    context.subscriptions.push(validateMezzurite);
    context.subscriptions.push(landingPageCommand);

}// activate() function

// this method is called when your extension is deactivated
export function deactivate() {
}

/**
 * Mezzurite extension class
 * After the extension is activated, this class will verify the mezzurite-framework dependency and then, it will display the welcome page
 * Also, it will run the mezzurite validation rules to look for marked and un-marked components specific to the mezzurite-framework dependency
 */
class MezzuriteExtension{
    
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
    public verifyMezzurite(){
        // This is just to test the base extension
        console.log('Mezzurite framework found!');
        return true;
    }
}