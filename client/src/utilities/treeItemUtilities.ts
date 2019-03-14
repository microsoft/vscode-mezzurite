import { join } from 'path';

import MezzuriteComponent from '../models/MezzuriteComponent';

function generateDescription (fulfilled: boolean) {
  let description = null;

  if (fulfilled != null) {
    if (fulfilled) {
      description = 'Tracked';
    } else {
      description = 'Not Tracked';
    }
  }

  return description;
}

function generateFulfilled (component: MezzuriteComponent): boolean {
  let fulfilled = null;

  if (component != null) {
    if (Object.keys(component.checks).length > 0) {
      fulfilled = Object.keys(component.checks)
        .map((key: string) => component.checks[key])
        .reduce((previousValue: boolean, currentValue: boolean) => {
          return previousValue && currentValue;
        });
    } else {
      fulfilled = true;
    }
  }

  return fulfilled;
}

function generateIconPath (componentType: string, fulfilled: boolean, rootPath: string): string {
  let iconPath = null;

  if (componentType != null && fulfilled != null && rootPath != null) {
    let iconKind = '';

    if (!fulfilled) {
      iconKind = 'Light';
    }

    const iconType = componentType + iconKind;
    iconPath = join(rootPath, 'client', 'res', 'icons', `${iconType}.svg`);
  }

  return iconPath;
}

export {
  generateDescription,
  generateFulfilled,
  generateIconPath
};
