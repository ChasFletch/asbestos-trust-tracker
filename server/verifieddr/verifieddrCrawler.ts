import type { Request, RequestHandler, Response } from "express";

export const VERIFIEDDR_CRAWLER_ENDPOINT = "https://verifieddr.com/api/v1/crawler-logs";
export const VERIFIEDDR_AI_CRAWLER_TOKENS = [
  "gptbot",
  "oai-searchbot",
  "chatgpt-user",
  "claude-searchbot",
  "claude-user",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "perplexitybot",
  "perplexity-user",
  "google-extended",
  "google-cloudvertexbot",
  "meta-externalagent",
  "meta-externalfetcher",
  "facebookbot",
  "bytespider",
  "amazonbot",
  "applebot-extended",
  "duckassistbot",
  "mistralai-user",
  "ccbot",
  "ai2bot",
  "cohere-ai",
  "youbot",
] as const;

export type VerifiedDrCrawlerEvent = {
  hostname: string;
  path: string;
  user_agent: string;
  method: string;
  status: number;
  timestamp: string;
  referrer: string;
};

export type VerifiedDrReporterOptions = {
  token?: string;
  canonicalOrigin: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  onError?: (error: unknown) => void;
};

const registeredSources = new Set<string>();

export function isVerifiedDrAiCrawler(userAgent: string): boolean {
  const normalized = userAgent.toLowerCase();
  return VERIFIEDDR_AI_CRAWLER_TOKENS.some((token) => normalized.includes(token));
}

function usableToken(token: string | undefined): token is string {
  return Boolean(token?.trim().startsWith("vdrcrawl_") || token?.trim().startsWith("vdr_"));
}

function referrerPath(request: Request): string {
  const referrer = request.get("referer");
  if (!referrer) return "";
  try {
    return new URL(referrer).pathname;
  } catch {
    return "";
  }
}

async function requireOk(response: globalThis.Response, description: string): Promise<void> {
  if (!response.ok) {
    throw new Error(`${description} returned ${response.status}`);
  }
}

/**
 * Forwards an already-finished Express request to VerifiedDR only when it was
 * made by a recognized AI crawler. The caller intentionally does not await
 * this from the response lifecycle so the visitor's response is never delayed.
 */
export async function reportVerifiedDrCrawlerEvent(
  request: Request,
  response: Response,
  options: VerifiedDrReporterOptions,
): Promise<boolean> {
  const token = options.token?.trim();
  const userAgent = request.get("user-agent") ?? "";
  if (!usableToken(token) || !isVerifiedDrAiCrawler(userAgent)) return false;

  const fetchImpl = options.fetchImpl ?? fetch;
  const endpoint = options.endpoint ?? VERIFIEDDR_CRAWLER_ENDPOINT;
  const url = new URL(request.originalUrl || request.url || "/", options.canonicalOrigin);
  const sourceKey = `${endpoint}|${url.hostname}|server`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "VerifiedDR-JS/1.0.0 (server)",
  };

  const tasks: Promise<void>[] = [
    fetchImpl(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify([
        {
          hostname: url.hostname,
          path: url.pathname || "/",
          user_agent: userAgent,
          method: request.method,
          status: response.statusCode,
          timestamp: (options.now ?? (() => new Date()))().toISOString(),
          referrer: referrerPath(request),
        } satisfies VerifiedDrCrawlerEvent,
      ]),
    }).then((result) => requireOk(result, "VerifiedDR crawler ingest")),
  ];

  if (!registeredSources.has(sourceKey)) {
    registeredSources.add(sourceKey);
    tasks.push(
      fetchImpl(endpoint, {
        method: "PUT",
        headers,
        body: JSON.stringify({ hostname: url.hostname, provider: "server" }),
      })
        .then((result) => requireOk(result, "VerifiedDR crawler source registration"))
        .catch((error) => {
          registeredSources.delete(sourceKey);
          throw error;
        }),
    );
  }

  try {
    await Promise.all(tasks);
  } catch (error) {
    options.onError?.(error);
  }
  return true;
}

/** Mount before application routes to capture the final status of every response. */
export function verifiedDrCrawlerTracking(options: VerifiedDrReporterOptions): RequestHandler {
  return (request, response, next) => {
    response.once("finish", () => {
      void reportVerifiedDrCrawlerEvent(request, response, options);
    });
    next();
  };
}

export function resetVerifiedDrCrawlerSourceRegistration(): void {
  registeredSources.clear();
}
