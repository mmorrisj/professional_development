(function () {
  'use strict';
  const $ = id => document.getElementById(id), math = globalThis.LoRAAdaptation;
  const exampleLabels = ['Detailed and jargon-heavy', 'Energetic and plain-language', 'Formal with low energy', 'Casual and plain-language', 'Detailed with little jargon', 'Formal and jargon-heavy', 'Detailed and casual, with jargon', 'Energetic but formal'];
  const names = ['Accessibility', 'Appeal'], features = ['Detail', 'Energy', 'Formality', 'Jargon'];
  let state, training, steps = 0;
  const fmt = v => (Math.abs(v) < 0.0005 ? 0 : v).toFixed(3);
  function row(values, heading = true) {
    const tr = document.createElement('tr');
    values.forEach((v, i) => {
      const cell = document.createElement(heading && i === 0 ? 'th' : 'td');
      if (heading && i === 0) cell.scope = 'row';
      cell.textContent = typeof v === 'number' ? fmt(v) : v; tr.append(cell);
    });
    return tr;
  }
  function renderExample() {
    const example = math.testSet[+$('taskExample').value], p = math.predict(state, example.x), active = $('taskAdapter').checked;
    $('taskFeatures').replaceChildren(...features.map((name, i) => {
      const chip = document.createElement('span'); chip.textContent = `${name}: ${example.x[i].toFixed(1)}`; return chip;
    }));
    $('taskPredictions').replaceChildren(...names.map((name, i) => {
      const tr = row([name, p.frozen[i], p.delta[i], active ? p.adapted[i] : p.frozen[i], example.y[i]]);
      const labels = ['Frozen W', 'Adapter BA', 'Shown output', 'Target'];
      tr.querySelectorAll('td').forEach((td, j) => { td.dataset.label = labels[j]; });
      return tr;
    }));
    $('taskPredictionNote').textContent = active
      ? 'Adapter on: shown output = frozen prediction + learned correction.'
      : 'Adapter off: shown output is the original scorer. The learned factors are retained.';
  }
  function renderDataset() {
    const test = $('taskDataset').value === 'test', data = test ? math.testSet : training;
    $('taskDatasetCaption').textContent = `${test ? 'Held-out — excluded from every gradient' : 'Training — used for gradients'} · ${data.length} examples`;
    $('taskDatasetRows').replaceChildren(...data.map(e => row([e.id, ...e.x, ...e.y])));
  }
  function render() {
    $('taskStep').textContent = steps;
    $('taskTrainError').textContent = fmt(math.rmse(state, training));
    $('taskTestError').textContent = fmt(math.rmse(state, math.testSet));
    $('taskTrainBase').textContent = `Frozen baseline: ${fmt(math.rmse(state, training, false))}`;
    $('taskTestBase').textContent = `Frozen baseline: ${fmt(math.rmse(state, math.testSet, false))}`;
    $('taskRule').replaceChildren(...math.update(state).map((values, i) => row([names[i], ...values])));
    $('taskTrueRule').replaceChildren(...math.truthB.map((b, i) => row([names[i], ...math.truthA.map(a => a * b)])));
    $('taskFactors').textContent = `A = [${state.A.map(fmt).join(', ')}]; B = [${state.B.map(fmt).join(', ')}]ᵀ. W remains unchanged.`;
    const narrow = $('taskCoverage').value === 'narrow';
    $('taskTakeaway').textContent = steps === 0
      ? 'Your goal is to explain a learned rule: does the correction improve predictions on examples outside the training set? First predict what will happen, then train.'
      : narrow
        ? 'Training error falls, but jargon never varied in training. Its effect cannot be identified from these examples. Compare the learned jargon weights with the authored rule and inspect the held-out errors.'
        : 'The adapter learns a feature-to-score correction that also works on unseen intermediate inputs from this synthetic rule. The original W is unchanged. This is transfer within a deliberately simple task, not proof of real-world generalization.';
    $('taskStatus').textContent = steps === 0
      ? 'Not trained. A is nonzero, B is zero: the adapter contributes nothing.'
      : `${steps} training-only gradient steps complete. Compare held-out RMSE with the frozen baseline, then inspect individual predictions.`;
    $('trainTask').disabled = steps >= 1000;
    $('trainTask').textContent = steps >= 1000 ? '1,000-step limit reached' : steps === 0 ? 'Train 200 steps →' : 'Train 200 more steps →';
    renderExample(); renderDataset();
  }
  function reset() {
    state = math.initialize(); training = math.trainingSet($('taskCoverage').value); steps = 0;
    $('taskAdapter').checked = true; render();
  }
  $('taskExample').replaceChildren(...math.testSet.map((e, i) => {
    const option = document.createElement('option'); option.value = i; option.textContent = `${i + 1}. ${exampleLabels[i]} · ${e.id}`; return option;
  }));
  $('trainTask').addEventListener('click', () => {
    for (let i = 0; i < 200 && steps < 1000; i++, steps++) state = math.step(state, training);
    render();
  });
  $('resetTask').addEventListener('click', reset);
  $('taskCoverage').addEventListener('change', reset);
  $('taskExample').addEventListener('change', renderExample);
  $('taskAdapter').addEventListener('change', renderExample);
  $('taskDataset').addEventListener('change', renderDataset);
  reset();
})();
