---
layout: default
title: "5. Bonus — GPUs & Local LLMs"
parent: "Part 2 — Submit a Job Array"
grand_parent: "Day 2 — The Yen-Slurm Cluster"
nav_order: 5
permalink: /day2/gpus/
---

# Bonus — GPUs & Local LLMs

{: .note }
> 🔴 **Red sticky** = I need help. Put it up the moment you are stuck — an instructor will
> come to you.
>
> 🟢 **Green sticky** = I have done 1–4 and am moving on to the bonus work, and I am ready
> to help my table.

{: .note }
> Everything on this page runs from your clone, with the environment active:
>
> ```bash
> cd ~/yens-onboarding-2026
> source .venv/bin/activate
> ```
> {: .yens }

Everything today has run on CPUs, against a model living on somebody else's servers. This
page is the other axis: **hardware you ask for by name, and models that run on it.**

It is bonus material — nothing in the checkpoint depends on it. It is also the part people
most often need six months later, when a project turns out to involve data that cannot leave
Stanford, or a volume of calls that makes per-token billing untenable.

---

## Why run a model yourself?

### What an API call actually does

When you call an LLM API, three things happen outside your control:

- **Your data leaves.** The filing text — and whatever else is in your prompt — is sent over the network to the model provider.
- **The compute is theirs.** The model runs on the *model provider's* machines, not yours.
- **The model can change.** You get the weights the model provider is serving that day.

<svg viewBox="0 0 600 164" role="img" aria-labelledby="api-title api-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:600px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="api-title">Calling an LLM API sends your data to a remote server and back</title>
  <desc id="api-desc">Your code on the left, labeled "on your or Stanford's machines", and the model provider's server on the right, labeled "in the cloud", separated by a dashed vertical boundary line. Your code sends a packet labeled "prompt plus data" across the boundary to the provider, which runs the model and sends a "response" packet back.</desc>
  <!-- side labels, above the boxes — same wording as the "Why Run It Yourself?" figure -->
  <text x="117" y="26" font-size="11" font-weight="700" fill="#2c3e50" text-anchor="middle">On your or Stanford's machines</text>
  <text x="505" y="26" font-size="11" font-weight="700" fill="#2c3e50" text-anchor="middle">In the cloud</text>
  <!-- trust boundary: the point where your data leaves your machine -->
  <line x1="300" y1="44" x2="300" y2="140" stroke="#b3bccb" stroke-width="1.5" stroke-dasharray="5 4"/>
  <!-- left node: your code -->
  <rect x="14" y="74" width="206" height="48" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="117" y="103" font-size="13" font-weight="700" fill="#2c3e50" text-anchor="middle">Your code</text>
  <!-- right node: model provider -->
  <rect x="430" y="74" width="150" height="48" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="505" y="103" font-size="13" font-weight="700" fill="#2c3e50" text-anchor="middle">Model provider</text>
  <!-- outbound packet: prompt + data (starts just right of the wider box) -->
  <g>
    <rect x="226" y="85" width="120" height="26" rx="8" fill="#E69F00"/>
    <text x="286" y="102" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle">prompt + data ▶</text>
    <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.44;0.5;1" dur="5s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,0;82,0;82,0" keyTimes="0;0.06;0.44;1" dur="5s" repeatCount="indefinite" calcMode="linear"/>
  </g>
  <!-- inbound packet: response -->
  <g>
    <rect x="304" y="85" width="120" height="26" rx="8" fill="#0072B2"/>
    <text x="364" y="102" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle">◀ response</text>
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.56;0.94;1" dur="5s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,0;-82,0;-82,0" keyTimes="0;0.56;0.94;1" dur="5s" repeatCount="indefinite" calcMode="linear"/>
  </g>
  <!-- caption -->
  <text x="300" y="150" font-size="12.5" fill="#6a7280" text-anchor="middle">Your prompt and data go to the model provider's servers, and the response comes back.</text>
</svg>

---

### Why run it yourself?

