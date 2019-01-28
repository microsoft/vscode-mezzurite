import {workspace} from 'vscode';
import 'reflect-metadata';
import {MezzuriteUtils} from '../utils/mezzurite-utils';
import {ExtensionConstants} from '../constants/extension-constants';
import { Project } from "ts-simple-ast";

export class MezzuriteReact{

    private filePath: any;

    constructor(filePath: any){
        this.filePath = filePath
    }

    /**
     * This method would execute the mezzurite framework-specific rules.
     * Rules:- Rules are 
     * 1. Looking for marked and unmarked React components
     * 2. Looking for mezzurite import and export in all React modules
     */
    async executeFrameworkSpecificRules(){
        let files: any;
        // Read the .ts files from the work space and get their contents
        if(!this.filePath){
            files = await MezzuriteUtils.searchWorkspace(workspace, ExtensionConstants.pathForTypescriptFiles, ExtensionConstants.pathForNodeModules);
        }
        else{
            var editedFilePath = "**/" + MezzuriteUtils.getFileNameFromPath(this.filePath);
            files = await MezzuriteUtils.searchWorkspace(workspace, editedFilePath, ExtensionConstants.pathForNodeModules);
        }
        let data: string;
        let listOfComponents : any = [];
        let listOfModules: any = [];
        for(var index in files){
            var filePath = files[index].fsPath;
            // Read file contents
            data = MezzuriteUtils.readFileFromWorkspace(files[index].fsPath, 'utf8');
            
            // Check if file contains React module
            if(MezzuriteReact.fileContainsModule(data)){
                listOfModules = await MezzuriteReact.getListOfModules(filePath, data, listOfModules);
            }
            
            // Check if file contains React component
            if(MezzuriteReact.fileContainsComponent(data)){
                listOfComponents = await MezzuriteReact.getListOfComponents(filePath, data, listOfComponents);
            }
        }
        return MezzuriteUtils.createOutputObject(listOfComponents, listOfModules);
    }

    /**
     * This method checks if file contains an an React module or not
     * @param file data as string
     * @return Return true if found, otherwise false
     */
    static fileContainsModule(fileData: string){
        if(fileData.indexOf(ExtensionConstants.moduleDecorator) > -1){
            return true;
        }
        return false;
    }

    /**
     * This method checks if file contains an an React component or not
     * @param file data as string
     * @return Return true if found, otherwise false
     */
    static fileContainsComponent(fileData: string){
        if(fileData.indexOf(ExtensionConstants.componentDecorator) > -1){
            return true;
        }
        return false;
    }

    /**
     * This method a decorator object by type. Type can be component or Module
     * @param class declaration object
     * @return If decorator, returns the decorator object, otherwise, return undefined
     */
    static getDecoratorByType(classDeclaration: any, decoratorType: string){
        const decorators = classDeclaration.getDecorators();
        for(var dec= 0; dec< decorators.length;dec++){
            var decorator = decorators[dec];
            if(decoratorType === decorator.getName()){
                return decorator;
            }
        }
        return undefined;
    }

    /**
     * This method checks whether node contains mezzurite import statement or not
     * @param root node object of the AST
     * @return true, if sourec file contains mezzurite import statements
     */
    static containsMezzuriteImportStmt(sourceFile: any){
        const importStatement = sourceFile.getImportDeclaration(ExtensionConstants.mezzuriteReact);
        if(importStatement){
            return true;
        }
        return false;
    }

    /**
     * This method checks whether the constructor has mezzurite router.start() method and RoutingService parameter or not
     * @param class decorator object
     * @return true, if constructor contains mezzurite router.start() method and RoutingService parameter
     */
    static containsRouterStart(decoratorClass: any){
        var classConstructors = decoratorClass.getConstructors();
        for(var index=0;index<classConstructors.length;index++){
            var constructor = classConstructors[index];
            if(MezzuriteReact.checkForRoutingServiceParam(constructor)){
                if(MezzuriteReact.checkForStartMethod(constructor)){
                    return true;
                }
            };
        }
        return false;
    }
    
