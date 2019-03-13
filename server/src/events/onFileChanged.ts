import { join } from 'path';
import Project from 'ts-morph';

import MezzuriteComponent from '../models/MezzuriteComponent';
import processFile from '../utilities/processFile';

function onFileChanged (components: MezzuriteComponent[], filePath: string, project: Project): Promise<MezzuriteComponent[]> {
  let updatedComponents: MezzuriteComponent[] = null;
  return processFile(filePath, project)
    .then((changedComponent: MezzuriteComponent) => {
      if (changedComponent != null) {
        updatedComponents = components.map((component: MezzuriteComponent) => {
          if (join(changedComponent.filePath) === join(component.filePath)) {
            return changedComponent;
          } else {
            return component;
          }
        });
      }
      return updatedComponents;
    })
    .catch((error: Error) => {
      throw(error);
    });
}

export default onFileChanged;
