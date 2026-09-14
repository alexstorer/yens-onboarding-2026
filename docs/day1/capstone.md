---
layout: default
title: "Day 1 Part 2 Capstone"
parent: "Part 2 — Python & AI"
grand_parent: "Day 1 — Foundations & AI"
nav_order: 6
permalink: /day1/capstone/
---

# Day 1 Part 2 Capstone

## The Genre Tribunal

Research often requires judgment calls: coding an interview response, deciding whether a
paper meets inclusion criteria, or classifying a firm's activity. Movie genres give us a
small example of the same problem. A film can fit more than one category, so two reasonable
classifiers may disagree.

You'll build a pipeline that labels movies, checks each label with a second model, and
flags cases for human review. Keep a record of how each decision was reached.

{: .exercise }
> **The challenge:** Process all **10 movies** in `data/top_rated_movies.csv`.
> Use **Haiku for classification** and **Sonnet for judging**, a different model for each
> of the pipeline's two AI stages. Flag contested results in Python and write
> `results/genre_verdicts.json`. Commit your script, results, and a short README section,
> then push them to your fork.

{: .note }
> Start here in class and finish in your own time. An unfinished capstone does not block
> Day 2, which uses the batch extraction script supplied in the repo.

## The Pipeline

| Step | What happens |
|---|---|
| **Menu** | Define a fixed set of genre labels with a Pydantic-compatible `Enum` |
| **Pick** | Haiku selects one genre and gives a one-sentence reason |
| **Check** | Sonnet sees the overview and selected genre, but not Haiku's reason |
| **Decide** | Python flags disagreements or certainty scores below 70 |
| **Record** | Save both judgments, reasons, model IDs, and the review flag |

<svg viewBox="0 0 660 660" role="img" aria-labelledby="genre-title genre-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:660px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="genre-title">The Genre Tribunal pipeline</title>
  <desc id="genre-desc">Each movie goes to Haiku for classification. Sonnet checks the overview and predicted genre without seeing Haiku's reason. Python flags disagreements or certainty below 70 and saves every row, both reasons, and model IDs to genre_verdicts.json.</desc>
  <defs><marker id="genre-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#e67e22"/></marker></defs>
<rect x="36" y="16" width="588" height="88" rx="12" fill="#fff8ef" stroke="#e6cfa8" stroke-width="1.5"/>
<text x="330" y="47" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Movie input</text>
<text x="330" y="75" text-anchor="middle" font-size="14" fill="#5b6472">id, title, and overview for all 10 movies</text>
<line x1="62" y1="106" x2="62" y2="142" stroke="#e67e22" stroke-width="2.5" marker-end="url(#genre-arrow)"/>
<text x="82" y="129" font-size="14" fill="#b3611a">overview</text>
<rect x="36" y="144" width="588" height="88" rx="12" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
<text x="330" y="175" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Classifier: Haiku</text>
<text x="330" y="203" text-anchor="middle" font-size="14" fill="#5b6472">Choose one of 17 labels and give a one-sentence reason.</text>
<line x1="62" y1="234" x2="62" y2="270" stroke="#e67e22" stroke-width="2.5" marker-end="url(#genre-arrow)"/>
<text x="82" y="257" font-size="14" fill="#b3611a">overview + predicted genre; classifier reason withheld</text>
<rect x="36" y="272" width="588" height="88" rx="12" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
<text x="330" y="303" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Judge: Sonnet</text>
<text x="330" y="331" text-anchor="middle" font-size="14" fill="#5b6472">Report agreement, certainty, reason, and an alternative.</text>
<line x1="62" y1="362" x2="62" y2="398" stroke="#e67e22" stroke-width="2.5" marker-end="url(#genre-arrow)"/>
<text x="82" y="385" font-size="14" fill="#b3611a">validated judge fields</text>
<rect x="36" y="400" width="588" height="88" rx="12" fill="#e3f2e6" stroke="#b7ddba" stroke-width="1.5"/>
<text x="330" y="431" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Review rule: Python</text>
<text x="330" y="459" text-anchor="middle" font-size="14" fill="#5b6472">Flag when the judge disagrees or certainty is below 70.</text>
<line x1="62" y1="490" x2="62" y2="526" stroke="#e67e22" stroke-width="2.5" marker-end="url(#genre-arrow)"/>
<text x="82" y="513" font-size="14" fill="#b3611a">keep flagged rows and both model judgments</text>
<rect x="36" y="528" width="588" height="88" rx="12" fill="#fff8ef" stroke="#e6cfa8" stroke-width="1.5"/>
<text x="330" y="559" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Save all 10 verdicts</text>
<text x="330" y="587" text-anchor="middle" font-size="14" fill="#5b6472">results/genre_verdicts.json + printed summary</text>
<text x="330" y="646" text-anchor="middle" font-size="14" fill="#6a7280">Two model calls per movie; your code decides what needs review.</text></svg>

