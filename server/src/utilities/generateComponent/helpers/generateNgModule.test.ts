import { join } from 'path';
import Project from 'ts-morph';

import generateNgModule from './generateNgModule';

describe('generateNgModule.ts', () => {
  const project = new Project({
    addFilesFromTsConfig: false
  });

  it('should return null when filePath is null', () => {
    expect(generateNgModule(null, null)).toBeNull();
  });

  it('should return null when sourceFile is null', () => {
    expect(generateNgModule('filePath', null)).toBeNull();
  });

  it('should generate a Mezzurite component from an ngModule file passing all the checks', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'ngModuleInstrumented.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateNgModule(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasAngularPerfModule: true,
          hasImport: true,
          hasRoutingServiceStart: true
        },
        filePath,
        name: 'InstrumentedModule',
        type: 'ngModule'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component from an ngModule file passing none of the checks', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'ngModuleNotInstrumented.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateNgModule(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasAngularPerfModule: false,
          hasImport: false,
          hasRoutingServiceStart: false
        },
        filePath,
        name: 'NotInstrumentedModule',
        type: 'ngModule'
      });
    project.removeSourceFile(sourceFile);
  });
});
