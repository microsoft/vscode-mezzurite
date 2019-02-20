import * as fs from 'fs';
import { ExtensionConstants } from '../constants/extension-constants';

export class MezzuriteUtils {

    /**
     * This method search for Mezzurite-framework dependency in node_modules/mezzurite-framework's Package.json file
     * @param workspace is the current workspace in the vs code editor
     * @param includePatterns is the path pattern which needs to searched
     * @param excludePattern is the path pattern which should be excluded from search
     * @return Return the arrays of files found in the current workspace
     */
  static async searchWorkspace (workspace: any, includePatterns: any, excludePattern: any) {
    try {
      return await workspace.findFiles(includePatterns, excludePattern);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

    /**
     * This method reads file contents, provided the filePath
     * @param filePath is the path to the file
     * @param encodingType is the character encoding type
     * @return Returns the file contents
     */
  static readFileFromWorkspace (filePath: string, encodingType: string) {
    let data: any;
    try {
      data = fs.readFileSync(filePath, encodingType);
    } catch (err) {
      if (err) {
        console.log('File not found at the following path:-' + filePath);
        throw err;
      }
    }
    return data;
  }

    /**
     * This method verifies whether component is marked or not
     * @param htmlString is the html template of the component
     * @return true, if parsed html contains the mezzurite directive and component-title, otherwise, false
     */
  static verifyComponentMarking (htmlString: string) {
    if (htmlString && htmlString.indexOf(ExtensionConstants.mezzuriteDirective) > -1 && htmlString.indexOf(ExtensionConstants.componentTitleDirective) > -1) {
      return true;
    }
    return false;
  }

    /**
     * This method is used to get the html file name from file path
     * @param filePath of the html template
     * @return heml file name
     */
  static getFileNameFromPath (filePath: string) {
    let lastIndex = filePath.lastIndexOf('/') > -1 ? filePath.lastIndexOf('/') : filePath.lastIndexOf('\\');
    return filePath.substring(lastIndex + 1, filePath.length);
  }

    /**
     * This method is used to parse the html template for the components with templateUrl property
     * @param filePath of the html template
     * @return true, if parsed html is marked for tracking, otherwise, false
     */
  static async parseExternalHTMLFile (fileName: string, workspace: any) {
    let templateString: any;
        // Get the html file and parse its contents for mezzurite markings
    let files: any = await MezzuriteUtils.searchWorkspace(workspace, '**/' + fileName, ExtensionConstants.pathForNodeModules);
    if (files[0] && files[0].fsPath) {
      templateString = MezzuriteUtils.readFileFromWorkspace(files[0].fsPath, 'utf8');
    }
    return MezzuriteUtils.verifyComponentMarking(templateString);
  }

    /**
     * This method creates an output object to be displayed as results
     * @param list of components
     * @param list of modules
     * @return output object
     */
  static createOutputObject (listOfComponents: any, listOfModules: any) {
    let outputObj: any = {};
    outputObj['listOfComponents'] = listOfComponents;
    outputObj['listOfModules'] = listOfModules;
    return outputObj;
  }

}
