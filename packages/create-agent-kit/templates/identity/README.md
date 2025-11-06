## {{APP_NAME}}

This project was scaffolded with `create-agent-kit` and includes **ERC-8004 identity registration** built on [`@lucid-agents/agent-kit`](https://www.npmjs.com/package/@lucid-agents/agent-kit) and [`@lucid-agents/agent-kit-identity`](https://www.npmjs.com/package/@lucid-agents/agent-kit-identity).

### Features

- ✅ ERC-8004 on-chain identity registration
- ✅ Automatic trust metadata in agent manifest
- ✅ x402 payment support
- ✅ Access to all three registries (Identity, Reputation, Validation)
- ✅ Domain ownership proof signing

### Quick start

1. **Set up your environment:**
   ```sh
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY, RPC_URL, etc.
   ```

2. **Install dependencies:**
   ```sh
   bun install
   ```

3. **Run the agent:**
   ```sh
   bun run dev
   ```

The agent will:
- Check if it's registered on the ERC-8004 Identity Registry
- Auto-register if not found (when `AUTO_REGISTER=true`)
- Sign a domain ownership proof
- Include trust metadata in `/.well-known/agent.json`

### Project structure

- `src/agent.ts` – Agent definition with identity bootstrap and entrypoints
- `src/index.ts` – HTTP server that serves the agent

### Default entrypoints

- `{{ENTRYPOINT_KEY}}` – {{ENTRYPOINT_DESCRIPTION}}{{ENTRYPOINT_PRICE_NOTE}}

### ERC-8004 Registries

Your agent has access to all three registries:

```typescript
import { identityClient, reputationClient, validationClient } from "./agent";

// Give feedback to another agent
await reputationClient.giveFeedback({
  toAgentId: 42n,
  score: 90,
  tag: "helpful",
  comment: "Great service!",
});

// Create a validation request
await validationClient.createRequest({
  requestType: "inference-validation",
  dataHash: "0x...",
});
```

### Environment Variables

Required:
- `AGENT_DOMAIN` – Your agent's domain (must match DNS)
- `PRIVATE_KEY` – Wallet private key for registration & payments
- `RPC_URL` – Blockchain RPC endpoint
- `CHAIN_ID` – Chain ID (e.g., 84532 for Base Sepolia)

Optional:
- `PORT` – HTTP server port (default: 3000)
- `FACILITATOR_URL` – x402 facilitator endpoint
- `ADDRESS` – Payment address (defaults to wallet from PRIVATE_KEY)
- `NETWORK` – Payment network identifier
- `IDENTITY_REGISTRY_ADDRESS` – Override registry address

### Available scripts

- `bun run dev` – Start with hot reload
- `bun run start` – Start once
- `bun run agent` – Run agent module directly
- `bunx tsc --noEmit` – Type-check

### Next steps

1. **Host metadata files** at your domain:
   - `https://{{AGENT_DOMAIN}}/.well-known/agent-card.json` (proxied from `/`)
   - `https://{{AGENT_DOMAIN}}/.well-known/agent-metadata.json`

2. **Customize your agent** in `src/agent.ts`

3. **Add more entrypoints** with different capabilities

4. **Deploy** to your favorite Bun-compatible platform

### Learn more

- [Agent Kit Documentation](https://github.com/lucid-dreams/lucid-agents/tree/master/packages/agent-kit)
- [Identity Kit Documentation](https://github.com/lucid-dreams/lucid-agents/tree/master/packages/agent-kit-identity)
- [ERC-8004 Specification](https://eips.ethereum.org/EIPS/eip-8004)

