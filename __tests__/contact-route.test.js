import { describe, it, expect, vi, afterEach } from 'vitest';
import { POST } from '../app/api/contact/route.js';

const makeRequest = (body) =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

const jsonResponse = (data, status) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Route Next.js POST /api/contact', () => {
  it("transmet les données à l'API Express et renvoie sa réponse", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ status: 'ok', message: 'Message reçu', id: 1 }, 201));
    vi.stubGlobal('fetch', fetchMock);

    const payload = {
      name: 'Hanin',
      email: 'hanin@example.com',
      message: 'Un message de test valide.',
    };
    const res = await POST(makeRequest(JSON.stringify(payload)));

    expect(res.status).toBe(201);
    expect((await res.json()).status).toBe('ok');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/contact$/);
    expect(JSON.parse(options.body)).toEqual(payload);
  });

  it("propage l'erreur de validation (400) renvoyée par l'API", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: 'Données invalides' }, 400))
    );

    const res = await POST(makeRequest(JSON.stringify({ name: 'H' })));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Données invalides');
  });

  it("renvoie 400 si le corps n'est pas du JSON valide", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(makeRequest('{"name":'));

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
