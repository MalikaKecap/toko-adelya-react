const MAX_BODY_SIZE = 512 * 1024;

function sendJson(response, status, data) {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.send(JSON.stringify(data));
}

function getAppsScriptUrl() {
  const raw = (process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL || '').trim();
  if (!raw) throw new Error('Environment variable GOOGLE_SCRIPT_URL belum diisi.');
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !url.pathname.endsWith('/exec')) {
    throw new Error('URL Apps Script harus berupa URL script.google.com yang berakhiran /exec.');
  }
  url.search = '';
  url.hash = '';
  return url;
}

export default async function handler(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { error: 'Metode tidak didukung.' });
  }

  try {
    const endpoint = getAppsScriptUrl();
    const options = {
      method: request.method,
      redirect: 'follow',
      signal: AbortSignal.timeout(45000),
    };

    if (request.method === 'GET') {
      endpoint.searchParams.set('action', 'get_all');
    } else {
      const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
      if (Buffer.byteLength(body) > MAX_BODY_SIZE) {
        return sendJson(response, 413, { error: 'Data terlalu besar.' });
      }
      options.headers = { 'Content-Type': 'application/json' };
      options.body = body;
    }

    const upstream = await fetch(endpoint, options);
    const text = await upstream.text();
    if (!upstream.ok) {
      return sendJson(response, 502, { error: 'Apps Script gagal merespons (' + upstream.status + ').' });
    }

    if (request.method === 'POST') {
      return sendJson(response, 200, { success: true });
    }

    let data;
    try { data = JSON.parse(text); }
    catch { return sendJson(response, 502, { error: 'Respons Apps Script bukan JSON.' }); }

    if (!data || !Array.isArray(data.products) || !Array.isArray(data.sales) || !Array.isArray(data.stockIn)) {
      return sendJson(response, 502, { error: 'Format data Apps Script tidak sesuai.' });
    }
    return sendJson(response, 200, data);
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return sendJson(response, timedOut ? 504 : 500, {
      error: timedOut ? 'Apps Script terlalu lama merespons.' : error.message || 'Koneksi Apps Script gagal.',
    });
  }
}
