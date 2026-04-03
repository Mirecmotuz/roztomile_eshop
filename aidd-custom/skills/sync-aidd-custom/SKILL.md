---
name: sync-aidd-custom
description: >
  Sync project-specific rules, skills, and commands from aidd-custom/ into
  .cursor/<repo-root>/ with content diff, Cursor-native formatting, and
  CLAUDE.md linkage. Use when the user runs /sync-aidd-custom or asks to
  refresh Cursor mirrors from aidd-custom.
disable-model-invocation: true
compatibility: Requires read/write access to the repository; no network required.
---

# sync-aidd-custom

Act as a meticulous build-gardener. Mirror project-owned agent assets from
`aidd-custom/` into Cursor’s `.cursor/` tree with a **diff-first**, incremental
workflow.

Competencies {
  repository layout and path mapping
  text diff and incremental file updates
  Cursor rule (`.mdc`), command (`.md`), and skill (`SKILL.md`) formats
  preserving upstream AIDD index files while extending them safely
}

Constraints {
  Run steps in order. Do **not** skip Step 2 (inventory/diff) before any writes.
  Never create empty `aidd-custom/rules`, `skills`, or `commands` trees “just because”.
  Write **only** files classified **new** or **changed** vs the mirror; do **not** rewrite unchanged mirrors.
  Touch each parent `.cursor/<category>/index.md` **only** when this run **first creates**
  `.cursor/<category>/<RepoRoot>/` for that category; otherwise update only child `index.md` under `<RepoRoot>/` when files were written.
  Communicate to the user as friendly markdown prose with numbered lists — not raw SudoLang syntax.
  No secrets in mirrored files.
}

**RepoRoot** = basename of `$projectRoot` (the repository root directory on disk, e.g. `roztomile`).

---

## Cursor output formats (replicate exactly)

When transforming or authoring mirrored files:

- **Rules (`.mdc`):** `.cursor/rules/<RepoRoot>/<name>.mdc` — YAML frontmatter (`description`, `alwaysApply`, `globs` as needed), then body. Prefer `@path` references over huge pasted code.
- **Commands (`.md`):** `.cursor/commands/<RepoRoot>/<name>.md` — kebab-case filename; imperative markdown body; no YAML unless project convention.
- **Skills:** `.cursor/skills/<RepoRoot>/<skill-folder>/SKILL.md` — `name` must match folder; required `description`; optional `disable-model-invocation`, etc.

---

## Step 1 — Preconditions

resolveRepoRoot() => context {
  1. Set **RepoRoot** = filesystem name of the project root (directory containing the repo).
  2. Treat missing `aidd-custom/<category>/` or a category with **no files** as **category empty** — do not fabricate empty trees in `aidd-custom/`.
}

---

## Step 2 — Inventory and diff (no writes)

inventoryAndDiff(context) => diffReport | idle {
  For each category in `{ rules, skills, commands }`:
  1. If category empty in `aidd-custom/` → record **empty**; skip walking.
  2. Else walk every file under `aidd-custom/<category>/` (skills: nested folders + `SKILL.md`, etc.).
  3. For each source file, compute the **mirror path** under `.cursor/<category>/<RepoRoot>/` + same relative path, adjusting only where the sync contract changes the filename (e.g. rules: prefer mirror as **`.mdc`** — map `foo.md` → `foo.mdc` when that is the Cursor output for that source).
  4. **Compare source vs mirror** in a way that matches how the mirror is produced:
     - **Skills** and **commands**: treat the mirror as a **byte-level** copy of the canonical source (after normalizing line endings only). If texts differ → **changed**; if mirror missing → **new**; if equal → **unchanged**.
     - **Rules**: the mirror is often **not** an exact copy of the source (extra YAML frontmatter, `.md` → `.mdc`, `@` references, etc.). **Do not** compare raw `aidd-custom` text to raw `.cursor` text. Instead, **compute the expected mirror body** using the **same rules as Step 3** (Cursor `.mdc` shape), then compare **expected mirror** ↔ **file on disk** (normalize line endings). Missing mirror → **new**; mismatch → **changed**; match → **unchanged**.
  5. Classify each path: **new** | **changed** | **unchanged** | **orphan** (mirror without source — report only; do not delete unless user asked).

  idleConstraints {
    If every category is empty **or** no path is **new** or **changed**:
      print exactly: `sync-aidd-custom: nothing to do — no aidd-custom assets or no differences vs .cursor/<RepoRoot>/ mirrors.`
      stop — no directory creation for empty categories
    Else:
      print a concise summary: path → status
  }
}

---

## Step 3 — Apply mirrors (incremental)

applyMirrors(diffReport) => writtenSet {
  Constraints {
    Write **only** **new** and **changed** paths.
    Normalize rules to `.mdc` with valid YAML frontmatter when mirroring structured sources.
    For rules from plain `.md` without frontmatter: infer `description` from first heading or sentence; default `alwaysApply: false` unless source says otherwise.
    Skills: folder name ↔ YAML `name` must match.
    Commands: kebab-case filenames only.
  }
}

---

## Step 4 — Index and navigation

updateIndexes(writtenSet) {
  **Parent** `.cursor/<category>/index.md`:
  Constraints {
    Modify **only** if this run **created** `.cursor/<category>/<RepoRoot>/` for that category for the **first** time.
    Append or insert a **Subdirectories** entry pointing to `<RepoRoot>/index.md` with a short AIDD-style blurb.
    Do not rewrite the whole parent index.
  }

  **Child** `.cursor/<category>/<RepoRoot>/index.md`:
  If this run wrote any file under that category, create or update child `index.md` to list files and one-line descriptions (tone like existing `.cursor/*/index.md`).
  If nothing written for that category, leave child index unchanged unless it is missing while files exist — then create a minimal listing from disk.
}

---

## Step 5 — CLAUDE.md

ensureClaudeGuidance() {
  If `CLAUDE.md` lacks explicit English guidance that:
  - `aidd-custom/` is canonical for project-owned rules/skills/commands, and
  - Cursor mirrors live under `.cursor/{rules,commands,skills}/<RepoRoot>/`,
  then add a short subsection under **AI Agent Guidelines** (preserve existing bullets). If present, only fix stale paths.
}

---

## Step 6 — Validate and report

validateAndReport(writtenSet) {
  1. Confirm each written file is valid YAML frontmatter where required.
  2. Summarize: paths written; parent indexes touched (yes/no per category); `CLAUDE.md` touched (yes/no).
  3. If nested `.cursor/commands/<RepoRoot>/` may not appear in Cursor’s slash palette, state that and mention optional thin wrapper at `.cursor/commands/<name>.md` (ask user before adding).
}

syncWorkflow = resolveRepoRoot |> inventoryAndDiff |> applyMirrors |> updateIndexes |> ensureClaudeGuidance |> validateAndReport

Note: `inventoryAndDiff` may **stop** the workflow when idle; do not run later steps after an idle stop.

Commands {
  /sync-aidd-custom - sync `aidd-custom/` into `.cursor/<RepoRoot>/` (diff-first, incremental)
}
