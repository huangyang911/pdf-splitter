// api/proxy.js
export default async function handler(req, res) {
  // 僅允許 POST 請求來傳遞代理參數
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url, method = 'GET', headers = {}, body } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (method !== 'GET' && method !== 'HEAD' && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    
    let responseData;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('[Proxy Error]:', error);
    res.status(500).json({ error: 'Proxy failed: ' + error.message });
  }
}
