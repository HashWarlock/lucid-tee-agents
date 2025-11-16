export type {
  WalletConnector,
  WalletMetadata,
  ChallengeSigner,
  NormalizedChallenge,
  ChallengeMessageEncoding,
  ChallengeNormalizationOptions,
} from './base-connector.js';
export {
  normalizeChallenge,
  stableJsonStringify,
  extractSignature,
  extractWalletMetadata,
  detectMessageEncoding,
} from './base-connector.js';

export {
  LocalEoaWalletConnector,
  type LocalEoaWalletConnectorOptions,
} from './local-eoa-connector.js';
export {
  ServerOrchestratorWalletConnector,
  ServerOrchestratorMissingAccessTokenError,
  type ServerOrchestratorWalletConnectorOptions,
} from './server-orchestrator-connector.js';
export { createPrivateKeySigner } from './private-key-signer.js';
export {
  createAgentWallet,
  type AgentWalletHandle,
  type AgentWalletKind,
} from './create-agent-wallet.js';
export type {
  AgentChallenge,
  AgentChallengeResponse,
  AgentWalletFactoryOptions,
  FetchExecutor,
  LocalEoaSigner,
  LocalWalletOptions,
  LocalWalletWithPrivateKeyOptions,
  LocalWalletWithSignerOptions,
  LucidWalletOptions,
  TypedDataPayload,
  AgentWalletConfig,
  DeveloperWalletConfig,
  WalletsConfig,
} from './types.js';
export { walletsFromEnv } from './env.js';
