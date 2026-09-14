---
layout: default
title: "Part 1 Checkpoint"
parent: "Part 1 — Setup"
grand_parent: "Day 1 — Foundations & AI"
nav_order: 5
permalink: /day1/part1-checkpoint/
---

# Part 1 Checkpoint

Nobody learns the terminal, cluster storage, git and Claude Code in an hour, and Part 1
did not try to. What it did was get each of them working once, in your hands, on a real
repo — which is the part you cannot read your way to.

Before moving on, here is a sanity check to make sure you're ready for Part 2. If you had
to skip over some material in Part 1, that's OK! You can always come back and review it
later.

{: .important }
> **If one of these fails, put up a red sticky right away.** Part 2 will build on this, so
> let's get it straightened out as soon as possible.

---

## What You Should Be Able to Do

| # | Skill | Where you learned it |
|---|---|---|
| 1 | Reach the Yens over SSH | [Connecting to the Yens]({{ '/day1/connect-to-the-yens/' | relative_url }}) |
| 2 | Have git and Claude configured and authenticated | [Git & GitHub]({{ '/day1/git-and-github/' | relative_url }}) · [Working with Claude Code]({{ '/day1/claude-code/' | relative_url }}) |
| 3 | Fork, branch, commit and push — on this course's own repo | [Git & GitHub]({{ '/day1/git-and-github/' | relative_url }}) |
| 4 | Get Claude Code to drive git for you | [Working with Claude Code]({{ '/day1/claude-code/' | relative_url }}) |

---

## The Run

### 1 — SSH to the Yens

From **your laptop**, in a terminal — Terminal on macOS, Git Bash or PowerShell on Windows:

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

### 2 — git and Claude are configured

Still on the Yens:

```bash
ml gh-cli claude-code       # both are modules — load them first
gh auth status              # should say: Logged in to github.com account YOUR_USERNAME
claude                      # should open, signed in, not asking you to log in
```
{: .yens }

Inside Claude, confirm the skill took:

```
> do you have the github-for-research skill?
```
{: .claude }

If `gh auth status` reports you are not logged in, your token never landed — go back to
[Step 3 of the Git exercise]({{ '/day1/git-and-github/#exercise' | relative_url }}). The
push in check 3 proves the other half: if it asks you for a password, you ran
`gh auth login` but not `gh auth setup-git`.

### 3 — git and GitHub, on this very site

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

### 4 — Let Claude drive

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
> you can tell when Claude gets it wrong. That is the whole reason step 3 comes before
> step 4 and not the other way round.

---

## Before You Move On

{: .note }
> 🟢 **Green sticky** = all four ran &nbsp;&nbsp; 🔴 **Red sticky** = one of them didn't
>
> Put the sticky up before you take a break, not after — an instructor can come to you
> while you are away from the keyboard anyway.

If you are green on all four, you have a working research setup: a machine you can reach,
an identity it recognizes, and a version-controlled place to put the results — plus an
assistant that can operate all of it on your behalf.

Everything in Part 2 is what you *do* with that.

{: .aside }
> Nothing here is specific to this course. The same four are what a new collaborator on
> any Stanford research project needs on their first day, and roughly the checklist worth
> running whenever you get access to an unfamiliar machine.
