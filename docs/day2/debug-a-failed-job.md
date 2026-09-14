---
layout: default
title: "4. Read Logs"
parent: "Part 1 — Profile & Submit a Job"
grand_parent: "Day 2 — The Yen-Slurm Cluster"
nav_order: 4
permalink: /day2/debug-a-failed-job/
---

# Read Logs

{: .note }
> 🔴 **Red sticky** = I need help. Put it up the moment you are stuck — an instructor will
> come to you.
>
> 🟢 **Green sticky** = I have done 1–4 and am moving on to the bonus work, and I am ready
> to help my table.

<svg viewBox="0 0 720 164" role="img" aria-labelledby="daymap-title" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:720px;height:auto;margin:1.5rem auto" font-family="'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="daymap-title">Day 2 arc — you are on step 4, read logs.</title>
  <defs>
    <marker id="daymap-ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c2cad4"/></marker>
  </defs>
  <text x="70" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">profile</text>
  <text x="210" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">document</text>
  <text x="350" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">submit</text>
  <text x="490" y="46" text-anchor="middle" font-size="17" font-weight="700" fill="#8C1515">read logs</text>
  <text x="630" y="46" text-anchor="middle" font-size="17" font-weight="400" fill="#6a7280">scale (Part 2)</text>
  <line x1="92" y1="80" x2="608" y2="80" stroke="#c2cad4" stroke-width="3"/>
  <path d="M490,101 L490,124 Q490,130 484,130 L356,130 Q350,130 350,124 L350,103" fill="none" stroke="#8C1515" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#daymap-ah)"/>
  <text x="420" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="#8C1515">debug</text>
  <circle cx="70" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="70" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">1</text>
  <circle cx="210" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="210" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">2</text>
  <circle cx="350" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="350" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">3</text>
  <circle cx="490" cy="80" r="20" fill="#fff" stroke="#8C1515" stroke-width="3"/><text x="490" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#8C1515">4</text>
  <circle cx="630" cy="80" r="20" fill="#f3f4f7" stroke="#6a7280" stroke-width="3"/><text x="630" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#6a7280">5</text>
</svg>

{: .note }
> Everything on this page runs from your clone, with the environment active:
>
> ```bash
> cd ~/yens-onboarding-2026
> source .venv/bin/activate
> ```
> {: .yens }

## Read your own job's logs

The job you just submitted wrote **log files** to `logs/` — the `.out` file has the
script's normal output, the `.err` file has any errors:

```bash
cat logs/extract_*.out
cat logs/extract_*.err
```
{: .yens }

A job that worked leaves an empty `.err`.

## Read a failed job's logs

{: .important }
> **Task:** Submit a deliberately broken job, read the error log it leaves behind, and fix it with Claude as your reviewer. Reading a failed job's `.err` is the first debugging skill you will actually need on the cluster.

