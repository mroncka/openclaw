# OpenClaw — CI/CD

## Pipeline
- **CI/CD not yet configured** — add GitHub Actions workflow as first chore task

## Secrets & Environment
- Local: `.env.local` or `.env` (never committed — in .gitignore)
- Production: secrets managed via platform (Firebase Secrets / Vercel / GitHub Secrets)
- Required variable names: see `.vectra/context/integrations.md`

## Deployment Targets
- TBD — update when deployment target is confirmed

## Rollback Procedure
1. Identify the bad commit on `main`
2. Revert merge commit: `git revert <sha>`
3. Push and redeploy

---
*Last updated: 2026-02-28*
