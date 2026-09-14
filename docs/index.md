---
layout: default
title: "Yens Onboarding 2026"
nav_order: 0
permalink: /
---

# Yens Onboarding 2026

A two-day, hands-on introduction to research computing and AI tools at Stanford GSB,
for incoming PhD students and faculty. Over two mornings you will build one real
pipeline end to end: get onto the Yens cluster, put your work under version control,
choose an approved AI route, extract public filings with Anthropic's API, and scale
the whole thing across the cluster with Slurm.

---

## Before You Arrive

Please ensure you have the following ready for class:

1. **A [GitHub account](https://github.com/signup)**
2. **[Claude, through Stanford](https://uit.stanford.edu/service/claude)**

---

## The Two Days

<div class="day-layout">
  <div class="day-card">
    <h3><a href="{{ '/day1/' | relative_url }}">Day 1 — Foundations &amp; AI</a></h3>
    <p>9:00–12:00</p>
  </div>
  <div class="day-skills">SSH &middot; cluster file system &middot; Git &amp; GitHub &middot; Claude Code &middot; Python environments &middot; Stanford AI services &middot; Anthropic API &middot; API keys &middot; Pydantic validation</div>

  <div class="day-card">
    <h3><a href="{{ '/day2/' | relative_url }}">Day 2 — The Yen-Slurm Cluster</a></h3>
    <p>9:00–12:00</p>
  </div>
  <div class="day-skills">Profiling &middot; Slurm &middot; Slurm arrays &middot; GPUs</div>
</div>

Both mornings run 9:00–12:00 and share the same shape: a short lecture at 9:00 and again
at 10:30, each opening into a long block where you work at your own pace. There are no
scheduled breaks — take your own when you reach a stopping point. The
[Reference]({{ '/reference/' | relative_url }}) section holds the material we could not
fit — local LLMs, LLM-as-a-judge, `scp`, and more.

---

## The Running Project

Both days build one pipeline over the same dataset: **SEC Form 3 filings**, the public
disclosures insiders file when they acquire a position in a company. They are
unstructured text, and the job is to turn them into structured records you can
analyze.

| | What you build |
|---|---|
| **Day 1** | A script that reads one filing, extracts fields with an LLM, and validates them. Then ten filings. |
| **Day 2** | The same work, profiled, submitted to Slurm, and scaled with a job array. Plus the README that makes it rerunnable. |

Your `README.md` is the deliverable that grows across both days. It is also the thing
your future self will thank you for.
