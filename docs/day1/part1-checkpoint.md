---
layout: default
title: "Part 1 Checkpoint"
parent: "Part 1 — Setup"
grand_parent: "Day 1 — Foundations & AI"
nav_order: 5
permalink: /day1/part1-checkpoint/
---

# Part 1 Checkpoint

Everything in Part 1 was setup. Nothing you have built yet does any
research — but from here on, every section assumes all of it works.

This checkpoint is how you find out. It is six things, in one continuous run, and it
should take about ten minutes — budget for it, because it is the last thing in the block
before the 10:30 lecture, and it is the point of the block. Do it **before you start
Part 2**, while there is still someone circulating who can fix whatever is broken.

{: .important }
> **A red sticky here is the cheapest one you will ever put up.** Everything in Part 2 —
> Python environments, API keys, the extraction script, tomorrow's cluster jobs — builds
> directly on this. A login that half-works costs you ten minutes now and the rest of the
> morning later.

---

## What You Should Be Able to Do

Six things. Each one is a section you just worked through, and each has a one-line
check you can run.

| # | Skill | Where you learned it |
|---|---|---|
| 1 | Use the command line on your own laptop | [Command Line Basics]({{ '/reference/command-line-basics/' | relative_url }}) — optional reading |
| 2 | Reach the Yens over SSH | [Connecting to the Yens]({{ '/day1/connect-to-the-yens/' | relative_url }}) |
| 3 | Have git and Claude configured and authenticated | [Git & GitHub]({{ '/day1/git-and-github/' | relative_url }}) · [Working with Claude Code]({{ '/day1/claude-code/' | relative_url }}) |
| 4 | Copy files between your laptop and the Yens | [Transferring Files]({{ '/reference/transferring-files/' | relative_url }}) |
| 5 | Fork, branch, commit and push — on this course's own repo | [Git & GitHub]({{ '/day1/git-and-github/' | relative_url }}) |
| 6 | Get Claude Code to drive git for you | [Working with Claude Code]({{ '/day1/claude-code/' | relative_url }}) |

The order matters. Each one is the thing the next one stands on: a terminal gets you an
SSH session, the session is where git and Claude are configured, and those are what let
you move work — by hand in (5), and by asking in (6).

---

## The Run

{: .exercise }
> Work down the six. Run each check, and stop at the first one that doesn't do what it
> says — a later step failing is almost always an earlier step that only looked fine.

### 1 — A terminal on your own laptop

On **your laptop**, not the Yens. Terminal on macOS, Git Bash or PowerShell on Windows.

Run `pwd` to see where you are, then `ls -a ~` to list your home directory including
hidden files:

```bash
pwd
ls -a ~
```
{: .laptop }

You are looking for two things: the commands run at all, and `ls -a` shows you dotfiles
that a plain `ls` hides. That second one matters more than it looks — `.env`, `.gitignore`
and `.claude` are all coming, and all three are invisible without `-a`.

### 2 — SSH to the Yens

```bash
ssh SUNetID@yen.stanford.edu
```
{: .laptop }

Password, then Duo. You should land on a banner and a prompt on one of `yen1`–`yen5`.

```bash
hostname            # which Yen did the load balancer give me?
whoami              # am I logged in as myself?
```
{: .yens }

{: .warning }
> **This is the one you cannot fix yourself.** If you cannot log in, it is an account
> problem, not a typo — put up a red sticky now. You will pair with someone for
> the rest of the day and can redo the hands-on work that evening.

### 3 — git and Claude are configured

Still on the Yens:

```bash
ml gh-cli
gh auth status                      # should say: Logged in to github.com as YOUR_USERNAME
git config --get credential.helper  # should mention gh — that's `gh auth setup-git`
claude                              # should open, signed in, not asking you to log in
```
{: .yens }

Inside Claude, confirm the skill took:

```
> do you have the github-for-research skill?
```
{: .claude }

If `gh auth status` reports you are not logged in, your token never landed — go back to
[Step 3 of the Git exercise]({{ '/day1/git-and-github/#exercise' | relative_url }}). If
`credential.helper` is empty, you ran `gh auth login` but not `gh auth setup-git`, and
your first `git push` will ask for a password it won't accept.

### 4 — Move a file both ways

This is the one skill on the list you have not practiced yet, and it is the one people
discover is missing at the worst possible moment — usually with data they need on the
cluster and no way to get it there.

Run these **from your laptop**, in a second terminal — not from inside your SSH session.
`scp` needs to name a machine it can reach, and your laptop has no address the Yens can
send to.

```bash
echo "checkpoint" > ~/checkpoint.txt
scp ~/checkpoint.txt SUNetID@yen.stanford.edu:/scratch/users/SUNetID/
scp SUNetID@yen.stanford.edu:/scratch/users/SUNetID/checkpoint.txt ~/checkpoint_back.txt
cat ~/checkpoint_back.txt
```
{: .laptop }

Up, then back down. If `checkpoint` prints, you can move data in both directions —
which is what the rest of the course will ask of you.

{: .note }
> `scp` is `scp SOURCE DESTINATION`, always. Upload and download are the same command
> with the arguments swapped. The full treatment, including directories and the
> trailing-slash trap, is in [Transferring Files]({{ '/reference/transferring-files/' | relative_url }}).

### 5 — git and GitHub, on this very site

You already forked and cloned this course's repo. Worth noticing what that means: **the
page you are reading is a file in it.** `docs/day1/part1-checkpoint.md` is this
checkpoint. The site is not a separate thing the course publishes at you — it is
markdown under version control, and you have a copy.

So edit it. On the Yens:

```bash
cd ~/yens-onboarding-2026
git checkout -b checkpoint
echo "- I got to the Part 1 checkpoint" >> notes.md
git add notes.md
git commit -m "Note reaching the Part 1 checkpoint"
git push -u origin checkpoint
```
{: .yens }

Then open your fork on GitHub and confirm the `checkpoint` branch is there with your
commit on it. If the push succeeded without asking for a password, item 3 is genuinely
working — that is the real thing this step tests.

{: .note }
> Committing to a branch, not `main`. That is the habit the whole course runs on, and
> the reason your `main` still matches the class repo.

### 6 — Let Claude drive

The same operation, asked for rather than typed. In Claude Code, on the Yens:

```
> Use the github-for-research skill. Add a line to notes.md saying I finished the
> Part 1 checkpoint, commit it on the current branch with a message explaining why,
> and push.
```
{: .claude }

Watch what it does before you approve it. You are checking three things: that it picks
up the skill, that it shows you the commit message before making it, and that the push
goes through on your credentials. Read the message it wrote — if it says *what* changed
but not *why*, tell it so and have it try again.

{: .tip }
> This is the loop for the rest of the two days: you know what the git command is, so
> you can tell when Claude gets it wrong. That is the whole reason step 5 comes before
> step 6 and not the other way round.

---

## Before You Move On

{: .note }
> 🟢 **Green sticky** = all six ran &nbsp;&nbsp; 🔴 **Red sticky** = one of them didn't
>
> Put the sticky up before you take a break, not after — an instructor can come to you
> while you are away from the keyboard anyway.

If you are green on all six, you have a working research setup: a machine you can reach,
an identity it recognizes, a way to move data to it, and a version-controlled place to
put the results — plus an assistant that can operate all of it on your behalf.

Everything in Part 2 is what you *do* with that.

{: .aside }
> Nothing here is specific to this course. The same six are what a new collaborator on
> any Stanford research project needs on their first day, and roughly the checklist worth
> running whenever you get access to an unfamiliar machine.
