---
layout: default
title: "Part 2 — Python & AI"
parent: "Day 1 — Foundations & AI"
nav_order: 2
has_children: true
has_toc: false
permalink: /day1/part2/
---

# Part 2 — Python & AI

Part 1 got you a working setup. This part is what you do with it: a Python environment
that travels, a key kept out of git, and a script that sends a real SEC filing to a
language model and validates what comes back.

**10:30 to noon.** A short lecture on Python environments and Stanford's AI services, then
the second work block. Finish with the extraction checkpoint: turn one public filing
into a validated record and save your work to your fork.

{: .important }
> This part assumes the [Part 1 Checkpoint]({{ '/day1/part1-checkpoint/' | relative_url }})
> passed. If any of its four items is still broken, fix that first — a venv you cannot
> create or a fork you cannot push to will stop you here rather than politely waiting.

---

## Hands-On Lab

Work through them in order — each builds on the one before.

| Section | Format | What you'll learn |
|---|---|---|
| [Running Python on the Yens]({{ '/day1/python-on-the-yens/' | relative_url }}) | 💻 Hands-on | How `$PATH` decides which `python3` answers, and the three ways to run Python |
| [Python Environments]({{ '/day1/python-environments/' | relative_url }}) | 💻 Hands-on | Build an isolated venv and rebuild a whole project from its `requirements.txt` |
| [AI Services & Data Privacy]({{ '/day1/stanford-ai-services/' | relative_url }}) | 💬 Demo + discussion | Try the Playground, explore Stanford's AI services, and check what data each service can receive |
| [Managing API Keys]({{ '/day1/api-keys/' | relative_url }}) | 💻 Hands-on | Load `ANTHROPIC_API_KEY` from `.env`, verify it safely, and prove Git ignores it |
| [Extracting Data with an LLM]({{ '/day1/extracting-data-with-an-llm/' | relative_url }}) | 🔑 Checkpoint | Extract and validate a filing, research the person with web tools, and save a summary with its source |

{: .note }
> The extraction checkpoint brings together the skills from Part 2. Day 2 uses the
> same script for profiling and Slurm jobs. If a checkpoint step fails, ask an instructor
> for help before moving on.
