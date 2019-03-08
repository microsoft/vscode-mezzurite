import { SourceFile } from 'ts-morph';

import MezzuriteComponent from '../../models/MezzuriteComponent';
import helpers from './helpers';

function generateComponent (componentType: string, filePath: string, sourceFile: SourceFile): MezzuriteComponent {
  let component = null;

  if (componentType != null && filePath != null && sourceFile != null) {
    if (componentType === 'ngComponent') {
      component = helpers.generateNgComponent(filePath, sourceFile);
    } else if (componentType === 'ngModule') {
      component = helpers.generateNgModule(filePath, sourceFile);
    } else if (componentType === 'react') {
      component = helpers.generateReact(filePath, sourceFile);
    }
  }

  return component;
}

export default generateComponent;
