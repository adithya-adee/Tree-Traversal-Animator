import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateAngle,
  isValidValue,
  deepClone,
  getTreeStatistics,
} from '../src/logic/utils';

describe('utils', () => {
  it('calculateDistance works for simple points', () => {
    expect(calculateDistance(0, 0, 3, 4)).toBe(5);
  });

  it('calculateAngle returns atan2 angle', () => {
    expect(calculateAngle(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);
  });

  it('isValidValue validates -999..999 inclusive', () => {
    expect(isValidValue('0')).toBe(true);
    expect(isValidValue('-999')).toBe(true);
    expect(isValidValue('999')).toBe(true);
    expect(isValidValue('1000')).toBe(false);
    expect(isValidValue('abc')).toBe(false);
  });

  it('deepClone handles nested objects and arrays', () => {
    const original = { a: [1, { b: 2 }], c: new Date(1700000000000) };
    const cloned = deepClone(original);
    expect(cloned).not.toBe(original);
    expect(cloned.a).not.toBe(original.a);
    expect(cloned.a[1]).not.toBe(original.a[1]);
    expect(cloned.c.getTime()).toBe(original.c.getTime());
  });

  it('getTreeStatistics returns defaults for empty', () => {
    expect(getTreeStatistics(null)).toEqual({
      nodeCount: 0,
      height: 0,
      balance: 0,
    });
  });
});
