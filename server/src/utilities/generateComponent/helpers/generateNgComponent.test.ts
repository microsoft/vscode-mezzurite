import { join } from 'path';
import Project from 'ts-morph';

import generateNgComponent from './generateNgComponent';

describe('generateNgComponent.ts', () => {
  const project = new Project({
    addFilesFromTsConfig: false
  });

  it('should return null when filePath is null', () => {
    expect(generateNgComponent(null, null)).toBeNull();
  });

  it('should return null when sourceFile is null', () => {
    expect(generateNgComponent('filePath', null)).toBeNull();
  });

  it('should generate a Mezzurite component from an ngModule file passing all the checks', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'ngComponentInstrumented.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateNgComponent(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasMezzuriteDirective: true
        },
        filePath,
        name: 'InstrumentedComponent',
        type: 'ngComponent'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component from an ngModule file not passing all the checks', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'ngComponentNotInstrumented.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateNgComponent(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasMezzuriteDirective: false
        },
        filePath,
        name: 'NotInstrumentedComponent',
        type: 'ngComponent'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component from an ngModule file using templateUrl passing all the checks', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'ngComponentTemplateUrlInstrumented.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateNgComponent(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasMezzuriteDirective: true
        },
        filePath,
        name: 'TemplateUrlInstrumentedComponent',
        type: 'ngComponent'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component from an ngModule file using templateUrl not passing all the checks', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'ngComponentTemplateUrlNotInstrumented.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateNgComponent(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasMezzuriteDirective: false
        },
        filePath,
        name: 'TemplateUrlInstrumentedComponent',
        type: 'ngComponent'
      });
    project.removeSourceFile(sourceFile);
  });
});
