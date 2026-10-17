export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function badRequest(message: string) {
  return json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Não autorizado") {
  return json({ error: message }, { status: 401 });
}

export function forbidden(message = "Acesso negado") {
  return json({ error: message }, { status: 403 });
}

export function notFound(message = "Não encontrado") {
  return json({ error: message }, { status: 404 });
}
