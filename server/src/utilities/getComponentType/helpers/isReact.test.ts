import isReact from './isReact';

describe('isReact.ts', () => {
  it('should return false when fileContents is null', () => {
    expect(isReact(null)).toBeFalsy();
  });

  it('should return false when fileContents does not contain the React import from react', () => {
    expect(isReact(`import { Component } from 'react'`)).toBeFalsy();
  });

  it('should return true when fileContents contains the React import from react', () => {
    expect(isReact(`import React from 'react'`)).toBeTruthy();
  });

  it('should return true when fileContents contains the React import last from react', () => {
    expect(isReact(`import { Component }, React from 'react'`)).toBeTruthy();
  });

  it('should return true when fileContents contains the React not last from react', () => {
    expect(isReact(`import React, { Component } from 'react'`)).toBeTruthy();
  });
});
