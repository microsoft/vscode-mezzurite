import { readFile } from 'fs';
import Project from 'ts-morph';

import MezzuriteComponent from '../../models/MezzuriteComponent';
import getComponentType from '../getComponentType';
import generateComponent from '../generateComponent';

function processFile (filePath: string, project: Project): Promise<MezzuriteComponent> {
  return new Promise((resolve: Function, reject: Function) => {
    if (filePath != null && project != null) {
      readFile(filePath, (error: Error, data: Buffer) => {
        if (error == null) {
          let componentData: MezzuriteComponent = null;
          const componentType = getComponentType(data.toString());
          if (componentType != null) {
            const sourceFile = project.addExistingSourceFile(filePath);
            componentData = generateComponent(componentType, filePath, sourceFile);
            project.removeSourceFile(sourceFile);
          }
          resolve(componentData);
        } else {
          reject(error);
        }
      });
    } else {
      reject(new Error('The file path or project cannot be null.'));
    }
  });
}

export default processFile;
