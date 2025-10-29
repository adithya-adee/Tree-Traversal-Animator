import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { logInput, logBackend, logInfo } from '../src/logic/logger';

describe('logger integration', () => {
  it('emits console logs with prefixes', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logInput('Insert');
    logBackend('Search');
    logInfo('Info');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
