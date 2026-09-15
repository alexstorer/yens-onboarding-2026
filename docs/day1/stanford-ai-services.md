---
layout: default
title: "AI Services & Data Privacy"
parent: "Part 2 — Python & AI"
grand_parent: "Day 1 — Foundations & AI"
nav_order: 3
permalink: /day1/stanford-ai-services/
---

# AI Services & Data Privacy

Before using AI with research data, check the data's risk classification, the dataset's
usage rules, and the service's approval. Your use must meet all three requirements.

You'll try Stanford's AI Playground in your browser, then use Anthropic's API from
Python to process public SEC filings. These are separate services with different access
and data-handling rules.

---

## Exercise

{: .important }
> **In this section:** Check which data a service can handle, try Stanford's AI
> Playground, and distinguish an LLM, an API, and an agent harness. Then review what
> your code or agent sends to the model service.

## Check the Data and Service

### 1. Stanford's data-risk classification

![Stanford Data Risk]({{ "/assets/images/Stanford_data_risk.png" | relative_url }})

Read Stanford's current
<a href="https://uit.stanford.edu/guide/riskclassifications" target="_blank" rel="noopener noreferrer">data-risk classification guidance</a>.

### 2. The dataset's rules

A Data Use Agreement (DUA), license, IRB protocol, or contract can impose stricter rules
than a service technically supports. "De-identified" does not automatically mean "safe
to send to AI," and a vendor license may forbid automated analysis entirely.

### 3. The system and service

The Yens, a Stanford-managed AI service, and a vendor API are separate systems with
different approvals. A file can be allowed on one and forbidden on another. Nothing in
Python checks whether a transfer is permitted. Check the requirements before sending data.

| Service | Role in this course | Data requirements |
|---|---|---|
| Stanford AI Playground | Manual browser demonstration | Follow Stanford's current approval and the dataset's rules |
| Stanford AI API Gateway | Institutional programmatic option, discussed for context | Use its current approval process, DRA/DUA, and project requirements |
| Direct Anthropic API | The SEC extraction exercises | **Public, Low Risk filings only** |

For current service approvals, check
<a href="https://uit.stanford.edu/ai/services" target="_blank" rel="noopener noreferrer">AI services at Stanford</a>
and the
<a href="https://uit.stanford.edu/service/ai-api-gateway/faqs" target="_blank" rel="noopener noreferrer">AI API Gateway FAQ</a>
before using research data.

{: .warning }
> Direct access to Anthropic is **not the same service** as Claude provisioned by Stanford
> and is not a shortcut around a DUA, IRB, Data Risk Assessment, or platform restriction.
> In this course it is limited to public SEC filings. For Moderate or High Risk data,
> stop and use the Stanford-approved route for that project.

### Practice: Classify the Data

For each item, decide whether it is Low, Moderate, or High Risk, then ask whether a DUA
could make the handling requirements stricter.

1. A published journal article
2. Social Security numbers
3. An unreleased internal financial projection
4. Student grades and transcripts
5. De-identified, aggregated survey results

<details markdown="1">
<summary>Answer key</summary>

| # | Item | Starting classification | Why |
|---|---|---|---|
| 1 | Published article | Low | Already public |
| 2 | Social Security numbers | High | Regulated personal identifiers |
| 3 | Internal projection | Moderate | Confidential business information |
| 4 | Grades and transcripts | Moderate | FERPA-protected education records |
| 5 | De-identified aggregate results | Often Low | Re-identification and contract terms still matter |

The classification is only the first check. A DUA, IRB protocol, or other agreement can
require stricter treatment.
</details>

---

## Stanford's Browser and API Routes

### AI Playground: an easy place to start

For everyday research questions, drafting, and trying prompts, **Stanford's AI Playground
is usually the easiest starting point**. You use it in a browser with your SUNetID;
there is no Python setup or API key to manage. You can choose among the available models
and compare their responses. Follow the data checks above before uploading material.

#### Try the Playground

