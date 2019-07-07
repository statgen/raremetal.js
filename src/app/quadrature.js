const GAUSS_KRONROD_ABSCISSA = {
  21: [
    0.00000000000000000000000000000000000e+00,
    1.48874338981631210884826001129719985e-01,
    2.94392862701460198131126603103865566e-01,
    4.33395394129247190799265943165784162e-01,
    5.62757134668604683339000099272694141e-01,
    6.79409568299024406234327365114873576e-01,
    7.80817726586416897063717578345042377e-01,
    8.65063366688984510732096688423493049e-01,
    9.30157491355708226001207180059508346e-01,
    9.73906528517171720077964012084452053e-01,
    9.95657163025808080735527280689002848e-01,
  ]
};

const GAUSS_KRONROD_WEIGHTS = {
  21: [
    1.49445554002916905664936468389821204e-01,
    1.47739104901338491374841515972068046e-01,
    1.42775938577060080797094273138717061e-01,
    1.34709217311473325928054001771706833e-01,
    1.23491976262065851077958109831074160e-01,
    1.09387158802297641899210590325804960e-01,
    9.31254545836976055350654650833663444e-02,
    7.50396748109199527670431409161900094e-02,
    5.47558965743519960313813002445801764e-02,
    3.25581623079647274788189724593897606e-02,
    1.16946388673718742780643960621920484e-02,
  ]
};

const GAUSS_ABSCISSA = {
  10: [
    1.48874338981631210884826001129719985e-01,
    4.33395394129247190799265943165784162e-01,
    6.79409568299024406234327365114873576e-01,
    8.65063366688984510732096688423493049e-01,
    9.73906528517171720077964012084452053e-01
  ]
};

const GAUSS_WEIGHTS = {
  10: [
    2.95524224714752870173892994651338329e-01,
    2.69266719309996355091226921569469353e-01,
    2.19086362515982043995534934228163192e-01,
    1.49451349150580593145776339657697332e-01,
    6.66713443086881375935688098933317929e-02
  ]
};

const ROOT_EPSILON = Math.sqrt(Number.EPSILON);

class GaussKronrod {
  constructor(N=21, maxDepth=15, maxRelativeError=ROOT_EPSILON) {
    this.N = N;
    this.maxDepth = maxDepth;
    this.maxRelativeError = maxRelativeError;
    this.error = 0;
  }

  _integrateNonAdaptive(f) {
    let N = this.N;
    let gauss_start = 2;
    let kronrod_start = 1;
    let gauss_order = (N - 1) / 2;
    let kronrod_result = 0;
    let gauss_result = 0;
    let fp, fm;

    if (gauss_order & 1) {
      fp = f(0);
      kronrod_result = fp * GAUSS_KRONROD_WEIGHTS[N][0];
      gauss_result += fp * GAUSS_WEIGHTS[(N - 1) / 2][0];
    }
    else {
      fp = f(0);
      kronrod_result = fp * GAUSS_KRONROD_WEIGHTS[N][0];
      gauss_start = 1;
      kronrod_start = 2;
    }

    for (let i = gauss_start; i < GAUSS_KRONROD_ABSCISSA[N].length; i += 2) {
      fp = f(GAUSS_KRONROD_ABSCISSA[N][i]);
      fm = f(-GAUSS_KRONROD_ABSCISSA[N][i]);
      kronrod_result += (fp + fm) * GAUSS_KRONROD_WEIGHTS[N][i];
      gauss_result += (fp + fm) * GAUSS_WEIGHTS[(N - 1) / 2][Math.floor(i / 2)];
    }

    for (let i = kronrod_start; i < GAUSS_KRONROD_ABSCISSA[N].length; i += 2) {
      fp = f(GAUSS_KRONROD_ABSCISSA[N][i]);
      fm = f(-GAUSS_KRONROD_ABSCISSA[N][i]);
      kronrod_result += (fp + fm) * GAUSS_KRONROD_WEIGHTS[N][i];
    }

    let error = Math.max(Math.abs(kronrod_result - gauss_result), Math.abs(kronrod_result * Number.EPSILON * 2));
    return [kronrod_result, error];
  }

  _recursiveAdaptiveIntegrate(f, a, b, max_levels, abs_tol) {
    let error_local;
    let estimate;
    let mean = (b + a) / 2;
    let scale = (b - a) / 2;
    let ff = x => { return f(scale * x + mean); };
    [estimate, error_local] = this._integrateNonAdaptive(ff);
    estimate *= scale;

    let abs_tol1 = Math.abs(estimate * this.maxRelativeError);
    if (!abs_tol) {
      abs_tol = abs_tol1;
    }

    if (max_levels && (abs_tol < error_local)) {
      let mid = (a + b) / 2;
      [estimate, ] = this._recursiveAdaptiveIntegrate(f, a, mid, max_levels - 1, abs_tol / 2);
      let result = this._recursiveAdaptiveIntegrate(f, mid, b, max_levels - 1, abs_tol / 2);
      estimate += result[0];
      this.error += result[1];
      return [estimate, error_local];
    }

    this.error = error_local;
    // console.log(
    //   `${a.toString().padEnd(15)}`,
    //   `${b.toString().padEnd(15)}`,
    //   `${max_levels.toString().padEnd(5)}`,
    //   `${abs_tol.toExponential(2).padEnd(11)}`,
    //   `${estimate.toFixed(4).padEnd(10)}`,
    //   `${error_local.toExponential(2).padStart(5).padEnd(11)}`,
    // );
    return [estimate, error_local];
  }

  integrate(f, a, b) {
    let result;
    if (isFinite(a) && isFinite(b)) {
      result = this._recursiveAdaptiveIntegrate(f, a, b, this.maxDepth, 0);
    }
    else {
      throw new Error("Additional integration limits not implemented");
    }
    return result;
  }
}

function _test() {
  let integ = new GaussKronrod(21, 15, 1e-30);
  let f = x => Math.exp(-x * x / 2);
  console.log(integ.integrate(f, 0, 10));
}

export { GaussKronrod };