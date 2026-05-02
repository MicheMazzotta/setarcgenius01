module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY nao configurada no servidor.' } });

  try {
    const body = req.body;
    if (!body || !body.messages || !body.model)
      return res.status(400).json({ error: { message: 'Payload invalido' } });

    body.max_tokens = Math.min(body.max_tokens || 1000, 4000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error || data });
    return res.status(200).json(data);

  } catch (err) {
    console.error('Claude proxy error:', err);
    return res.status(500).json({ error: { message: err.message } });
  }
};
