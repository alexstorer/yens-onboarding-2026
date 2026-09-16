---
layout: default
title: "Bulk File Operations"
parent: "Reference"
nav_order: 3
permalink: /reference/bulk-file-operations/
---

# Bulk File Operations

This page teaches you how to inspect and organize hundreds of files at once from
the shell — no loops and no Python. You start with a few hundred files dumped in
one directory, in the state a vendor delivery or an instrument export usually
arrives in, and impose a structure on them.

It is **optional background reading** — nothing in class depends on it. Work through it on
your own laptop whenever you like; it takes about 25 minutes.

{: .note }
> This page assumes you have already done [Command Line Basics]({{ '/reference/command-line-basics/' | relative_url }}) —
> `pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`, and the difference between an
> absolute and a relative path.

---

## The Situation

A few hundred files. No subdirectories. Names that encode everything you need to
know, if you can read them. Your job, before any analysis, is to work out what
you actually received and give it a shape.

**Step 1 — Make the dataset**

We'll generate the files locally so there's nothing to download. Open Terminal
(macOS) or Git Bash (Windows) and run:

```bash
mkdir -p ~/Desktop/filings
cd ~/Desktop/filings
touch {AAPL,MSFT,XOM,JPM,PFE}_{2019,2020,2021,2022,2023}_{form3,form4,form5}_{raw,clean,flagged,void}.txt
rm XOM_2021_form4_*.txt
```

- `touch` creates empty files. The `{a,b,c}` parts are **brace expansion**: the
  shell multiplies every combination out, so those five tickers × five years ×
  three form types × four processing states become one command instead of 300.
- The `rm` line is there on purpose. Hold on to that thought — you'll meet it
  again in the last exercise.

The naming convention is:

```text
TICKER_YEAR_FORM_STATUS.txt
```

Four facts per filename, which means four different ways you could group the
directory. Choosing between them is part of the work.

---

## Asking Questions with Wildcards

The `*` wildcard matches any run of characters, so you can list just the files
whose names contain a given piece. This is the fastest way to get a feel for a
messy directory:

```bash
ls *_2021_*          # every file from 2021
ls AAPL_*            # every Apple file
ls *_form3_*         # every Form 3
ls *_flagged.txt     # every file flagged during processing
```

`*` can go anywhere in the pattern, and you can use more than one — so
`ls AAPL_*_form3_*` matches Apple's Form 3 files across all five years. Try a few
combinations.

---

## Counting with Pipes

The `|` character is a **pipe**: it takes the output of one command and feeds it
as the input to the next. That lets you build a question out of small pieces. Two
commands pair especially well with `ls`:

- `wc -l` counts lines
- `head -N` shows only the first N lines

```bash
ls | wc -l                   # how many files in total
ls | head -20                # just the first 20 names
ls *_2021_* | wc -l          # how many files from 2021
ls *_void.txt | wc -l        # how many were voided
```

Read a pipeline left to right: *list the 2021 files, then count how many lines
that produces.* You will reach for this pattern — `ls` a subset, pipe it to a
counter or a filter — constantly in real work.

{: .tip }
> `ls | wc -l` should report **296**, not 300. That is not a mistake in the
> instructions. Keep going; the last exercise is about finding out why.

---

## Try It by Hand First

Before you go further, open **Finder** (macOS) or **File Explorer** (Windows) and
navigate to `Desktop/filings/`. Create a folder called `AAPL` and drag ten Apple
files into it by hand.

Now imagine doing that for all 296 files across five tickers. How long would it
take? What happens when the next delivery is 10,000 files?

That is the problem the next section solves — and it is the first shell skill you
will actually use in your own research, every time a new dataset lands.

{: .note }
> Undo the hand-sorting before you continue, so the commands below start from a
> flat directory: `mv AAPL/* . && rmdir AAPL`

---

## Sorting with Wildcards

`AAPL_*` matches every filename starting with `AAPL_`, so you can move all of
them into a folder in one command:

```bash
cd ~/Desktop/filings
mkdir -p AAPL MSFT XOM JPM PFE

mv AAPL_* AAPL/
mv MSFT_* MSFT/
mv XOM_*  XOM/
mv JPM_*  JPM/
mv PFE_*  PFE/
```

**Verify it.** Use the pipe from before — `ls AAPL/ | wc -l` lists what's in
`AAPL/` and counts it:

```bash
ls AAPL/ | wc -l
ls MSFT/ | wc -l
ls XOM/  | wc -l
ls JPM/  | wc -l
ls PFE/  | wc -l
```

Four of those report 60. One doesn't.

You can also count across every subdirectory at once. `*/*` reaches into each
immediate subdirectory, so:

