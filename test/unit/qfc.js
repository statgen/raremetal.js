/**
 * These are the original test values supplied with the qfc.c source code.
 */

const {assert} = require('chai');
const qfc = require('../../src/app/qfc.js');

describe('qfc.js', function() {
  describe('qf()', function() {
    describe('Davies\' test suite', function () { 
      let testJson = require('./qfc.json');
      let count = 0;
      for (var testCase of testJson) {
        var result = qfc.qf(
          testCase['lambda'],
          testCase['noncen'],
          testCase['df'],
          testCase['r'],
          testCase['sigma'],
          testCase['c'],
          testCase['lim'],
          testCase['acc']
        );

        it('should match expected qf value for parameter set ' + count, function() {
          let computedQf = result[0];
          let expectedQf = testCase['qfval'];
          assert.closeTo(computedQf,expectedQf,0.001);
        });

        it('should match ifault value for parameter set ' + count, function() {
          let ifault = result[1];
          assert.equal(ifault,0);
        });

        it('should match integration debug values for parameter set ' + count, function() {
          let computedTrace = result[2];
          let actualTrace = testCase['trace'];
          for (let i = 0; i < 6; i++) {
            assert.closeTo(actualTrace[i],computedTrace[i],0.001); 
          }
        });

        count += 1;
      }
    });
  });
});