Use **`claude-haiku-4-5`** as the classifier and **`claude-sonnet-5`** as the judge, the
same models used in the extraction lesson. Both calls use your existing Anthropic client
and the course's direct API key. No Stanford Gateway key is needed.

The judge gets a different model ID and does not receive the classifier's explanation.
This reduces one source of influence, but it does not make the judgments statistically
independent. The judge still sees the proposed label, and both models may make similar errors.

## 1. Read the 10 Movies

Create `day1/genre_tribunal.py` beside your `anthropic_test.ipynb` notebook. Run it from
the `day1/` folder, so `../data/`, `../results/`, and `../.env` point to the repo root.

Start with the environment and client setup from the previous lesson:

```python
from dotenv import load_dotenv
import anthropic
import pandas as pd

load_dotenv("../.env")
client = anthropic.Anthropic()

df = pd.read_csv("../data/top_rated_movies.csv")
for row in df.itertuples():
    print(row.id, row.title, row.overview[:80])
```

The CSV contains ten movies. Use `id`, `title`, and `overview`; there is no genre column,
so you are creating the labels. Each movie gets one classification call to Haiku and one
judging call to Sonnet, for 20 model calls in a complete run without retries.

## 2. Classify Each Movie

Send the overview to Haiku and request:

- `genre`: one label from the list below
- `reason`: one sentence explaining the choice

```text
Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family,
Fantasy, Horror, Mystery, Romance, Science Fiction, Thriller, War, Western, Other
```

There are **17 labels, including Other**. Define them in an `Enum` and use that type in
your Pydantic classifier schema. Validate the returned genre and reason before continuing.
Reuse the structured-output approach from
[Extracting Data with an LLM]({{ '/day1/extracting-data-with-an-llm/' | relative_url }}).

<details markdown="1">
<summary>Hint: using the Anthropic structured-output helper</summary>

Pass your Pydantic class to `client.messages.parse(output_format=YourSchema, ...)`,
then read `response.parsed_output`. Supply the model, messages, and a sufficient
`max_tokens` budget as in the extraction lesson. Check for missing parsed output and
record a failure rather than inventing a result.

</details>

Keep the reason in your results even though you will not send it to the judge. It helps
a reviewer assess whether the explanation supports the label.

{: .note }
> **The label list is a research choice.** Animation describes a medium, while Action
> describes a genre; a movie may fit both. Choosing one label loses information. Frequent
> use of Other or repeated disagreements may indicate that the categories need revision.

## 3. Check with a Second Model

Call Sonnet with the movie's overview and the predicted genre. **Do not include the
classifier's reason.** Start a separate request rather than continuing the classifier's
conversation.

Define and validate these fields with Pydantic:

| Field | Type | Meaning |
|---|---|---|
| `agrees` | `bool` | Whether the judge agrees with the proposed genre |
| `certainty` | `int`, 0 to 100 | The judge's reported certainty |
| `reason` | `str` | A one-sentence explanation |
| `suggested_genre` | `Genre` or `None` | An alternative when the judge disagrees; otherwise `None` |

