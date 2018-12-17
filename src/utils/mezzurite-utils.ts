import * as fs from "fs";

export class MezzuriteUtils {

    constructor(
    ) { }

    /**
     * This method search for Mezzurite-framework dependency in node_modules/mezzurite-framework's Package.json file
     * @param workspace is the current workspace in the vs code editor
     * @param includePatterns is the path pattern which needs to searched
     * @param excludePattern is the path pattern which should be excluded from search
     * @return Return the arrays of files found in the current workspace
     */
    static async searchWorkspace(workspace: any, includePatterns: any, excludePattern: any){
        try{
            return await workspace.findFiles(includePatterns, excludePattern);
        }catch(err){
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
    static readFileFromWorkspace(filePath: string, encodingType: string){
        let data: any;
        try{
            data = fs.readFileSync(filePath, encodingType);
        }
        catch(err)
        {
            if (err){
                console.log('File not found at the following path:-' + filePath);
                throw err;
            } 
        }
        return data;
    }

}