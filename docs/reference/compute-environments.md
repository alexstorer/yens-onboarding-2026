---
layout: default
title: "Compute Environments"
parent: "Reference"
nav_order: 11
permalink: /reference/compute-environments/
---

# Compute Environments

Reference for the hardware terms Day 2 uses — here so you can look a number back up after
the room has emptied.

Every machine you will run research code on — your laptop, a Yen, a cloud instance — is
built from the same few physical parts. What changes between them is how much of each part
you get, and who else is competing for it.

---

## The Parts

![Server hardware diagram showing CPU, cores, and RAM]({{ "/assets/images/server-hardware-cpu-ram.png" | relative_url }})

*An AI rendering of a Yen server opened up.*

| Component | What it is |
|-----------|-----------|
| **CPU** | The processor chip — executes your code |
| **CPU core** | An individual worker inside the CPU; each runs independently, which is what makes parallel work possible |
| **RAM** | Fast memory the CPU reads from and writes to while working — limited in size |
| **Storage (disk / file system)** | Where your files live when nothing is running — large, but slow to reach |
| **I/O (input/output)** | Moving data from disk into RAM and writing results back — almost always the slowest step |
| **Script** | The sequence of steps the CPU follows to produce your output |

---

### What Happens When You Run a Script

When you run `python scripts/extract_form_3_one_file.py`, four things happen in order:

1. **Load from disk** — Python reads your script and data files from storage.
2. **Into RAM** — the data lands in memory, where the CPU can reach it quickly.
3. **CPU does the work** — cores execute the steps in your script against what's in RAM.
4. **Save to disk** — results are written back to storage so they survive the run.

Watch the first leg. Getting data from disk into RAM is the slow one; once it's close to
the processor, the rest is quick:

