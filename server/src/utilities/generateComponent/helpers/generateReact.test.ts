import { join } from 'path';
import Project from 'ts-morph';

import generateReact from './generateReact';

describe('generateReact.ts', () => {
  const project = new Project({
    addFilesFromTsConfig: false
  });

  it('should generate a Mezzurite component for a react component written in javascript', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactInstrumentedJs.js');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: true
        },
        filePath: filePath,
        name: 'ReactInstrumented',
        type: 'react'
      });
  });

  it('should generate a Mezzurite component for a react component written in jsx', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactInstrumentedJsx.jsx');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: true
        },
        filePath: filePath,
        name: 'ReactInstrumented',
        type: 'react'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component for a react component written in typescript', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactInstrumentedTs.ts');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: true
        },
        filePath: filePath,
        name: 'ReactInstrumented',
        type: 'react'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component for a react component written in tsx', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactInstrumentedTsx.tsx');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: true
        },
        filePath: filePath,
        name: 'ReactInstrumented',
        type: 'react'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component for a react component that has not been instrumented', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactNotInstrumented.js');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: false
        },
        filePath: filePath,
        name: 'ReactNotInstrumented',
        type: 'react'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component for a react redux component', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactRedux.js');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: false
        },
        filePath: filePath,
        name: 'ReactRedux',
        type: 'react'
      });
    project.removeSourceFile(sourceFile);
  });

  it('should generate a Mezzurite component for a component with parentheses surrounding the export', () => {
    const filePath = join('.', 'server', 'src', 'utilities', 'generateComponent', 'helpers', '__mocks__', 'reactNotInstrumentedParentheses.js');
    const sourceFile = project.addExistingSourceFile(filePath);
    expect(generateReact(filePath, sourceFile))
      .toMatchObject({
        checks: {
          hasWithMezzurite: false
        },
        filePath: filePath,
        name: 'ReactNotInstrumentedParentheses',
        type: 'react'
      });
    project.removeSourceFile(sourceFile);
  });
});
