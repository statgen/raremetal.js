import fs from 'fs';

import { assert } from 'chai';
import { _PortalGroupHelper, _PortalVariantsHelper, parsePortalJSON, TestRunner } from '../../src/app/helpers2';
import { SkatTest, ZegginiBurdenTest } from '../../src/app/stats2';



describe('helpers.js', function () {
  before(function () {
    // Load example JSON of portal response from requesting covariance in a region
    let jsonRaw = fs.readFileSync('test/integration/scorecov.json');
    this.json_data = JSON.parse(jsonRaw).data;
  });

  describe('parsePortalJSON', function () {
    it('should return helper objects for variants and groups', function () {
      const [ groups, variants ] = parsePortalJSON({
        variants: [],
        groups: []
      });
      assert.instanceOf(variants, _PortalVariantsHelper, 'Received a variants helper');
      assert.instanceOf(groups, _PortalGroupHelper, 'Received a group helper');
    });
  });

  describe('PortalVariantsHelper', function () {
    // TODO: All these tests will break when sample json updated; this is VERY fictional data
    it('is created from json variants data', function () {
      const inst = new _PortalVariantsHelper(this.json_data.variants);
      assert.deepEqual(inst.data, this.json_data.variants);
    });

    it('can fetch a subset of scores', function () {
      const inst = new _PortalVariantsHelper(this.json_data.variants);
      const scores = inst.getScores(['22:21581838_G/A']);
      assert.equal(scores.length, 1);
      assert.deepEqual(scores, [-8.70912])
    });

    // TODO: test sign flipping and effect allele determination
  });

  describe('PortalGroupHelper', function () {
    beforeEach(function () {
      this.inst = new _PortalGroupHelper(this.json_data.groups);
    });

    it('is created from json groups data', function () {
      assert.deepEqual(this.inst.data, this.json_data.groups);
    });

    it('can fetch a subset of masks', function () {
      const groups = this.inst.byMask('GENCODE-AF01');
      assert.equal(groups.data.length, 17);
    });

    describe('covariance test parsing', function () {
      // TODO: important- add tests around covariance matrix generation (and sign flipping if ONE, the OTHER, or BOTH are not the lower freq allele. Also test when certain numbers don't make sense or arrays don't match lengths
      it('can reformat an array into a covariance matrix', function () {
        const one_group =  {
          variants: ['1', '2', '3'],
          covariance: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
          nSamples: 10
        };
        const covar = this.inst.makeCovarianceMatrix(one_group, [0.1, 0.1, 0.1]);
        assert.deepEqual(
          covar,
          [
            [ 1, 2, 3 ],
            [ 2, 4, 5 ],
            [ 3, 5, 6 ]
          ]
        );
      });
    });
  });

  describe('TestRunner', function () {
    before(function () {
      [ this.groups, this.variants ] = parsePortalJSON(this.json_data);
    });

    beforeEach(function () {
      this.inst = new TestRunner(this.groups, this.variants, ['skat']);
    });

    it('creates two test instances when given test names', function () {
      const inst = new TestRunner(this.groups, this.variants, ['zegginiBurden', 'skat']);
      assert.equal(inst._tests.length, 2);

      assert.instanceOf(inst._tests[0], ZegginiBurdenTest, 'Created a burden test');
      assert.instanceOf(inst._tests[1], SkatTest, 'Created a skat test');
    });

    it('builds tests from either names or instances', function() {
      const skat = new SkatTest();
      const inst = new TestRunner(this.groups, this.variants, ['zegginiBurden', skat]);
      assert.equal(inst._tests.length, 2);
      assert.instanceOf(inst._tests[0], ZegginiBurdenTest, 'Created a burden test');
      assert.instanceOf(inst._tests[1], SkatTest, 'Created a skat test');
    });

    it('cannot create tests of an unknown type', function () {
      assert.throws(
        () => { new TestRunner(this.groups, this.variants, ['nonexistent']); },
        /Cannot make unknown test type/,
        'Fails if given invalid test name'
      );

      assert.throws(
        () => { new TestRunner(this.groups, this.variants, [42]); },
        /Must specify test as name or instance/,
        'Fails if test type can not be resolved'
      );

    });

    it('combines the results from multiple tests', function () {
      const results = this.inst.run();
      const expected_count = this.groups.data.length * this.inst._tests.length;
      assert.equal(results.length, expected_count);
    });

    it('can represent results payload as portal-format precomputed results JSON', function () {
      const results = this.inst.toJSON();
      assert.hasAllKeys(results.data, ['results', 'groups', 'variants'])
    });
  });

});

