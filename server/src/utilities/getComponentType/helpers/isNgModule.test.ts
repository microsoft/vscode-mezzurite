import isNgModule from './isNgModule';

describe('isAngular.ts', () => {
  it('should return false when fileContents is null', () => {
    expect(isNgModule(null)).toBeFalsy();
  });

  it('should return false when fileContents does not contain @Component or @Module', () => {
    expect(isNgModule('test')).toBeFalsy();
  });

  it('should return true when fileContents contains @Module', () => {
    expect(isNgModule('@NgModule')).toBeTruthy();
  });
});
