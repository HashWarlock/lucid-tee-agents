export interface AgentChallenge {
  id: string;
  credential_id?: string | null;
  payload?: unknown;
  payload_hash?: string | null;
  nonce: string;
  scopes?: string[];
  issued_at: string | Date;
  expires_at: string | Date;
  server_signature?: string | null;
}

export interface AgentChallengeResponse {
  challenge: AgentChallenge;
}

export type FetchExecutor = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

export interface LocalEoaSigner {
  signMessage(message: string | Uint8Array): Promise<string>;
  signTypedData?(payload: TypedDataPayload): Promise<string>;
  getAddress?(): Promise<string | null>;
}

export type TypedDataPayload = {
  domain: Record<string, unknown>;
  primary_type: string;
  types: Record<string, Array<{ name: string; type: string }>>;
  message: Record<string, unknown>;
};

export interface LocalWalletMetadataOptions {
  address?: string | null;
  caip2?: string | null;
  chain?: string | null;
  chainType?: string | null;
  provider?: string | null;
  label?: string | null;
}

export type LocalWalletWithSignerOptions = LocalWalletMetadataOptions & {
  type: 'local';
  signer: LocalEoaSigner;
  privateKey?: never;
};

export type LocalWalletWithPrivateKeyOptions = LocalWalletMetadataOptions & {
  type: 'local';
  privateKey: string;
  signer?: never;
};

export type LocalWalletOptions =
  | LocalWalletWithSignerOptions
  | LocalWalletWithPrivateKeyOptions;

export interface LucidWalletOptions {
  type: 'lucid';
  baseUrl: string;
  agentRef: string;
  fetch?: FetchExecutor;
  headers?: HeadersInit;
  accessToken?: string | null;
  authorizationContext?: Record<string, unknown>;
}

export type AgentWalletFactoryOptions = LocalWalletOptions | LucidWalletOptions;

// Wallet config types are now in @lucid-agents/types/wallets
export type {
  AgentWalletConfig,
  DeveloperWalletConfig,
  WalletsConfig,
} from '@lucid-agents/types/wallets';
