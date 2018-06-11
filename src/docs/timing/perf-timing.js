require("babel-register");
const { parsePortalJson } = require("../../app/helpers.js");
const { testBurden, testSkat, calcSkatWeights } = require("../../app/stats.js");
const fs = require("fs");
const Table = require("cli-table2");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class Timer {
  constructor() {
    this.start = process.hrtime();
  }

  stop() {
    this.end = process.hrtime(this.start);
  }

  getElapsedMilliseconds() {
    return (this.end[0] * 1e9 + this.end[1]) / 1e6;
  }

  toString() {
    return `${this.getElapsedMilliseconds().toFixed(1)} ms`;
  }
}

function readJson(filename) {
  const jsonRaw = fs.readFileSync(filename);
  const json = JSON.parse(jsonRaw);
  return json;
}

function loadPortalJson(filename) {
  const json = readJson(filename);
  const scoreCov = parsePortalJson(json);
  return scoreCov;
}

function scoreCovDescriptiveStats(scoreCov, maskId) {
  const mask = scoreCov.masks[maskId];
  const nGroups = mask.size();

  let avgGroupLength = 0;
  let avgGroupNvar = 0;

  for (const [groupLabel, variants] of mask) {
    const nVar = variants.length;
    const start = parseInt(variants[0].split("_")[0].split(":")[1]);
    const end = parseInt(variants[nVar-1].split("_")[0].split(":")[1]);
    const length = end - start;
    avgGroupLength += length / nGroups;
    avgGroupNvar += nVar / nGroups;
  }

  const stats = {
    "Avg length/group": avgGroupLength,
    "Avg variants/group": avgGroupNvar,
    "Number of groups": nGroups,
  };

  return stats;
}

function timeAggregationTests(tests, scoreCov) {
  let results = {
    data: {
      masks: [],
      groupResults: []
    }
  };

  results.data.masks = Object.values(scoreCov.masks);

  const timings = [];

  for (let [testLabel, testObject] of Object.entries(tests)) {
    const timerTest = new Timer();
    for (let scoreBlock of Object.values(scoreCov.scorecov)) {
      let testFunc;
      let weightFunc;
      if (typeof testObject === 'function') {
        testFunc = testObject;
      }
      else if (typeof testObject === 'object') {
        weightFunc = testObject.weights;
        testFunc = testObject.test;
      }

      let res = {
        group: scoreBlock.group,
        mask: scoreBlock.mask,
        test: testLabel,
        pvalue: NaN,
        stat: NaN
      };

      if (scoreBlock.scores.u.length === 0 || scoreBlock.covariance.matrix.length === 0) {
        continue;
      }

      // Calculate weights if necessary
      let w;
      if (weightFunc) {
        // Use default weights for now, will offer option to specify later
        w = weightFunc(scoreBlock.scores.altFreq.map(x => Math.min(x, 1 - x)));
      }

      let [stat, p] = testFunc(scoreBlock.scores.u, scoreBlock.covariance.matrix, w);
      res.pvalue = p;
      res.stat = stat;

      results.data.groupResults.push(res);
    }

    timerTest.stop();
    timings[testLabel] = timerTest.toString();
  }

  return timings;
}

function runTiming(scoreCov) {
  const timerLoad = new Timer();
  timerLoad.stop()

  const tests = {
    "zegginiBurden": testBurden,
    "skatLiu": {
      test: (u, v, w) => testSkat(u, v, w, "liu"),
      weights: calcSkatWeights
    },
    "skatDavies": {
      test: (u, v, w) => testSkat(u, v, w, "davies"),
      weights: calcSkatWeights
    }
  };

  // Run all tests/masks
  const timerTests = new Timer();
  const perTestTimes = timeAggregationTests(tests, scoreCov);
  timerTests.stop()

  // Return timings
  const timings = {
    load: timerLoad.toString(),
    allTests: timerTests.toString(),
    perTest: perTestTimes
  }

  return timings;
}

function main() {
  const regions = readJson("regions.json");

  /*
  { load: '0.069759 ms',
  allTests: '2817.31991 ms',
  perTest:
   [ burden: '10.715852 ms',
     skatLiu: '1610.871073 ms',
     skatDavies: '1195.173734 ms' ],
  region: 'Large region, high gene density',
  chr: 16,
  start: 1,
  end: 2000000,
  'Average length per group': 9811.80555555556,
  'Average # of variants per group': 27.583333333333318,
  'Number of groups': 144 }
  */

  const table = new Table({
    head: [
      "Region",
      "Total Length",
      "# Groups",
      "Avg length/group",
      "Avg variants/group",
      "Load JSON",
      "All Tests",
      "Burden",
      "SKAT Liu",
      "SKAT Davies"
    ]
  });

  for (const region of regions) {
    const filename = `example_portal_${region.chr}-${region.start}-${region.end}.json`;
    const portalJson = loadPortalJson(filename);
    const stats = scoreCovDescriptiveStats(portalJson, 'GENCODE-AF01');
    const timings = runTiming(portalJson);

    table.push([
      region["region"],
      numberWithCommas(region["end"] - region["start"]) + " bp",
      stats["Number of groups"],
      stats["Avg length/group"].toFixed(1),
      stats["Avg variants/group"].toFixed(1),
      timings["load"],
      timings["allTests"],
      timings["perTest"]["zegginiBurden"],
      timings["perTest"]["skatLiu"],
      timings["perTest"]["skatDavies"]
    ]);
  }

  console.log(table.toString());
}

main();
