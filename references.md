# Research references and citation guide

This repository supports technical deep dives, interactive training artifacts, and
classroom materials. Use this guide to select evidence and make each artifact's
sources traceable. This directory is a source catalog, not evidence for a technical
claim: cite the specific paper, standard, documentation page, or code revision used.

## Source directory

| Purpose | Sources | Use |
| --- | --- | --- |
| Preprints | [arXiv](https://arxiv.org), [arXiv API](https://export.arxiv.org/api/query) | Original research; record version and distinguish preprints from peer-reviewed publications. |
| Publication records | [DOI resolver](https://doi.org), [ACM](https://dl.acm.org), [IEEE](https://ieeexplore.ieee.org), [Springer](https://link.springer.com) | Stable identifiers and published versions; full text may require a subscription. |
| Open papers and reviews | [OpenReview](https://openreview.net), [PMLR](https://proceedings.mlr.press), [JMLR](https://jmlr.org) | Papers, review discussions, and publication context. Check each paper's status. |
| Archived artifacts | [Zenodo](https://zenodo.org) | Versioned software and datasets, often with DOIs. |
| Discovery and metadata | [Semantic Scholar](https://www.semanticscholar.org), [Semantic Scholar API](https://api.semanticscholar.org), [Crossref API](https://api.crossref.org) | Find related work and verify bibliographic metadata; read original sources before citing claims. |
| Reference implementations | [GitHub](https://github.com), [GitHub API](https://api.github.com), [raw files](https://raw.githubusercontent.com), [repository downloads](https://codeload.github.com) | Inspect implementations, releases, tests, and issues. Cite immutable commits. |
| Internet standards | [RFC Editor](https://www.rfc-editor.org), [IETF Datatracker](https://datatracker.ietf.org), [W3C](https://www.w3.org/TR/) | Normative requirements; check status, updates, errata, and superseding documents. |
| Security guidance | [NIST CSRC](https://csrc.nist.gov), [OWASP](https://owasp.org) | Security practices and threat models; record publication or project version. |
| Web platform | [MDN](https://developer.mozilla.org) | Practical explanations and compatibility guidance; cite standards for normative claims. |
| Technical documentation | [Python](https://docs.python.org), [PyTorch](https://docs.pytorch.org), [NumPy](https://numpy.org), [scikit-learn](https://scikit-learn.org) | Official API behavior and examples. Match documentation to installed versions. |

## Evidence and citation practices

1. Prefer original research, standards, official documentation, and original code.
   Support recommendations with evidence appropriate to the context; a paper's
   benchmark result alone does not establish a universal best practice.
2. Cite claims where they appear, including in interactive views, slide captions,
   exercises, and instructor notes. Give learners a visible references section.
3. Record relevant sections, pages, figures, or code lines. Explain limitations,
   assumptions, conflicting evidence, and whether results have been reproduced.
4. Label our explanations, adaptations, hypotheses, and experimental findings.
   Record environment versions, commands, inputs, and results for experiments.
5. Pin code to a full commit SHA or release and use commit permalinks. Record paper
   versions, documentation versions, access dates, and DOI or stable URLs.
6. Check code, figure, and dataset licenses before copying or redistributing them.
   Attribution does not replace permission. Keep notices and identify adaptations.
   Link to restricted publications rather than committing unauthorized copies.
7. Verify generated citations against the source. Do not invent authors, DOIs,
   quotations, page numbers, or findings. Mark unread or inaccessible sources.

## Per-topic reference template

Create a `references.md` beside each topic's learning artifacts. Optionally add a
`references.bib` when citation tooling is useful. Use stable citation IDs throughout
the artifact, for example `[attention-2017]` linked to its reference entry.

```markdown
# Topic references

## [source-id] Title
- Authors / organization:
- Year / publication status:
- DOI / canonical URL:
- Version / release / full commit SHA:
- Accessed: YYYY-MM-DD
- Relevant sections / pages / code permalinks:
- Claims or artifact elements supported:
- Evidence, assumptions, and limitations:
- License / reuse permissions / required attribution:
- Local reproduction commands and results, if applicable:
```

For a classroom-ready topic, include learning objectives, prerequisites, a runnable
activity, exercises, instructor guidance, and references. Tie explanations and
exercise solutions to their supporting sources.

## Environment access

The environment uses restricted outbound access. Its existing package-manager
preset includes GitHub checkout, raw-file, and download hosts. A draft adds the
research, standards, documentation, and API hosts listed above, including the
`www` variants for Semantic Scholar, RFC Editor, and W3C. Existing presets are
preserved; no credentials are stored in this repository.

Access checks on 2026-10-22:

- Existing repository GitHub read access was verified during initial onboarding.
- Fetching the CPython README from `raw.githubusercontent.com` returned HTTP 200.
- Representative requests to the added sources and APIs were blocked by the
  proxy with `CONNECT tunnel failed, response 403` before draft activation.
  These results do not establish publisher availability or subscription access.

Review and save the network changes in environment settings, then publish the
environment. Saving a draft does not activate its policy. After activation, retry
affected requests with TLS verification enabled, for example:

```sh
curl --fail --location --show-error --max-time 30 \
  https://arxiv.org/abs/1706.03762 --output /tmp/reference-paper.html
curl --fail --location --show-error --max-time 30 \
  https://www.rfc-editor.org/rfc/rfc9110.txt --output /tmp/reference-rfc.txt
```

Inspect the returned content to confirm it is the requested material. A successful
landing page alone does not verify PDF downloads or API operations. Test the exact
paper, repository, or API route needed for each deep dive. Add specific redirect
or artifact hosts when observed rather than allowing the entire Internet.
Publisher subscriptions, anti-bot restrictions, and API quotas can still limit
access. Use lawful open versions or existing institutional access where needed;
never put tokens in reference files or ask for credential values in chat.

No additional installation or running service is required for this reference
workflow. Use the existing isolated checkout under `/workspace`; do not create a
Git worktree unless explicitly requested.
