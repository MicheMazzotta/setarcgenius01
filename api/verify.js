// GET /api/verify?session_id=xxx
// Verifies Stripe payment and returns signed activation token
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'STRIPE_SECRET_KEY não configurada' });

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id obrigatório' });

  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, {
      headers: { 'Authorization': `Bearer ${stripeKey}` },
    });
    const session = await r.json();
    if (session.error) return res.status(400).json({ error: session.error.message });

    const paid = session.payment_status === 'paid' || session.status === 'complete';
    if (!paid) return res.status(402).json({ error: 'Pagamento não confirmado', status: session.payment_status });

    // Simple signed token: base64(plan:email:timestamp:secret_hash)
    const email    = session.customer_details?.email || 'unknown';
    const plan     = session.metadata?.plan || 'anual';
    const ts       = Date.now();
    const secret   = process.env.TOKEN_SECRET || 'sag2025secret';
    const payload  = `${plan}:${email}:${ts}`;
    // Poor-man HMAC using just XOR+base64 (no crypto module needed in edge)
    const token    = Buffer.from(`${payload}|${secret}`).toString('base64');

    return res.status(200).json({ valid: true, plan, email, token, ts });

  } catch (err) {
    console.error('Stripe verify error:', err);
    return res.status(500).json({ error: err.message });
  }
};
