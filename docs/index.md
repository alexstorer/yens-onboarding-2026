---
layout: default
title: "Yens Onboarding 2026"
nav_order: 0
permalink: /
---

# Yens Onboarding 2026

A two-day, hands-on introduction to research computing and AI tools at Stanford GSB,
for incoming PhD students and faculty. Over two mornings you will get onto the Yens
cluster, put your work under version control, learn to drive it with Claude Code, and
build a Python environment anyone can rebuild. Then you will pick an AI service your
data is allowed to use, extract structured records from public filings and validate
them, and finish by measuring what that job needs and scaling it across the cluster
with Slurm.

---

## Before You Arrive

1. **[A GitHub account](https://github.com/signup)**
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
scheduled breaks — take your own when you reach a stopping point.

---

## The Running Project

**SEC Form 3 filings** are the public disclosures insiders file when they acquire a
position in a company. They are unstructured text, and the job is to turn them into
structured records you can analyze.

| | What you build |
|---|---|
| **Day 1** | A script that reads one filing, extracts fields with an LLM, and validates them. Then ten filings. |
| **Day 2** | The same work, profiled, submitted to Slurm, and scaled with a job array. Plus the README that makes it rerunnable. |