Enforce the certainty range in the schema. Check that a disagreement includes an
alternative and that an agreement uses `None`.

The certainty score is a model report, not a measured probability of correctness.

## 4. Flag Cases for Human Review

Apply the review rule in Python:

```python
needs_human_review = (not verdict.agrees) or (verdict.certainty < 70)
```

Keep every row, including flagged ones. Record `suggested_genre` without automatically
replacing the original prediction. A human reviewer can then compare both judgments.

Log progress by movie ID and use a warning when a row is flagged. If a request or
validation fails, record which movie failed and why. A failure is not an agreement.

## 5. Save the Results and Summarize

Write a JSON array to `../results/genre_verdicts.json`, with one object per movie. Include
all the fields in this illustrative example; your judgments and scores may differ:

```json
[
  {
    "id": 13448,
    "title": "Angels & Demons",
    "predicted_genre": "Thriller",
    "classifier_reason": "The overview describes a conspiracy investigation under time pressure.",
    "agrees": true,
    "certainty": 85,
    "judge_reason": "The investigation and suspense support the Thriller label.",
    "suggested_genre": null,
    "needs_human_review": false,
    "classifier_model": "claude-haiku-4-5",
    "judge_model": "claude-sonnet-5"
  }
]
```

Create the output folder if needed:

```python
from pathlib import Path

Path("../results").mkdir(exist_ok=True)
```

Print a summary with the agreement count and rate, minimum/median/maximum certainty,
and number flagged. For example:

```text
agreement rate ........  7/10 (70%)
certainty min/med/max ..  60 / 85 / 95
flagged for review ....  4/10
```

**Agreement is not accuracy.** There is no reference genre column, and both models can
agree on a poor label. Read the flagged cases and a few agreements against the overviews.
Note which cases you would resolve differently and why. Do not treat a high certainty
score as proof that a label is correct.

## 6. Run, Document, and Push

From your Yen terminal:

```bash
cd ~/yens-onboarding-2026
source .venv/bin/activate
cd day1
python3 genre_tribunal.py
```
{: .yens }

Add a short **Genre Tribunal** section to the repo's `README.md` covering:

- How to run the script and where it saves results
- Which model performs each role and the review threshold
- Your summary counts and what you found when reviewing the labels
- Any failed requests or unresolved cases

Commit the script, output, and README from the repo root:

```bash
cd ~/yens-onboarding-2026
git add day1/genre_tribunal.py results/genre_verdicts.json README.md
git commit -m "Complete Day 1 Part 2 Genre Tribunal capstone"
git push
```
{: .yens }

You can use Claude Code to help build the script. Review its code and the movie labels
before committing. Keep `.env` out of the commit.

## Completion Check

- The output has ten movie records with validated classifier and judge fields
- The classifier and judge use different model IDs
- The judge did not receive the classifier's reason
- Python applies the review rule and retains flagged rows
- The script prints a summary, and the README records your review
- The script, results, and README are pushed to your fork

{: .note }
> 🟢 **Green sticky** = I completed the checks and pushed my work &nbsp;&nbsp;
> 🔴 **Red sticky** = I need help
>
> Put a sticky note on your laptop lid so instructors can see where you are.

<details markdown="1">
<summary>Optional practice: inspect the review rule</summary>

Using your saved results, recalculate the flags with certainty thresholds of 60 and 80.
How many additional cases would a human need to review? No new model calls are needed.

Consider whether a multi-label codebook would fit these movies better. Record your
proposed change and the cases that motivated it.

</details>

## Day 1 Skills Applied

You used the Yens, a Python environment, an API key loaded from `.env`, structured model
responses, validation, logging, and Git. You also made a research decision explicit in
code: when a model's output needs human review.

Day 2 covers measuring resource use and running jobs through the cluster scheduler.
