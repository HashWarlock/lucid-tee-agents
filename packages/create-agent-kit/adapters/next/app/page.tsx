import { headers } from 'next/headers';

import Dashboard from '@/components/dashboard';
import { agent, runtime } from '@/lib/agent';
import type { DashboardData } from '@/lib/dashboard-types';

const BASE_PATH = '/api/agent';

function ensureSerializable<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch (error) {
    throw new Error(`Object contains non-serializable values: ${error}`);
  }
}

function getRequestOrigin(): string {
  const headerMap = headers();
  const proto = headerMap.get('x-forwarded-proto') ?? 'http';
  const host = headerMap.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

async function loadDashboardData(origin: string): Promise<DashboardData> {
  const manifest = agent.resolveManifest(origin, BASE_PATH);
  const manifestEntrypoints = manifest.entrypoints || [];

  const rawEntrypoints = agent.listEntrypoints();
  const entrypoints = rawEntrypoints.map(entry => {
    const manifestEntry = manifestEntrypoints.find(
      (candidate: any) => candidate.key === entry.key
    );

    return {
      key: String(entry.key),
      description: entry.description ? String(entry.description) : null,
      streaming: Boolean(entry.stream),
      price:
        typeof entry.price === 'string'
          ? String(entry.price)
          : entry.price
            ? {
                invoke: entry.price.invoke ? String(entry.price.invoke) : null,
                stream: entry.price.stream ? String(entry.price.stream) : null,
              }
            : null,
      network: entry.network ? String(entry.network) : null,
      inputSchema: manifestEntry?.input || null,
      outputSchema: manifestEntry?.output || null,
    };
  });

  const configPayments = runtime.payments;
  const payments =
    configPayments !== false && configPayments !== undefined
      ? {
          network: configPayments.network
            ? String(configPayments.network)
            : null,
          defaultPrice: configPayments.defaultPrice
            ? String(configPayments.defaultPrice)
            : null,
          payTo: configPayments.payTo ? String(configPayments.payTo) : null,
        }
      : null;

  const rawMeta = agent.config.meta;
  const meta = rawMeta
    ? {
        name: String(rawMeta.name || ''),
        version: String(rawMeta.version || ''),
        description: rawMeta.description ? String(rawMeta.description) : null,
      }
    : null;

  return ensureSerializable({ meta, payments, entrypoints });
}

export default async function Page() {
  const origin = getRequestOrigin();
  const dashboard = await loadDashboardData(origin);
  return <Dashboard initialData={dashboard} />;
}
