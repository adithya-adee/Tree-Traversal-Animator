import { describe, it, expect } from 'vitest';
import BST from '../src/logic/tree';
import cases from '../test-cases/cases.json';

describe('BST JSON cases parity with CLI', () => {
  it(`runs ${cases.length} cases`, () => {
    expect(Array.isArray(cases)).toBe(true);
    expect(cases.length).toBeGreaterThanOrEqual(15);
  });

  cases.forEach((testCase) => {
    it(testCase.name, () => {
      const bst = new BST();
      testCase.steps.forEach((step) => {
        const [op, ...args] = step;
        if (op === 'insert') bst.insert(args[0]);
        else if (op === 'delete') bst.delete(args[0]);
        else if (op === 'search') bst.search(args[0]);
      });

      const expectSpec = testCase.expect;
      let output;
      if (expectSpec.type === 'inorder') {
        output = bst.inorderTraversal().result;
      } else if (expectSpec.type === 'preorder') {
        output = bst.preorderTraversal().result;
      } else if (expectSpec.type === 'postorder') {
        output = bst.postorderTraversal().result;
      } else if (expectSpec.type === 'search') {
        output = bst.search(expectSpec.target).found;
      } else {
        throw new Error(`Unknown expect type: ${expectSpec.type}`);
      }

      expect(output).toEqual(expectSpec.value);
    });
  });
});
