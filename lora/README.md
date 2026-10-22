# LoRA: the adaptation lab

A self-contained interactive chapter for understanding low-rank adaptation in
language and generative models. Open `index.html` directly, or serve the repository:

```sh
cd /workspace/professional_development
python -m http.server 8000 --bind 127.0.0.1
```

Visit `/lora/` on that local server. No package installation, CDN, font download,
GPU, model weights, or API credentials are required. This lesson trains tiny synthetic linear models in the browser;
it does not train an LLM or diffusion model. Source links require external access.

## GitHub Pages

Commit and push the site files, then in the repository's **Settings → Pages**,
choose **Deploy from a branch**, select the branch containing these files
(usually `main`), and choose **/ (root)**. The lesson will be served at
`https://mmorrisj.github.io/professional_development/lora/` after deployment.
The site is published at this URL. Pushing changes to `main` triggers its Pages deployment.
No Actions workflow or build step is needed. Repository visibility and plan can
limit Pages availability. Do not publish private training data or restricted papers.

## Teaching plan

Audience: learners comfortable with matrix multiplication and basic gradient descent.
Suggested duration: 60–70 minutes. Students should be able to:

- Explain the dimensions of A and B and the distinction between model rank and update rank.
- Calculate adapter parameters and identify when factorization stops saving parameters.
- Explain why a concentrated singular-value spectrum favors low-rank approximation.
- Describe initialization, frozen-weight training, scaling, and deployment choices.
- Distinguish fitting a sample from learning a rule that transfers to held-out examples.
- Explain why missing variation in training data can leave an unlearned feature effect.
- Design an evaluation for language or diffusion adaptation without treating rank as a quality guarantee.

Use sections 01–04, including the audience adaptation task (03A) and gradient lab
(03B), for exploration, then section 05 for prediction and discussion.
Ask learners to make a prediction before moving a control. Exercises include
instructor notes in expandable disclosures. Use the numeric readouts alongside
heatmaps so color is not the only way to interpret results.

## Scope and next stages

The rank lab uses a constructed 8 × 8 matrix with known singular directions; it
illustrates approximation capacity, not empirical LLM performance. The budget
calculator assumes square 4,096-wide projections and 32 layers. Real models differ.
A subsequent practical lab can add a pinned training environment, licensed dataset,
base-model license review, evaluation harness, and measured rank sweep. Those
artifacts do not exist yet. The current chapter supplies sourced foundations and
experiment-design exercises.

Primary sources and claim boundaries appear in the lesson's references section.
See the repository's [sourcing guide](../references.md) for citation conventions.

## Validation of this edition

Validated in Chromium with automated browser interactions: matrix energy and
error calculations, full-rank reconstruction, parameter counts, training-step
selection, model-family tabs (including keyboard navigation), quiz feedback, and
internal anchors. Checked horizontal overflow at 375, 768, and 1,440 pixels;
no browser JavaScript errors occurred. Desktop and phone layouts were inspected.
The five lesson reference URLs resolved with HTTP 200 on 2026-10-22. This does
not validate a training run or a deployed GitHub Pages site.

## Forward/backward lab (03B)

Allow 10 additional minutes to predict and trace the first two SGD steps for each
initialization. The fixed example has two inputs, one output, rank 1, scale 1,
and half-squared-error loss. A and B updates use the same pre-update gradients.
The reverse initialization is a comparison, not the original LoRA initialization.
Ask why a nonzero error does not guarantee a nonzero adapter gradient, and why
freezing weights does not mean blocking gradients through them. Students can
inspect the numeric loss history alongside the chart. The 200-step cap bounds
interactive history; it is not a convergence criterion.

Run the dependency-free mathematical tests with Node.js:

```sh
node --test lora/tests/training-math.test.cjs
```

Tests cover finite-difference gradients, first-step asymmetry, both-zero stalling,
simultaneous updates, frozen weights, and finite loss across the allowed learning
rates. Browser checks cover all initialization modes, gradient revelation, updates,
run/reset controls, history, the step cap, and responsive layouts. The new lab
requires no installation beyond a browser for learners.

## Audience adaptation task (03A)

Start here when asking “what is learned?” Four supplied caption features map to
two invented audience scores. The frozen base is an authored 2 × 4 linear map,
not a pretrained language model. A rank-1 adapter learns a shared feature direction
and two output strengths, using 6 trainable parameters instead of 8 dense updates.
Targets come from an authored rank-1 rule; that rule is never given to the optimizer.

The varied training set contains 16 corner combinations in four dimensions; the
limited set contains 8 combinations with jargon fixed at zero. Eight fixed
held-out examples have intermediate feature values and are distinct from both
training sets. The examples are deterministic, original teaching data; no external
dataset, human preference ratings, credentials, or model weights are involved.

Full-batch gradient descent minimizes `sum_i ||prediction_i - target_i||² / (2N)`
with learning rate 0.1 and simultaneous factor updates. The original W stays
fixed. After 200 steps, the varied condition fits the authored rule to numerical
precision. The limited condition fits training examples but cannot identify the
jargon effect; its held-out RMSE remains about 0.239 versus the frozen baseline's
0.379. These are reproducible results from this constructed task, not empirical
claims about real caption quality. The two conditions differ in sample count as
well as coverage; they isolate missing jargon information mathematically, not a
controlled empirical estimate of the benefit of dataset diversity.

Suggested activity (15 minutes):

1. Identify the inputs, outputs, fixed weights, trainable values, and target rule.
2. Predict whether the initialized adapter changes the frozen prediction.
3. Train the varied condition. Compare train and held-out RMSE; switch the adapter
   off for individual test examples and inspect the learned update matrix.
4. Repeat with limited coverage. Explain the training/test gap using the jargon
   column. More steps cannot supply information absent from the examples.
5. State what this supports (transfer within a known linear task) and what it
   cannot support (human preference learning or LLM performance).

The visible held-out set supports teaching. For real experiments, use a validation
set for iterative choices and reserve a separate test set for final evaluation.
A and B are not uniquely identifiable: compare BA with the target update rather
than expecting the learned factors to match the authored factorization.

Run all mathematical tests:

```sh
node --test lora/tests/*.test.cjs
```

The adaptation tests check all six gradients against finite differences, initial
baseline equivalence, first-step behavior, learned update recovery, held-out
predictions, the missing-feature limitation, and disjoint datasets.
