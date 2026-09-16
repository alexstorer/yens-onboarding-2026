---
layout: default
title: "Python Environments"
parent: "Part 2 — Python & AI"
grand_parent: "Day 1 — Foundations & AI"
nav_order: 2
permalink: /day1/python-environments/
---

# Python Environments

A virtual environment gives a project its own Python packages. In this section, you'll create one, install the course dependencies, make it available to JupyterHub notebooks, and record the installed versions. A bonus exercise uses another project's requirements file to run its code.

{: .important }
> **In this section:** Create and activate a virtual environment on the Yens, install packages, and register a Jupyter kernel.
>
> **Start in your SSH terminal connected to the Yens.** You do not need a JupyterHub terminal. If you already have one open, you can use it instead. All commands labeled **Yen Terminal** run on the cluster. You'll open a notebook in Step 4.

---

## Check Which Python You're Using

If you are still at the Python `>>>` prompt, run `exit()` to return to the shell. Then check the interpreter and its package installer:

```bash
which python3
python3 -m pip --version
```
{: .yens }

The paths tell you which Python and pip this terminal uses. An SSH terminal, a JupyterHub terminal, and a notebook can each use a different Python environment. Installing a package in one does not necessarily make it available in another.

Using `python3 -m pip` runs pip through the Python you selected. Next, you'll create an environment and use it for both terminal commands and notebooks.

---

## Step 1: Create a Virtual Environment

In your Yen terminal, move into the cloned repo:

```bash
cd ~/yens-onboarding-2026
```
{: .yens }

Create the environment at the repo root using the system Python:

```bash
/usr/bin/python3 -m venv .venv
```
{: .yens }

{: .note }
> Use `~/yens-onboarding-2026/.venv` for the rest of this course, including Day 2. The Potion Brawl bonus is a separate project and gets its own environment.

---

## Step 2: Activate the Environment

```bash
source ~/yens-onboarding-2026/.venv/bin/activate
```
{: .yens }

Your prompt should now show `(.venv)`. Check which Python will run:

```bash
echo $PATH          # .venv/bin is now at the front
which python3       # points inside the repo's .venv/
```
{: .yens }

Deactivate the environment and compare the paths:

```bash
deactivate
which python3       # the Python this shell used before activation
echo $PATH
```
{: .yens }

Reactivate it before continuing:

```bash
source ~/yens-onboarding-2026/.venv/bin/activate
```
{: .yens }

{: .note }
> Activation adds `.venv/bin/` to the front of `$PATH`, similar to `module load` in the previous section. Deactivation removes it. This change applies only to the current terminal; activate the environment again in each new terminal you use.

{: .note }
> 🟢 **Green sticky** = my prompt shows `(.venv)` and `which python3` points inside the repo's `.venv/` &nbsp;&nbsp; 🔴 **Red sticky** = I need help
>
> Put a sticky note on your laptop lid so instructors can see where you are.

---

## Step 3: Install Packages

With the environment active, read the course's requirements file:

```bash
cd ~/yens-onboarding-2026
cat requirements.txt
```
{: .yens }

It lists eight packages. Install them with:

```bash
python3 -m pip install -r requirements.txt
```
{: .yens }

`-r` tells pip to read package requirements from the file.

<details markdown="1">
<summary>Installing packages by name</summary>

You could also list the packages in the command:

```bash
python3 -m pip install anthropic python-dotenv pydantic pandas requests ipykernel jupyter matplotlib
```
{: .yens }

Keeping the list in `requirements.txt` lets collaborators install the dependencies without finding the original command. In Step 5, you'll record the installed versions as well.

</details>

| Package | Purpose | Where you'll use it |
|---|---|---|
| `anthropic` | Calling Claude through Anthropic's API | Extracting Data with an LLM |
| `python-dotenv` | Loading your API key from `.env` | Managing API Keys |
| `pydantic` | Validating model output against a schema | Extracting Data with an LLM |
| `pandas` | Working with tabular data; also installs `numpy` | Extraction exercises |
| `requests` | Downloading filings over HTTP | Day 2's batch extraction |
| `ipykernel` | Running this environment's Python in a notebook | Step 4 |
| `jupyter` | Notebook tools | Notebook exercises |
| `matplotlib` | Creating plots | Plotting exercises |

These packages are installed in this environment. Check that Python can import one:

```bash
python3 -c "import dotenv; print('dotenv ok')"
```
{: .yens }

Deactivate the environment and compare:

```bash
deactivate
python3 -c "import sys; print(sys.executable)"
python3 -c "import dotenv"
```
{: .yens }

The import may fail with `ModuleNotFoundError`. If it succeeds, that Python already has `dotenv` available. The interpreter path shows which environment you're testing.

Reactivate the course environment:

```bash
source ~/yens-onboarding-2026/.venv/bin/activate
```
{: .yens }

---

## Step 4: Register a Jupyter Kernel