```bash
ls */*.txt | wc -l    # 296 — everything, now organized
```

---

## Filtering and Saving a List

Say you need a list of every Form 4 in the delivery, to hand to a collaborator.

`grep` searches its input for a pattern. Combined with `ls` and a pipe, it filters
filenames by any part of their name:

```bash
ls */*.txt | grep "_form4_"
```

The `>` operator redirects output into a file instead of printing it to the
screen. If the file already exists it is **overwritten**; `>>` appends instead.

```bash
ls */*.txt | grep "_form4_" > form4_files.txt
cat form4_files.txt          # view what you just wrote
wc -l form4_files.txt        # how many Form 4 files there are
```

---

## Exercise — Audit the Delivery

You know 4 files are missing. Pretend you don't. **Find them** the way you would
in real work: by counting what you have and looking for the number that breaks
the pattern.

Every ticker should have one file for each of 5 years × 3 forms × 4 states.

`cut` splits each line on a delimiter and keeps the fields you name. `sort` groups
identical lines together. `uniq -c` counts runs of identical lines — which is why
you have to sort first. `sort -n` then sorts those counts numerically.

Try to build the pipeline yourself before expanding the solution.

<details markdown="1">
<summary>Solution</summary>

Count the files per ticker-and-year:

```bash
ls */*.txt | cut -d'/' -f2 | cut -d'_' -f1,2 | sort | uniq -c | sort -n | head
```

- `cut -d'/' -f2` — drop the directory prefix, keep the filename
- `cut -d'_' -f1,2` — split on `_`, keep fields 1 (ticker) and 2 (year)
- `sort` — group identical ticker-year pairs together
- `uniq -c` — count each group
- `sort -n | head` — smallest counts first

Every pair reports 12 except `XOM_2021`, which reports 8. Narrow it down:

```bash
ls XOM/XOM_2021_* | cut -d'_' -f3 | sort | uniq -c
```

`form3` and `form5` have 4 files each; `form4` has none. **XOM's 2021 Form 4
filings never arrived.**

</details>

{: .important }
> This is the whole point of the exercise. A missing-data problem you find by
> counting files takes two minutes. The same problem found three months later,
> as an unexplained gap in a regression, costs you a week and a lot of confidence
> in your own results. Count what you were given, *before* you analyze it.

---

## Document What You Did

Always leave a note explaining the structure and why it's that way. Create a
`README.md` in the folder:

```bash
nano ~/Desktop/filings/README.md
```

Write something like:

```text
# Filings delivery — sorted

296 files, grouped into one directory per ticker:
AAPL/, MSFT/, XOM/, JPM/, PFE/

Filename format:
  TICKER_YEAR_FORM_STATUS.txt

Known gap: XOM 2021 form4 is missing (4 files). Expected 300, received 296.

Organized: [today's date]
```

Save with `Ctrl+O`, exit with `Ctrl+X`.

Documenting your organization decisions while they are fresh — especially the
known gaps — is one of the highest-leverage habits in research computing. In six
months, that note is the difference between a known limitation and a mystery.

---

## Bonus

**Group by processing state as well**

Your files are grouped by ticker. You might also want every flagged file across
all five tickers in one place.

Use `cp` rather than `mv`, so the files stay in their ticker folders too.

*Think before you type: what pattern matches all flagged files regardless of
which ticker folder they are in?*

<details markdown="1">
<summary>Solution</summary>

```bash
cd ~/Desktop/filings
mkdir -p raw clean flagged void

cp */*_raw.txt     raw/
cp */*_clean.txt   clean/
cp */*_flagged.txt flagged/
cp */*_void.txt    void/
```

`*/*_flagged.txt` reaches into every immediate subdirectory at once, so it matches
flagged files inside `AAPL/`, `MSFT/`, `XOM/`, `JPM/`, and `PFE/` in one command.
Using `cp` instead of `mv` means each file now lives in two places at once: its
ticker folder and its state folder.

Worth noticing: that's a real tradeoff, not a free win. Two copies means two
things to keep in sync, and twice the disk. A symlink or a plain index file is
often the better answer — but `cp` is the one-liner, and knowing when the
one-liner is good enough is its own skill.

</details>

**Which year is thinnest?**

Count files per year across the whole delivery, rather than per ticker.

<details markdown="1">
<summary>Solution</summary>

```bash
ls */*.txt | cut -d'/' -f2 | cut -d'_' -f2 | sort | uniq -c | sort -n
```

2021 comes out at 56 instead of 60 — the same gap you found before, seen from a
different angle. Slicing the same data two ways and getting a consistent story is
how you build confidence that you understand a dataset.

</details>
