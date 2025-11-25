import { flow } from '@ax-llm/ax';
import { createAgent, createAxLLMClient } from '@lucid-agents/core';
import { createAgentApp } from '@lucid-agents/hono';
import { http } from '@lucid-agents/http';
import { payments } from '@lucid-agents/payments';
import type { PaymentsConfig } from '@lucid-agents/types/payments';
import { z } from 'zod';

/**
 * This example shows how to combine `createAxLLMClient` with a small AxFlow
 * pipeline. The flow creates a short summary for a topic and then follows up
 * with a handful of ideas the caller could explore next.
 *
 * Required environment variables:
 *   - OPENAI_API_KEY   (passed through to @ax-llm/ax)
 *   - PRIVATE_KEY      (used for x402 payments)
 */

const axClient = createAxLLMClient({
  apiUrl: 'http://localhost:8080/v1',
  logger: {
    warn(message, error) {
      if (error) {
        console.warn(`[examples] ${message}`, error);
      } else {
        console.warn(`[examples] ${message}`);
      }
    },
  },
});

if (!axClient.isConfigured()) {
  console.warn(
    '[examples] Ax LLM provider not configured — the flow will fall back to scripted output.'
  );
}

const brainstormingFlow = flow<{ topic: string }>()
  .node(
    'summarizer',
    'topic:string -> summary:string "Two concise sentences describing the topic."'
  )
  .node(
    'ideaGenerator',
    'summary:string -> ideas:string[] "Three short follow-up ideas."'
  )
  .execute('summarizer', state => ({
    topic: state.topic,
  }))
  .execute('ideaGenerator', state => ({
    summary: state.summarizerResult.summary as string,
  }))
  .returns(state => ({
    summary: state.summarizerResult.summary as string,
    ideas: Array.isArray(state.ideaGeneratorResult.ideas)
      ? (state.ideaGeneratorResult.ideas as string[])
      : [],
  }));

// Use URL to validate and normalize, then get href string
import type { Resource } from 'x402/types';

const facilitatorUrlString =
  process.env.FACILITATOR_URL ?? 'https://facilitator.daydreams.systems';
const facilitatorUrl = new URL(facilitatorUrlString).href as Resource;

const paymentsConfig: PaymentsConfig = {
  payTo: '0xb308ed39d67D0d4BAe5BC2FAEF60c66BBb6AE429',
  facilitatorUrl: facilitatorUrl,
  network: 'base',
};

const agent = await createAgent({
  name: 'ax-flow-agent',
  version: '0.0.1',
  description:
    'Demonstrates driving an AxFlow pipeline through createAxLLMClient.',
})
  .use(http())
  .use(payments({ config: paymentsConfig }))
  .build();

const { app, addEntrypoint } = await createAgentApp(agent);

addEntrypoint({
  key: 'brainstorm',
  description:
    'Summarise a topic and suggest three follow-up ideas using AxFlow.',
  input: z.object({
    topic: z
      .string()
      .min(1, { message: 'Provide a topic to analyse.' })
      .describe('High level topic to explore.'),
  }),
  output: z.object({
    summary: z.string(),
    ideas: z.array(z.string()),
  }),
  async handler(ctx) {
    const topic = String(ctx.input.topic ?? '').trim();
    if (!topic) {
      throw new Error('Topic cannot be empty.');
    }

    const llm = axClient.ax;
    if (!llm) {
      const fallbackSummary = `AxFlow is not configured. Pretend summary for "${topic}".`;
      return {
        output: {
          summary: fallbackSummary,
          ideas: [
            'Set OPENAI_API_KEY to enable the Ax integration.',
            'Provide a PRIVATE_KEY so x402 can sign requests.',
            'Re-run the request once credentials are configured.',
          ],
        },
        model: 'axllm-fallback',
      };
    }

    const result = await brainstormingFlow.forward(llm, { topic });
    const usageEntry = brainstormingFlow.getUsage().at(-1);
    brainstormingFlow.resetUsage();

    return {
      output: {
        summary: result.summary ?? '',
        ideas: Array.isArray(result.ideas) ? result.ideas : [],
      },
      model: usageEntry?.model,
    };
  },
});

const port = Number(process.env.PORT ?? 8787);

if (typeof Bun !== 'undefined') {
  Bun.serve({ fetch: app.fetch, port });
  console.log(
    `[examples] AxFlow example listening on https://localhost:${port}/entrypoints/brainstorm/invoke`
  );
} else {
  console.warn(
    '[examples] Bun runtime not detected; export the app or adapt to your runtime instead.'
  );
}