<svg viewBox="0 0 600 232" role="img" aria-labelledby="local-title local-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:600px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="local-title">Running the model yourself keeps your prompt and data on your side</title>
  <desc id="local-desc">Your code sits above a local model, both on the left of a dashed vertical boundary — the edge of your, or Stanford's, machines. A labeled bar carries the prompt and data down to the local model and the response back up; neither crosses the boundary. On the right, in the cloud, the model provider's server is grayed out and not contacted.</desc>
  <!-- boundary: the edge of your machines -->
  <line x1="300" y1="36" x2="300" y2="196" stroke="#b3bccb" stroke-width="1.5" stroke-dasharray="5 4"/>
  <!-- territory labels -->
  <text x="150" y="26" font-size="11" font-weight="700" fill="#2c3e50" text-anchor="middle">On your or Stanford's machines</text>
  <text x="450" y="26" font-size="11" font-weight="700" fill="#9aa3b0" text-anchor="middle">In the cloud</text>
  <!-- your code (top) -->
  <rect x="70" y="44" width="160" height="48" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="150" y="72" font-size="13" font-weight="700" fill="#2c3e50" text-anchor="middle">Your code</text>
  <!-- local model (below) -->
  <rect x="70" y="150" width="160" height="48" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="150" y="178" font-size="13" font-weight="700" fill="#2c3e50" text-anchor="middle">Local model</text>
  <!-- outbound bar: prompt + data, travels down to the local model -->
  <g>
    <rect x="90" y="98" width="120" height="24" rx="8" fill="#E69F00"/>
    <text x="150" y="114" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle">prompt + data ▼</text>
    <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.44;0.5;1" dur="5s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,0;0,26;0,26" keyTimes="0;0.06;0.44;1" dur="5s" repeatCount="indefinite" calcMode="linear"/>
  </g>
  <!-- inbound bar: response, travels back up -->
  <g>
    <rect x="90" y="124" width="120" height="24" rx="8" fill="#0072B2"/>
    <text x="150" y="140" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle">▲ response</text>
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.56;0.94;1" dur="5s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,0;0,-26;0,-26" keyTimes="0;0.56;0.94;1" dur="5s" repeatCount="indefinite" calcMode="linear"/>
  </g>
  <!-- model provider: present but not contacted -->
  <rect x="370" y="97" width="160" height="48" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.5"/>
  <text x="450" y="118" font-size="13" font-weight="700" fill="#9aa3b0" text-anchor="middle">Model provider</text>
  <text x="450" y="134" font-size="10" fill="#9aa3b0" text-anchor="middle">(not contacted)</text>
  <!-- caption -->
  <text x="300" y="222" font-size="12.5" fill="#6a7280" text-anchor="middle">Run the model yourself and your prompt and data never cross into the cloud.</text>
</svg>

**1. Privacy & data requirements — often a hard rule, not a preference.** Restricted, confidential, or IRB-governed data may not leave Stanford's perimeter. Run the model locally and your prompts and documents never leave the cluster — nothing goes to an outside model provider. (Which bucket your data falls in was covered in [the data classification section]({{ '/day1/stanford-ai-services/#check-the-data-and-service' | relative_url }}) on Day 1.)

**2. Cost at scale.** No per-token bill. You already have cluster access, so local "inference" (querying an LLM) is effectively free at the margin. A run over 100,000 filings that would rack up a real bill on a metered API costs nothing extra on the Yens.

**3. Reproducibility.** Versioning proprietary models is complicated — the provider can change the model behind a given name, and old versions eventually get retired. An open model is always reproducible: you control the weights, so the exact model is fixed and a reviewer (or future you) can rerun the identical pipeline years later.

**4. No API rate limits.** Model providers cap requests and tokens per minute, which throttles a big parallel job array. Locally you're bounded only by your own compute allocation on the cluster, so a thousand-task array isn't held back by someone else's quota.

---

{: .note }
> There's a catch to "run it yourself": you can only run models whose **weights you can download**. The frontier models from OpenAI (GPT-5.6) and Anthropic (Claude Fable 5) are **proprietary** — the companies never release the weights, so those models exist *only* behind their cloud APIs. There is no way to run them on the Yens.
>
> Running locally therefore means using **open-weight** models — ones whose parameters are published for anyone to download and serve, such as Llama (Meta), Mistral, Qwen, or DeepSeek. These are the kind of models you'll run on the Yens later today.
>
> So the real choice isn't "any model, local or cloud." It's: a **proprietary model in the cloud**, or an **open-weight model you run yourself**.

