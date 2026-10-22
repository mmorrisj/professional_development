/* Rank-1, two-input / one-output LoRA toy. No external dependencies. */
(function (root) {
  'use strict';
  const W = Object.freeze([0.5, -0.25]);
  const x = Object.freeze([1, 2]);
  function initialize(mode) {
    if (mode === 'zeros') return { A: [0, 0], B: 0 };
    if (mode === 'reverse') return { A: [0, 0], B: 0.4 };
    return { A: [0.4, 0.1], B: 0 };
  }
  function evaluate(state) {
    const base = W.reduce((v, w, i) => v + w * x[i], 0);
    const z = state.A.reduce((v, a, i) => v + a * x[i], 0);
    const delta = state.B * z;
    const prediction = base + delta;
    const error = prediction - 1;
    return { base, z, delta, prediction, error, loss: 0.5 * error * error,
      gradB: error * z,
      gradA: x.map(v => state.B * error * v),
      gradX: W.map((w, i) => (w + state.B * state.A[i]) * error) };
  }
  function step(state, rate) {
    const g = evaluate(state);
    return { A: state.A.map((a, i) => a - rate * g.gradA[i]), B: state.B - rate * g.gradB };
  }
  const api = Object.freeze({ initialize, evaluate, step, W, x });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LoRAToy = api;
})(globalThis);
