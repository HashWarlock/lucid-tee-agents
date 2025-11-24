# TypeScript Errors Review - Examples Package

## 🚨 Critical UX Issues (API Confusion)

### 1. runtime-auth.ts - createAgentApp API Changed

**Issue:** Example shows OLD API pattern that doesn't work
**Impact:** High - developers copy-pasting will get confusing errors
**Fix:** ✅ Fixed - Updated to show correct async pattern with runtime creation

### 2. Handler Context Typing (ctx.input as unknown)

**Issue:** `ctx.input` is typed as `unknown` despite Zod schemas
**Files:**

- runtime-auth.ts:44
- ax-flow.ts:94
- firecrawl.ts:266
- a2a/full-integration.ts (multiple locations)
  **Impact:** High - Shows developers Zod schemas don't provide type safety
  **Fix:** Needs investigation - either fix typing or add type assertions

## ⚠️ UX Issues (Library/API Confusion)

### 3. A2A Task Output Types

**Issue:** `task.output` is `unknown` - needs proper typing
**Files:** a2a/full-integration.ts (lines 84, 100, 120, 179, 188, 218, 227)
**Impact:** Medium - Shows A2A API doesn't provide strong typing
**Fix:** Add type assertions or check if A2A API should provide better types

### 4. Extension URI Type Checking

**Issue:** `ext.uri` is `unknown` when checking for AP2 extension
**Files:** a2a/full-integration.ts (lines 300, 318, 345)
**Impact:** Low - Type narrowing issue
**Fix:** Add proper type guards

## 🔧 Code Issues (Fixable)

### 5. Template Literal Type

**Issue:** `facilitatorUrl` needs `${string}://${string}` type
**File:** ax-flow.ts:62
**Impact:** Low - Type assertion needed
**Fix:** Add type assertion or fix config type

### 6. Array.at() Method

**Issue:** `.at()` not available in ES2020 target
**Files:** ax-flow.ts:116, firecrawl.ts:314
**Impact:** Low - Use array[index] instead
**Fix:** Replace with array[array.length - 1] or update tsconfig lib

### 7. Fetch Type Mismatch

**Issue:** `preconnect` property missing from wrapped fetch
**File:** agent-zero-client.ts:69
**Impact:** Low - Type definition issue
**Fix:** Type assertion or fix fetch wrapper types

## Summary

- **Fixed:** 1 critical UX issue (createAgentApp API)
- **Needs Fix:** 2 handler context typing issues (reveals API weakness)
- **Can Fix:** 5 code-level issues
