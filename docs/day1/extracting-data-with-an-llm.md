---
layout: default
title: "Extracting Data with an LLM"
parent: "Part 2 — Python & AI"
grand_parent: "Day 1 — Foundations & AI"
nav_order: 5
permalink: /day1/extracting-data-with-an-llm/
---

# Extracting Data with an LLM

You will make a live call to Anthropic's Messages API, then turn a public SEC Form 3
filing into a validated Python object. The code grows in three deliberately small stages:
a minimal call, a logged and saved result, and schema-constrained structured output.

{: .important }
> **Data boundary:** These exercises use public, Low Risk SEC filings. The course's direct
> Anthropic credential is not approved for sensitive research data. Revisit
> [AI Services & Data Privacy]({{ '/day1/stanford-ai-services/' | relative_url }}) before
> substituting another dataset.

---

## Exercise

{: .important }
> **In this section:** Make a native Anthropic API call, read a Form 3 filing, use Haiku
> while iterating, switch to Sonnet 5 for the final extraction, and validate the response
> against a Pydantic model.

## 1. Make the Smallest Live Call

Continue in `day1/anthropic_test.ipynb`, which you created in Managing API Keys,
and confirm that it uses the **GSB AI 2026** kernel.
The kernel contains `anthropic`, `python-dotenv`, and `pydantic` from your project
environment.

Load the key from the repository root and create the client:

```python
from dotenv import load_dotenv
import anthropic

load_dotenv("../.env")
client = anthropic.Anthropic()
```

Now send one request:

```python
response = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    system="Answer accurately and concisely.",
    messages=[
        {"role": "user", "content": "What does SEC Form 3 disclose?"}
    ],
)

answer = "".join(
    block.text for block in response.content if block.type == "text"
).strip()
print(answer)
```

Anthropic's native Messages API puts the system instruction in the top-level `system`
argument. The conversation in `messages` contains user and assistant turns; there is no
`{"role": "system"}` message.

The response content is a list of typed blocks because Claude can return more than plain
text. Filtering for `block.type == "text"` makes the assumption explicit.

### Read Token Usage

Models process **tokens**, chunks of text that can be smaller than a word. The
**context window** limits how much material a model can work with in a request,
including instructions, messages, and the response. Your prompt and filing contribute
input tokens; the generated answer contributes output tokens.

After the call above, inspect its usage:

```python
print("input:", response.usage.input_tokens)
print("output:", response.usage.output_tokens)
```

Use these counts with the current model price to estimate cost. Measure several
representative filings before estimating a full run.

