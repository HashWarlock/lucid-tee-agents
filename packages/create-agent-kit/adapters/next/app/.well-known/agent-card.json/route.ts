import type { NextRequest } from 'next/server';

import { agent } from '@/lib/agent';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const manifest = agent.resolveManifest(origin, '/api/agent');
  return Response.json(manifest);
}
