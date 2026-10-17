/** Bindings declarados em wrangler.toml (Pages / Workers). */
export type CloudflareEnv = {
  VITRINE_KV: KVNamespace;
  /** Estoque relacional do painel (fase 2 — substituir demo/localStorage). */
  DB?: D1Database;
  /** Fotos dos veículos (substituir uploads/ local). */
  PHOTOS_BUCKET?: R2Bucket;
};

declare global {
  interface KVNamespace {
    get(key: string, type?: "text"): Promise<string | null>;
    get<T>(key: string, type: "json"): Promise<T | null>;
    put(
      key: string,
      value: string,
      options?: { expirationTtl?: number; metadata?: Record<string, unknown> },
    ): Promise<void>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    all<T = unknown>(): Promise<{ results?: T[] }>;
    run(): Promise<unknown>;
  }

  interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: ArrayBuffer | ReadableStream | string): Promise<unknown>;
  }

  interface R2ObjectBody {
    arrayBuffer(): Promise<ArrayBuffer>;
  }
}

export {};
