---
layout: default
title: "Part 1 Checkpoint"
parent: "Part 1 — Profile & Submit a Job"
grand_parent: "Day 2 — The Yen-Slurm Cluster"
nav_order: 5
permalink: /day2/part1-checkpoint/
---

# Part 1 Checkpoint

You have measured what your script actually costs, and you have handed a job to the
scheduler instead of holding a terminal open.

---

## Before Part 2, You Should Have

- Profiled the mystery script, with two terminals on one node
- Timed the batch script over 10 filings
- Written the three numbers into your README
- Written `#SBATCH` directives by hand and submitted the job
- Read what the job did — a working job's `.out`, and a failed job's `.err`

---

## Before You Move On

{: .note }
> 🔴 **Red sticky** = something on the list is missing.
>
> 🟢 **Green sticky** = you have all five. Put it up, then **ask whether anyone at your table
> is still working** — explaining a thing you just learned is the fastest way to find out
> whether you actually learned it.

---

## Bonus Work

Checkpoint passed and your table sorted? Everything Part 1 folded away is here, so you do
not have to go hunting back through the pages:

| Page | Bonus |
|---|---|
| [1. Profile]({{ '/day2/profiling/' | relative_url }}) | [Profile two more scripts]({{ '/day2/profiling/#bonus-more-scripts' | relative_url }}) · [explore real cluster usage data]({{ '/day2/profiling/#bonus-cluster-usage' | relative_url }}) · [size up your own machine]({{ '/day2/profiling/#bonus-your-machine' | relative_url }}) |
| [2. Document]({{ '/day2/resource-profile/' | relative_url }}) | [Let Claude write it into the README]({{ '/day2/resource-profile/#bonus-claude-readme' | relative_url }}) |
| [3. Submit]({{ '/day2/submit-a-slurm-job/' | relative_url }}) | [Other ways to run and inspect jobs]({{ '/day2/submit-a-slurm-job/#bonus-other-ways' | relative_url }}) · [turn this into a Claude skill]({{ '/day2/submit-a-slurm-job/#bonus-claude-skill' | relative_url }}) |
| [4. Read Logs]({{ '/day2/debug-a-failed-job/' | relative_url }}) | [Three more broken jobs]({{ '/day2/debug-a-failed-job/#bonus-more-broken-jobs' | relative_url }}) · [let Claude read the log for you]({{ '/day2/debug-a-failed-job/#bonus-claude-reads-log' | relative_url }}) |
