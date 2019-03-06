import { WorkspaceFolder } from 'vscode-languageserver';
import extractSourceFiles from './extractSourceFiles';

function combineWorkspaceFolders (folders: WorkspaceFolder[]): string[] {
  let filePaths: string[] = [];

  if (folders != null && folders.length > 0) {
    folders.forEach((folder: WorkspaceFolder): void => {
      if (folder != null) {
        const folderFilePaths = extractSourceFiles(folder.uri)
          .filter((file: string): boolean => {
            return file != null;
          });
        filePaths = [ ...filePaths, ...folderFilePaths ];
      }
    });
  }

  return filePaths;
}

export default combineWorkspaceFolders;
