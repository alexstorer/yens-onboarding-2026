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
the second work block. Start the extraction lesson and Genre Tribunal capstone in class,
then finish the capstone in your own time.

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
| [AI Services & Data Privacy]({{ '/day1/stanford-ai-services/' | relative_url }}) | 💬 Demo + discussion | Try the Playground, distinguish APIs from agent harnesses, and check what data each service can receive |
| [Managing API Keys]({{ '/day1/api-keys/' | relative_url }}) | 💻 Hands-on | Load `ANTHROPIC_API_KEY` from `.env`, verify it safely, and prove Git ignores it |
| [Extracting Data with an LLM]({{ '/day1/extracting-data-with-an-llm/' | relative_url }}) | 💻 Hands-on | Native Anthropic calls, then structured fields from a real SEC filing validated with Pydantic |
| [Day 1 Part 2 Capstone]({{ '/day1/capstone/' | relative_url }}) | 🔑 Capstone | Classify 10 movies, check with a second model, flag cases for review, and push your results |

{: .note }
> The capstone builds on the extraction lesson: use the same API and validation skills
> to classify movies and check the labels with a second model. You are not expected to finish the capstone in the room — carry on with it in
> your own time.