1. Open the [Stanford AI Playground quick start page](https://uit.stanford.edu/aiplayground),
   follow its link to the Playground, and sign in with your SUNetID.
2. Choose an available model and send this prompt:

   > Explain the difference between a Python interpreter and a Jupyter kernel in two sentences.

3. Ask a follow-up question. If time allows, try the same prompt with another model and
   compare the answers.

**Why use an API for this exercise?** We want a Python script to read filings, send the
same extraction instructions for each one, validate the responses, and save the results.
An API lets those steps run together without manually copying text between a browser
and a file. The Playground remains useful for testing a prompt before putting it into code.

### Stanford Claude and ChatGPT Education Accounts

Stanford also provides university-managed accounts for **Claude for Education** and
**ChatGPT Edu**. These give you access to the providers' own apps for research, writing,
analysis, and coding.

| Account | What you can use | Sign up |
|---|---|---|
| [Claude for Education](https://uit.stanford.edu/service/claude) | Claude Chat, Claude Code, and Claude Cowork | [Request a Standard account](https://stanford.service-now.com/it_services?id=sc_cat_item&sys_id=d0605d9c2b558b10ee36fd3fc891bfe2) |
| [ChatGPT Edu](https://uit.stanford.edu/service/openai-chatgpt-edu) | ChatGPT for research and analysis, document creation, and coding tools including Codex | [Request a Standard account](https://stanford.service-now.com/it_services?id=sc_cat_item&sys_id=0c3324ad2be5cf90ee36fd3fc891bf6f) |

The Standard accounts are free for active Stanford faculty, students, postdocs, and
staff. Use your SUNetID to request access. The service pages above also list affiliate
options, paid tiers, and the current data rules for each tool.

The Claude education account connects to the Claude Code work you did earlier. For
the upcoming Python exercises, you'll use the course's separate **Anthropic API key**.
Requesting an education account does not replace that setup.

### AI API Gateway: Stanford's programmatic route

The
<a href="https://uit.stanford.edu/service/ai-api-gateway" target="_blank" rel="noopener noreferrer">Stanford AI API Gateway</a>
lets code call models under Stanford's service controls. It remains the institutional
route to evaluate when a research project needs Stanford governance, sensitive-data
approval, centralized budget controls, or access to several providers through one API.

Use the Playground in your browser. Use the Gateway when you want code to call a
Stanford-managed AI service.


#### How the Gateway Works

Your code sends its request to Stanford's Gateway with a Stanford-issued API key.
The Gateway checks the key's model access and budget, routes the request to the model
service, and returns the response. Stanford manages the service and its provider agreements.

<svg viewBox="0 0 660 536" role="img" aria-labelledby="gateway-title gateway-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:660px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="gateway-title">Your code calls a model through Stanford's AI API Gateway</title>
  <desc id="gateway-desc">Your code sends a request authenticated by a Stanford-issued API key to the Gateway. The Gateway checks model access, enforces the key's budget, and tracks usage under Stanford's service agreements. It forwards the request to the model service and sends the response back to your code.</desc>
  <defs>
    <marker id="gateway-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#e67e22"/></marker>
  </defs>
  <rect x="16" y="16" width="628" height="104" rx="16" fill="#fffaf2" stroke="#ecdcc0" stroke-width="1.5" stroke-dasharray="5 4"/>
  <rect x="36" y="32" width="588" height="72" rx="12" fill="#fff8ef" stroke="#e6cfa8" stroke-width="1.5"/>
  <text x="330" y="61" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Your code on the Yens or your laptop</text>
  <text x="330" y="86" text-anchor="middle" font-size="14" fill="#5b6472">Uses a Stanford-issued API key</text>
  <line x1="174" y1="122" x2="174" y2="196" stroke="#e67e22" stroke-width="2.5" marker-end="url(#gateway-arrow)"/>
  <text x="158" y="162" text-anchor="end" font-size="14" font-weight="700" fill="#b3611a">1. Request</text>
  <line x1="486" y1="196" x2="486" y2="122" stroke="#e67e22" stroke-width="2.5" marker-end="url(#gateway-arrow)"/>
  <text x="502" y="162" font-size="14" font-weight="700" fill="#b3611a">4. Response</text>
  <rect x="36" y="198" width="588" height="140" rx="12" fill="#e3f2e6" stroke="#b7ddba" stroke-width="1.5"/>
  <text x="330" y="228" text-anchor="middle" font-size="17" font-weight="700" fill="#2c3e50">Stanford AI API Gateway</text>
  <text x="330" y="254" text-anchor="middle" font-size="14" fill="#5b6472">Checks key and model access · Enforces budget</text>
  <text x="330" y="279" text-anchor="middle" font-size="14" fill="#5b6472">Tracks usage · Routes requests to the model service</text>
  <text x="330" y="312" text-anchor="middle" font-size="14" font-weight="700" fill="#2e7d46">Managed by Stanford under its service agreements</text>
  <line x1="174" y1="340" x2="174" y2="414" stroke="#e67e22" stroke-width="2.5" marker-end="url(#gateway-arrow)"/>
  <text x="158" y="380" text-anchor="end" font-size="14" font-weight="700" fill="#b3611a">2. Forward</text>
  <line x1="486" y1="414" x2="486" y2="340" stroke="#e67e22" stroke-width="2.5" marker-end="url(#gateway-arrow)"/>
  <text x="502" y="380" font-size="14" font-weight="700" fill="#b3611a">3. Response</text>
  <rect x="16" y="416" width="628" height="104" rx="16" fill="#f7f9fc" stroke="#bcd4f2" stroke-width="1.5" stroke-dasharray="5 4"/>
  <rect x="36" y="432" width="588" height="72" rx="12" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="330" y="461" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Model service</text>
  <text x="330" y="486" text-anchor="middle" font-size="14" fill="#5b6472">Processes the request and generates a response</text>
</svg>

*The request and response both pass through Stanford's Gateway.*

#### Request a Gateway Key for Your Research

The Gateway is billed by usage and requires a **PTA (Project, Task, and Award)**.
Agree on the billing account and budget with your advisor or project lead first.

1. Open Stanford's [Add AI API Gateway Key form](https://stanford.service-now.com/it_services?id=sc_cat_item&sys_id=fd75ec563b90265079a53434c3e45a65)
   and sign in with your SUNetID.
2. Prepare the request details:

   | Detail | What to provide |
   |---|---|
   | Organization and requester | Your institution and who will own the key |
   | Models | The models your project needs |
   | Key alias and purpose | A short name and description of the research use |
   | Budget and volume | Maximum monthly spend and estimated requests per day |
   | Due date | When you need access |
   | Billing | Your PTA and the appropriate billing approver |

3. Submit the request and complete any required approval. Stanford sends the key through
   secure email after processing the request.
4. Follow the setup instructions linked from the [Gateway service page](https://uit.stanford.edu/service/ai-api-gateway).
   Keep the key out of source code, prompts, and Git.

The monthly budget is a spending cap, not a flat fee. For current billing and access
details, see the [Gateway FAQ](https://uit.stanford.edu/service/ai-api-gateway/faqs).

{: .note }
> **For a future research project:** These are the steps for requesting your own Stanford
> Gateway key. Today's exercises use the course's separate Anthropic key, so you can
> continue without submitting this request.

---

## Why This Course Calls Anthropic Directly

In earlier classroom runs, many students sent requests at the same time through a shared
Stanford Gateway key. That synchronized load ran into rate limits and stalled the exercise.
For this public-data pipeline, the course now uses a directly provisioned Anthropic
organization with more usable headroom for the expected class traffic.

The Python exercises call **Anthropic's API directly**, using the course's Anthropic
account and an `ANTHROPIC_API_KEY`. These requests do **not** go through Stanford's AI API
Gateway. Use only the public SEC filings provided for the exercises.

---

## Models, APIs, and Agent Harnesses

These terms describe different parts of an AI tool:

| Term | What it does | Example in this course |
|---|---|---|
| **LLM (large language model)** | Processes the supplied context and generates a response, which can include a request to use a tool | Claude |
| **LLM API (application programming interface)** | Lets software send requests to a model service and receive responses | Your Python script calls Anthropic's Messages API |
| **Agent harness** | Manages the model's context, tool access, permissions, and repeated steps toward a task | Claude Code reads a file, asks the model what to change, applies an edit, and runs a check |

The **model** generates a response. The **harness** supplies context and executes permitted
tool actions. A model does not read your repo or run a terminal command on its own; the
surrounding software provides those capabilities. An API can support both a simple
request-and-response script and a harness that makes many model calls while working.

The Playground provides a browser interface, conversation history, and optional tools.
You do not need to build that software yourself. In the extraction exercise, your Python
script controls the requests and saves the results. It follows a fixed sequence rather
than letting an agent choose the next action.

## What Leaves the Yens?

In the extraction script, your code chooses the prompt and filing text to send:

<svg viewBox="0 0 660 432" role="img" aria-labelledby="api-flow-title api-flow-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:660px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="api-flow-title">A direct API request from the Yens to Anthropic</title>
  <desc id="api-flow-desc">On the Yens, Python reads the public filing and builds a prompt. The request leaves the Yens through Anthropic's API. Claude returns a response, which Python validates and saves on the Yens. This request does not pass through Stanford's API Gateway.</desc>
  <defs>
    <marker id="api-flow-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#e67e22"/></marker>
  </defs>
  <rect x="16" y="16" width="628" height="172" rx="16" fill="#fffaf2" stroke="#ecdcc0" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="36" y="43" font-size="14" font-weight="700" letter-spacing="0.6" fill="#6a7280">ON THE YENS</text>
  <rect x="36" y="58" width="280" height="108" rx="12" fill="#fff8ef" stroke="#e6cfa8" stroke-width="1.5"/>
  <text x="54" y="87" font-size="16" font-weight="700" fill="#2c3e50">1. Build the request</text>
  <text x="54" y="114" font-size="14" fill="#5b6472">Python reads the public filing</text>
  <text x="54" y="138" font-size="14" fill="#5b6472">and adds your instructions.</text>
  <rect x="344" y="58" width="280" height="108" rx="12" fill="#e3f2e6" stroke="#b7ddba" stroke-width="1.5"/>
  <text x="362" y="87" font-size="16" font-weight="700" fill="#2c3e50">3. Check and save</text>
  <text x="362" y="114" font-size="14" fill="#5b6472">Python validates the response</text>
  <text x="362" y="138" font-size="14" fill="#5b6472">and writes the result to a file.</text>
  <line x1="176" y1="168" x2="176" y2="258" stroke="#e67e22" stroke-width="2.5" marker-end="url(#api-flow-arrow)"/>
  <text x="160" y="219" text-anchor="end" font-size="14" font-weight="700" fill="#b3611a">prompt + filing</text>
  <text x="160" y="242" text-anchor="end" font-size="14" fill="#5b6472">API request</text>
  <line x1="484" y1="260" x2="484" y2="168" stroke="#e67e22" stroke-width="2.5" marker-end="url(#api-flow-arrow)"/>
  <text x="500" y="219" font-size="14" font-weight="700" fill="#b3611a">response</text>
  <text x="500" y="242" font-size="14" fill="#5b6472">back to Python</text>
  <rect x="16" y="260" width="628" height="156" rx="16" fill="#f7f9fc" stroke="#bcd4f2" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="36" y="286" font-size="14" font-weight="700" letter-spacing="0.6" fill="#6a7280">ANTHROPIC'S SERVICE</text>
  <rect x="36" y="300" width="588" height="94" rx="12" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="330" y="332" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">2. Claude processes the request</text>
  <text x="330" y="361" text-anchor="middle" font-size="14" fill="#5b6472">The model receives the text your script sends.</text>
</svg>

*The prompt and filing leave the Yens. This course calls Anthropic directly.*

With a coding agent, the harness may gather additional context before calling the model:

<svg viewBox="0 0 1000 560" role="img" aria-labelledby="harness-flow-title harness-flow-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:1000px;height:auto;margin:1.5rem auto" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="harness-flow-title">An agent sends context from the Yens to a remote model</title>
  <desc id="harness-flow-desc">The Claude Code harness runs on the Yens. It reads files and other context, follows your instructions, and uses permitted local tools. Its API requests send selected context across the Yens boundary to Anthropic's remote model. That context can include code, data samples, earlier messages, and terminal output. The model's response returns to the harness, which may run more tools and send their results in another request. The service and account determine the applicable data rules.</desc>
  <defs>
    <marker id="privacy-ah-outbound" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#8c1515"/></marker>
    <marker id="privacy-ah-green" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#2e8b57"/></marker>
    <marker id="privacy-ah-slate" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#556a95"/></marker>
    <marker id="privacy-ah-brown" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#b5761f"/></marker>
  </defs>

  <!-- perimeter -->
  <line x1="700" y1="40" x2="700" y2="536" stroke="#b09668" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="700" y="30" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="0.5" fill="#b09668">YENS BOUNDARY</text>

  <!-- your machine -->
  <rect x="16" y="56" width="628" height="488" rx="18" fill="#fdf6ea" stroke="#e6cfa8" stroke-width="1.5"/>
  <text x="40" y="94" font-size="24" font-weight="700" fill="#2c3e50">💻  On the Yens</text>
  <text x="40" y="122" font-size="16" fill="#9a8a68">The harness runs here. Its model calls send context elsewhere.</text>

  <!-- your data panel (what it reads) -->
  <rect x="32" y="142" width="300" height="262" rx="12" fill="#ffffff" stroke="#e6cfa8" stroke-width="1.25"/>
  <text x="50" y="174" font-size="19" font-weight="700" fill="#2c3e50">Possible context</text>
  <text x="50" y="202" font-size="16" font-weight="700" fill="#b5761f">Check what gets sent</text>
  <circle cx="56" cy="232" r="5" fill="#6a7280"/><text x="72" y="238" font-size="16" fill="#2c3e50">Code and file contents</text>
  <circle cx="56" cy="264" r="5" fill="#6a7280"/><text x="72" y="270" font-size="16" fill="#2c3e50">Data samples</text>
  <line x1="50" y1="290" x2="314" y2="290" stroke="#eee2cf" stroke-width="1"/>
  <circle cx="56" cy="318" r="5" fill="#6a7280"/><text x="72" y="324" font-size="16" fill="#2c3e50">Terminal and tool output</text>
  <circle cx="56" cy="350" r="5" fill="#6a7280"/><text x="72" y="356" font-size="16" fill="#2c3e50">Earlier messages</text>
  <circle cx="56" cy="382" r="5" fill="#6a7280"/><text x="72" y="388" font-size="16" fill="#2c3e50">Errors and logs</text>

  <!-- your instructions -->
  <rect x="360" y="142" width="280" height="88" rx="12" fill="#ffffff" stroke="#e6cfa8" stroke-width="1.25"/>
  <text x="500" y="180" text-anchor="middle" font-size="20" font-weight="700" fill="#2c3e50">🗨️  Your instructions</text>
  <text x="500" y="210" text-anchor="middle" font-size="15.5" fill="#7a6a48">what you ask it · your CLAUDE.md</text>

  <!-- harness -->
  <rect x="402" y="270" width="196" height="112" rx="14" fill="#fbe9cf" stroke="#dcae6a" stroke-width="1.75"/>
  <text x="500" y="318" text-anchor="middle" font-size="22" font-weight="700" fill="#2c3e50">⚙️  Claude Code</text>
  <text x="500" y="350" text-anchor="middle" font-size="16" fill="#8a6d3b">the model harness</text>

  <!-- your inputs (green): you direct it, and it reads what you allow -->
  <line x1="500" y1="230" x2="500" y2="266" stroke="#2e8b57" stroke-width="2.5" marker-end="url(#privacy-ah-green)"/>
  <text x="512" y="254" text-anchor="start" font-size="15" font-weight="700" fill="#1f6b45">you direct it</text>

  <line x1="332" y1="326" x2="398" y2="326" stroke="#2e8b57" stroke-width="2.5" marker-end="url(#privacy-ah-green)"/>
  <text x="365" y="316" text-anchor="middle" font-size="15" font-weight="700" fill="#1f6b45">reads</text>

  <!-- local acting loop (brown): acts on your machine, results return -->
  <line x1="478" y1="382" x2="478" y2="416" stroke="#b5761f" stroke-width="2.5" marker-end="url(#privacy-ah-brown)"/>
  <text x="468" y="404" text-anchor="end" font-size="15" font-weight="700" fill="#95611a">runs tools</text>
  <line x1="522" y1="416" x2="522" y2="384" stroke="#b5761f" stroke-width="2.5" marker-end="url(#privacy-ah-brown)"/>
  <text x="532" y="404" text-anchor="start" font-size="15" font-weight="700" fill="#95611a">results</text>

  <rect x="360" y="418" width="280" height="110" rx="12" fill="#fdf0d8" stroke="#e0c48a" stroke-width="1.25"/>
  <text x="500" y="450" text-anchor="middle" font-size="16.5" font-weight="700" fill="#8a5a12">Permitted local actions:</text>
  <text x="500" y="480" text-anchor="middle" font-size="15.5" fill="#6a5326">edit files · run commands</text>
  <text x="500" y="504" text-anchor="middle" font-size="15.5" fill="#6a5326">drive git · call tools</text>

  <!-- model -->
  <rect x="772" y="250" width="212" height="150" rx="16" fill="#eef5ff" stroke="#bcd4f2" stroke-width="1.5"/>
  <text x="878" y="298" text-anchor="middle" font-size="21" font-weight="700" fill="#2c3e50">🧠  Claude's model</text>
  <text x="878" y="330" text-anchor="middle" font-size="17" fill="#6a7280">Anthropic's server</text>
  <text x="878" y="362" text-anchor="middle" font-size="15" fill="#8a94a6">Remote API call</text>
  <text x="878" y="382" text-anchor="middle" font-size="15" fill="#8a94a6">Check account + service</text>

  <!-- remote model loop (slate): harness sends context; model replies -->
  <line x1="600" y1="308" x2="768" y2="308" stroke="#8c1515" stroke-width="3.5" marker-end="url(#privacy-ah-outbound)"/>
  <text x="684" y="298" text-anchor="middle" font-size="15.5" font-weight="700" fill="#8c1515" stroke="#ffffff" stroke-width="5" paint-order="stroke" stroke-linejoin="round">① context leaves</text>
  <line x1="768" y1="342" x2="602" y2="342" stroke="#556a95" stroke-width="2.5" marker-end="url(#privacy-ah-slate)"/>
  <text x="684" y="362" text-anchor="middle" font-size="15.5" font-weight="700" fill="#3f4f74" stroke="#ffffff" stroke-width="5" paint-order="stroke" stroke-linejoin="round">② response</text>
  <text x="684" y="382" text-anchor="middle" font-size="14" fill="#8a94a6" stroke="#ffffff" stroke-width="5" paint-order="stroke" stroke-linejoin="round">loops until done</text>
  <text x="878" y="440" text-anchor="middle" font-size="16" font-weight="700" fill="#8c1515">Sent off the Yens:</text>
  <text x="878" y="466" text-anchor="middle" font-size="16" fill="#5b6472">any files, messages, or</text>
  <text x="878" y="490" text-anchor="middle" font-size="16" fill="#5b6472">tool output included</text>
  <text x="878" y="514" text-anchor="middle" font-size="16" fill="#5b6472">in the request</text>
</svg>

*The harness runs on the Yens, but the context it sends crosses the boundary to the remote model. Files and terminal output can leave with the next request.*

**Context** is the material supplied to the model for a response. It can include
instructions, earlier messages, file contents, and tool results. With a remote model,
anything included in that context is sent to the model service. Running the harness on
the Yens does not mean the model runs there too.

An API key identifies the account making a request. The model name alone does not tell
you which account, contract, or data-handling terms apply. Check the service and account
used by the script or harness.

For this course's direct calls, the prompt and public filing go to Anthropic. See its
[commercial training policy](https://privacy.anthropic.com/en/articles/7996885-how-do-you-use-personal-data-in-model-training)
and [retention policy](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)
for the current terms. Those terms do not replace Stanford's requirements or a dataset's rules.

## Keep Sensitive Material Out of Context

- Keep API keys in `.env`, exclude that file from Git, and do not paste its contents into
  prompts or print them in notebook output or logs.
- Use public or synthetic examples when writing and testing code. Keep real restricted
  records out of comments, example prompts, and error output.
- Give an agent access only to the files it needs. Review its actions before letting it
  read additional data or run commands that might print records.
- Check the tool's access controls. A Git ignore rule prevents a file from being tracked;
  it does not necessarily prevent an agent from reading it.

Next, [Managing API Keys]({{ '/day1/api-keys/' | relative_url }}) shows you how to set up
your Anthropic API key and keep it out of Git. In
[Extracting Data with an LLM]({{ '/day1/extracting-data-with-an-llm/' | relative_url }}),
you'll measure token usage and check results before scaling the pipeline.

---

## Quiz

Answer each one in your head, then open it to check.

<details class="quiz" markdown="1">
<summary><span class="qnum">1</span><span class="qtext">You want to compare different model providers' answers to the same prompt without writing code. Where would you start?</span></summary>

**Stanford's AI Playground.** Sign in through your browser and send the same prompt to
available models from different providers. Compare their responses to see how the answers
differ.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">2</span><span class="qtext">Does this course's Python script send its requests through Stanford's AI API Gateway?</span></summary>

**No. It calls Anthropic's API directly** using the course's `ANTHROPIC_API_KEY`.
Stanford's Gateway uses a separate key and service setup. Your Claude education account
is also separate from the key used by the exercise's Python client.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">3</span><span class="qtext">Claude Code reads a file, asks the model what to change, and runs a check. Which part is doing each job?</span></summary>

**The harness manages the work; the model generates responses.** Claude Code's harness
supplies context and runs permitted tools to read files, apply edits, and execute checks.
The LLM API carries requests to the model service and responses back to the harness.

A model can request a tool action, but the harness is what executes it.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">4</span><span class="qtext">You started an agent on the Yens. Does that mean its model runs on the Yens too?</span></summary>

**No. The harness and model can run on different systems.** When the harness calls a
remote model, the context it includes leaves the Yens. Check which service the tool
connects to, even when you launch it from a cluster terminal.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">5</span><span class="qtext">An AI service supports your data's risk level, but the dataset's agreement forbids AI analysis. Is the service's approval enough?</span></summary>

**No. You need to meet the dataset's rules as well.** Check all three: the data's risk
classification, the agreement governing its use, and the system and service approvals.
A service's technical capabilities do not override the dataset's restrictions.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">6</span><span class="qtext">You added a restricted file to <code>.gitignore</code>. Does that stop a coding agent from reading it?</span></summary>

**Not necessarily.** `.gitignore` controls which untracked files Git normally includes;
it is not a general file-access control. Check the agent's permissions and limit its
access to the files needed for the task.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">7</span><span class="qtext">An agent reads a script containing a path to a data file. Has it sent the file's contents to the model?</span></summary>

**The path alone does not contain the file's contents.** But if the agent opens the file,
or a command prints a row, the harness may include that output in its next model call.
The path itself can also reveal information, such as a participant's name.

Check both what a tool can read and what it returns to the model.

</details>

---

## Skills Learned

- Choose the Playground for browser-based work and an API for scripted requests
- Distinguish the model, its API, and the agent harness that manages tools and context
- Check data classification, dataset rules, and service approval before sending data
- Identify what a script or harness sends to a remote model
- Use Anthropic's direct API with the course's public filings
