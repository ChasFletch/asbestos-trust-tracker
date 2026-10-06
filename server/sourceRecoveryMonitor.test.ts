import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("internal source recovery monitor", () => {
  it("keeps operational recovery evidence behind an admin-only endpoint", () => {
    const router = read("server/routers.ts");
    expect(router).toContain("sourceRecoveryMonitor: adminProcedure.query");
    expect(router).toContain("operationsPilots");
    expect(router).toContain("retiredFailures");
    expect(router).toContain("documentRecoveryStatus: \"unresolved\"");
    expect(router).toContain("monitoringSchedulePaused: pilot.status !== \"active\"");
  });

  it("registers a protected, noindex UI route without adding it to public navigation", () => {
    const app = read("client/src/App.tsx");
    const monitor = read("client/src/pages/AdminSourceRecoveryMonitor.tsx");
    const prefetch = read("client/src/ssr/prefetch.ts");
    const navigation = read("client/src/components/SiteNav.tsx");

    expect(app).toContain('path="/admin/source-monitor"');
    expect(monitor).toContain("trpc.admin.sourceRecoveryMonitor.useQuery");
    expect(monitor).toContain("Admin access required");
    expect(monitor).toContain("Retired source-failure record");
    expect(prefetch).toContain('clean === "/admin/source-monitor"');
    expect(prefetch).toContain("noindex: true");
    expect(navigation).not.toContain("/admin/source-monitor");

    const auth = read("client/src/_core/hooks/useAuth.ts");
    expect(auth).toContain('if (typeof window !== "undefined")');
    expect(auth).toContain("Authenticated admin routes are server-rendered as a signed-out shell.");
  });

  it("stops the public recovery page from advertising a future check after pilot completion", () => {
    const router = read("server/routers.ts");
    const page = read("client/src/pages/SourceRecovery.tsx");
    expect(router).toContain("nextScheduledCheckAt: source && !monitoringSchedulePaused ?");
    expect(page).toContain("The 30-day pilot ended October 5, 2026.");
    expect(page).toContain("Monitoring paused after pilot close");
  });
});
