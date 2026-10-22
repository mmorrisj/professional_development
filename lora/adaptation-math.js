/* Authored synthetic task, not human ratings or a language model. */
(function (root) {
  'use strict';
  const freezeRows = rows => Object.freeze(rows.map(row => Object.freeze(row)));
  const W = freezeRows([[0.3, 0.1, -0.1, -0.15], [0.1, 0.4, 0.1, -0.1]]);
  const truthA = Object.freeze([0.5, 0.3, -0.4, -0.6]);
  const truthB = Object.freeze([0.8, 0.4]);
  const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
  const base = x => W.map(row => dot(row, x));
  const target = x => base(x).map((v, i) => v + truthB[i] * dot(truthA, x));
  const makeExample = (x, id) => Object.freeze({ x: Object.freeze(x), y: Object.freeze(target(x)), id });
  function trainingSet(coverage) {
    const varied = coverage !== 'narrow', count = varied ? 16 : 8;
    return Object.freeze(Array.from({ length: count }, (_, i) => makeExample(
      Array.from({ length: 4 }, (_, j) => j === 3 && !varied ? 0 : ((i >> j) & 1) ? 1 : -1), `train-${i + 1}`)));
  }
  const testSet = Object.freeze([
    [0.6, 0.2, 0.3, 0.8], [-0.4, 0.7, 0.2, -0.9],
    [0.3, -0.8, 0.6, 0.5], [-0.7, -0.2, -0.5, -0.6],
    [0.8, 0.5, 0.1, -0.7], [-0.2, -0.6, 0.8, 0.9],
    [0.5, -0.4, -0.7, 0.6], [-0.6, 0.3, 0.4, -0.8]
  ].map((x, i) => makeExample(x, `test-${i + 1}`)));
  const initialize = () => ({ A: [0.1, 0.1, -0.1, -0.1], B: [0, 0] });
  function predict(state, x) {
    const frozen = base(x), z = dot(state.A, x), delta = state.B.map(b => b * z);
    return { frozen, delta, adapted: frozen.map((v, i) => v + delta[i]) };
  }
  // Intentionally accepts only the selected training data; test data are not read here.
  function gradients(state, training) {
    const gradA = [0, 0, 0, 0], gradB = [0, 0];
    let loss = 0;
    for (const { x, y } of training) {
      const error = predict(state, x).adapted.map((v, i) => v - y[i]), z = dot(state.A, x);
      for (let j = 0; j < 2; j++) {
        loss += 0.5 * error[j] ** 2 / training.length;
        gradB[j] += error[j] * z / training.length;
      }
      for (let k = 0; k < 4; k++) gradA[k] += dot(state.B, error) * x[k] / training.length;
    }
    return { gradA, gradB, loss };
  }
  function step(state, training, rate = 0.1) {
    const { gradA, gradB } = gradients(state, training);
    return { A: state.A.map((a, i) => a - rate * gradA[i]), B: state.B.map((b, i) => b - rate * gradB[i]) };
  }
  function rmse(state, data, adapted = true) {
    let squared = 0;
    for (const { x, y } of data) {
      const result = predict(state, x)[adapted ? 'adapted' : 'frozen'];
      squared += result.reduce((sum, v, i) => sum + (v - y[i]) ** 2, 0);
    }
    return Math.sqrt(squared / (2 * data.length));
  }
  const update = state => state.B.map(b => state.A.map(a => b * a));
  const api = Object.freeze({ W, truthA, truthB, target, trainingSet, testSet, initialize, predict, gradients, step, rmse, update });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LoRAAdaptation = api;
})(globalThis);
