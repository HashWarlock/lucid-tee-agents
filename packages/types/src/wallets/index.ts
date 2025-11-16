export interface LocalWalletMetadataOptions {
  address?: string | null;
  caip2?: string | null;
  chain?: string | null;
  chainType?: string | null;
  provider?: string | null;
  label?: string | null;
}

export type LocalWalletWithPrivateKeyOptions = LocalWalletMetadataOptions & {
  type: 'local';
  privateKey: string;
  signer?: never;
};

export interface LucidWalletOptions {
  type: 'lucid';
  baseUrl: string;
  agentRef: string;
  fetch?: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>;
  headers?: HeadersInit;
  accessToken?: string | null;
  authorizationContext?: Record<string, unknown>;
}

export type AgentWalletConfig =
  | LocalWalletWithPrivateKeyOptions
  | LucidWalletOptions;

export type DeveloperWalletConfig = LocalWalletWithPrivateKeyOptions;

export type WalletsConfig = {
  agent?: AgentWalletConfig;
  developer?: DeveloperWalletConfig;
};

