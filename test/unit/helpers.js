import fs from 'fs';

import { assert } from 'chai';
import { _PortalGroupHelper, _PortalVariantsHelper, parsePortalJSON, PortalTestRunner } from '../../src/app/helpers';
import { SkatTest, ZegginiBurdenTest } from '../../src/app/stats';


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
    it('is created from json variants data', function () {
      const inst = new _PortalVariantsHelper(this.json_data.variants);
      assert.deepEqual(inst.data, this.json_data.variants);
    });

    it('handles the case where altFreq > 0.5', function () {
      const variants = [{
        variant: '22:21576208_G/A',
        altFreq: 0.1,
        pvalue: 0.279888
      },
      {
        variant: '22:21581760_G/A',
        altFreq: 0.8,
        pvalue: 0.477434
      }];
      const variant_names = ['22:21576208_G/A', '22:21581760_G/A'];

      const helper = new _PortalVariantsHelper(variants);
      const parsed = helper.getGroupVariants(variant_names);

      assert.propertyVal(parsed[0], 'effectAllele', 'A');
      assert.propertyVal(parsed[0], 'effectFreq', 0.1, 'Alt allele is  minor allele');

      assert.propertyVal(parsed[1], 'effectAllele', 'G', 'Ref allele is  minor allele');
      assert.approximately(parsed[1]['effectFreq'], 0.2, 0.000001);

      assert.deepEqual(
        helper.isAltEffect(variant_names),
        [true, false],
        'Correctly identifies whether alt is effect allele'
      );
    });
  });

  describe('PortalGroupHelper', function () {
    beforeEach(function () {
      this.inst = new _PortalGroupHelper(this.json_data.groups);
    });

    it('is created from json groups data', function () {
      assert.deepEqual(this.inst.data, this.json_data.groups);
    });

    it('can fetch a subset of one mask', function () {
      const groups = this.inst.byMask(1);
      assert.equal(groups.data.length, 17);
    });

    it('can fetch a subset of several masks', function () {
      const groups = this.inst.byMask([1, 4]);
      assert.equal(groups.data.length, 20);
    });

    describe('covariance matrix parsing', function () {
      beforeEach(function () {
        this.one_group =  {
          variants: ['1', '2', '3'],
          covariance: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
          nSamples: 10
        };
      });

      it('can reformat an array into a covariance matrix', function () {
        const covar = this.inst.makeCovarianceMatrix(this.one_group, [true, true, true]);
        assert.deepEqual(
          covar,
          [
            [ 1, 2, 3 ],
            [ 2, 4, 5 ],
            [ 3, 5, 6 ]
          ]
        );
      });

      it('correctly handles sign flips on covariance elements', function () {
        const one_flip = [false, true, true];

        let covar = this.inst.makeCovarianceMatrix(this.one_group, one_flip);
        assert.deepEqual(
          covar,
          [
            [ 1, -2, -3 ],
            [ -2, 4, 5 ],
            [ -3, 5, 6 ]
          ],
          'Correctly handles a single variant sign flip'
        );

        const two_flips = [false, false, true];
        covar = this.inst.makeCovarianceMatrix(this.one_group, two_flips);
        assert.deepEqual(
          covar,
          [
            [ 1, 2, -3 ],
            [ 2, 4, -5 ],
            [ -3, -5, 6 ]
          ],
          'Correctly handles the case where two signs are flipped'
        );
      });
    });
  });

  describe('PortalTestRunner', function () {
    before(function () {
      [ this.groups, this.variants ] = parsePortalJSON(this.json_data);
    });

    beforeEach(function () {
      this.inst = new PortalTestRunner(this.groups, this.variants, ['skat']);
    });

    it('creates two test instances when given test names', function () {
      const inst = new PortalTestRunner(this.groups, this.variants, ['burden', 'skat']);
      assert.equal(inst._tests.length, 2);

      assert.instanceOf(inst._tests[0], ZegginiBurdenTest, 'Created a burden test');
      assert.instanceOf(inst._tests[1], SkatTest, 'Created a skat test');
    });

    it('builds tests from either names or instances', function() {
      const skat = new SkatTest();
      const inst = new PortalTestRunner(this.groups, this.variants, ['burden', skat]);
      assert.equal(inst._tests.length, 2);
      assert.instanceOf(inst._tests[0], ZegginiBurdenTest, 'Created a burden test');
      assert.instanceOf(inst._tests[1], SkatTest, 'Created a skat test');
    });

    it('cannot create tests of an unknown type', function () {
      assert.throws(
        () => { new PortalTestRunner(this.groups, this.variants, ['nonexistent']); },
        /Cannot make unknown test type/,
        'Fails if given invalid test name'
      );

      assert.throws(
        () => { new PortalTestRunner(this.groups, this.variants, [42]); },
        /Must specify test as name or instance/,
        'Fails if test type can not be resolved'
      );
    });

    it('combines the results from multiple tests', function () {
      return this.inst.run().then(results => {
        const expected_count = this.groups.data.length * this.inst._tests.length;
        assert.equal(results.length, expected_count);
      });
    });

    it('can represent results payload as portal-format precomputed results JSON', function () {
      return this.inst.toJSON().then(results => {
        assert.hasAllKeys(results.data, ['groups', 'variants']);
      });
    });
  });

});

