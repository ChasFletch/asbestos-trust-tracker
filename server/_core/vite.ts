import superjson from "superjson";
import { buildSsrPrefetch } from "./ssrCaller";
import { SITE_NAME, SITE_TITLE, SITE_DESC } from "../../shared/const";
import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import type { HeadMeta } from "../../client/src/ssr/prefetch";

import { ENV } from "./env";
const CANONICAL_ORIGIN = ENV.canonicalOrigin;
const OG_LOCALE = "en_US";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const clampText = (t: string, max: number) => {
  t = t.trim();
  if (t.length <= max) return t;
  const cut = t.lastIndexOf(" ", max);
  if (cut > max * 0.6) return t.slice(0, cut) + "…";
  return Array.from(t).slice(0, max).join("") + "…";
};
const metaText = (s: string, max: number) => clampText(s.replace(/[#*_`~]+/g, ""), max);

function buildHeadTags(head: HeadMeta, siteName: string): string {
  const title = escapeHtml(clampText(head.title, 70) || siteName);
  const desc = escapeHtml(metaText(head.description, 200));
  const url = head.canonicalPath && CANONICAL_ORIGIN ? escapeHtml(CANONICAL_ORIGIN + head.canonicalPath) : "";
  const img = head.ogImage?.startsWith("//")
    ? "https:" + head.ogImage
    : head.ogImage?.startsWith("/")
      ? (CANONICAL_ORIGIN ? CANONICAL_ORIGIN + head.ogImage : undefined)
      : head.ogImage;
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta property="og:type" content="${head.ogType ?? "website"}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:locale" content="${escapeHtml(head.locale ?? OG_LOCALE)}" />`,
    `<meta name="twitter:card" content="${img ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
  ];
  if (siteName) tags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`);
  if (img) {
    tags.push(`<meta property="og:image" content="${escapeHtml(img)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(img)}" />`);
    if (head.ogImageWidth) tags.push(`<meta property="og:image:width" content="${head.ogImageWidth}" />`);
    if (head.ogImageHeight) tags.push(`<meta property="og:image:height" content="${head.ogImageHeight}" />`);
    if (head.ogImageAlt) tags.push(`<meta property="og:image:alt" content="${escapeHtml(head.ogImageAlt)}" />`);
  }
  if (head.ogType === "article") {
    if (head.publishedTime) tags.push(`<meta property="article:published_time" content="${escapeHtml(head.publishedTime)}" />`);
    if (head.modifiedTime) tags.push(`<meta property="article:modified_time" content="${escapeHtml(head.modifiedTime)}" />`);
  }
  if (url) {
    tags.push(`<meta property="og:url" content="${url}" />`);
    tags.push(`<link rel="canonical" href="${url}" />`);
  }
  if (head.notFound || head.noindex) {
    tags.push(`<meta name="robots" content="noindex, follow" />`);
  }
  return tags.join("\n");
}

function composeHtml(template: string, appHtml: string, head: HeadMeta, dehydratedState: unknown) {
  const esc = (s: string) => s.replace(/</g, "\\u003c");
  const headTags = buildHeadTags(head, SITE_NAME);
  const stateScript = `<script>window.__RQ_STATE__ = ${esc(JSON.stringify(superjson.serialize(dehydratedState)))}</script>`;
  return template
    .replace("</body>", () => `${stateScript}</body>`)
    .replace("<!--app-head-->", () => headTags)
    .replace("<!--app-html-->", () => appHtml);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/entry-client.tsx"`, `src="/src/entry-client.tsx?v=${nanoid()}"`);
      template = await vite.transformIndexHtml(url, template);
      template = template.replace("</head>", `<link rel="stylesheet" href="/src/index.css?direct" data-ssr-dev-css></head>`);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const prefetch = await buildSsrPrefetch(req, res);
      const { html, dehydratedState, head } = await render(url, prefetch);
      res
        .status(head.notFound ? 404 : 200)
        .set("Cache-Control", "no-cache")
        .type("html")
        .end(composeHtml(template, html, head, dehydratedState));
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error("[SSR] dev render failed:", e);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }
  app.use((req, res, next) => {
    if (req.path === "/index.html") return res.redirect(301, "/");
    if (req.path !== "/" && /\/+$/.test(req.path)) {
      const query = req.originalUrl.slice(req.path.length);
      const target = (req.path.replace(/\/+$/, "") || "/").replace(/^\/\/+/, "/");
      return res.redirect(301, target + query);
    }
    next();
  });
  app.use(express.static(distPath, { index: false, redirect: false }));
  const templatePath = path.resolve(distPath, "index.html");
  const serverEntryPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "server-ssr", "entry-server.js")
      : path.resolve(import.meta.dirname, "server-ssr", "entry-server.js");
  app.use("*", async (req, res) => {
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const { render } = await import(serverEntryPath);
      const prefetch = await buildSsrPrefetch(req, res);
      const { html, dehydratedState, head } = await render(req.originalUrl, prefetch);
      res
        .status(head.notFound ? 404 : 200)
        .set("Cache-Control", "no-cache")
        .type("html")
        .end(composeHtml(template, html, head, dehydratedState));
    } catch (e) {
      console.error("[SSR] render failed, serving shell:", e);
      try {
        const tmpl = await fs.promises.readFile(templatePath, "utf-8");
        const fallbackHead = buildHeadTags({ title: SITE_TITLE, description: SITE_DESC }, SITE_NAME);
        res.status(200).set("Cache-Control", "no-cache").type("html").end(
          tmpl.replace("<!--app-head-->", () => fallbackHead).replace("<!--app-html-->", () => "")
        );
      } catch {
        res.status(500).send("Internal Server Error");
      }
    }
  });
}
