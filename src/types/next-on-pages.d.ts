declare module "@cloudflare/next-on-pages" {
  export function getRequestContext(): {
    env: import("@/types/cloudflare-env").CloudflareEnv;
    cf: IncomingRequestCfProperties;
    ctx: ExecutionContext;
  };
}
