import { join } from 'path';

import { generateIconPath, generateDescription, generateFulfilled } from './treeItemUtilities';
import MezzuriteComponent from '../models/MezzuriteComponent';

describe('treeItemUtilities.ts', () => {
  describe('generateDescription', () => {
    it('should return null when fulfilled is null', () => {
      expect(generateDescription(null)).toBeNull();
    });

    it('should return Tracked when fulfilled is true', () => {
      expect(generateDescription(true)).toBe('Tracked');
    });

    it('should return Not Tracked when fulfilled is false', () => {
      expect(generateDescription(false)).toBe('Not Tracked');
    });
  });

  describe('generateFulfilled', () => {
    it('should return null when component is null', () => {
      expect(generateFulfilled(null)).toBeNull();
    });

    it('should return true when all the checks in component are true', () => {
      const component: MezzuriteComponent = {
        checks: {
          isTested: true,
          isRouted: true
        },
        filePath: 'filePath',
        name: 'name',
        type: 'type'
      };
      expect(generateFulfilled(component)).toBeTruthy();
    });

    it('should return false when all the checks in component are false', () => {
      const component: MezzuriteComponent = {
        checks: {
          isTested: false,
          isRouted: false
        },
        filePath: 'filePath',
        name: 'name',
        type: 'type'
      };
      expect(generateFulfilled(component)).toBeFalsy();
    });

    it('should return false when some of the checks in component are false', () => {
      const component: MezzuriteComponent = {
        checks: {
          isTested: false,
          isRouted: true
        },
        filePath: 'filePath',
        name: 'name',
        type: 'type'
      };
      expect(generateFulfilled(component)).toBeFalsy();
    });

    it('should return true when there are no checks', () => {
      const component: MezzuriteComponent = {
        checks: {
        },
        filePath: 'filePath',
        name: 'name',
        type: 'type'
      };
      expect(generateFulfilled(component)).toBeTruthy();
    });
  });

  describe('generateIconPath', () => {
    it('should return null when componentType is null', () => {
      expect(generateIconPath(null, false, 'rootPath')).toBeNull();
    });

    it('should return null when fulfilled is null', () => {
      expect(generateIconPath('componentType', null, 'rootPath')).toBeNull();
    });

    it('should return null when rootPath is null', () => {
      expect(generateIconPath('componentType', false, null)).toBeNull();
    });

    it('should return the icon path when fulfilled is true', () => {
      expect(generateIconPath('componentType', true, 'rootPath'))
      .toBe(join('rootPath', 'client', 'res', 'icons', 'componentType.svg'));
    });

    it('should return the light icon path when fulfilled is false', () => {
      expect(generateIconPath('componentType', false, 'rootPath'))
      .toBe(join('rootPath', 'client', 'res', 'icons', 'componentTypeLight.svg'));
    });
  });
});
