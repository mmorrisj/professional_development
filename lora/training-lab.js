/* DOM controller; computations live in training-math.js. */
(function () {
  'use strict';
  const el = id => document.getElementById(id);
  const math = globalThis.LoRAToy;
  let state, history, revealed = false;
  const fmt = v => (Math.abs(v) < 0.0000005 ? 0 : v).toFixed(6);
  const vector = values => '[' + values.map(fmt).join(', ') + ']';
  function render() {
    const v = math.evaluate(state), iteration = history.length - 1;
    el('passBase').textContent = fmt(v.base);
    el('passHidden').textContent = fmt(v.z);
    el('passDelta').textContent = fmt(v.delta);
    el('passPrediction').textContent = fmt(v.prediction);
    el('passError').textContent = fmt(v.error);
    el('passFactors').textContent = `A = ${vector(state.A)} · B = ${fmt(state.B)}`;
    el('gradientB').textContent = fmt(v.gradB);
    el('gradientA').textContent = vector(v.gradA);
    el('gradientX').textContent = vector(v.gradX) + 'ᵀ';
    el('backwardPanel').hidden = !revealed;
    el('applyGradient').disabled = !revealed || iteration >= 200;
    el('runSteps').disabled = iteration >= 200;
    el('revealBackward').disabled = revealed;
    el('revealBackward').setAttribute('aria-expanded', String(revealed));
    el('revealBackward').setAttribute('aria-controls', 'backwardPanel');
    el('passIteration').textContent = iteration;
    el('passLoss').textContent = fmt(v.loss);
    const zero = el('initialization').value === 'zeros';
    el('initializationInsight').textContent = zero
      ? 'Both factors are zero. Both gradients vanish, so these SGD steps cannot change the adapter. The loss stays at 0.5.'
      : iteration === 0
        ? el('initialization').value === 'reverse'
          ? 'The adapter starts at zero, but B is nonzero. Predict which factor receives a gradient first.'
          : 'The adapter starts at zero, but A is nonzero. Predict which factor receives a gradient first.'
        : 'The original W is unchanged. Only the adapter factors have moved. Compare the current prediction with the target of 1.';
    const end = Math.max(20, iteration), max = Math.max(0.5, ...history);
    const points = history.map((loss, i) => [40 + 465 * i / end, 155 - 135 * loss / max]);
    el('chartEndStep').textContent = end;
    el('lossLine').setAttribute('points', points.map(p => p.join(',')).join(' '));
    el('lossDots').replaceChildren(...points.filter((_, i) => i === 0 || i === iteration).map(([cx, cy]) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); dot.setAttribute('r', '4'); return dot;
    }));
    el('lossChartDesc').textContent = `Step 0 loss ${fmt(history[0])}; step ${iteration} loss ${fmt(v.loss)}. Linear vertical scale from 0 to ${max}; horizontal scale from 0 to ${end} steps. Numeric history follows.`;
    el('lossHistory').replaceChildren(...history.map((loss, i) => {
      const row = document.createElement('tr'), index = document.createElement('th'), value = document.createElement('td');
      index.scope = 'row'; index.textContent = i; value.textContent = fmt(loss); row.append(index, value); return row;
    }));
    el('passStatus').textContent = iteration >= 200
      ? '200-step exploration limit reached. Reset to start another experiment.'
      : revealed
        ? `Step ${iteration}: gradients revealed at the displayed weights. Apply SGD to update both factors simultaneously.`
        : `Step ${iteration}: forward pass complete. Reveal the backward pass to inspect the current gradients.`;
  }
  function reset() {
    state = math.initialize(el('initialization').value);
    history = [math.evaluate(state).loss]; revealed = false;
    el('learningRateValue').textContent = (+el('learningRate').value).toFixed(2); render();
  }
  function advance(count) {
    for (let i = 0; i < count && history.length <= 200; i++) {
      state = math.step(state, +el('learningRate').value); history.push(math.evaluate(state).loss);
    }
    revealed = false; render();
  }
  el('initialization').addEventListener('change', reset);
  el('learningRate').addEventListener('input', reset);
  el('resetPass').addEventListener('click', reset);
  el('revealBackward').addEventListener('click', () => { revealed = true; render(); });
  el('applyGradient').addEventListener('click', () => advance(1));
  el('runSteps').addEventListener('click', () => advance(20));
  reset();
})();
