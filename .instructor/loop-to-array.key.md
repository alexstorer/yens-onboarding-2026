# Scale the Loop to an Array — Key

**Instructor use only.** Not served by GitHub Pages (Jekyll builds from `docs/`). Note it
*is* in the students' clone and on the public repo, so treat it as a speed bump, not a lock.

The page deliberately does **not** say "write a script that handles one filing" — reaching
that is the exercise. Nudge with the on-page hints before showing any of this.

## The conclusion they need to reach

An array runs the same script N times, and the only thing that differs is
`SLURM_ARRAY_TASK_ID`. So the work has to be sliced by that number. With 100 filings and
`--array=0-99` the natural slice is **one filing per task**: the task ID indexes the filing
list directly. The Python script therefore loses its loop — it does what one iteration of
Part 1's loop did, for the filing its task ID selects.

Students who keep the loop and add `--array` end up running the whole batch 100 times. That
is the mistake worth catching early: ask what task 7 is doing that task 8 is not.

## `scripts/extract_array.py`

Pick the filing from the task ID:

```python
import sys
import pandas as pd

task_id = int(sys.argv[1])                      # handed over by the array script

# the CSV has a single `urls` column; drop any blank rows
urls = pd.read_csv("data/aws_links.csv")["urls"].dropna()

# keep only the filings themselves — the first row is the folder they live in,
# not a filing — and take the first 100
filings = [u for u in urls if u.endswith(".txt")][:100]

filing = filings[task_id]                       # task_id == 0 is the first filing
```

Extract from it — Day 1's logic with no loop, fetching over the network and letting the API
validate against the schema:

```python
import json
import os

import requests
import anthropic
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic()   # reads ANTHROPIC_API_KEY from the environment

class Form3Filing(BaseModel):
    insider_name: str
    insider_role: List[str]
    company_name: str
    company_cik: str
    filing_date: str

system_prompt = """
You are a data extraction agent for SEC Form 3 filings.

Extract the following fields:
- insider_name: The name of the insider (from reportingOwner or anywhere in the document).
- insider_role: A list of roles the insider holds (Director, Officer, 10% Owner, Other).
- company_name: The issuer's company name.
- company_cik: The CIK number of the issuer (from issuerCik or COMPANY DATA).
- filing_date: The filing date (prefer signatureDate or FILED AS OF DATE).

Return a SINGLE JSON object, not a list. Do not wrap it in an array.
"""

# `filing` is the URL you picked in step a — fetch it over the network
filing_text = requests.get(filing).text

# output_format sends Form3Filing along as a schema the reply has to match
api_response = client.messages.parse(
    model="claude-haiku-4-5",
    max_tokens=4096,
    system=system_prompt,
    messages=[{"role": "user", "content": filing_text}],
    output_format=Form3Filing,
)

# already validated against the schema, so this is a Form3Filing instance
result = api_response.parsed_output
```

Write the result somewhere no other task will touch:

```python
from pathlib import Path

name = filing.split("/")[-1].replace(".txt", ".json")
output_path = Path("results") / name         # results/0000003570-22-000041.json
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(result.model_dump_json(indent=2))
```

## `slurm/extract_array.slurm`

```bash
#!/bin/bash
#SBATCH --job-name=extract-array
#SBATCH --partition=normal
#SBATCH --output=logs/extract_%A_%a.out
#SBATCH --error=logs/extract_%A_%a.err
#SBATCH --time=00:10:00
#SBATCH --mem=2G
#SBATCH --cpus-per-task=1
#SBATCH --array=0-99

cd $HOME/yens-onboarding-2026
source .venv/bin/activate

python scripts/extract_array.py "$SLURM_ARRAY_TASK_ID"
```

`--mem=2G` and `--cpus-per-task=1` are the honest answers — one filing at a time, and the
work waits on the API rather than computing. `--time` is per task, so it covers one filing
plus queue jitter, not a hundred.

## Failure modes, in the order you will see them

| Symptom | Cause |
|---|---|
| Job vanishes, no log at all | `logs/` did not exist. Slurm resolves `--output` at submit time and will not create the directory. |
| `ModuleNotFoundError` in every task | No venv. A fresh shell on a compute node does not inherit yours — the `source` line is required. |
| One ordinary job, not 100 tasks | `#SBATCH --array` missing, or placed below the first real command. `SLURM_ARRAY_TASK_ID` is then unset. |
| Runs clean, `results/` empty | Script computes `result` but never writes it. The likeliest single bug — the three snippets above only assemble if the last one is present. |
| First filing skipped, last task `IndexError` | 1-based thinking: `filings[task_id - 1]`. Tasks and the list both count from 0 here, so no shift. |
| All tasks overwrite one file | Output path not derived from the filing or the task ID. |
| Job sits in `PD` far longer than expected | `--reservation=class_cpu` omitted, so they are queueing against the whole cluster. |
| "It didn't work" with no detail | They have not opened a per-task `.err`. Point at one failing task's file, not the whole glob. |

## Done looks like

```bash
ls results/*.json | wc -l        # 100
sacct -j JOBID --format=JobID,State,Elapsed,MaxRSS
```

`MaxRSS` well under the requested `--mem` is the normal result, and worth saying out loud:
over-asking for memory is the default mistake.

## Bonus — merge to CSV

```python
# scripts/merge_results.py — combine the array's per-filing JSON into one CSV
import json
from pathlib import Path

import pandas as pd

RESULTS_DIR = Path("results")
OUTPUT_CSV = Path("results/extracted_filings.csv")

rows = []
for f in sorted(RESULTS_DIR.glob("*.json")):
    data = json.loads(f.read_text())
    data["filing"] = f.stem          # keep a record of which filing each row came from
    rows.append(data)

df = pd.DataFrame(rows)
df.to_csv(OUTPUT_CSV, index=False)

print(f"Wrote {len(df)} rows to {OUTPUT_CSV}")
```

A failed task simply left no file, so it never turns up in the glob and nothing crashes.
That is also why the count matters: fewer than 100 rows means some tasks did not finish.

The page asks them to have Claude write this and then **document it as a step** in the
README — the point being that a merge is part of the pipeline, not a one-off.

### Going further — the dependency job

```bash
sbatch --dependency=afterok:ARRAYJOBID slurm/merge_results.slurm
```

`afterok` holds the job in `PD` until the array exits cleanly, then releases it; if any task
fails, it never runs. Two things students get wrong: passing a *task* ID (`12345678_3`)
instead of the array's job ID, and expecting `afterok` to fire when some tasks failed — it
will not, which is the whole point. `afterany` is the flag for "run regardless".