**Cost and rate limits are separate.** A project may have budget remaining and still
send requests too quickly. Request and input/output token rate limits constrain how
much traffic the account can send in a period. Exceeding them can return HTTP `429`.
See [Anthropic's rate-limit documentation](https://platform.claude.com/docs/en/api/rate-limits)
for the current limits and retry guidance.

### Common Errors

| Symptom | Likely cause |
|---|---|
| `ModuleNotFoundError: anthropic` | Notebook is using the wrong kernel |
| Missing API key | `.env` was not copied, or the notebook needs `load_dotenv("../.env")` |
| HTTP `401` | Credential is missing, invalid, or revoked |
| HTTP `429` | The organization/workspace hit a request or token rate limit |
| Empty text | The response stopped or returned a non-text content block |

If you receive `429`, read the error and its `retry-after` guidance. Do not have the room
hammer the service by repeatedly rerunning the cell. The teaching scripts expose the
failure instead of silently retrying it.

## 2. Read a Real Filing

From a terminal at the repository root, preview the public filing used by the staged
scripts:

```bash
cd ~/yens-onboarding-2026
head -40 data/sec_filings/Cheniere_Energy_Inc.txt
```

Form 3 is an ownership filing. The useful facts are spread through SEC headers and XML,
which makes it a good example of turning unstructured text into a record.

## 3. Stage 1: A Minimal Extraction

Open `scripts/extract_form_3_step1_basic.py`. Its essential call is:

```python
response = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=256,
    system="You extract data from SEC filings. Be precise and concise.",
    messages=[
        {
            "role": "user",
            "content": (
                "Extract the insider's name and role.\n"
                "Reply with only: NAME | ROLE\n\n"
                + filing_text[:4000]
            ),
        }
    ],
)
```

Run the complete script from the repository root:

```bash
source .venv/bin/activate
python3 scripts/extract_form_3_step1_basic.py
```

The `[:4000]` slice is a simple input guard for the first experiment. It limits cost and
makes the amount sent easy to reason about. It is not a general document-chunking strategy.

At this stage the prompt asks for `NAME | ROLE`, but nothing enforces that shape. A fluent
but differently formatted response would still print successfully.

## 4. Stage 2: Log and Save the Result

See exactly what the second stage adds:

```bash
diff scripts/extract_form_3_step1_basic.py scripts/extract_form_3_step2_logged.py
```

Then run it:

```bash
python3 scripts/extract_form_3_step2_logged.py
```

New behavior:

- progress goes to the terminal and `form3_extract.log`
- the input filing is one named setting near the top
- the response is saved under `results/`
- an empty text response raises an error instead of writing a misleading blank result

The output is still only text. Logging proves what ran; it does not prove that the answer
has the fields or types your analysis expects.

## 5. Stage 3: Generate and Validate a Typed Record

Compare the final stage with Stage 2:

```bash
diff scripts/extract_form_3_step2_logged.py scripts/extract_form_3_one_file.py
```

The schema is ordinary Pydantic:

```python
from typing import List
from pydantic import BaseModel


class Form3Filing(BaseModel):
    insider_name: str
    insider_role: List[str]
    company_name: str
    company_cik: str
    filing_date: str
```

The final call passes that class directly to Anthropic's structured-output helper:

```python
response = client.messages.parse(
    model="claude-sonnet-5",
    max_tokens=4096,
    thinking={"type": "disabled"},
    system=system_prompt,
    messages=[{"role": "user", "content": filing_text}],
    output_format=Form3Filing,
)

result = response.parsed_output
if result is None:
    raise RuntimeError(
        f"No structured output returned (stop reason: {response.stop_reason})"
    )
```

`output_format=Form3Filing` does two connected jobs: the SDK turns the model into a JSON
schema for constrained generation, then parses and validates the returned JSON as a
`Form3Filing`. When `messages.parse` returns successfully, `parsed_output` is already a
typed, validated object. See Anthropic's current
<a href="https://platform.claude.com/docs/en/build-with-claude/structured-outputs" target="_blank" rel="noopener noreferrer">structured outputs documentation</a>.

This is different from the old course code, which requested generic JSON and later ran
`Form3Filing.model_validate_json(raw)`. The native helper keeps the requested schema and
the local parser tied to the same Pydantic class.

{: .note }
> The script retains the raw JSON text and writes a normalized JSON result. Validation
> happens **inside `messages.parse` before it returns**, so the raw file is an audit
> artifact, not a pre-validation rescue file.

Run the final stage:

```bash
python3 scripts/extract_form_3_one_file.py
```

Inspect both artifacts:

```bash
sed -n '1,80p' results/form3_Cheniere_Energy_Inc.txt
sed -n '1,80p' results/form3_result.json
```

### Why Haiku First and Sonnet 5 Last?

Stages 1 and 2 use `claude-haiku-4-5`: the request is simple and you may rerun it while
changing the prompt. Stage 3 uses `claude-sonnet-5` after the prompt and schema settle,
giving the final extraction the stronger model. `thinking={"type": "disabled"}` keeps
this deterministic extraction task focused on the schema instead of allocating tokens to
extended thinking.

This tiering is a project choice, not a rule that a larger model always wins. Evaluate
accuracy on a labeled sample before selecting a production model.

### Why `max_tokens` Is Required

Anthropic requires a maximum output-token budget on each Messages request. It is a ceiling,
not a promise to generate that much. The basic reply needs only 256; the structured stage
uses 4096 so the schema can complete without truncation. Input size is measured separately.

## 6. Know What Validation Does Not Prove

Pydantic catches structural problems such as a missing field or a string where a list is
required. It cannot prove that a plausible date, CIK, or name is factually correct.

Before scaling:

1. confirm that the dataset and service are approved for the project
2. measure latency and token usage on representative filings and estimate the run's cost
3. compare outputs with their source filings and decide how you will score accuracy
4. record model and prompt versions, failed record identifiers, and stop reasons without logging secrets or restricted content
5. add bounded retries that respect `retry-after` and avoid repeating successful work
6. require human review before using results for consequential decisions

The [Day 1 Part 2 Capstone]({{ '/day1/capstone/' | relative_url }}) applies these skills
to ten movie overviews, using a second model to check each classification.

---

## Optional Practice

### List Models Available to the Course Key

```python
models = client.models.list(limit=20)
for model in models.data:
    print(model.id)
```

Model availability belongs to the Anthropic organization and may change. The core scripts
require both `claude-haiku-4-5` and `claude-sonnet-5`; do not silently substitute a model
if either is missing.

### Count Input Tokens Before Generating

Anthropic does not provide its own embedding model, so the old course's embeddings example
does not map to the native client. Use the native token-counting endpoint instead—directly
useful when sizing this pipeline:

```python
count = client.messages.count_tokens(
    model="claude-haiku-4-5",
    system="You extract data from SEC filings.",
    messages=[{"role": "user", "content": filing_text}],
)
print(count.input_tokens)
```

Read Anthropic's
<a href="https://platform.claude.com/docs/en/api/python/messages/count_tokens" target="_blank" rel="noopener noreferrer">token-counting API documentation</a>
and its
<a href="https://platform.claude.com/docs/en/build-with-claude/embeddings" target="_blank" rel="noopener noreferrer">embeddings guidance</a>
if a future project needs semantic search.

### Compare the Two Course Models

Ask both models the same small, public-data question and record live usage rather than
copying a fixed benchmark:

```python
question = "In two sentences, explain what SEC Form 3 discloses."

for model in ["claude-haiku-4-5", "claude-sonnet-5"]:
    kwargs = {
        "model": model,
        "max_tokens": 150,
        "messages": [{"role": "user", "content": question}],
    }
    if model == "claude-sonnet-5":
        kwargs["thinking"] = {"type": "disabled"}

    comparison = client.messages.create(**kwargs)
    text = "".join(
        block.text for block in comparison.content if block.type == "text"
    ).strip()
    print(model, comparison.usage, text, sep="\n")
```

Compare answer quality, input/output tokens, latency you observe, and current price. One
small run is an observation, not a universal performance claim.

---

## Quiz

Answer each one in your head, then open it to check.

<details class="quiz" markdown="1">
<summary><span class="qnum">1</span><span class="qtext">Your prompt asks for <code>NAME | ROLE</code>, and the call succeeds. Can your code assume the answer follows that format?</span></summary>

**No. A successful request does not guarantee the requested format.** The basic call
returns text that may differ from your instructions. For fields your code needs to use,
define a Pydantic schema and pass it through the structured-output helper, as in Stage 3.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">2</span><span class="qtext">Pydantic accepts the extracted company name and filing date. Does that prove they match the filing?</span></summary>

**No. Validation checks the schema, not the source facts.** A wrong company name can
still be a string. In this lesson, `filing_date` is also a string, so the schema does not
even require a particular date format.

Compare extracted values with the original filing. Valid structure makes the result
usable in code; checking the source tells you whether it is accurate.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">3</span><span class="qtext">After a structured-output call, <code>response.parsed_output</code> is <code>None</code>. Should you save an empty record and continue?</span></summary>

**No. Record the failure and inspect `response.stop_reason`.** An empty record would
hide the fact that extraction did not produce a usable result. The example raises an
error here so you can investigate before treating the filing as complete.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">4</span><span class="qtext">You set <code>max_tokens=4096</code>. Will every response contain 4,096 tokens?</span></summary>

**No. It is an output limit, not a requested response length.** The model may finish
with fewer tokens. A limit that is too small can cut off the response before it is
complete. Check the actual input and output counts in `response.usage` when measuring
your run.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">5</span><span class="qtext">The project still has budget, but a call returns HTTP <code>429</code>. What might be happening?</span></summary>

**The account may have hit a request or token rate limit.** Budget and traffic limits
are separate. Read the error and follow its `retry-after` guidance instead of immediately
rerunning the same request. More available money does not necessarily let you send more
requests at once.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">6</span><span class="qtext">How would you use temperature and top-k to make an LLM's answers more consistent or more varied?</span></summary>

**Lower temperature and a smaller top-k generally make answers more consistent.
Higher values allow more variation.** On models that support these settings:

- **Temperature** controls randomness when choosing the next token. Lower values favor
  the most likely tokens; higher values give less likely tokens more chance.
- **Top-k** limits the choices to the k most likely next tokens. A smaller k narrows
  the choices; a larger k allows more options. With `top_k=1`, only the most likely
  token is eligible at each step.

For extraction, consistency is usually useful. For brainstorming, more variation may
help. Even `temperature=0` does not guarantee identical results across repeated calls.
Support varies by model, so check the
[API documentation](https://platform.claude.com/docs/en/api/http/messages/create)
before adding these settings.

</details>

---

## Skills Learned

- Use `anthropic.Anthropic()` and the native Messages API
- Put system instructions in `system=` and user turns in `messages`
- Use Haiku for lightweight iteration and Sonnet 5 for the final validated extraction
- Pass a Pydantic class to `messages.parse(output_format=...)`
- Treat `parsed_output` as validated structure while still checking for no output
- Read input/output token usage and distinguish it from rate-limit headroom
- Build from a notebook experiment to a logged, reproducible script in small stages
