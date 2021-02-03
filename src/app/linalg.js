import numeric from '../lib/numeric-1.2.6';

/**
 * Return the cholesky decomposition A = GG'. The matrix G is returned.
 * @param A
 * @return {*}
 */
export function cholesky(A) {
  const n = A.length;
  const G = numeric.rep([n, n], 0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[j][i];
      for (let k = 0; k <= j - 1; k++) {
        s = s - G[j][k] * G[i][k];
      }
      if (j < i) {
        G[i][j] = s / G[j][j];
      } else {
        G[i][i] = Math.sqrt(s);
      }
    }
  }
  return G;
}
