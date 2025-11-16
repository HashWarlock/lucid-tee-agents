# Agent Wallet Extraction Notes

Source reference: `agent-auth/src/runtime/**/*`

## Wallet connector surface

- `WalletConnector` extends `ChallengeSigner` and optionally exposes `getWalletMetadata()`, `supportsCaip2()`, `getAddress()`.
- Helper utilities (`normalizeChallenge`, `stableJsonStringify`, `extractSignature`, `extractWalletMetadata`, `detectMessageEncoding`) live alongside the base interface and are consumed by both existing connectors.
- Two concrete connectors exist today:
  - `LocalEoaWalletConnector` wraps an injected signer with `signMessage`, optional `signTypedData`, and lazy `getAddress`. It normalizes challenges, extracts typed-data payloads, and coerces hex messages into bytes when needed.
  - `ServerOrchestratorWalletConnector` POSTs to `/v1/agents/{agentRef}/wallet/sign-message` on the Lucid backend, requiring `baseUrl`, `agentRef`, and a bearer token. It caches wallet metadata from the response for later access.

## Runtime wiring in `createWallet`

- `createWallet(options)` resolves runtime config (env or overrides) and instantiates a connector:
  - Custom connector can be provided directly.
  - Default path constructs a `ServerOrchestratorWalletConnector` with base URL, agent ref, headers, initial access token, and optional authorization context.
- It spins up `AgentRuntime` with `{ wallet: { signer: connector } }` plus fetch/transport/storage overrides.
- Runtime events `authenticated` and `tokenRefreshed` keep the orchestrator connector’s bearer token in sync (when it exposes `setAccessToken`).
- Exposes a `WalletClient` wrapper that proxies runtime API helpers (sign/send transaction, etc.) and surfaces connector metadata getters.

## Agent runtime expectations

- `AgentRuntime.fromConfig` requires `wallet.signer` before authentication flows; challenges are signed via `wallet.signer.signChallenge(challenge)`.
- Transport/auth clients rely on a fetch implementation (defaults to global `fetch`); token refresh schedule uses `TokenManager` and emits events consumed by connectors.

## Config + env inputs

- `config-loader.ts` expects agent ref, credential id, refresh token, scopes, and base URL via `.lucid-agent.json` or `LUCID_AGENT_*` env vars.
- `createWallet` also looks for orchestrator overrides via `LUCID_SERVER_URL` and `LUCID_SERVER_ACCESS_TOKEN`.

## Implications for new `@lucid-agents/wallet`

- Move the connector classes and helpers verbatim to avoid regressions.
- Expose a small factory so runtimes can request either a local signer (from private key) or Lucid-hosted orchestrator, without `agent-auth` dependencies.
- Ensure runtime event hooks remain available so orchestrator connectors receive updated access tokens automatically.
- Keep helper utilities public so other packages (e.g., ERC-8004, payments) can normalize/sign challenges consistently.

