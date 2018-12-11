import {workspace} from 'vscode';
import ts = require('typescript');
import 'reflect-metadata';
import {MezzuriteUtils} from './mezzurite-utils';

export class MezzuriteAngularV1{

    constructor(){

    }

    async executeFrameworkSpecificRules(){
        // Read the .js and .ts files from the work space
        // Get the contents
        // Look for @Component keyword
        // If found, get that object
        // Check property templateUrl and template
        // If templateUrl found store that file name as html
        // If template found, mark that as component and check for mezzurite and component title in that html string
        let files: any = await MezzuriteUtils.searchWorkspace(workspace, "**/*.ts", "**/node_modules/**");
        let data: string;
        let htmlFiles: any = [];
        let output : any = [];
        for(const index in files){
            data = MezzuriteUtils.readFileFromWorkspace(files[index].fsPath, 'utf8');
            if(data.indexOf('@NgModule') > -1){
                console.log("This is a angular module:-"+ files[index].fsPath);
                console.log("You should have import and router.start() here");
            }
            if(data.indexOf('@Component') > -1){
                
                let outputObject: any = {
                    componentName: "",
                    filePath: "",
                    status: "Unmarked",
                    template: ""
                };
                // Add the file path
                outputObject.filePath = files[index].fsPath;

                const parsedData = ts.createSourceFile(files[index].fsPath, data, ts.ScriptTarget.Latest, true);
                var componentFound = false;

                for(var i = 0;i < parsedData.statements.length; i++){
                    var nodeObj: any  = ts.getParseTreeNode(parsedData.statements[i]);
                    if(nodeObj.decorators && ts.isDecorator(nodeObj.decorators[0])){
                        // Add the componentName
                        outputObject.componentName = nodeObj.name.text;

                        // Get the decorator properties
                        var expObj = ts.getParseTreeNode(nodeObj.decorators[0].expression);
                        if(expObj.expression.text !== "Component"){
                            continue;
                        }

                        var properties;
                        if(expObj && expObj.arguments){
                            properties = ts.getParseTreeNode(expObj.arguments[0]).properties;
                            componentFound = true;
                        }
                        
                        for(var j = 0; j < properties.length; j++){
                            var element = properties[j];
                            if(element.name.text === "templateUrl"){
                                htmlFiles.push(element.initializer.text);
                                outputObject.template = element.initializer.text;
                                if(element.initializer.text !== ""){
                                   var found = await MezzuriteAngularV1.parseHTMLFile(element.initializer.text);
                                   if(found){
                                        outputObject.status = "Marked";
                                   }
                                }
                            }
                            if(element.name.text === "template"){
                                outputObject.template = "Html template provided";
                                if(MezzuriteAngularV1.verifyComponentMarking(element.initializer.text)){
                                    outputObject.status = "Marked";
                                }
                            }
                        };
                    }
                }
                
                if(componentFound){
                    output.push(outputObject);
                }
            }
            
        }

        // Display output
        for(var component = 0;component < output.length; component++){
            console.log(output[component]);
        }
    }

    static async parseHTMLFile(filePath: string){
        var lastIndex = filePath.lastIndexOf('/') > -1? filePath.lastIndexOf('/') : filePath.lastIndexOf('\\');
        var includePattern = "**/" + filePath.substring(lastIndex + 1, filePath.length);

        // Get the html file and parse its contents for mezzurite markings
        let files: any = await MezzuriteUtils.searchWorkspace(workspace,  includePattern, "**/node_modules/**");
        var templateString = MezzuriteUtils.readFileFromWorkspace(files[0].fsPath, 'utf8');
        
        return MezzuriteAngularV1.verifyComponentMarking(templateString);
    }

    static verifyComponentMarking(htmlString: string){
        if(htmlString.indexOf('mezzurite') > -1 && htmlString.indexOf('component-title')> -1){
            return true;
        }
        return false;
    }
}