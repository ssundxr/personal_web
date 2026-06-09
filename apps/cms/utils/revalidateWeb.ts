import crypto from 'crypto';

export async function revalidateWeb(tags: string[]) {
  const secret = process.env.CMS_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!secret) {
    console.warn('[revalidateWeb] Missing CMS_WEBHOOK_SECRET, skipping revalidation.');
    return;
  }

  const payload = JSON.stringify({ tags, timestamp: Date.now() });
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  try {
    const res = await fetch(`${siteUrl}/api/webhook/cms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cms-signature': signature,
      },
      body: payload,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[revalidateWeb] Webhook failed:', res.status, errorText);
    } else {
      console.log(`[revalidateWeb] Successfully invalidated tags: ${tags.join(', ')}`);
    }
  } catch (error) {
    console.error('[revalidateWeb] Fetch error:', error);
  }
}
