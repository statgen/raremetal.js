//import { pchisq } from '../../src/app/rstats.js';
require("babel-register");
const { pchisq } = require("../../src/app/rstats.js");
const { assert } = require("chai");

describe('rstats.js', function() {
  describe('pchisq()', function() {
    it('should match expected values from d-p-q-r-tests', function() {
      // Line 163
      let xB = [2000,1e6,1e50,Infinity];
      for (let df of [0.1,1,10]) {
        for (let ncp of [0,1,10,100]) {
          for (let x of xB) {
            assert.equal(pchisq(x,df,ncp),1,`parameters were: x=${x}, df=${df}, ncp=${ncp}`);
          }
        }
      }
    });
  });
});
