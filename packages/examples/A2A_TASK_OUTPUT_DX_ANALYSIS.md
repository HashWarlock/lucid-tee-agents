# A2A Task Output Typing - DX Issue Analysis

## The Problem

**`task.result?.output` is typed as `unknown`** - this affects ALL developers using A2A, not just examples.

### Root Cause

```typescript
// packages/types/src/a2a/index.ts
export type TaskResult = {
  output: unknown; // ❌ Always unknown
  usage?: Usage;
  model?: string;
};
```

**Why?**

- A2A is a protocol for calling remote agents
- The framework doesn't know what type the remote agent returns
- Type safety requires compile-time knowledge, but remote agents are runtime

### Current Impact

Every developer using A2A must manually validate/assert:

```typescript
const task = await waitForTask(client, card, taskId);
// task.result.output is 'unknown' ❌

// Developer MUST do this every time:
const outputSchema = z.object({ text: z.string() });
const validated = outputSchema.parse(task.result?.output); // Manual validation
return { output: validated };
```

## Is This Expected?

**Partially yes, but could be improved:**

✅ **Expected:** Runtime validation is necessary (remote data = untrusted)
❌ **Unexpected:** No helper functions to make this easier
❌ **Unexpected:** Can't leverage Agent Card `output_schema` for typing

## Potential Solutions

### Option 1: Generic Type Parameter

```typescript
// Make waitForTask generic
const task = await waitForTask<{ text: string }>(client, card, taskId);
// task.result.output is { text: string } ✅

// But still need runtime validation:
const validated = outputSchema.parse(task.result?.output);
```

**Pros:** Better type hints in IDE
**Cons:** Type isn't enforced at runtime (could be wrong)

### Option 2: Validation Helper Function

```typescript
// New helper that validates and types
export async function waitForTaskAndValidate<T extends z.ZodTypeAny>(
  client: A2AClient,
  card: AgentCardWithEntrypoints,
  taskId: string,
  outputSchema: T
): Promise<{ output: z.infer<T>; usage?: Usage; model?: string }> {
  const task = await waitForTask(client, card, taskId);
  return {
    output: outputSchema.parse(task.result?.output),
    usage: task.result?.usage,
    model: task.result?.model,
  };
}

// Usage:
const result = await waitForTaskAndValidate(
  client,
  card,
  taskId,
  z.object({ text: z.string() })
);
// result.output is { text: string } ✅ and validated ✅
```

**Pros:**

- Explicit validation (good practice)
- Type-safe after validation
- Clear intent

**Cons:** Still requires passing schema

### Option 3: Extract from Agent Card

```typescript
// Parse output_schema from Agent Card and use it
// Would require JSON Schema → Zod conversion
```

**Pros:** Automatic from Agent Card
**Cons:** Complex, JSON Schema → Zod conversion needed

## Recommendation

**This IS a DX issue** that affects all developers. We should:

1. ✅ **Fix examples** - Show proper validation pattern
2. ✅ **Add helper functions** - Make validation easier (Option 2)
3. ✅ **Document pattern** - Explain why validation is needed
4. ⚠️ **Consider generics** - Could help IDE autocomplete (Option 1)

## Conclusion

**This is a real DX issue**, not just an example problem. All developers will encounter this. The framework should provide better helpers and documentation for handling remote agent outputs.
