const globby = require('globby');
import { join } from 'path';

import extractSourceFiles from './extractSourceFiles';

describe('extractSourceFiles.ts', () => {
  beforeAll(() => {
    globby.sync = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not error out', () => {
    extractSourceFiles('test');
    expect(globby.sync).toHaveBeenLastCalledWith([ join('test', '**', '*.+(js|jsx|ts|tsx)'), join('!**', 'node_modules') ]);
  });

  it('should handle a Windows style path', () => {
    extractSourceFiles('file:///c:/some/windows/style/path');
    expect(globby.sync).toHaveBeenLastCalledWith([ join('/', 'some', 'windows', 'style', 'path', '**', '*.+(js|jsx|ts|tsx)'), join('!**', 'node_modules') ]);
  });

  it('should handle a Windows style path with an escaped colon', () => {
    extractSourceFiles('file:///c%3A/some/windows/style/path');
    expect(globby.sync).toHaveBeenLastCalledWith([ join('/', 'some', 'windows', 'style', 'path', '**', '*.+(js|jsx|ts|tsx)'), join('!**', 'node_modules') ]);
  });
});
