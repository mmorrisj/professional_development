# LoRA: the adaptation lab

A self-contained interactive chapter for understanding low-rank adaptation in
language and generative models. Open `index.html` directly, or serve the repository:

```sh
cd /workspace/professional_development
python -m http.server 8000 --bind 127.0.0.1
```

Visit `/lora/` on that local server. No package installation, CDN, font download,
GPU, model weights, or API credentials are required. This is a conceptual lesson;
it does not train a model. Source links require external access.

## GitHub Pages

Commit and push the site files, then in the repository's **Settings → Pages**,
choose **Deploy from a branch**, select the branch containing these files
(usually `main`), and choose **/ (root)**. The lesson will be served at
`https://mmorrisj.github.io/professional_development/lora/` after deployment.
This URL is the intended deployment location, not a claim that it is published.
No Actions workflow or build step is needed. Repository visibility and plan can
limit Pages availability. Do not publish private training data or restricted papers.

## Teaching plan

Audience: learners comfortable with matrix multiplication and basic gradient descent.
Suggested duration: 45–55 minutes. Students should be able to:

- Explain the dimensions of A and B and the distinction between model rank and update rank.
- Calculate adapter parameters and identify when factorization stops saving parameters.
- Explain why a concentrated singular-value spectrum favors low-rank approximation.
- Describe initialization, frozen-weight training, scaling, and deployment choices.
- Design an evaluation for language or diffusion adaptation without treating rank as a quality guarantee.

Use sections 01–04, including the gradient lab (03B), for exploration, then section 05 for prediction and discussion.
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
