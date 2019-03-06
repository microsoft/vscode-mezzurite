import { WorkspaceFolder } from 'vscode-languageserver';

import combineWorkspaceFolders from './combineWorkspaceFolders';
import * as extractSourceFiles from './extractSourceFiles';

describe('combineWorkspaceFolders.ts', () => {
  const folders: WorkspaceFolder[] = [
    {
      name: 'test',
      uri: 'test'
    },
    {
      name: 'test',
      uri: 'test'
    }
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array when folders is null', () => {
    expect(combineWorkspaceFolders(null)).toMatchObject([]);
  });

  it('should return an empty array when folders is an empty array', () => {
    expect(combineWorkspaceFolders([])).toMatchObject([]);
  });

  it('should ignore any folders which return null when extracting source files', () => {
    Object.defineProperty(extractSourceFiles, 'default', { value: jest.fn(() => [ null ]) });
    expect(combineWorkspaceFolders(folders)).toMatchObject([]);
  });

  it('should map the workspace folders into an array of paths', () => {
    Object.defineProperty(extractSourceFiles, 'default', { value: jest.fn(() => [ 'test', 'test' ]) });
    expect(combineWorkspaceFolders(folders)).toMatchObject([ 'test', 'test', 'test', 'test' ]);
  });
});
