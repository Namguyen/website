import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext setup for Cloudflare Workers. All pages are statically prerendered,
// so no incremental cache (R2/KV) is needed for now.
export default defineCloudflareConfig();
