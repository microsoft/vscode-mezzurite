import helpers from './helpers';

function getComponentType (fileContents: string): string {
  let componentType = null;

  if (helpers.isNgComponent(fileContents)) {
    componentType = 'ngComponent';
  } else if (helpers.isNgModule(fileContents)) {
    componentType = 'ngModule';
  } else if (helpers.isReact(fileContents)) {
    componentType = 'react';
  }

  return componentType;
}

export default getComponentType;
