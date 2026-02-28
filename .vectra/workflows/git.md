# OpenClaw — Git Conventions

## Default Branch
`main`

## Branch Naming
| Prefix | Use |
|--------|-----|
| `feat/` | New feature or capability |
| `fix/` | Bug fix |
| `chore/` | Non-functional: deps, config, refactor |
| `exp/` | Experiment — may be deleted without notice |
| `docs/` | Documentation only |

## Commit Format
```
<type>(<scope>): <short description>

[optional body]
[optional footer: BREAKING CHANGE, closes #N]
```
Types: `feat` `fix` `chore` `docs` `test` `refactor` `perf`

## PR Policy
- **Default: merge fixes directly to main** — skip PRs unless Martin explicitly requests one
- Squash and merge preferred when PRs are used
- PR title must follow commit format

## Protected Branches
- `main` — no force-push

---
*Last updated: 2026-02-28*
