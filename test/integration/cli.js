import { assert } from 'chai';
import { single } from '../../src/app/cli.js';

describe('cli.js', function() {
  this.timeout(10000);

  it('skat-davies', async function() {
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

  it('burden', async function() {
    const args = {
      cov: 'test/integration/data/gene.DUXAP8.cov.assoc.gz',
      score: 'test/integration/data/gene.DUXAP8.scores.assoc.gz',
      mask: 'test/integration/data/gene.DUXAP8.mask.tab',
      test: 'burden',
      group: null,
      silent: true
    };

    const result = await single(args);
    assert(result.results.length === 1);
    assert.closeTo(result.results[0].pvalue,0.7141704,0.001);
  });

  it('vt', async function() {
    const args = {
      cov: 'test/integration/data/gene.DUXAP8.cov.assoc.gz',
      score: 'test/integration/data/gene.DUXAP8.scores.assoc.gz',
      mask: 'test/integration/data/gene.DUXAP8.mask.tab',
      test: 'vt',
      group: null,
      silent: true
    };

    const result = await single(args);
    assert(result.results.length === 1);
    assert.closeTo(result.results[0].pvalue,0.878379,0.001);
  });

  it('skat-o', async function() {
    const args = {
      cov: 'test/integration/data/gene.DUXAP8.cov.assoc.gz',
      score: 'test/integration/data/gene.DUXAP8.scores.assoc.gz',
      mask: 'test/integration/data/gene.DUXAP8.mask.tab',
      test: 'skato',
      group: null,
      silent: true
    };

    const result = await single(args);
    assert(result.results.length === 1);
    assert.closeTo(result.results[0].pvalue,0.836389,0.001);
  });

});
