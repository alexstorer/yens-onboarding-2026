---
layout: default
title: "Day 2 — The Yen-Slurm Cluster"
nav_order: 3
has_children: true
has_toc: false
permalink: /day2/
---

# Day 2 — The Yen-Slurm Cluster

Today you'll move from running your code interactively — one piece at a time, watching it
go — to handing bigger jobs off to the scheduled Yens and letting them run on their own.
You'll pick up the ideas and habits for that step by step: how to size up what a job needs
before you run it, how to send it off and check how it went, how to fix it when something
breaks, and how to write down what you did so you (or a labmate) can run it again.

By the end you will have done it on real work: nearly a thousand SEC filings processed by a
job you sized yourself, then checked against what it actually used.

Here's what we'll do today:

<svg viewBox="0 0 720 164" role="img" aria-labelledby="daymap-title" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:720px;height:auto;margin:1.5rem auto" font-family="'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="daymap-title">The arc of Day 2: profile, document, submit, read logs, then scale — with debugging looping back to submit.</title>
  <defs>
    <marker id="daymap-ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c2cad4"/></marker>
  </defs>
  <text x="70" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">profile</text>
  <text x="210" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">document</text>
  <text x="350" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">submit</text>
  <text x="490" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">read logs</text>
  <text x="630" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">scale (Part 2)</text>
  <line x1="92" y1="80" x2="608" y2="80" stroke="#c2cad4" stroke-width="3"/>
  <path d="M490,101 L490,124 Q490,130 484,130 L356,130 Q350,130 350,124 L350,103" fill="none" stroke="#c2cad4" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#daymap-ah)"/>
  <text x="420" y="150" text-anchor="middle" font-size="15" font-weight="400" fill="#6a7280">debug</text>
  <circle cx="70" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="70" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">1</text>
  <circle cx="210" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="210" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">2</text>
  <circle cx="350" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="350" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">3</text>
  <circle cx="490" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="490" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">4</text>
  <circle cx="630" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="630" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">5</text>
</svg>

---

## Day 1 Recap

Where yesterday left you:

- Built a virtual environment on the Yens and installed dependencies from `requirements.txt`
- Ran `scripts/extract_form_3_one_file.py` in three stages — calls the language model to
  extract structured fields from one SEC Form 3 filing, with logging and a validated
  result file
- Used Pydantic to validate and structure the LLM output

---

## Before You Start

Three things need to be in place. **Say so now if any of them are missing:**

1. Your fork, cloned to the Yens at `~/yens-onboarding-2026`
2. A virtual environment at `~/yens-onboarding-2026/.venv`, with `requirements.txt` installed
3. A `.env` holding your `ANTHROPIC_API_KEY`, and `.env` in `.gitignore`

{: .important }
> **If you finish a section early, check whether anyone at your table is stuck before you
> move on to the bonus material.** Explaining a thing you just learned is
> the fastest way to find out whether you actually learned it.

Work through the sections in order — they build on each other, and the numbers you write
down in one are the inputs to the next. Each page ends with **bonus** work, folded away,
for when you finish early.
