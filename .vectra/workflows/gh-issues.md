# OpenClaw — GitHub Issues Schema

## Label Taxonomy

### Type Labels
| Label | Color | Use |
|-------|-------|-----|
| `type: bug` | `#d73a4a` | Something is broken |
| `type: feat` | `#0075ca` | New capability |
| `type: chore` | `#e4e669` | Maintenance / refactor |
| `type: question` | `#d876e3` | Needs clarification |
| `type: docs` | `#0052cc` | Documentation |

### Priority Labels
| Label | Color | Use |
|-------|-------|-----|
| `priority: critical` | `#b60205` | Blocks release — current sprint |
| `priority: high` | `#e11d48` | Next sprint |
| `priority: medium` | `#f97316` | Backlog |
| `priority: low` | `#94a3b8` | Someday |

### Status Labels
| Label | Color | Use |
|-------|-------|-----|
| `status: in-progress` | `#fbca04` | Actively worked on |
| `status: blocked` | `#e4e669` | Waiting on external dependency |
| `status: needs-review` | `#0075ca` | PR or design review needed |
| `status: wont-fix` | `#ffffff` | Intentionally not addressed |

## Issue Template Fields
1. **What** — one-line description of the problem or feature
2. **Why** — why this matters now
3. **Acceptance criteria** — what "done" looks like
4. **Related** — links to PRs, decisions, blocking issues

## Triage Rules
- Unlabeled issues → triage at start of next session
- `priority: critical` → must enter current sprint immediately
- `status: blocked` → add blocking issue/PR link in body

## Milestone Strategy
- Milestones map to project phases: `scaffold` → `beta` → `v1.0`
- Unplanned items default to `backlog` milestone

---
*Last updated: 2026-02-28*
