import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { runtime } from '@/lib/agent';
import { createNextPaywall } from '@/lib/paywall';

const PAYWALL_BASE_PATH = '/api/agent';
const FALLBACK_MATCHER = ['/__noop-paywall'];

const paywall = createNextPaywall({
  runtime,
  basePath: PAYWALL_BASE_PATH,
});

export const config = {
  matcher: paywall.matcher.length > 0 ? paywall.matcher : FALLBACK_MATCHER,
};

export function proxy(request: NextRequest) {
  if (paywall.middleware) {
    return paywall.middleware(request);
  }
  return NextResponse.next();
}
