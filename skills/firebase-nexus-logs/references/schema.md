# Nexus RTDB Schema

The following interfaces define the structure of data in the Vectra Nexus Firebase Realtime Database.

## Task Record
```typescript
export interface NexusTaskRecord<TPayload = unknown, TResult = unknown, TError = unknown> {
  id: string;
  state: 'queued' | 'leased' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: number;
  updatedAt: number;
  leaseOwnerNodeId: string | null;
  leaseExpiresAt: number | null;
  attempts: number;
  payload: TPayload;
  result: TResult | null;
  error: TError | null;
  firestoreTaskId?: string;
  firestoreProjectId?: string;
}
```

## Node Heartbeat
```typescript
export interface NodeHeartbeatRecord {
  nodeId: string;
  status: 'online' | 'offline' | 'degraded';
  lastSeenAt: number;
  updatedAt: number;
  capabilities?: string[];
  currentTaskId?: string | null;
  metadata?: Record<string, unknown>;
}
```

## Global Request (Orchestrator Log)
```typescript
export interface GlobalRequestRecord<TPayload = unknown> {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  updatedAt: number;
  requestedBy: string;
  payload: TPayload;
  expiresAt?: number;
  result?: unknown;
  error?: string;
}
```

## Runtime Snapshot
```typescript
export interface RuntimeSnapshot {
  version: string;
  timestamp: string;
  tickMs: number;
  transport: {
    persistence: 'ok' | 'degraded';
    lastWriteAt: string | null;
    lastWriteError: string | null;
  };
  health: {
    loopActive: boolean;
    dbConnected: boolean;
    consecutiveWriteFailures: number;
    uptimeSec: number;
  };
  nodes: {
    total: number;
    online: number;
    degraded: number;
    offline: number;
    stale: number;
  };
  tasks: {
    total: number;
    queued: number;
    leased: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}
```
