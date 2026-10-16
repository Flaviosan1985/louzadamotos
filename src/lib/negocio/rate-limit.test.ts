import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "./rate-limit.ts";

test("bloqueia depois do limite na janela", () => {
  let agora = 1_000;
  const limiter = createRateLimiter({ max: 2, janelaMs: 10_000, agora: () => agora });
  assert.equal(limiter.permitir("1.1.1.1"), true);
  assert.equal(limiter.permitir("1.1.1.1"), true);
  assert.equal(limiter.permitir("1.1.1.1"), false);
  assert.equal(limiter.permitir("2.2.2.2"), true);
});

test("a janela reabre depois do tempo", () => {
  let agora = 0;
  const limiter = createRateLimiter({ max: 1, janelaMs: 100, agora: () => agora });
  assert.equal(limiter.permitir("ip"), true);
  assert.equal(limiter.permitir("ip"), false);
  agora = 101;
  assert.equal(limiter.permitir("ip"), true);
});