<svg viewBox="0 2 600 220" role="img" aria-labelledby="hwflow-title hwflow-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:820px;height:auto;margin:1.5rem auto" font-family="'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="hwflow-title">How your data moves: disk to RAM to CPU</title>
  <desc id="hwflow-desc">A packet of data loops from Storage to RAM to the CPU and back to Storage. Reading from disk into RAM is slow, and writing results back to disk is slow too; the CPU reaches data in RAM quickly.</desc>
  <defs><marker id="bk-hw" markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#c0392b"/></marker><marker id="fw-hw" markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#8fa3c4"/></marker></defs>
  <text x="12" y="20" font-size="14" font-weight="700" letter-spacing="0.4" fill="#6b7280">🖥  HOW YOUR DATA MOVES: DISK → RAM → CPU</text>
  <line x1="80" y1="56" x2="292" y2="56" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 5" marker-end="url(#bk-hw)"/>
  <line x1="308" y1="56" x2="514" y2="56" stroke="#8fa3c4" stroke-width="1.25" stroke-dasharray="2 4" marker-end="url(#fw-hw)"/>
  <line x1="80" y1="62" x2="80" y2="84" stroke="#dfe4ef" stroke-width="1"/>
  <line x1="300" y1="62" x2="300" y2="84" stroke="#dfe4ef" stroke-width="1"/>
  <line x1="520" y1="62" x2="520" y2="84" stroke="#dfe4ef" stroke-width="1"/>
  <text x="190" y="44" text-anchor="middle" font-size="13" font-weight="700" fill="#c0392b">read into RAM · ~200 µs</text>
  <text x="410" y="44" text-anchor="middle" font-size="13" font-weight="700" fill="#3f4f74">RAM to a core · ~100 ns</text>
  <rect x="20" y="84" width="120" height="60" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="80" y="111" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">Storage</text>
  <text x="80" y="130" text-anchor="middle" font-size="12" fill="#6a7280">where your files sit</text>
  <rect x="240" y="84" width="120" height="60" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="300" y="111" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">RAM</text>
  <text x="300" y="130" text-anchor="middle" font-size="12" fill="#6a7280">what the job holds</text>
  <rect x="460" y="84" width="120" height="60" rx="10" fill="#eef1f8" stroke="#cdd4e6" stroke-width="1.5"/>
  <text x="520" y="106" text-anchor="middle" font-size="16" font-weight="700" fill="#2c3e50">CPU</text>
  <rect x="487" y="116" width="12" height="12" rx="2" fill="#cdd4e6"/><rect x="503" y="116" width="12" height="12" rx="2" fill="#cdd4e6"/><rect x="519" y="116" width="12" height="12" rx="2" fill="#cdd4e6"/><rect x="535" y="116" width="12" height="12" rx="2" fill="#cdd4e6"/>
  <text x="520" y="140" text-anchor="middle" font-size="12" fill="#6a7280">cores do the work</text>
  <line x1="520" y1="174" x2="90" y2="174" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 5" marker-end="url(#bk-hw)"/>
  <text x="305" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#c0392b">write results back · ~200 µs</text>
  <g>
    <circle cx="80" cy="56" r="8" fill="#0072B2"><animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite"/></circle>
    <animateTransform attributeName="transform" type="translate" values="0,0; 0,0; 220,0; 220,0; 440,0; 440,0; 440,118; 0,118; 0,0" keyTimes="0; 0.05; 0.45; 0.52; 0.56; 0.64; 0.70; 0.97; 1" dur="8s" repeatCount="indefinite" calcMode="linear"/>
  </g>
  <text x="300" y="212" text-anchor="middle" font-size="13.5" fill="#6a7280">Both disk legs cost about 1,000× more than reaching RAM.</text>
</svg>

{: .warning }
> **Reading from storage is slow — by a factor of about a thousand.** Your CPU reaches
> data in RAM in roughly 100 nanoseconds; a request to Yen storage lands in the
> few-hundred-microsecond range. That cost is paid *per request*, so a few large reads
> beat many small reads or writes. And if your dataset does not fit in RAM all at once,
> your script keeps going back to storage mid-computation, and *that* is what makes a job
> crawl. This is why knowing how much RAM your script needs matters — on the cluster, and
> on your laptop too.
>
> Yen storage is all-flash (VAST), so the drives are not the bottleneck; the network
> between your node and the storage is.

---

## Three Places Your Code Can Run

### Your Laptop

Yours alone, and small: a handful of cores, RAM measured in single-digit gigabytes, and
a disk that is bigger than RAM but far slower to reach. Nothing competes with you, and
nothing helps you either — when you close the lid, the work stops.

### The Yens — Shared

A Yen node has far more of everything: `yen1` has **256 cores and roughly 1 TB of RAM**.
But you share it. Cores, RAM, and the file system are all contended, and **they are not
infinite**. Per-user limits are enforced so that one person cannot claim a whole node —
see the [current limits](https://rcpedia.stanford.edu/_policies/user_limits/) — but when
the cluster is busy, you feel it.

{: .note }
> **Shared file system.** A file you write on `yen1` is instantly visible on every other
> node, because they all read and write the same VAST storage (~1 PB). That is what makes
> collaboration easy — and it also means everyone is hitting the same storage at once.

A **node** is one physical server, with its own CPU and RAM, independent of the others.
That distinction matters later today: a job asking for more cores than any single node has
will never start, however much the cluster has in total.

### The Cloud — Rented

AWS, GCP, and Azure rent you a machine that is **yours alone** and effectively
unlimited: need 1,000 cores for an hour, rent them; need a petabyte, rent it. No
queueing behind other researchers.

{: .warning }
> **You pay for everything you rent, for as long as you rent it** — not for what you
> use. Leaving a large instance running overnight by accident costs real money, and the
> bill arrives whether the machine did anything or not. Shut down what you are not using.

For most GSB research, the Yens are the right answer: no per-hour cost, data stays on
Stanford-managed infrastructure, and your PI already has access to the same project
storage. The cloud earns its keep when you need something the Yens do not have, or need
it faster than the queue will give it to you.

---

## Where This Shows Up in the Lab

The three numbers every script needs — **compute time**, **cores**, and **RAM** — are the
ones you measure in [1. Profile]({{ '/day2/profiling/' | relative_url }}) and then
declare in [3. Submit]({{ '/day2/submit-a-slurm-job/' | relative_url }}). You cannot read
them off the code; you have to measure them while it runs.
