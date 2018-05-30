import fs from 'fs';
import { assert } from 'chai';

import { makeTests, AGGREGATION_TESTS, parsePortalJson } from '../../src/app/helpers';
import { ZegginiBurdenTest } from '../../src/app/stats';

describe('helpers.js', function () {
  describe('makeTests', function () {
    before(function () {
      // Load example JSON of portal response from requesting covariance in a region
      let jsonRaw = fs.readFileSync('test/integration/example.json');
      let json = JSON.parse(jsonRaw);
      this.scoreCov = parsePortalJson(json);

    });

    it('creates a container from test name', function () {
      Object.keys(AGGREGATION_TESTS).forEach(name => {
        const { constructor } = AGGREGATION_TESTS[name];
        const container = makeTests([name], this.scoreCov);
        assert.property(container.tests, name);
        assert.instanceOf(container.tests[name], constructor);
      });
    });

    it('will throw an error if the specified test is not in the registry', function () {
      assert.throws(()=> makeTests(['nonexistent'], {}));
    });

    it('can create a container with multiple tests', function () {
      // Do we need to address a particular result by name/ID later?
      const container = makeTests(['zegginiBurden', 'skat'], this.scoreCov);
      assert.equal(Object.keys(container.tests).length, 2);
    });

    it('creates a container from class instances', function() {
      const container = makeTests([new ZegginiBurdenTest()], this.scoreCov);
      const instance = container.getTest('zegginiBurden');
      assert.ok(instance);
      assert.instanceOf(instance, ZegginiBurdenTest)
    });

    it('will tell each test to run with all masks by default', function () {
      const container = makeTests(['zegginiBurden', 'skat'], this.scoreCov);
      const instance = container.getTest('zegginiBurden');
      assert.equal(instance._scorecov.length, Object.keys(this.scoreCov.scorecov).length);
    });

    it('has a mechanism to limit what masks are used for a given test', function () {
      const aMask = this.scoreCov.scorecov[ Object.keys(this.scoreCov.scorecov)[0] ];

      const container = makeTests([{ name: 'zegginiBurden' , mask: aMask.mask }], this.scoreCov);
      const instance_data = container.getTest('zegginiBurden')._scorecov;

      assert.notEqual(instance_data.length, 0, 'At least one mask was selected');
      assert.isAtMost(  // The sample data only contains one mask so filtering does not do much
        instance_data.length,
        Object.keys(this.scoreCov.scorecov).length,
        'Uses a limited set of masks'
      );
      assert.ok(instance_data.every(item => item.mask === aMask.mask), 'All masks match the specified option');
    });

    it('has a mechanism to limit what groups are used for a given test', function () {
      const aMask = this.scoreCov.scorecov[ Object.keys(this.scoreCov.scorecov)[0] ];

      const container = makeTests([{ name: 'zegginiBurden' , group: aMask.group }], this.scoreCov);
      const instance_data = container.getTest('zegginiBurden')._scorecov;

      assert.notEqual(instance_data.length, 0, 'At least one group was selected');

      assert.isAtMost(  // The sample data only contains one group so filtering does not do much
        instance_data.length,
        Object.keys(this.scoreCov).length,
        'Uses a limited set of groups'
      );
      assert.ok(instance_data.every(item => item.group === aMask.group), 'All groups match the specified option');
    });

    it('can filter by both masks and groups', function () {
      const aMask = this.scoreCov.scorecov[ Object.keys(this.scoreCov.scorecov)[0] ];

      const container = makeTests(
        [{ name: 'zegginiBurden' , mask: aMask.mask, group: aMask.group }],
        this.scoreCov
      );
      const instance_data = container.getTest('zegginiBurden')._scorecov;

      assert.equal(instance_data.length, 1, 'Exactly one mask-group combination is used');
      assert.ok((instance_data[0].mask === aMask.mask) && (instance_data[0].group === aMask.group));
    });

    it('can create multiple tests that mix filters and no filters', function () {
      const aMask = this.scoreCov.scorecov[ Object.keys(this.scoreCov.scorecov)[0] ];
      const container = makeTests(
        [
          'skat',
          { name: 'zegginiBurden' , mask: aMask.mask, group: aMask.group }
        ],
        this.scoreCov
      );
      assert.equal(Object.keys(container.tests).length, 2, 'Created two tests');
      assert.equal(container.getTest('skat')._scorecov.length, Object.keys(this.scoreCov.scorecov).length, 'Tests created without filters will run on all masks');
      assert.equal(container.getTest('zegginiBurden')._scorecov.length, 1, 'Tests created with filters will run on fewer masks');
    });

  });
});