---

### When the API is still the right call

Running locally isn't always the answer. The honest tradeoffs:

- **Capability** — the proprietary models (GPT-5.6, Claude Fable 5) typically outperform the open-weight ones you can run yourself. For the hardest tasks, the API wins.
- **Convenience** — an API key and one line of code: no cluster job to submit, no model server to start, no queue wait.
- **Elastic scale** — a hosted API scales on demand; the capacity you can run on the Yens is finite, so very large models or very high volume can exceed it.

---

### The three options at a glance

| | Local on the Yens | Stanford AI API Gateway | Third-party API |
|---|---|---|---|
| **Where your data goes** | Stays on the cluster | In the cloud, but regulated and approved by Stanford | Leaves Stanford → model provider |
| **Cost** | Free at the margin | Budget-capped Stanford account | Per-token billing |
| **Models** | Open-weight models you can run on the Yens | Provider-curated, Stanford-audited | Latest, most capable |
| **Best for** | Restricted data, large batch jobs | Everyday research | Hardest tasks where data rules allow |

For the difference between the Playground, Stanford's Gateway, and the course's direct Anthropic access, see [AI Services & Data Privacy]({{ '/day1/stanford-ai-services/#stanfords-browser-and-api-routes' | relative_url }}) from Day 1.

---

### Rule of thumb

**Restricted data → run it locally, no exceptions.** Otherwise, weigh cost, reproducibility, and throughput (which favor local) against capability and convenience (which favor the API).

---

---

## GPUs on the Yens

### What you can ask for