Your repo ships several Slurm scripts that are **deliberately broken**. Fix `slurm/fix_me.slurm` here; the others are waiting for you in the [Bonus](#bonus) section. **Work with Claude**: point Claude Code at the job's error log and ask it to explain what went wrong and propose a fix. **Read its explanation, and if the fix makes sense, approve it** and let Claude apply it — you're the reviewer, so don't accept a change you don't understand.

{: .note }
> 💡 **Let it fail before you fix it.** A `logs/fix_me_*.err` file has to exist for you to read, and a bonus exercise later reuses it — so submit it and let it fail rather than reading the script and spotting the bug by eye.

Submit the first one:

```bash
sbatch --reservation=class slurm/fix_me.slurm
```
{: .yens }

Watch it move through the queue — `PD` (pending), then `R` (running), then gone once it finishes:

```bash
squeue --me
```
{: .yens }

Once it's no longer in the queue, check how it ended:

```bash
sacct -u SUNetID --format=JobID,JobName,State,Elapsed --starttime=today
```
{: .yens }

When it shows `FAILED`, read the error log to find out *why*:

```bash
cat logs/fix_me_*.err
```
{: .yens }

**Put Claude Code in plan mode first** (press <kbd>Shift</kbd>+<kbd>Tab</kbd> to switch) so it lays out *what* it would change and *why* instead of editing right away. Then point it at the error log — a simple prompt is enough:

```
> Help me troubleshoot logs/fix_me_*.err
```
{: .claude }

**Read the plan it comes back with.** If the fix makes sense, approve it and let Claude apply it — you're the reviewer.

You'll also want a completion email, so ask Claude to add the notification lines to this script:

```
> Add #SBATCH --mail-type=ALL and #SBATCH --mail-user=SUNetID@stanford.edu to slurm/fix_me.slurm.
```
{: .claude }

Then resubmit — **keep debugging and resubmitting until the Slurm email says the job succeeded** (exit status `0`).

<details markdown="1">
<summary>⭐ Bonus — three more broken jobs</summary>

**Bonus — Debug `fix_me_2.slurm`**

Same drill, a different setup mistake. Submit it, watch it fail, and read its error log:

```bash
sbatch --reservation=class slurm/fix_me_2.slurm
squeue --me
cat logs/fix_me_2_*.err
```
{: .yens }

Troubleshoot with Claude in plan mode (`> Help me troubleshoot logs/fix_me_2_*.err`), approve the fix if it makes sense, have Claude add the email lines to `slurm/fix_me_2.slurm` too, and resubmit until the Slurm email says it succeeded.

**Bonus — Debug `fix_me_3.slurm`**

One more, hiding yet another setup mistake. Same process:

```bash
sbatch --reservation=class slurm/fix_me_3.slurm
squeue --me
cat logs/fix_me_3_*.err
```
{: .yens }

Troubleshoot with Claude in plan mode, approve the fix, have Claude add the email lines to `slurm/fix_me_3.slurm`, and resubmit until it completes.

**Bonus — Debug `extract_form_3_one_file_broken.slurm`**

The trickiest one: it hides *two* bugs — one in the Slurm script and one in the Python it runs (`scripts/extract_form_3_one_file_broken.py`). Submit it, read the error log, and work through **both** with Claude the same way (plan mode → read the plan → approve → add the email lines → resubmit) until it completes.

</details>

<details markdown="1">
<summary>⭐ Bonus — let Claude read the log for you</summary>

*Print mode — `claude -p`.*

Everything above used Claude Code **interactively**. For a quick, one-off question — or to script it — Claude also runs **non-interactively**: `claude -p "…"` (print mode) runs a single prompt, prints the answer, and exits. No session, no back-and-forth.

Point it at a file — one of the other broken scripts, say:

```bash
claude -p "review scripts/extract_form_3_one_file_broken.py and explain what it does"
```
{: .yens }

Or **pipe** data straight into it. On Linux, every command-line program has two text streams: **standard input** (`stdin`, the text coming *in*) and **standard output** (`stdout`, the text it prints *out*). The pipe symbol `|` connects them — it takes the `stdout` of the command on its left and feeds it as the `stdin` of the command on its right. Because `claude -p` reads from `stdin`, you can pipe a file's contents straight into Claude instead of typing them. Take the `fix_me` error log you just read and let Claude diagnose it in one line:

```bash
cat logs/fix_me_*.err | claude -p "this Slurm job failed — explain the error and suggest a fix"
```
{: .yens }

Because it's just another command that reads `stdin` and prints to `stdout`, you can drop `claude -p` **inside a Slurm job or a shell script** and let it work in **batch mode** — no interactive session at all.

Picture inheriting a whole project you didn't write — a stack of scripts and Slurm jobs. You can wire `claude -p` into those jobs so that, as each one runs unattended, Claude documents the run for you: at the end of the script, pipe the results (or the log) to Claude and have it append a plain-English summary of what ran, what the output means, and anything that looks off — straight into the job's own output. For example, add a few lines to the *end* of a `.slurm` script, after the real work:

```bash
# ... your extraction / analysis commands above ...

# Let Claude write a human-readable summary of this run into the log
cat results/*.json \
  | claude -p "Summarize what this run produced and flag anything unusual." \
  >> logs/run_summary.txt
```
{: .yens }

Submit a batch of these and you come back to finished jobs that have already **documented themselves** — what they did, when, and what to look at — without you watching a single one run.

</details>
