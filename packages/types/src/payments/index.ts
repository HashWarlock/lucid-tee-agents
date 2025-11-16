import type { Network, Resource } from 'x402/types';

/**
 * Solana address type (base58 encoded).
 */
export type SolanaAddress = string;

/**
 * Payment configuration for x402 protocol.
 * Supports both EVM (0x...) and Solana (base58) addresses.
 */
export type PaymentsConfig = {
  payTo: `0x${string}` | SolanaAddress;
  facilitatorUrl: Resource;
  network: Network;
};

/**
 * Price for an entrypoint - either a flat string or separate invoke/stream prices.
 */
export type EntrypointPrice = string | { invoke?: string; stream?: string };

