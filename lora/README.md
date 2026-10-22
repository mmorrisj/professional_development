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
Suggested duration: 35–45 minutes. Students should be able to:

- Explain the dimensions of A and B and the distinction between model rank and update rank.
- Calculate adapter parameters and identify when factorization stops saving parameters.
- Explain why a concentrated singular-value spectrum favors low-rank approximation.
- Describe initialization, frozen-weight training, scaling, and deployment choices.
- Design an evaluation for language or diffusion adaptation without treating rank as a quality guarantee.

Use sections 01–04 for exploration, then section 05 for prediction and discussion.
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
