---
layout: default
title: "1. Hello World Array"
parent: "Part 2 — Submit a Job Array"
grand_parent: "Day 2 — The Yen-Slurm Cluster"
nav_order: 1
permalink: /day2/hello-world-array/
---

# Hello World Array

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
> **Task:** Submit `slurm/hello_array.slurm` unchanged, and confirm you got
> four tasks and four separate logs out of one submission.

The repo ships two scripts that do the same trivial thing — one as a single job, one as an
array. Read them both:

```bash
cat slurm/hello.slurm
cat slurm/hello_array.slurm
```
{: .yens }

You can spot the difference by eye, but let `diff` isolate it:

```bash
diff slurm/hello.slurm slurm/hello_array.slurm
```
{: .yens }

<details markdown="1">
<summary>📖 How to read diff output</summary>

`diff` tells you how to turn the **first** file into the **second**. Lines starting with
`<` come from the first file (`hello.slurm`), lines starting with `>` from the second
(`hello_array.slurm`), and `---` separates the two sides.

The lines in between are line numbers, with a letter saying what happens there:

| | | |
|---|---|---|
| `c` | **change** | `2c2` — line 2 becomes line 2. `4,5c4,5` — lines 4–5 become lines 4–5. |
| `a` | **add** | `8a9` — after line 8 of the first file, add line 9 of the second. Only a `>` side, because there is nothing in the first file to show against it. |
| `d` | **delete** | Doesn't appear here — nothing was removed. |

One thing worth noticing: the last chunk is `12c13`, not `12c12`. Once a line has been
added, the two files no longer agree on numbering — `echo "Hello, world!"` is line 12 of
`hello.slurm` but line 13 of `hello_array.slurm`.

If two files are identical, `diff` prints nothing at all.

</details>

One directive is genuinely new — `--array=0-3` — and that is what turns one job into four.
The job name and the log paths are also different.

{: .note }
> **`%j`, `%A` and `%a`.** Slurm substitutes these when it writes the log file. `%j` is the
> job ID, which is all a single job needs. An array needs two numbers: **`%A` is the
> array's job ID**, the same for all four tasks, and **`%a` is that task's own index**. So
> `hello_%A_%a.out` lands as `hello_12345678_0.out`, `hello_12345678_1.out` and so on —
> four separate files, rather than four tasks overwriting one.

Submit it:

```bash
mkdir -p logs
sbatch --reservation=class slurm/hello_array.slurm
squeue --me
```
{: .yens }

You get **one** job ID back, but `squeue` shows four rows — `12345678_0` through
`12345678_3`. When they finish:

```bash
cat logs/hello_*_*.out
```
{: .yens }

That one `sbatch` produced four logs, each printing a different task number.

<svg viewBox="0 0 720 310" role="img" aria-labelledby="array-title array-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:720px;height:auto;margin:1.5rem auto" font-family="'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="array-title">One array script fans out into many tasks</title>
  <desc id="array-desc">A single submission script with the directive array equals 0 to N minus 1 fans out into N independent tasks, numbered 0, 1, 2 and so on up to N minus 1. What each task does is determined by your code together with its array task ID.</desc>
  <!-- fan-out connectors (drawn first, behind boxes) -->
  <line x1="224" y1="147" x2="356" y2="40"  stroke="#cbd3e0" stroke-width="1.5"/>
  <line x1="224" y1="147" x2="356" y2="102" stroke="#cbd3e0" stroke-width="1.5"/>
  <line x1="224" y1="147" x2="356" y2="164" stroke="#cbd3e0" stroke-width="1.5"/>
  <line x1="224" y1="147" x2="356" y2="254" stroke="#cbd3e0" stroke-width="1.5"/>
  <rect x="24" y="115" width="200" height="64" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="124" y="141" font-size="14" font-weight="700" fill="#2c3e50" text-anchor="middle">Slurm script</text>
  <text x="124" y="164" font-size="12" fill="#6a7280" text-anchor="middle" font-family="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, monospace">--array=0–(N−1)</text>
  <rect x="356" y="14" width="340" height="52" rx="8" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="526" y="36" font-size="13.5" fill="#2c3e50" text-anchor="middle">task 0</text>
  <text x="526" y="55" font-size="11" fill="#6a7280" text-anchor="middle">determined by your code <tspan font-weight="700">and</tspan> SLURM_ARRAY_TASK_ID</text>
  <rect x="356" y="76" width="340" height="52" rx="8" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="526" y="98" font-size="13.5" fill="#2c3e50" text-anchor="middle">task 1</text>
  <text x="526" y="117" font-size="11" fill="#6a7280" text-anchor="middle">determined by your code <tspan font-weight="700">and</tspan> SLURM_ARRAY_TASK_ID</text>
  <rect x="356" y="138" width="340" height="52" rx="8" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="526" y="160" font-size="13.5" fill="#2c3e50" text-anchor="middle">task 2</text>
  <text x="526" y="179" font-size="11" fill="#6a7280" text-anchor="middle">determined by your code <tspan font-weight="700">and</tspan> SLURM_ARRAY_TASK_ID</text>
  <text x="526" y="214" font-size="18" fill="#6a7280" text-anchor="middle">⋮</text>
  <rect x="356" y="228" width="340" height="52" rx="8" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="526" y="250" font-size="13.5" fill="#2c3e50" text-anchor="middle">task N−1</text>
  <text x="526" y="269" font-size="11" fill="#6a7280" text-anchor="middle">determined by your code <tspan font-weight="700">and</tspan> SLURM_ARRAY_TASK_ID</text>
  <!-- caption -->
  <text x="360" y="302" font-size="13.5" fill="#6a7280" text-anchor="middle">One submission becomes N independent tasks, each with its own task ID.</text>
