import fs from 'fs';

import { assert } from 'chai';
import { _PortalGroupHelper, _PortalVariantsHelper, parsePortalJSON, TestRunner } from '../../src/app/helpers2';

describe('In-browser calculation workflow', function () {
  before(function () {
    let jsonRaw = fs.readFileSync('test/integration/scorecov.json');
    this.json_data = JSON.parse(jsonRaw).data;
  });

  it('can go from covariance JSON to results', function () {
    // TODO: DRY with TestRunner unit tests
    const [ groups, variants ] = parsePortalJSON(this.json_data);
    const runner = new TestRunner(groups, variants, ['skat']);

    const results = runner.run();

    const expected_count = groups.data.length * runner._tests.length;
    assert.equal(results.length, expected_count);
    assert.hasAllKeys(results[0], ['group', 'mask', 'test', 'pvalue', 'stat'] )
  });
});

describe('Precomputed results workflow', function () {
  before(function () {
    let jsonRaw = fs.readFileSync('test/integration/precomputed.json');
    this.json_data = JSON.parse(jsonRaw).data;
  });

  it('can make helpers from parsed result data', function () {
    const [ groups, variants ] = parsePortalJSON(this.json_data);
    assert.instanceOf(variants, _PortalVariantsHelper, 'Received a variants helper');
    assert.instanceOf(groups, _PortalGroupHelper, 'Received a group helper');

    assert.deepEqual(variants.data, this.json_data.variants, 'Variants loaded correctly');
    assert.deepEqual(groups.data, this.json_data.groups, 'Groups loaded correctly');
  });

  it('can use helpers to explore results', function () {
    // At the moment, there is no helper for results- we just read the parsed data directly. Helpers can be used to
    //  connect back to the mask and variant data.
    const results = this.json_data.results;
    const [ groups, variants ] = parsePortalJSON(this.json_data);

    const one_result = results[0];
    const one_group = groups.getOne(one_result.mask, one_result.group);
    const variant_data = variants.getGroupVariants(one_group.variants);

    assert.equal(one_group.variants.length, variant_data.length, 'Fetched variant subset appropriate to this group');
    assert.isBelow(one_group.variants.length, variants.data.length, 'Did not fetch all variant data');
  });
});
