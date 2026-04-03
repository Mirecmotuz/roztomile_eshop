# aidd-custom

This index provides an overview of the contents in this directory.

## Subdirectories

### 📁 commands/

See [`commands/index.md`](./commands/index.md) for contents.

### 📁 rules/

See [`rules/index.md`](./rules/index.md) for contents.

### 📁 skills/

See [`skills/index.md`](./skills/index.md) for contents.

## Root configuration

### 📄 config.yml

This file is the **AIDD project override** for tooling that reads `aidd-custom/` (see [paralleldrive/aidd](https://github.com/paralleldrive/aidd)). It centralizes **repo-specific switches** so skills and hooks do not hard-code behavior—for example, whether **e2e tests must run locally before each commit** (`e2eBeforeCommit`) or are left to CI. Add new keys here when the framework or your skills need configurable project policy.
