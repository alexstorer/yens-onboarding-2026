---
layout: default
title: "4. Yen-Slurm Array Limits"
parent: "Part 2 — Submit a Job Array"
grand_parent: "Day 2 — The Yen-Slurm Cluster"
nav_order: 4
permalink: /day2/array-limits/
---

# Yen-Slurm Array Limits

{: .note }
> 🔴 **Red sticky** = I need help. Put it up the moment you are stuck — an instructor will
> come to you.
>
> 🟢 **Green sticky** = I have done 1–4 and am moving on to the bonus work, and I am ready
> to help my table.

<svg viewBox="0 0 720 164" role="img" aria-labelledby="daymap-title" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:720px;height:auto;margin:1.5rem auto" font-family="'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="daymap-title">Day 2 arc — you are on step 5, scale (Part 2).</title>
  <defs>
    <marker id="daymap-ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c2cad4"/></marker>
  </defs>
  <text x="70" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">profile</text>
  <text x="210" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">document</text>
  <text x="350" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">submit</text>
  <text x="490" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">read logs</text>
  <text x="630" y="46" text-anchor="middle" font-size="17" font-weight="700" fill="#8C1515">scale (Part 2)</text>
  <line x1="92" y1="80" x2="608" y2="80" stroke="#c2cad4" stroke-width="3"/>
  <path d="M490,101 L490,124 Q490,130 484,130 L356,130 Q350,130 350,124 L350,103" fill="none" stroke="#c2cad4" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#daymap-ah)"/>
  <text x="420" y="150" text-anchor="middle" font-size="15" font-weight="400" fill="#6a7280">debug</text>
  <circle cx="70" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="70" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">1</text>
  <circle cx="210" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="210" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">2</text>
  <circle cx="350" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="350" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">3</text>
  <circle cx="490" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="490" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">4</text>
  <circle cx="630" cy="80" r="20" fill="#fff" stroke="#8C1515" stroke-width="3"/><text x="630" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#8C1515">5</text>
</svg>

{: .note }
> Everything on this page runs from your clone, with the environment active:
>
> ```bash
> cd ~/yens-onboarding-2026
> source .venv/bin/activate
> ```
> {: .yens }

{: .important }
> **Task:** Work out how to get **all ~992 filings** through an array when Slurm will not
> give you 992 tasks, run it, then write down what the full run cost.

## The limit

Every scheduler puts a ceiling on arrays, and on the Yens' `normal` partition it is
**`MaxArraySize` = 512**. Read it off the cluster rather than taking our word for it:

```bash
scontrol show config | grep MaxArraySize
```
{: .yens }

What that number caps is the **task index**, not the number of tasks. Slurm allows an index
of 0, so the highest index you may use is one less than `MaxArraySize` — **511**. An array
therefore holds at most 512 tasks, numbered `0` to `511`, and `--array=0-511` is the largest
one you can submit.

Try to go past it and the submission is simply refused:

```bash
sbatch --reservation=class --array=0-991 slurm/extract_array.slurm
```
{: .yens }

The important part is that this cap applies to **every submission**, independently. There is
no second window of higher indices waiting for a second `sbatch` — index 512 is out of
bounds in a fresh array exactly as it was in the first one.

### The other limits worth knowing

`MaxArraySize` is the one that stops you today, but it is not the only ceiling on an array:

| | What it limits | Where to see it |
|---|---|---|
| **`MaxArraySize`** | The highest task **index** — so also the largest array | `scontrol show config \| grep MaxArraySize` |
| **`%` throttle** | How many tasks run **at once**, without changing how many exist — `--array=0-511%20` keeps 20 running | your own directive |
| **QoS caps** | How much of a partition **one user** may hold — running jobs, submitted jobs, total cores | `sacctmgr show qos normal` |
| **`--time`** | Per **task**, not per array. A hundred tasks each get the full allowance | your own directive |

The `%` throttle is the one people wish they had known about sooner: it is how you run a
large array without taking the whole partition, and it costs you nothing but wall-clock.

---

## Your problem

`data/aws_links.csv` lists **992** filings. You have run 100 of them. The ceiling is 512
tasks per submission.

Work out how to process all 992. You have everything you need — page 2's array, page 3's
rerun-safety, and the limit above. Hints are at the bottom if you want them; use Claude to
think it through or work it out on paper, but be able to explain the route you chose.

{: .warning }
> **992 API calls is real money, and the whole room is submitting at once.** Work the cost
> out from your 100-filing numbers *before* you submit, and **check the number with an
> instructor**. This is the one job today where getting the arithmetic wrong is expensive
> rather than merely slow.

## Size it

Whatever route you pick, the per-task numbers may change — if a task now handles more than
one filing, one `--time` has to cover all of them. You are not guessing this time:
[2. Scale the Loop to an Array]({{ '/day2/loop-to-array/' | relative_url }}) left you real
`sacct` numbers for a single filing to build on.

## Run it

```bash
mkdir -p logs
watch squeue --me
```
{: .yens }

When it drains, count what landed:

```bash
ls results/*.json | wc -l
```
{: .yens }

Short of 992? That is what rerun-safety is for — resubmit. Finished tasks find their output
and exit immediately, so only the gaps are redone.

## Document it, and push

In `README.md`, next to your 100-filing numbers, record what the full run actually took:
per-task time and memory from `sacct`, total wall-clock, how many tasks you split it into,
and which route you chose and why.

```bash
sacct -j JOBID --format=JobID,State,Elapsed,MaxRSS
```
{: .yens }

Then commit it. Ask Claude Code to handle it:

```
> Add and commit my array scripts and README changes with a message like "Day 2: all 992 filings through an array", then push to my fork.
```
{: .claude }

---

## Stuck?

Put up a **red sticky** and talk it through with your table. Nudges, roughly in the order
they help:

<details markdown="1">
<summary>💡 What exactly does the ceiling forbid?</summary>

Write the two numbers next to each other: 992 filings, and a hard maximum of 512 tasks in
any one array.

So one array cannot have one task per filing. That is the only thing the limit rules out —
and notice how much it leaves open. Two of the three things in "992 filings, 512 tasks, one
array" are assumptions you chose, not rules Slurm imposed.

</details>

<details markdown="1">
<summary>💡 Does one task have to mean one filing?</summary>

On page 2 it did, because 100 filings fitted comfortably inside one array. Nothing in Slurm
requires it.

What is stopping a single task from handling several filings? And if it did, what would that
change about the `--time` you ask for?

</details>

<details markdown="1">
<summary>💡 What if one submission is not enough?</summary>

Suppose you submit twice. Every array starts numbering at 0, so the second submission's task
0 gets handed exactly the same number as the first submission's task 0 — and would therefore
process exactly the same filing.

What extra piece of information would the second submission need in order to work on a
different slice? And how could you get that information to it at submit time, without
editing the script in between?

</details>

<details markdown="1">
<summary>💡 How will you know it worked?</summary>

Decide the number you expect *before* it finishes: how many files should be in `results/`
when all 992 have been processed?

If you are short, you already have the machinery to fix it cheaply — that was page 3. And
per-task `.err` files tell you which tasks to look at rather than which array.

</details>
