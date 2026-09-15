---
layout: default
title: "Part 2 — Submit a Job Array"
parent: "Day 2 — The Yen-Slurm Cluster"
nav_order: 2
has_children: true
has_toc: false
permalink: /day2/part2/
---

# Part 2 — Submit a Job Array

Part 1 got one job onto the scheduler. This part is the jump from one to many: a single
submission that fans out into hundreds of tasks, made safe to rerun, then pushed up
against the ceiling the scheduler actually enforces.

**10:30 to noon.** A short lecture, then the work block.

---

## Hands-On Lab

| | What you'll learn |
|---|---|
| [1. Hello World Array]({{ '/day2/hello-world-array/' | relative_url }}) | One submission, four tasks, four logs — the shortest proof an array works |
| [2. Scale the Loop to an Array]({{ '/day2/loop-to-array/' | relative_url }}) | Work out how a loop becomes an array, write both files yourself, run 100 filings |
| [3. Make Your Tasks Rerun-Safe]({{ '/day2/rerun-safe-tasks/' | relative_url }}) | Make a task skip work it has already done, so a resubmit costs nothing |
| [4. Yen-Slurm Array Limits]({{ '/day2/array-limits/' | relative_url }}) | Where the array ceiling is, and how to get ~992 filings through a scheduler that caps you at 512 |
| [5. Bonus — GPUs & Local LLMs]({{ '/day2/gpus/' | relative_url }}) | Ask Slurm for a GPU, serve an open-weight model on it, and query it without your data leaving the Yens |
