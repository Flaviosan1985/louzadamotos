export function createRateLimiter(options: {
  max: number;
  janelaMs: number;
  agora?: () => number;
}) {
  const hits = new Map<string, number[]>();
  const agora = options.agora ?? (() => Date.now());

  return {
    permitir(chave: string) {
      const agoraMs = agora();
      const janela = hits.get(chave)?.filter((t) => agoraMs - t < options.janelaMs) ?? [];
      if (janela.length >= options.max) {
        hits.set(chave, janela);
        return false;
      }
      janela.push(agoraMs);
      hits.set(chave, janela);
      return true;
    },
  };
}