    /**
     * This method checks whether the constructor has mezzurite RoutingService parameter or not
     * @param constructor object
     * @return true, if constructor contains mezzurite RoutingService parameter
     */
    static checkForRoutingServiceParam(constructor: any){
        var constParams = constructor.getParameters();
        for(var param=0;param< constParams.length;param++){
            var parameterName = constParams[param].getTypeNode().getText();
            if(parameterName.indexOf(ExtensionConstants.routingService) > -1){
                return true;
            }
        }
        return false;
    }

    /**
     * This method checks whether start method is called inside constructor or not
     * @param constructor object
     * @return true, if constructor contains router.start() method
     */
    static checkForStartMethod(constructor: any){
        var constStatements = constructor.getBody().getStatements();
        for(var stmt =0;stmt< constStatements.length;stmt++){
            var statement = constStatements[stmt];
            if(statement.getKindName() === ExtensionConstants.expressionStatment && statement.getText().indexOf(ExtensionConstants.startText) > -1){
                return true;
            }
        }
        return false;
    }

    /**
     * This method returns array of elements inside imports property in module decorator
     * @param decorator object
     * @return array of elements inside imports property in module decorator
     */
    static getImportDecoratorElements(decorator: any){
        var importsObject = MezzuriteReact.getDecoratorProperty(decorator, ExtensionConstants.importsText);
        if(importsObject){
            var importsElements = importsObject.getInitializer().getElements();
            if(importsElements && importsElements.length > 0){
                return importsElements;
            }
        }
        return [];
    }

    /**
     * This method returns decorator property by property name
     * @param decorator object
     * @param property name can be any property inside decorator like 'import' in module decoartor or 'template' and 'templateUrl' inside components decorator
     * @return decorator property object
     */
    static getDecoratorProperty(decorator: any, propertyName: any){
        var decoratorArgs = decorator.getArguments();
        for(var arg=0; arg<decoratorArgs.length;arg++){
            var propertyObject = decoratorArgs[arg].getProperty(propertyName);
            if(propertyObject){
                return propertyObject;
            }
        }
        return undefined;
    }

    /**
     * This method returns all the class nodes from typscript source file
     * @param file path
     * @return array of class nodes
     */
    static getClassNodesFromSourceFile(filePath: string){
        const project = new Project();
        const sourceFile = project.addExistingSourceFile(filePath);
        return sourceFile.getClasses();
    }

    /**
     * Creates an array of output objects consisting of module details with file path,  module name, router.start() info, mezzurite import and export statements
     * @param file path
     * @param file data as string
     * @param output array of objects consisting of details related to component
     * @return list of components
     */
    static async getListOfModules(filePath: string, data: string, listOfModules: any){
        var moduleDecoratorFound = false;
        // Initialize module output object
        var moduleObject = MezzuriteReact.initializeModuleObject();
        const project = new Project();
        const sourceFile = project.addExistingSourceFile(filePath);
        const classes = sourceFile.getClasses();
        // Check for a import statement
        if(MezzuriteReact.containsMezzuriteImportStmt(sourceFile)){
            moduleObject.importStmt = true;
        }
        for(var i = 0;i <classes.length; i++){
            // Check for a valid NgModule decorator object
            var decorator = MezzuriteReact.getDecoratorByType(classes[i], ExtensionConstants.moduleDecoratorName);
            if(decorator !== undefined){
                moduleDecoratorFound = true;
                moduleObject.moduleName = classes[i].getName();
            }
            // Check for a forRoot() method
            if(MezzuriteReact.containsReactPerfForRoot(decorator)){
                moduleObject.forRoot = true;
            }
            // Check for a router.start() method
            if(MezzuriteReact.containsRouterStart(classes[i])){
                moduleObject.routerStart = true;
            }
            if(moduleObject.importStmt && moduleObject.forRoot && moduleObject.routerStart){
                break;
            }
        }
        if(moduleDecoratorFound){
            moduleObject.filePath = filePath;
            listOfModules.push(moduleObject);
        }
        return listOfModules;
    }

