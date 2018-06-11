import fs from 'fs';

import { assert } from 'chai';
import { _PortalGroupHelper, _PortalVariantsHelper, parsePortalJSON, PortalTestRunner } from '../../src/app/helpers';
import { SkatTest, ZegginiBurdenTest } from '../../src/app/stats';

describe('In-browser calculation workflow', function () {
  before(function () {
    let jsonRaw = fs.readFileSync('test/integration/scorecov.json');
    this.json_data = JSON.parse(jsonRaw).data;
    [ this.groups, this.variants ] = parsePortalJSON(this.json_data);
  });

  it('can go from covariance JSON to results', function () {
    // TODO: DRY with PortalTestRunner unit tests
    const runner = new PortalTestRunner(this.groups, this.variants, ['skat']);

    const results = runner.run();

    const expected_count = this.groups.data.length * runner._tests.length;
    assert.equal(results.length, expected_count);
    assert.hasAllKeys(results[0], ['groupType', 'group', 'mask', 'variants', 'test', 'pvalue', 'stat'] )
  });

  it('should match expected burden p-value for HIC2', function() {
    const runner = new PortalTestRunner(this.groups, this.variants);
    const testGroup = this.groups.getOne('GENCODE-AF01', 'ENSG00000169635');
    const results = runner._runOne(new ZegginiBurdenTest(), testGroup);
    assert.closeTo(results.pvalue, 0.42913956, 0.001);
  });

  it('should match expected skat p-value for HIC2', function() {
    const runner = new PortalTestRunner(this.groups, this.variants);
    const testGroup = this.groups.getOne('GENCODE-AF01', 'ENSG00000169635');
    const results = runner._runOne(new SkatTest(), testGroup);
    assert.closeTo(results.pvalue, 0.765, 0.001);
  });
});

describe('Precomputed results workflow', function () {
  beforeEach(function () {
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
    const [ groupResults, variants ] = parsePortalJSON(this.json_data);

    const one_result = groupResults.data[0];
    const one_group = groupResults.getOne(one_result.mask, one_result.group);
    const variant_data = variants.getGroupVariants(one_group.variants);

    assert.equal(one_group.variants.length, variant_data.length, 'Fetched variant subset appropriate to this group');
    assert.isBelow(one_group.variants.length, variants.data.length, 'Did not fetch all variant data');
  });
});
