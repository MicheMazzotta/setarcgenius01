// POST /api/checkout
// Body: { priceId } — creates Stripe Checkout Session
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'STRIPE_SECRET_KEY não configurada' });

  const priceId = process.env.STRIPE_PRICE_ID || req.body?.priceId;
  if (!priceId) return res.status(400).json({ error: 'STRIPE_PRICE_ID não configurada' });

  const origin = req.headers.origin || 'https://setarchigenius.vercel.app';

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode':                           'subscription',
        'line_items[0][price]':           priceId,
        'line_items[0][quantity]':        '1',
        'success_url':                    `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url':                     `${origin}/?payment=cancelled`,
        'locale':                         'pt-BR',
        'payment_method_types[0]':        'card',
        'billing_address_collection':     'required',
        'allow_promotion_codes':          'true',
        'metadata[plan]':                 'anual',
      }).toString(),
    });

    const session = await response.json();
    if (session.error) return res.status(400).json({ error: session.error.message });
    return res.status(200).json({ url: session.url, id: session.id });

  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
};
