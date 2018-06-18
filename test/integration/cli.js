import { assert } from 'chai';
import { single } from '../../src/app/cli.js';

describe('cli.js', function() {
  it('should work', async function() {
    const args = {
      cov: 'test/integration/data/gene.DUXAP8.cov.assoc.gz',
      score: 'test/integration/data/gene.DUXAP8.scores.assoc.gz',
      mask: 'test/integration/data/gene.DUXAP8.mask.tab',
      test: 'skat-davies',
      group: null,
      silent: true
    };

    const result = await single(args);
    assert(result.results.length === 1);
    assert.closeTo(result.results[0].pvalue,8.11e-1,0.001);
  });
});