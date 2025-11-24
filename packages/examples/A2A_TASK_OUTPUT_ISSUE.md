# A2A Task Output Typing Issue

## Problem

When receiving task results from A2A client, `task.result.output` is typed as `unknown` because:

- The A2A protocol is generic - it doesn't know what output type the remote agent returns
- `TaskResult.output` is defined as `unknown` in `packages/types/src/a2a/index.ts`

However, when returning from a handler that has a Zod output schema:

- TypeScript expects `{ output: { text: string } }` (from the schema)
- But we're returning `{ output: unknown }` (from task.result.output)

## Error Example

```typescript
handler: async ctx => {
  const task = await waitForTask(...);

  // task.result.output is 'unknown'
  return {
    output: task.result?.output,  // ❌ Type error: unknown doesn't match { text: string }
    usage: task.result?.usage,
  };
}
```

## Solution Options

1. **Validate with Zod schema** (best practice - runtime safety)
2. **Type assertion** (faster for examples, less safe)
3. **Both** - validate and assert

For examples, we should show validation with Zod since it's the proper way to handle untrusted data.
