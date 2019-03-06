import getComponentType from '.';
import helpers from './helpers';

describe('index.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when the input does not return true for any framework', () => {
    helpers.isNgComponent = jest.fn(() => false);
    helpers.isNgModule = jest.fn(() => false);
    helpers.isReact = jest.fn(() => false);
    const framework = getComponentType('test');
    expect(framework).toBeNull();
  });

  it('should return ngComponent when isNgComponent is true', () => {
    helpers.isNgComponent = jest.fn(() => true);
    helpers.isNgModule = jest.fn(() => false);
    helpers.isReact = jest.fn(() => false);
    const framework = getComponentType('test');
    expect(framework).toBe('ngComponent');
  });

  it('should return ngModule when isNgModule is true', () => {
    helpers.isNgComponent = jest.fn(() => false);
    helpers.isNgModule = jest.fn(() => true);
    helpers.isReact = jest.fn(() => false);
    const framework = getComponentType('test');
    expect(framework).toBe('ngModule');
  });

  it('should return react when isReact is true', () => {
    helpers.isNgComponent = jest.fn(() => false);
    helpers.isNgModule = jest.fn(() => false);
    helpers.isReact = jest.fn(() => true);
    const framework = getComponentType('test');
    expect(framework).toBe('react');
  });
});