    /**
     * Creates an array of output objects consisting of components details with file path,  component name, component tracking status, template and templateUrl
     * @param file name
     * @param file data as string
     * @param output array of objects consisting of details related to component
     * @return list of components
     */
    static async getListOfComponents(filePath: string, data: string, listOfComponents: any){
        var componentDecoratorFound = false;
        // Initialize component output object
        var componentObject = MezzuriteReact.initializeComponentObject();
        const classes = MezzuriteReact.getClassNodesFromSourceFile(filePath);
        for(var i = 0;i < classes.length; i++){
            // Check for a valid decorator object
            var decorator = MezzuriteReact.getDecoratorByType(classes[i], ExtensionConstants.componentDecoratorName);
            if(decorator !== undefined){
                componentObject.filePath = filePath;
                componentObject.componentName = classes[i].getName();
                componentDecoratorFound = true;
                componentObject = await MezzuriteReact.verifyComponentsTemplate(decorator, componentObject);
                break;
            }
        }
        if(componentDecoratorFound){
            listOfComponents.push(componentObject);
        }
        return listOfComponents;
    }

    /**
     * This method adds the component details such as component tracking status, template and templateUrl to the output object
     * @param decoratorProps consisting of the properties like template, style, templateUrl,etc..
     * @param outputObject with default component details
     * @return outputobject 
     */
    static async verifyComponentsTemplate(decorator: any, componentObject : any){
        // Look for 'template' and 'templateUrl' properties in decorator object
        var templateUrlProperty = MezzuriteReact.getDecoratorProperty(decorator, ExtensionConstants.templateUrl);
        if(templateUrlProperty !== undefined && templateUrlProperty !== ""){
            await MezzuriteReact.checkForTemplateUrlProperty(templateUrlProperty, componentObject);
        }
        var templateProperty = MezzuriteReact.getDecoratorProperty(decorator, ExtensionConstants.template);
        if(templateProperty !== undefined && templateProperty !== ""){
            MezzuriteReact.checkForTemplateProperty(templateProperty, componentObject);
        }
        return componentObject;
    }

    /**
     * This method checks templateUrl property value in component decorator object
     * @param templateUrlProperty is the templateUrl property node from componenet object
     * @param outputObject with default component details
     */
    static async checkForTemplateUrlProperty(templateUrlProperty: any, componentObject: any){
        var templateUrlValue = templateUrlProperty.getInitializer().compilerNode.text;
        if(templateUrlValue !== ""){
            componentObject.templateUrl = templateUrlValue;
            var fileName: string = MezzuriteUtils.getFileNameFromPath(templateUrlValue);
            var found = await MezzuriteUtils.parseExternalHTMLFile(fileName, workspace);
            if(found){
                componentObject.status = ExtensionConstants.marked;
            }
        }
    }

    /**
     * This method checks template property value in component decorator object
     * @param templateProperty is the templateUrl property node from componenet object
     * @param outputObject with default component details
     */
    static async checkForTemplateProperty(templateProperty: any, componentObject: any){
        var templateValue = templateProperty.getInitializer().compilerNode.text;
        if(templateValue !== ""){
            componentObject.template = ExtensionConstants.htmlTemplateProvided;
            if(MezzuriteUtils.verifyComponentMarking(templateValue)){
                componentObject.status = ExtensionConstants.marked;
            }
        }
    }

    /**
     * Initilize the default component output object
     * @return default/empty component output object
     */
    static initializeComponentObject(){
        let componentObject: any = {
            componentName: "",
            filePath: "",
            status: ExtensionConstants.unmarked,
            template: "",
            templateUrl: "",
        };
        return componentObject;
    }

    /**
     * Initilize the default module output object
     * @return default/empty module output object
     */
    static initializeModuleObject(){
        let moduleObject: any = {
            moduleName: "",
            filePath: "",
            importStmt: false,
            forRoot: false,
            routerStart: false
        };
        return moduleObject;
    }

    
}