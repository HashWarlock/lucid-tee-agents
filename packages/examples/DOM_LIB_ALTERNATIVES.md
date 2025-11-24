# DOM Lib Alternatives

## Downsides of Using DOM Lib

1. **Brings in browser-only types** - Adds `Window`, `Document`, `HTMLElement`, `Event`, etc. that don't exist in Node.js/Bun
2. **Type pollution** - Unnecessary global types available everywhere
3. **Confusion** - Developers might think DOM APIs are available when they're not
4. **Semantic mismatch** - DOM is for browsers, not server-side code
5. **Larger type definitions** - More types to process, slower IDE

## Better Alternatives

### Option 1: Use FetchFunction type from @lucid-agents/types/http

```typescript
import type { FetchFunction } from '@lucid-agents/types/http';

type FetchWithPayment = FetchFunction;
```

This already includes `RequestInfo | URL, init?: RequestInit`.

### Option 2: Import types explicitly

```typescript
// If using Bun/Node 18+, these types should be available via global types
// But we can reference them directly from fetch types
type RequestInfo = Parameters<typeof fetch>[0];
type RequestInit = Parameters<typeof fetch>[1];
```

### Option 3: Use bun-types

Bun includes Fetch API types. Check if `bun-types` provides these.

### Option 4: Define locally

```typescript
type FetchWithPayment = (
  input: string | URL | Request,
  init?: {
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
    // ... other fetch options
  }
) => Promise<Response>;
```

## Recommendation

Use **Option 1** - import `FetchFunction` from `@lucid-agents/types/http` since it's already defined and matches what we need.