The Yens have several GPU types. For our purposes they differ mainly in one thing: **VRAM** (video random-access memory — the GPU's own memory), which sets a ceiling on how big a model you can load.

| GPU type | VRAM | Roughly good for |
|-----|------|------------------|
| A30 | 24 GB | small models, embeddings |
| A40 | 48 GB | mid-size models |
| H200 | 141 GB | large models |

A model's weights have to fit in VRAM, so VRAM — not disk or CPU RAM — is the binding constraint on which models you can run.

You request a GPU the same way you set any other resource in a Slurm script — a directive at the top:

```bash
#SBATCH --partition=gpu       # the GPU partition (confirm the name for your setup)
#SBATCH --gres=gpu:1          # request one GPU
```
{: .yens }

Just like the `#SBATCH` directives you wrote on Day 2, this tells the scheduler what your job needs — here, one GPU. Match the partition name (and any specific-node targeting) to your cluster's current setup.

{: .tip }
> **For interactive work** — exploring, pulling a model, quick tests — you don't need a batch script. Grab a GPU node directly with `srun --pty`, the same command you used for a CPU allocation on [Day 2]({{ '/day2/' | relative_url }}), plus the GPU flags:
>
> ```bash
> srun --partition=gpu --gres=gpu:1 --cpus-per-task=4 --mem=16G --time=01:00:00 --pty bash
> ```
> {: .yens }
>
> This drops you into a shell *on a GPU node* with one GPU reserved — run `nvidia-smi` to confirm. To pin a specific GPU type, add `--constraint="GPU_MODEL:<type>"`, substituting one of the types from the table above. Reach for an interactive session when you're exploring or testing; use a batch job for long or production runs that should queue unattended.

{: .warning }
> **Release it when you're done.** Type `exit` the moment your experimentation is complete. An interactive allocation holds the GPU for the *full* `--time` you requested — even while it sits idle at your shell prompt — so no one else can use that GPU until you exit or the time limit runs out. GPUs are scarce shared resources; don't sit on one you've finished with.

---

### Exercise 1 — ask for a GPU, and see what you got

{: .important }
> **Task:** Submit a two-minute job that asks Slurm for one GPU, read back which GPU you
> landed on, then decide whether today's extraction pipeline would have run any faster on it.

**Look at the GPU partition first.** You already read the queue for `normal`; do the same
for `gpu`:

```bash
sinfo -p gpu
sinfo -p normal
```
{: .yens }

There are far fewer GPU nodes than CPU nodes, and the per-user caps differ too. Those caps
come from each partition's **QoS** — the policy Slurm attaches to a partition setting how
much of it one person can hold at once:

```bash
sacctmgr show qos gpu
sacctmgr show qos normal
```
{: .yens }

**Read the job script.** `slurm/gpu_check.slurm` is already in your repo. Open it — it is
the shortest Slurm script you have seen today, and two directives are new:

```bash
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
```
{: .yens }

`--gres` is "generic resource". `gpu:1` asks for one GPU on the node you land on. Miss it
out and you get a slot on a GPU node with **no GPU allocated to you** — the job runs,
`nvidia-smi` finds nothing, and the failure is quiet. That is the mistake worth knowing
about.

**Submit it:**

```bash
mkdir -p logs
sbatch --reservation=class slurm/gpu_check.slurm
squeue --me
```
{: .yens }

{: .note }
> **Today the reservation covers the GPU nodes too**, so this should start quickly rather
> than queueing behind the rest of the cluster. That is a luxury of a reserved teaching
> session — drop `--reservation=class` for your own work afterwards, and expect to wait.

Once it finishes:

```bash
cat logs/gpu_check_*.out
```
{: .yens }

The `nvidia-smi` output tells you which model you landed on and how much VRAM it has. Note
what your own output says, because **VRAM is the binding constraint on a GPU** the way RAM
was on a Yen node: a model that does not fit does not run slowly, it does not run.

**Then the actual question.** Check what the job cost you:

```bash
sacct -j JOBID --format=JobID,State,Elapsed,ReqTRES
```
{: .yens }

and think back to your profiling numbers from this morning. You measured
`extract_form_3_batch.py` and found `real` far larger than `user` — the script spent almost
all its wall-clock time **waiting on the network** for the API to answer, not computing.

{: .important }
> **So: would a GPU have made your extraction job faster?**
>
> <details markdown="1">
> <summary>Think about it, then check</summary>
>
> No — and not by a little. Your `real` ≫ `user` measurement from this morning says the job
> waits on the network rather than computing, and a GPU only accelerates computing. It
> would sit at 0% utilization for the whole run while you held it out of a queue somebody
> else needs.
>
> </details>

---

## Run a model on one

### The three steps

At a high level, running a model on the cluster comes down to three things:

1. **Loading an open model onto the cluster.** Download the weights once and cache them on cluster storage, so nothing has to be fetched again on later runs.
2. **Starting a server that holds it.** Loading a model into memory takes time, so you pay that cost once and leave the process running, rather than reloading for every query.
3. **Running queries against that server.** From your own code, across the cluster's internal network — the request never leaves the Yens. The server does the work and sends back the answer.

**[Ollama](https://ollama.com/)** is the standard way to do all three, and what we use here. It downloads open-weight models, keeps one loaded in memory, and serves it behind an HTTP API.

---

### Exercise 2 — one server per table, everyone connects

There are not enough GPUs for everyone to hold one, and starting a server takes a few
minutes. So do it **once per table**: one person runs the server, everybody else points
their code at it. That is also how this works in practice — a lab runs one server and the
group shares it.

**One person per table — grab a GPU and start the server.** Decide who; the rest of the
table skips to the next step and waits for a URL.

```bash
srun --partition=gpu --gres=gpu:1 --cpus-per-task=8 --mem=16G \
     --time=01:00:00 --reservation=class --pty bash
```
{: .yens }

That drops you into a shell **on a GPU node**. Confirm with `nvidia-smi`, then start Ollama.
DARC keeps a helper repo that wraps the container and picks a free port for you:

```bash
git clone https://github.com/gsbdarc/ollama_helper.git ~/ollama_helper
cd ~/ollama_helper
ml apptainer
apptainer pull ollama.sif docker://ollama/ollama      # slow, the first time only
source ollama.sh
ollama serve
```
{: .yens }

Leave that running. In a **second terminal**, pull the model and read off the address the
server picked:

```bash
cd ~/ollama_helper && source ollama.sh
ollama pull llama3.2:1b

echo "http://$(cat /scratch/users/$USER/ollama/host.txt):$(cat /scratch/users/$USER/ollama/port.txt)"
```
{: .yens }

**Give that URL to your table.** Write it on a sticky note; it is the only thing anyone else
needs.

{: .note }
> **If your `srun` cannot get a GPU**, start the server anyway on a CPU node. `llama3.2:1b`
> is small enough to answer without one — just slowly, and Apptainer will print
> `Could not find any nv files on this host!` as it starts, which is the GPU passthrough
> finding nothing rather than an error. Exercise 3 is precisely about that difference.

**Everyone — check you can reach it.** A URL is a host and a *port*: one node runs many
services at once, and the port says which door you are knocking on.

```bash
curl <server-url>
```
{: .yens }

You should see `Ollama is running`.

{: .note }
> That request left your node, crossed to another machine on the Yens, and came back —
> without leaving the cluster. The model runs there too, so your prompts and your data never
> leave the Yens.

**Everyone — now query it from Python:**

```python
from openai import OpenAI

client = OpenAI(
    base_url="<server-url>/v1",        # the model server at your table
    api_key="ollama",                  # ignored, but the client requires a value
)

response = client.chat.completions.create(
    model="llama3.2:1b",
    messages=[{"role": "user", "content": "<your query>"}],
)
print(response.choices[0].message.content)
```

{: .important }
> **Look at what just changed, and what didn't.** That is the *same code you wrote on Day 1*
> against the Stanford AI API Gateway. Only `base_url` is different. Ollama speaks the
> OpenAI API, so every client, library and tool that talks to OpenAI talks to your local
> model too — which is why "switch to a local model" is usually a one-line change rather
> than a rewrite.

{: .warning }
> This works only while somebody at your table is holding that `srun` session. When they
> `exit`, the server goes with it.

### Exercise 3 — the same model on a CPU

{: .demo }
> You may have noticed that the server URL pointed to a GPU node on the Yens.
>
> Now let's run queries on a local LLM that's running on a **CPU** instead.
>
> We'll send the same query to each and time them — same model, same prompt, same code, with only the hardware underneath differing.
>
> What do you notice about the runtime?

<details markdown="1">
<summary>What we saw (expand after discussion)</summary>

The CPU still answers — but slower, and *how much* slower depends on:

- The prompt length;
- The length of the answer the model generates;
- The GPU and CPU — chip model, and how many cores the CPU has; and
- The model size.

A small difference per query can still be a meaningful one, for a task that runs a lot of them — a few seconds each becomes hours across thousands of queries.

And our example is on the favorable end for the CPU: a short query, of low complexity, against a small model. A longer prompt, a longer answer, or a bigger model all widen the gap.

</details>

We won't go into the details of why a GPU is faster than a CPU at running LLM queries. It's enough to say that the demo above illustrates GPUs are much faster in general — though we've also seen that a CPU may be enough for basic tasks.

{: .aside }
> The efficacy of GPUs for training LLMs and serving LLM queries has made them enormously valuable. Indeed, the surge in the share price of NVIDIA, the dominant GPU maker, tracks the AI boom:
>
> <svg viewBox="0 0 600 278" role="img" aria-labelledby="nvda-title nvda-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:600px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
>   <title id="nvda-title">NVIDIA share price over time</title>
>   <desc id="nvda-desc">A line chart of NVIDIA's split-adjusted year-end share price from 2016 to 2024. It stays low — a few dollars — through 2019, rises through 2021, dips in 2022, then climbs steeply in 2023 and 2024 as demand for AI GPUs surges, reaching about $134 by the end of 2024.</desc>
>   <text x="300" y="20" font-size="13" font-weight="700" fill="#2c3e50" text-anchor="middle">NVIDIA's share price</text>
>   <!-- y gridlines -->
>   <line x1="50" y1="171" x2="585" y2="171" stroke="#eef1f8" stroke-width="1"/>
>   <line x1="50" y1="93"  x2="585" y2="93"  stroke="#eef1f8" stroke-width="1"/>
>   <!-- axes -->
>   <line x1="50" y1="30"  x2="50"  y2="250" stroke="#b8bfcc" stroke-width="1.5"/>
>   <line x1="50" y1="250" x2="585" y2="250" stroke="#b8bfcc" stroke-width="1.5"/>
>   <!-- y labels -->
>   <text x="44" y="254" font-size="10" fill="#6a7280" text-anchor="end">$0</text>
>   <text x="44" y="175" font-size="10" fill="#6a7280" text-anchor="end">$50</text>
>   <text x="44" y="97"  font-size="10" fill="#6a7280" text-anchor="end">$100</text>
>   <!-- price line -->
>   <polyline points="55,246 121,242 186,245 252,241 318,230 383,204 449,227 514,172 580,39" fill="none" stroke="#0072B2" stroke-width="2.5"/>
>   <circle cx="55"  cy="246" r="3" fill="#0072B2"/>
>   <circle cx="121" cy="242" r="3" fill="#0072B2"/>
>   <circle cx="186" cy="245" r="3" fill="#0072B2"/>
>   <circle cx="252" cy="241" r="3" fill="#0072B2"/>
>   <circle cx="318" cy="230" r="3" fill="#0072B2"/>
>   <circle cx="383" cy="204" r="3" fill="#0072B2"/>
>   <circle cx="449" cy="227" r="3" fill="#0072B2"/>
>   <circle cx="514" cy="172" r="3" fill="#0072B2"/>
>   <circle cx="580" cy="39"  r="4" fill="#0072B2"/>
>   <text x="578" y="33" font-size="10" font-weight="700" fill="#0072B2" text-anchor="end">~$134</text>
>   <!-- x labels -->
>   <text x="55"  y="266" font-size="10" fill="#6a7280" text-anchor="middle">2016</text>
>   <text x="121" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2017</text>
>   <text x="186" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2018</text>
>   <text x="252" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2019</text>
>   <text x="318" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2020</text>
>   <text x="383" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2021</text>
>   <text x="449" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2022</text>
>   <text x="514" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2023</text>
>   <text x="580" y="266" font-size="10" fill="#6a7280" text-anchor="middle">2024</text>
> </svg>

---

---

## Beyond Ollama

Ollama is the easy on-ramp: one model, one process, an OpenAI-shaped API, minutes to get
going. It is the right tool for exploring, for development, and for the scale most research
projects actually need. It is not the only option, and the differences matter once you are
running seriously.

| | What it is for | Reach for it when |
|---|---|---|
| **[Ollama](https://ollama.com/)** | One model held in memory behind a simple API | Exploring, development, moderate query volume — today's exercise |
| **[vLLM](https://docs.vllm.ai/en/latest/)** | A serving engine built for throughput: continuous batching, paged attention | Many concurrent requests, or a large batch job where tokens-per-second is the constraint |
| **[NVIDIA NIM](https://rcpedia.stanford.edu/blog/2026/04/23/self-hosting-llms-with-nvidia-nim-on-the-yens/)** | Vendor-packaged inference containers, tuned per model | You want NVIDIA's own optimised container rather than assembling the stack — DARC has written this up for the Yens |
| **[Transformers](https://huggingface.co/docs/transformers/en/index)** | The library underneath much of the above | You need to touch the model itself — custom generation, embeddings, training |

**Fine-tuning.** Adapting an open model to your own data is a different job from serving one,
and the Yens can do it. Two DARC write-ups, in increasing order of how much you need to know:
[Fine-Tuning BERT for Sentiment Analysis on Financial News](https://rcpedia.stanford.edu/blog/2024/03/28/fine-tuning-bert-for-sentiment-analysis-on-financial-news/)
is a concrete worked example on a small model, and
[Fine-Tuning Open Source Models](https://rcpedia.stanford.edu/blog/2025/11/07/fine-tuning-open-source-models/)
covers the current approach for the larger ones.

{: .note }
> **Before you fine-tune, check you need to.** A better prompt, a few examples in the prompt,
> or retrieval over your own documents will get you most of the way for most research tasks,
> at a fraction of the effort. Fine-tuning earns its keep when you need a *behavior* the
> model does not have — a house output format, a domain vocabulary — rather than more facts.

**Choosing a model.** Leaderboards measure what the leaderboard measures, which is rarely
your task. [LLM Benchmarks for Researchers](https://rcpedia.stanford.edu/blog/2026/07/14/llm-benchmarks-for-researchers/)
covers reading benchmarks honestly, and the
[LLM-as-a-Judge]({{ '/reference/llm-as-a-judge/' | relative_url }}) and
[Failure Modes]({{ '/reference/llm-failure-modes/' | relative_url }}) reference pages cover
building an evaluation of your own — which is the only benchmark that answers your question.

---

## Where to read more

**DARC and RCpedia** — Stanford GSB's own documentation, and the first place to look:

| | |
|---|---|
| [GPU Slurm Jobs](https://rcpedia.stanford.edu/_user_guide/using_gpu/) | Requesting GPUs properly, with current partition and constraint syntax |
| [Running Ollama on Stanford Computing Clusters](https://rcpedia.stanford.edu/blog/2025/05/12/running-ollama-on-stanford-computing-clusters/) | Every step of what your table did, written out |
| [Self-Hosting LLMs with NVIDIA NIM on the Yens](https://rcpedia.stanford.edu/blog/2026/04/23/self-hosting-llms-with-nvidia-nim-on-the-yens/) | The vendor-container route to serving |
| [Stanford's LLM API Tools](https://rcpedia.stanford.edu/blog/2026/03/06/stanfords-llm-api-tools/) | What Stanford offers centrally, and when to use it instead |
| [Fine-Tuning Open Source Models](https://rcpedia.stanford.edu/blog/2025/11/07/fine-tuning-open-source-models/) | Adapting an open model to your data |
| [LLM Benchmarks for Researchers](https://rcpedia.stanford.edu/blog/2026/07/14/llm-benchmarks-for-researchers/) | Reading model comparisons without being sold to |
| [Everything tagged LLM](https://rcpedia.stanford.edu/blog/category/llm/) · [tagged GPU](https://rcpedia.stanford.edu/blog/category/gpu/) | The living indexes — check these before assuming something is undocumented |
| [Current per-user limits](https://rcpedia.stanford.edu/_policies/user_limits/) | What you are actually allowed to hold |

**Tools:** [Ollama](https://ollama.com/) · [`gsbdarc/ollama_helper`](https://github.com/gsbdarc/ollama_helper) · [vLLM](https://docs.vllm.ai/en/latest/) ([repo](https://github.com/vllm-project/vllm)) · [Hugging Face Transformers](https://huggingface.co/docs/transformers/en/index)

**Wider Stanford research:** [Stanford AI Lab blog](https://ai.stanford.edu/blog/) · [Stanford HAI](https://hai.stanford.edu/news) · [Center for Research on Foundation Models](https://crfm.stanford.edu/)

{: .note }
> **Still the fastest route to an answer:** [**#gsb-yen-users**](https://circlerss.slack.com/archives/C01JXJ6U4E5)
> for anything cluster-shaped, or [**gsb_darcresearch@stanford.edu**](mailto:gsb_darcresearch@stanford.edu)
> if you would rather not post it. "I want to run a model on my own data" is exactly the kind
> of question DARC would rather answer early than late.

---

## What you learned

- You know an API call sends your data to a provider's servers and returns a response — the computation runs on their machines, not yours
- You can give the reasons to run a model on the Yens instead — data residency, cost at scale, reproducibility, no rate limits — and the honest counterweights of capability, convenience and elastic scale
- You can apply the rule of thumb: restricted data forces local; otherwise weigh the tradeoffs
- You requested a GPU in a Slurm job with `--partition=gpu` and `--gres=gpu:1`, and read back which one you got
- You know **VRAM** sets the ceiling on the model size a GPU can load, and how the Yen GPUs compare
- You know that a GPU only helps work that is *computing* — and that this morning's extraction job was waiting on the network
- Your table served an open-weight model on cluster hardware and queried it, and the prompts never left the Yens
- You know pointing your code at a local model instead of the Gateway is a change of `base_url`
- You have seen the same model answer on a GPU and on a CPU
- You know where to go next: vLLM and NIM for serving at volume, DARC's write-ups for fine-tuning, and your own evaluation rather than a leaderboard