</svg>

The task number is what makes this general. Every task runs the identical script, and `SLURM_ARRAY_TASK_ID` is the only thing that differs between them — so wherever the work needs to vary, you derive it from that number: which file to read, which row of a list to process, which parameter value to try.

<svg viewBox="0 0 720 352" role="img" aria-labelledby="handover-title handover-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:720px;height:auto;margin:1.5rem auto" font-family="'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="handover-title">How a task's array index reaches your Python script</title>
  <desc id="handover-desc">Three stages. Slurm sets the variable SLURM_ARRAY_TASK_ID in every task's environment, here with the value 2. Your Slurm script reads it with bash and passes it to Python as a command-line argument. Your Python script reads that argument back out of sys.argv and converts it to an integer. Every task runs the same script, and only this number differs.</desc>
  <defs>
    <marker id="handover-ah" markerWidth="9" markerHeight="9" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c2cad4"/></marker>
  </defs>

  <rect x="16" y="16" width="688" height="76" rx="10" fill="#f3f4f7" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="36" y="46" font-size="14" fill="#2c3e50"><tspan font-weight="700">Slurm</tspan><tspan font-size="12.5" fill="#6a7280"> sets one variable in every task's environment</tspan></text>
  <text x="36" y="76" font-size="12.5" fill="#2c3e50" font-family="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, monospace">SLURM_ARRAY_TASK_ID=<tspan font-weight="700" fill="#8C1515">2</tspan></text>

  <line x1="360" y1="94" x2="360" y2="122" stroke="#c2cad4" stroke-width="2" marker-end="url(#handover-ah)"/>
  <text x="376" y="112" font-size="12" fill="#6a7280">read by bash as <tspan font-family="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, monospace">$SLURM_ARRAY_TASK_ID</tspan></text>

  <rect x="16" y="124" width="688" height="76" rx="10" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="36" y="154" font-size="14" fill="#2c3e50"><tspan font-weight="700">your .slurm</tspan><tspan font-size="12.5" fill="#6a7280"> passes it to Python as a command-line argument</tspan></text>
  <text x="36" y="184" font-size="12.5" fill="#2c3e50" font-family="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, monospace">python scripts/extract_array.py "$SLURM_ARRAY_TASK_ID"</text>

  <line x1="360" y1="202" x2="360" y2="230" stroke="#c2cad4" stroke-width="2" marker-end="url(#handover-ah)"/>
  <text x="376" y="220" font-size="12" fill="#6a7280">arrives as the argument <tspan font-family="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, monospace" fill="#8C1515" font-weight="700">"2"</tspan></text>

  <rect x="16" y="232" width="688" height="76" rx="10" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="36" y="262" font-size="14" fill="#2c3e50"><tspan font-weight="700">your Python</tspan><tspan font-size="12.5" fill="#6a7280"> reads argument 1 back out of sys.argv</tspan></text>
  <text x="36" y="292" font-size="12.5" fill="#2c3e50" font-family="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, monospace">task_id = int(sys.argv[1])<tspan fill="#6a7280">   # </tspan><tspan font-weight="700" fill="#8C1515">2</tspan></text>

  <text x="360" y="336" font-size="13.5" fill="#6a7280" text-anchor="middle">One task shown. Task 0 gets 0, task 1 gets 1 — same script, a different number each time.</text>
</svg>

{: .note }
> The script could equally read the variable straight from its environment with
> `os.environ["SLURM_ARRAY_TASK_ID"]` and take no argument at all. Passing it in keeps the
> handover visible in the `.slurm`, and lets you run a single task by hand to test it:
>
> ```bash
> python scripts/extract_array.py 0
> ```
> {: .yens }
