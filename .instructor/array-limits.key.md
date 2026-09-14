# Yen-Slurm Array Limits — Key

**Instructor use only.** Not served by GitHub Pages (Jekyll builds from `docs/`). It *is* in
the students' clone and on the public repo, so treat it as a speed bump, not a lock.

The page states the limit and then stops. Both routes below are deliberately absent from it —
work the nudges before showing either.

## The reasoning they need to reach

992 filings, and a hard ceiling of 512 tasks per array. Only one thing is actually forbidden:
one array with one task per filing. Two assumptions are theirs to drop —

- **one filing per task** → give each task several, and the array shrinks below the cap
- **one submission** → submit twice, and tell the second where its slice starts

Either is a correct answer. The first is cleaner; the second teaches more about how Slurm
hands information to a job.

## Route 1 — more filings per task (no offset needed)

```bash
sbatch --reservation=class_cpu --array=0-99 slurm/extract_array.slurm
```

with the script taking a slice rather than a single item:

```python
filings[task_id * 10 : task_id * 10 + 10]
```

100 tasks × 10 filings covers 992 with the last task taking two — Python's slicing handles
the short tail without a special case, which is worth pointing out. The per-task `--time` now
has to cover ten API calls, not one; that is the only directive that has to change.

## Route 2 — two submissions with an offset

Both arrays must start at 0, so the second needs telling which slice is its own:

```bash
sbatch --reservation=class_cpu --array=0-511 slurm/extract_array.slurm

sbatch --reservation=class_cpu --array=0-479 \
       --export=ALL,OFFSET=512 slurm/extract_array.slurm
```

and the `.slurm` adds it on before handing over:

```bash
python scripts/extract_array.py $(( SLURM_ARRAY_TASK_ID + ${OFFSET:-0} ))
```

`ALL` matters — without it, `--export` replaces the environment rather than adding to it, and
the job loses everything else it needs. The `:-0` default is what leaves the first submission
working unchanged, so there is one script rather than two.

Indices check out: `0`–`511` then `0`–`479` with +512 covers filings 0–991 inclusive, and no
index ever exceeds 511.

## Common wrong turns

| What they try | What happens |
|---|---|
| `--array=0-991` | Refused outright. This is the intended first move — the page tells them to try it. |
| `--array=512-991` for the second half | Also refused. The cap is on the index, on *every* submission; there is no second window. This is the most common misunderstanding. |
| `--array=1-512` | Refused — index 512 is out of bounds. Off-by-one against `MaxArraySize`, not against the filing list. |
| Two arrays, no offset | Runs fine and processes the first 512 filings twice. Silent, and only the file count reveals it. |
| Route 1 with unchanged `--time` | Tasks hit the time limit partway through their ten and die. `sacct` shows `TIMEOUT`. |
| Forgetting `ALL` in `--export` | The job starts with almost no environment; usually surfaces as a missing venv or `ANTHROPIC_API_KEY`. |

## Worth mentioning if there is time

`--array=0-511%20` throttles to 20 running at once without changing how many tasks exist.
The page has this in its limits table; it is the thing most people wish they had known
earlier, and it is the polite way to run a big array on a shared partition.

## Done looks like

```bash
ls results/*.json | wc -l        # 992
sacct -j JOBID --format=JobID,State,Elapsed,MaxRSS
```

A short count is not a failure to fix by rerunning blindly — have them look at a per-task
`.err` first, then resubmit and let rerun-safety skip what is already done.
