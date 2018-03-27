/**
 * Functions for interacting with HAIL and requesting score/covariance statistics
 * @module hail
 * @license MIT
 */

const {ScoreStatTable, GenotypeCovarianceMatrix} = require("./stats.js");
const {REGEX_REGION} = require("./constants.js");
const fetch = require("node-fetch");

class HailRequester {
  /**
   * Create a new Hail requester. This object will handle making requests to Hail and retrieving
   * score statistics and covariance matrices.
   *
   * @param url URL for HAIL covariance endpoint, e.g. 'http://localhost:6060/getStats'
   * @param root This is the root object store that contains your variables of interest within HAIL.
   *   Usually it is "sa.rest" or "sa", but could be anything. Variable names will be
   *   prefixed with this value when sending them in the request.
   */
  constructor(url,root) {
    this._init(url,root);
  }

  /**
   * Code called by the constructor
   * @private
   */
  _init(url,root) {
    this.url = url;
    this.json = {};
    this.json.api_version = 1;
    this.root = root;
    this.loaded = false;
    this._covarianceMatrix = null;
    this._scoreTable = null;
  }

  /**
   * Reset this requester back to initial state
   * Root store and url will still be set
   */
  reset() {
    this._init(this.url,this.root);
  }

  /**
   * Add a covariate to the request
   * I currently only know of one type: 'phenotype', which can be a misnomer, since it is also
   * used for covariates.
   * @param covariate
   * @param type
   */
  addCovariate(covariate,type) {
    covariate = this.root == null ? covariate : this.root + "." + covariate;
    this.json.covariates = this.json.covariates || [];
    this.json.covariates.push({
      name: covariate,
      type: type
    })
  }

  /**
   * Add a phenotype
   * @param phenotype
   */
  addPhenotype(phenotype) {
    phenotype = this.root == null ? phenotype : this.root + "." + phenotype;
    this.json.phenotype = phenotype;
  }

  /**
   * Set the region to request.
   * @param region String, formatted like: '4:341-27843101'
   */
  setRegion(region) {
    let match = region.match(REGEX_REGION);
    if (match == null) {
      throw 'Could not parse region: ' + region;
    }

    let chrom = match[1];
    let start = match[2];
    let end = match[3];

    this.json.variant_filters = this.json.variant_filters || [];

    this.json.variant_filters.push({
      operand: "chrom",
      operand_type: "string",
      operator: "eq",
      value: chrom
    });

    this.json.variant_filters.push({
      operand: "pos",
      operand_type: "integer",
      operator: "lte",
      value: end
    });

    this.json.variant_filters.push({
      operand: "pos",
      operand_type: "integer",
      operator: "gte",
      value: start
    });
  }

  /**
   * Send a request to Hail using current state of the object (such as region, phenotype, covariates, etc.)
   * @throws {Error} If request to Hail failed
   * @return {Promise<Response>}
   * @private
   */
  async _fetchRequest() {
    // Ask Hail for data
    const response = await fetch(
      this.url,
      {
        method: 'POST',
        body:    JSON.stringify(this.json),
        headers: {'Content-Type': 'application/json'},
      }
    );

    if (!response.ok) {
      let msg = `Error ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    return response;
  }

  /**
   * Load data from the Hail response into the relevant data structures
   * @return {Promise<void>}
   * @private
   */
  async _loadData() {
    const response = await this._fetchRequest();
    const json = await response.json();

    // Load score statistics
    this._loadScoreStats(json);

    // Load covariance matrix
    this._loadCovarianceMatrix(json);

    // We finished loading the data
    this.loaded = true;
  }

  /**
   * Load score statistics from JSON. Score statistics are stored as a plain array of numbers, in order with the list
   * of variants (json.active_variants).
   * @todo rvtest/raremetal may be computing sqrt(v), but hail is returning v, need to verify
   * @param json JSON returned from Hail response
   * @private
   */
  _loadScoreStats(json) {
    const scoreTable = new ScoreStatTable();
    const variants = json.active_variants;
    for (let i of variants.length) {
      let vobj = variants[i];
      let variant = `${vobj.chrom}:${vobj.pos}_${vobj.ref}/${vobj.alt}`;
      let u = json.scores[i];

      // Diagonal element of linearized (lower triangular) covariance matrix
      let n = i + 1;
      let v = json.covariance[n*(n+1)/2-1];

      // Unused (not in HAIL API yet)
      let alt_freq = null;

      scoreTable.appendScore(variant, u, v, alt_freq);
    }
    this._scoreTable = scoreTable;
  }

  /**
   * Load covariance matrix from JSON. The covariance in the Hail response is stored as a linear array of the lower
   * triangle of the covariance matrix.
   * @param json JSON returned from Hail response
   * @private
   */
  _loadCovarianceMatrix(json) {
    // Preallocate matrix
    const variants = json.active_variants;
    const n_variants = variants.length;
    let covmat = new Array(n_variants);
    for (let i = 0; i < n_variants; i++) {
      covmat[i] = new Array(n_variants).fill(null);
    }

    // Map from variant ID or position => matrix index
    const positions = new Map();
    for (let i = 0; i < n_variants; i++) {
      let vobj = json.variants[i];
      //let variant = `${vobj.chrom}:${vobj.pos}_${vobj.ref}/${vobj.alt}`;
      positions.set(vobj.pos, i);
    }

    // Load the covariance matrix from the response JSON
    let c = 0;
    for (let i = 0; i < n_variants; i++) {
      for (let j = 0; j < i + 1; j++) {
        covmat[i][j] = json.covariance[c];
        covmat[j][i] = json.covariance[c];
        c += 1;
      }
    }

    // Construct the covariance matrix object and store it
    this._covarianceMatrix = GenotypeCovarianceMatrix(covmat,variants,positions);
  }

  /**
   * Retrieve the covariance matrix from Hail
   * If a request to Hail has not yet been issued, it will be sent
   * @return {Promise<GenotypeCovarianceMatrix>}
   */
  async getCovarianceMatrix() {
    if (!this.loaded) {
      await this._loadData();
    }
    return this._covarianceMatrix;
  }

  /**
   * Retrieve the score statistics from Hail
   * If a request to Hail has not yet been issued, it will be sent
   * @return {Promise<ScoreStatTable>}
   */
  async getScoreStats() {
    if (!this.loaded) {
      await this._loadData();
    }
    return this._scoreTable;
  }
}

async function _test() {
  const hailReq = new HailRequester("http://localhost:6060/getStats","sa");
  hailReq.addCovariate("SEX","phenotype");
  hailReq.addPhenotype("ENSG00000075275");
  hailReq.setRegion("22:46706731-46983067");

  const scores = await hailReq.getScoreStats();
  const cov = await hailReq.getCovarianceMatrix();
}

if (typeof require !== 'undefined' && require.main === module) {
  _test();
}

module.exports = {HailRequester};
