import {window, workspace} from 'vscode';
import * as fs from "fs";
import {ExtensionConstants} from './constants/extension-constants';
import {MezzuriteUtils} from './utils/mezzurite-utils';

export class MezzuriteDependency {

    constructor(
    ) { }

    /**
     * This method verifies whether Mezzurite-framework dependency is present in the current workspace or not.
     * @return If found, returns the mezzurite framework name and version in an object, otherwise, undefined.
     */
    public async verifyMezzuriteDependency(){
        // Parse application's package.json file
        var dependencyFound= await MezzuriteDependency.searchInPackageJsonFile();
        if(dependencyFound === undefined){
            // If Mezzurite framework dependency is not found in application's package.json file
            // then, search into node modules directory for @microsoft/mezzurite-(frameworkName)
            // frameworkName can be angularjs, angular or react
            dependencyFound = await MezzuriteDependency.searchNodeDirectory();
        }
        return dependencyFound;
    }

    /**
     * This method search for Mezzurite-framework dependency in application's Package.json file
     * @return If found, returns the mezzurite framework name and version in an object, otherwise, undefined.
     */
    static async searchInPackageJsonFile(){
        var packageJsonFiles = await MezzuriteUtils.searchWorkspace(workspace, ExtensionConstants.pathForAppsPackageJson, ExtensionConstants.pathForNodeModules);
        if(packageJsonFiles.length < 1){
            console.log('Applications package.json file not found in the current workspace.');
            return undefined;
        }
        return MezzuriteDependency.parsePackageJsonContents(packageJsonFiles);
    }

    /**
     * This method is used to parse application's Package.json file
     * @param packageJsonFile.json file path object
     * @return Returns the mezzurite framework name and version in an object, otherwise, undefined.
     */
    static parsePackageJsonContents(packageJsonFiles: any){
        let mezzuriteDependency: any = undefined;

        for(var i=0;i < packageJsonFiles.length; i++){
            // read application's package.json contents
            let data: any = MezzuriteUtils.readFileFromWorkspace(packageJsonFiles[i].fsPath, 'utf8');
            
            // Get the package.json Object
            let packageJsonObj = JSON.parse(data);

            // Search in dependencies object in package.json file
            mezzuriteDependency = this.getMezzuriteDependency(packageJsonObj.dependencies);

            // Search in devDependencies object in package.json file
            mezzuriteDependency = mezzuriteDependency !== undefined? mezzuriteDependency : this.getMezzuriteDependency(packageJsonObj.devDependencies);
            if(mezzuriteDependency !== undefined){
                return mezzuriteDependency;
            }
        }
        
        return mezzuriteDependency;
    }

    /**
     * This method is used to parse dependencies and devDependencies Object's in application's Package.json file
     * @param dependancyObject is the dependency object from package.json file
     * @return Returns the mezzurite framework name and version in an object, otherwise, undefined.
     */
    static getMezzuriteDependency(dependancyObject: any){
        let mezzuriteDependency: any = undefined;
        for(var dependency in dependancyObject){
            // if there's a match with any of our framework
            if(ExtensionConstants.mezzuriteFrameworks.indexOf(dependency) > -1){
                mezzuriteDependency = this.getDependencyDetails(dependency, dependancyObject[dependency]);
                break;
            }
        }
        
        return mezzuriteDependency;
    }

    /**
     * This method is used to create mezzurite framework name and version object
     * @param dependencyName is the mezzurite framework name
     * @param dependencyVersion is the mezzurite framework version
     * @return Returns the object
     */
    static getDependencyDetails(dependencyName: string, dependencyVersion: number){
        return {
            name: dependencyName,
            version: dependencyVersion
        };
    }
    
    /**
     * This method search for Mezzurite-framework dependency in node_modules directory
     * @return If found, returns the mezzurite framework name and version in an object, otherwise, undefined.
     */
    static async searchNodeDirectory(){
        var mezzuriteLibs;
        var mezzuFrameworkName: any = undefined;

        try{
            // Get all the folders in nodemodules/@microsoft directory
            mezzuriteLibs = fs.readdirSync(workspace.rootPath + ExtensionConstants.mezzuritePath);
        }catch(err){
            console.log('Mezzurite frameworks directory not found');
            throw err;
        }

        // Search if mezzurite framework's folder exists or not
        if(mezzuriteLibs.length > 0){
            for(var lib in mezzuriteLibs){
                if(ExtensionConstants.mezzuriteDirectories.indexOf(mezzuriteLibs[lib]) > -1){
                    mezzuFrameworkName = mezzuriteLibs[lib];
                    break;
                }
            }
        }

        // If mezzurite dependency found, then get the mezzurite-frameworkName and version
        if(mezzuFrameworkName !== undefined){
            var mzzFrameworksPackageJsonPath = '**'+ ExtensionConstants.mezzuritePath + mezzuFrameworkName +'/package.json';

            // If mezzurite framework found inside node modules directory 
            // then, parse mezzurite framework's package.json file and get the version
            // This will help to identify the which version of mezzurite-frameworkName is used by the application
            // It can be:- 1. angularjs, 2. angular (version = 1.0.x for Angular 2-5 and version = 2.0.x for Angular 6) or 3. react
            let files: any = await MezzuriteUtils.searchWorkspace(workspace, mzzFrameworksPackageJsonPath, '');
            
            // read framework's package.json contents
            let data: any = MezzuriteUtils.readFileFromWorkspace(files[0].fsPath, 'utf8');
            let obj = JSON.parse(data);
            
            // @TODO:This would be removed
            window.showInformationMessage('Mezzurite framework configured is '+ obj.name + ' and version is '+ obj.version);
            return this.getDependencyDetails(obj.name, obj.version);
        }

        return undefined;
    }

}