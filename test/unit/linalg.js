import { cholesky } from '../../src/app/linalg.js';
import { assert } from 'chai';
import numeric from '../../src/lib/numeric-1.2.6';

describe('linalg.js', function() {
  describe('cholesky', function() {
    it('simple case', function() {
      const A = [[4, 12, -16], [12, 37, -43], [-16, -43, 98]];
      const G = cholesky(A);
      assert.deepStrictEqual(G, [[2, 0, 0], [6, 1, 0], [-8, 5, 3]]);
    });

    it('test when not perfect integers', function() {
      const A = [[8, 2, 3], [2, 9, 3], [3, 3, 6]];
      const G = cholesky(A);
      const reA = numeric.dot(G, numeric.transpose(G));
      assert.closeTo(reA[0][0], 8, 1e-6);
    });
  });
});