A **kernel** is the process that runs a notebook's code and holds its variables in memory. Selecting a Python kernel chooses the interpreter and packages the notebook uses. Activating a virtual environment in a terminal does not change an open notebook's kernel.

With the course environment active, run this in the same Yen terminal:

```bash
python3 -m ipykernel install --user --name=gsb-ai-2026 --display-name "GSB AI 2026"
```
{: .yens }

This registers the environment for your account. You can run the command through SSH; a JupyterHub terminal is not required.

Now open a notebook in your browser:

1. Open [JupyterHub on Yen1](https://yen1.stanford.edu/jupyter/hub/home) and log in with your SUNetID, or return to the JupyterHub session from the previous section.
2. In the file browser, open **`yens-onboarding-2026`**.
3. Click the **blue "+"** to open the Launcher, then select **GSB AI 2026** under Notebook. If it isn't listed yet, refresh the browser.
4. Name the notebook **`venv_check.ipynb`**. Confirm that **GSB AI 2026** appears in the notebook's kernel menu.

Run this in a notebook cell with **Shift+Enter**:

```python
import sys
import dotenv
import anthropic

print(sys.executable)
print("dotenv and anthropic are available!")
```
{: .notebook }

The interpreter path should end in `yens-onboarding-2026/.venv/bin/python3`, and both imports should succeed.

{: .note }
> If the path points elsewhere, select **GSB AI 2026** from the kernel menu. If you install or upgrade packages while a notebook is open, restart its kernel before testing them again. Restarting clears the notebook's variables, so run the cells again afterward.

{: .note }
> 🟢 **Green sticky** = my notebook uses **GSB AI 2026** and both imports worked &nbsp;&nbsp; 🔴 **Red sticky** = I need help
>
> Put a sticky note on your laptop lid so instructors can see where you are.

---

## Step 5: Record the Installed Versions

Virtual environments contain machine-specific paths and should be rebuilt when moving to another machine. Use a requirements file to record which packages to install.

Return to your Yen terminal. Activate the course environment and record its installed packages:

```bash
cd ~/yens-onboarding-2026
source .venv/bin/activate
python3 -m pip freeze > requirements.lock.txt
cat requirements.lock.txt
```
{: .yens }

`pip freeze` lists installed packages with their versions. The list is longer than `requirements.txt` because it includes dependencies installed by the eight packages you requested.

| File | How it's made | Contents | Purpose |
|---|---|---|---|
| `requirements.txt` | Written by the project authors | The packages the project needs | Installing project dependencies |
| `requirements.lock.txt` | Generated with `pip freeze` | Installed packages and their versions | Reinstalling the recorded package versions |

{: .warning }
> Save the output to **`requirements.lock.txt`**. Running `pip freeze > requirements.txt` would overwrite the course's existing requirements list.

For your own projects, commit `requirements.txt` so collaborators can install the dependencies. Include the recorded versions when they need to reproduce a particular run. Keep `.venv/` out of git; this repo already excludes it in `.gitignore`.

<details markdown="1">
<summary>Rebuilding an environment later</summary>

In a fresh project checkout on the Yens, create and activate an environment:

```bash
/usr/bin/python3 -m venv .venv
source .venv/bin/activate
```
{: .yens }

Install the project's requirements:

```bash
python3 -m pip install -r requirements.txt
```
{: .yens }

Or use the recorded versions if you have a lock file:

```bash
python3 -m pip install -r requirements.lock.txt
```
{: .yens }

</details>

{: .note }
> Requirements files record packages, not Python itself, data, API keys, or notebooks. Record your Python version and preserve the code and inputs too. Matching package versions alone does not guarantee identical results across machines.

---

## Bonus

{: .note }
> Finished early? Try any of these.

**Bonus 1: Run Another Project (Potion Brawl)**

The repo includes **Potion Brawl**, a simulation in which three potion types interact using rock-paper-scissors rules. You'll use its requirements file to install its dependencies in a separate environment.

In your Yen terminal, open the project and read its requirements:

```bash
cd ~/yens-onboarding-2026/data/potion_brawl
cat requirements.txt
```
{: .yens }

The file lists 13 packages with pinned versions.

### Create the Project's Environment

Deactivate the course environment before creating Potion Brawl's environment:

```bash
deactivate
/usr/bin/python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```
{: .yens }

{: .note }
> Potion Brawl's `.venv/` and generated `output/` folder are already excluded from git.

### Run the Script

```bash
python3 potion_brawl.py
```
{: .yens }

The script prints a banner, progress bar, and population table, then writes these files to `output/`:

| File | Contents |
|---|---|
| `brawl.gif` | Animation of the simulation |
| `populations.png` | Population chart over time |
| `law_of_the_brawl.png` | Diagram of the three-potion cycle |
| `victor.txt` | Tick count and final population tally |
| `lab_journal.pkl` | Saved positions, velocities, and random-number generator state |

### Resume the Simulation

Run it again:

```bash
python3 potion_brawl.py
```
{: .yens }

The script loads `output/lab_journal.pkl` and continues from the saved state, including the random-number generator's state. Check the terminal message for the tick at which it resumes.

To continue the simulation in a new directory, you need the code, requirements file, and saved journal. Rebuild the environment there rather than copying `.venv/`.

<details markdown="1">
<summary>Run the notebook version</summary>

With Potion Brawl's environment active, register its kernel from your Yen terminal:

```bash
python3 -m ipykernel install --user --name potion-brawl --display-name "Potion Brawl (venv)"
```
{: .yens }

In JupyterHub's file browser, open `yens-onboarding-2026/data/potion_brawl/the_alchemists_lab.ipynb`. Select **Potion Brawl (venv)**, then choose **Kernel → Restart Kernel and Run All Cells**.

</details>

### Return to the Course Environment

Before continuing to the next section, switch back in your Yen terminal:

```bash
deactivate
cd ~/yens-onboarding-2026
source .venv/bin/activate
which python3
```
{: .yens }

The path should point to `~/yens-onboarding-2026/.venv/bin/python3`.

---

**Bonus 2: Find the Kernel Configuration**

List the registered kernels from your Yen terminal:

```bash
jupyter kernelspec list
```
{: .yens }

Your user-installed kernels are usually under `~/.local/share/jupyter/kernels/`. Open the configuration for the course kernel:

```bash
cat ~/.local/share/jupyter/kernels/gsb-ai-2026/kernel.json
```
{: .yens }

The file points to your environment's Python. Deleting that environment leaves the kernel entry pointing to a missing interpreter.

**Bonus 3: Inspect the Environment's Paths**

```bash
ls -l ~/yens-onboarding-2026/.venv/bin/python
cat ~/yens-onboarding-2026/.venv/pyvenv.cfg
```
{: .yens }

On the Yens, the environment's Python links to the system interpreter, and `pyvenv.cfg` records the base Python's location. These paths may not exist on another machine, which is why you recreate the environment there.

---

## Quiz

Answer each one in your head, then open it to check.

<details class="quiz" markdown="1">
<summary><span class="qnum">1</span><span class="qtext">You activated the course environment, then opened a new SSH terminal. Is the environment active there too?</span></summary>

**No. Activation applies to the terminal where you ran it.** In the new terminal, run:

```bash
source ~/yens-onboarding-2026/.venv/bin/activate
which python3
```
{: .yens }

The path should point inside the course repo's `.venv/`. You do not need to recreate
the environment or reinstall its packages each time you connect.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">2</span><span class="qtext">You run <code>deactivate</code>. Have you deleted the environment or its packages?</span></summary>

**No.** Deactivation removes the environment's directory from the front of this shell's
`$PATH`. The `.venv/` folder and installed packages remain on disk. Activate it again to
use them.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">3</span><span class="qtext">Why do we install packages with <code>python3 -m pip</code> instead of just <code>pip</code>?</span></summary>

**It runs pip through the Python you selected.** A separate `pip` command might belong
to another Python installation. After activating the environment, `python3 -m pip`
installs packages for that environment's Python. Check `which python3` if you are unsure
which interpreter is selected.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">4</span><span class="qtext">A package imports successfully in your terminal but fails in your notebook. What should you check first?</span></summary>

**Check the notebook's kernel.** Activating an environment in a terminal does not change
the notebook's Python. Select **GSB AI 2026**, then check the interpreter in a cell:

```python
import sys
print(sys.executable)
```
{: .notebook }

The path should point inside the course repo's `.venv/`. If you just installed or upgraded
a package in that environment, restart the kernel and rerun the cells.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">5</span><span class="qtext">A collaborator wants to run your project on another machine. Should you send them your <code>.venv/</code> folder?</span></summary>

**Send the code and requirements files so they can rebuild the environment.** A virtual
environment contains paths tied to the machine where it was created. Copying it can leave
those paths pointing to missing files.

Include the Python version and any data the project needs. Keep `.venv/` out of Git.

</details>

<details class="quiz" markdown="1">
<summary><span class="qnum">6</span><span class="qtext">The course's <code>requirements.txt</code> has eight packages, but <code>pip freeze</code> lists many more. Did something go wrong?</span></summary>

**No. Those packages have dependencies of their own.** `pip freeze` records the installed
packages and their versions, including those dependencies. Save it as
`requirements.lock.txt` to preserve the course's shorter `requirements.txt`.

The recorded versions help reproduce the package setup, but they do not include Python,
your input data, or your code.

</details>

---

## Skills Learned

- Create and activate a project environment on the Yens
- Install packages using `python3 -m pip` and a requirements file
- Select the project's environment as a JupyterHub notebook kernel
- Record installed package versions without overwriting the project's requirements
- Rebuild an environment from its requirements and keep `.venv/` out of git
