import isNgComponent from './isNgComponent';

describe('isAngular.ts', () => {
  it('should return false when fileContents is null', () => {
    expect(isNgComponent(null)).toBeFalsy();
  });

  it('should return false when fileContents does not contain @Component or @Module', () => {
    expect(isNgComponent('test')).toBeFalsy();
  });

  it('should return true when fileContents contains @Component', () => {
    expect(isNgComponent('@Component')).toBeTruthy();
  });
});
