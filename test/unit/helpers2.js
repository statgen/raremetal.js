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
    })
  });

  describe('PortalVariantsHelper', function () {
    // TODO: All these tests will break when sample json updated; this is VERY fictional data
    it('is created from json variants data', function () {
      const inst = new _PortalVariantsHelper(this.json_data.variants);
      assert.deepEqual(inst.variants, this.json_data.variants);
    });

    it('can fetch a subset of scores', function () {
      const inst = new _PortalVariantsHelper(this.json_data.variants);
      const scores = inst.getScores(['2:21228643_G/A']);
      assert.equal(scores.length, 1);
      assert.deepEqual(scores, [0.2])
    });

    // TODO: test sign flipping and effect allele determination
  });

  describe('PortalGroupHelper', function () {
    beforeEach(function () {
      this.inst = new _PortalGroupHelper(this.json_data.groups);
    });

    it('is created from json groups data', function () {
      assert.deepEqual(this.inst.groups, this.json_data.groups);
    });

    it('can fetch a subset of masks', function () {
      const groups = this.inst.byMask('PTV');
      assert.equal(groups.groups.length, 2);
    });

    describe('covariance test parsing', function () {
      // TODO: important- add tests around covariance matrix generation (and sign flipping if ONE, the OTHER, or BOTH are not the lower freq allele. Also test when certain numbers don't make sense or arrays don't match lengths
      it('can reformat an array into a covariance matrix', function () {
        const one_group = this.inst.groups[2];
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
      this.inst = new TestRunner(this.groups, this.variants);
    });

    //todo test creation with unknown test name/type
    it('creates two test instances when given test names', function () {
      const inst = new TestRunner(this.groups, this.variants, ['zegginiBurden', 'skat']);
      assert.equal(inst._tests.length, 2);

      assert.instanceOf(inst._tests[0], ZegginiBurdenTest, 'Created a burden test');
      assert.instanceOf(inst._tests[1], SkatTest, 'Created a skat test');
    });
  });

});

