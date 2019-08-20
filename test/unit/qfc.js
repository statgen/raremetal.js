/**
 * These are the original test values supplied with the qfc.c source code.
 */

import * as qfc from '../../src/app/qfc.js';
import { assert } from 'chai';

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

        it('should match expected values for parameter set ' + count, function() {
          let computedQf = result[0];
          let expectedQf = testCase['qfval'];
          assert.closeTo(computedQf,expectedQf,0.001);

          let ifault = result[1];
          assert.equal(ifault,0);

          let computedTrace = result[2];
          let actualTrace = testCase['trace'];
          for (let i = 0; i < 6; i++) {
            assert.closeTo(actualTrace[i],computedTrace[i],0.001);
          }
        });

        count += 1;
      }
    });

    describe('Edge cases found from testing genome-wide', function() {
      it('case 1', function() {
        let lambdas = [ 164121.3743475122,
          14747.802766005561,
          14747.076530665458,
          14721.947692685235 ];
        let nc1 = [
          0,
          0,
          0,
          0
        ];
        let n1 = [
          1,
          1,
          1,
          1
        ];
        let n = 4;
        let sigma = 0;
        let acc = 0.0001;
        let lim = 10000;
        let qstat = 48692.70492647851;
        let res = qfc.qf(lambdas, nc1, n1, n, sigma, qstat, lim, acc);
        assert.closeTo(res[0],0.1891,0.001)
      })
    });

    describe('Problematic case arising from large number of lambdas', function() {
      it("should return correct value", function() {
        let lambdas = [4577.59249381509, 2105.83403243373, 2025.25285788052, 1958.01092318006, 1928.9385475074, 1866.65371492922, 1840.91347210187, 1825.9890328526, 1778.43537170704, 1764.45106675294, 1701.1496370064, 1680.10693988725, 1610.69672591249, 1583.78352877446, 1562.25130426955, 1552.67144804587, 1525.08336870507, 1501.5621406919, 1495.57010141851, 1481.00999499156, 1435.66643412819, 1392.15312343179, 1368.17149283644, 1362.62984034384, 1308.53088150497, 1295.41982324547, 1277.73010752401, 1249.91079552742, 1213.05366431098, 1197.53190251801, 1187.85343658489, 1179.89546815409, 1163.66976353849, 1129.43703350512, 1113.27979670667, 1106.22963951975, 1083.4281603999, 1078.48883139525, 1073.34328609085, 1045.14213169261, 1023.5617606675, 1017.11332503783, 1005.56592839705, 979.738251134124, 954.673886077792, 937.851351412927, 920.258916256873, 903.715243662471, 897.939176620173, 886.176938368837, 872.556708177416, 862.843089188904, 851.435275520449, 828.414830127046, 803.200117612469, 772.605421151822, 768.404673834427, 751.850743356835, 746.105166446403, 734.930912818019, 728.436140767676, 716.222960925669, 699.843410415928, 694.245153688204, 677.403250695003, 651.065958088806, 646.319251874481, 622.070324868079, 612.359562904362, 597.566584720172, 579.109249300097, 558.541930824777, 538.046552145954, 525.803655674488, 513.794573507203, 504.41212678306, 475.358383841448, 467.777784783001, 450.010720816003, 435.739958716875, 427.602627161526, 408.785672720083];
        let nc1 = new Array(lambdas.length).fill(0);
        let n1 = new Array(lambdas.length).fill(1);
        let n = lambdas.length;
        let sigma = 0;
        let lim = 10000;
        let acc = 1e-6;
        let qstat = 257095;
        let res = qfc.qf(lambdas, nc1, n1, n, sigma, qstat, lim, acc);
        assert.closeTo(1 - res[0], 1.847445e-08, 1e-4);
      });
    });
  });
});

