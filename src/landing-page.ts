import * as vscode from 'vscode';
import {window, Uri, ExtensionContext} from 'vscode';
import * as fs from "fs";
import * as path from "path";
import {ExtensionConstants} from './extension-constants';

export class LandingPage {
    
    // Track currently webview panel
    currentPanel: vscode.WebviewPanel | undefined;

    constructor(
        public context: ExtensionContext
    ) { }

    /**
     * Display's the welcome page for Mezzurite Extension
     */
    public displayLandingPage(){
        const columnToShowIn = vscode.ViewColumn.One;
        if (this.currentPanel) {
            // If we already have a panel, show it in the target column
            this.currentPanel.reveal(columnToShowIn);
        } else {
            // Otherwise, create a new panel
            this.currentPanel = window.createWebviewPanel(
                'reactLandingPage', // Identifies the type of the webview. Used internally
                ExtensionConstants.titleForWelcomePage, // Title of the panel displayed to the user
                columnToShowIn, // Editor column to show the new webview panel in.
                { 
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    // Only allow the webview to access resources in our extension's client directory
                    localResourceRoots: [
                        vscode.Uri.file(path.join(this.context.extensionPath, ExtensionConstants.clientFolderName))
                    ]} // Webview options. More on these later.
            );
            this.currentPanel.webview.html = this.getWebviewContent();

            // Reset when the current panel is closed
            this.currentPanel.onDidDispose(() => {
                this.currentPanel = undefined;
            }, null, this.context.subscriptions);
        }
    }

    /**
     * Get Webview's content to be displayed in the welcome page
     * @return html content for the webview
     */
    public getWebviewContent() {
        let html;
        try{
            html = fs.readFileSync(this.getMiscPath( ExtensionConstants.webviewHtmlFileName, false), { encoding: "utf-8" });
        }catch(err){
            console.log('Vs code webview not found');
            throw err;
        }
        html = html.replace( ExtensionConstants.placeholderForStyleTag, `${this.getStyles()}`.replace(/\$/g, "$$"));
        return html;
    }

    /**
     * Get the css styling applied to the welcome page
     * @return stylesheet link for the webview
     */
    public getStyles(): string {
        const baseStyle = this.getMiscPath( ExtensionConstants.webviewStyleName, true);
        var css = `<link rel="stylesheet" type="text/css" href="${baseStyle}">`;
        return css;
    }

     /**
     * Returns the absolute path to a file located in our misc folder.
     *
     * @param file: The base file name.
     * @param asResource: a boolean flag to know whether its html or css file and to add the 'vscode-resource' scheme.
     *                    vscode-resource: loads a resource at a given absolute path from the disk.
     */
    public getMiscPath(file: string, asResource: boolean): string {
        if (asResource) {
            return Uri.file(this.context.asAbsolutePath(path.join( ExtensionConstants.clientFolderName, file))).with({ scheme: 'vscode-resource' }).toString();
        }
        return this.context.asAbsolutePath(path.join( ExtensionConstants.clientFolderName, file));
    }
}