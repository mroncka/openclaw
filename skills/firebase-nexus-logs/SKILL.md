---
name: firebase-nexus-logs
description: Read production logs and runtime snapshots from Vectra Nexus (Firebase RTDB). Use when you need to check the health of the Nexus runtime, audit orchestrator decisions, or inspect node heartbeats.
---

# Firebase Nexus Logs

This skill allows you to connect to the Vectra Nexus production environment and read real-time logs and snapshots stored in Firebase Realtime Database.

## Workflows

### 1. Check Runtime Health
To see if the Nexus control loop is active, check DB connectivity, and view task/node statistics:
- Use `read_nexus_logs(type: 'runtime')`
- Look for `health.loopActive: true` and `transport.persistence: 'ok'`

### 2. Audit Orchestrator Actions
To see recent global requests and how the orchestrator handled them:
- Use `read_nexus_logs(type: 'orchestrator', limit: 10)`
- Inspect `payload` (input) and `result` (output) of each request

### 3. Inspect Node Status
To see the latest heartbeats from all nodes:
- Use `read_nexus_logs(type: 'nodes')`
- Check `status` (online/offline) and `lastSeenAt` for each nodeId

## Tool Reference

### `read_nexus_logs`
- `type`: 'runtime' | 'orchestrator' | 'nodes' (Required)
- `limit`: Number of entries (Optional, defaults to 10, used for orchestrator logs)

## Schema Reference
For detailed data structures, see [references/schema.md](references/schema.md).

## Technical Context
The logs are read via the Firebase Admin SDK. The `NexusTaskRecord` and `NodeHeartbeatRecord` schemas define the structure of the data returned from RTDB.
- Tasks path: `tasks/`
- Node heartbeats path: `nodeHeartbeats/`
- Runtime snapshot path: `state/runtimeSnapshot`
- Global requests (Orchestrator logs) path: `globalRequests/`
