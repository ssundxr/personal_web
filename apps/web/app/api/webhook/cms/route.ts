import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-cms-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const payload = await request.text();
    const secret = process.env.CMS_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[Webhook] CMS_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Secure timing-safe comparison
    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const data = JSON.parse(payload);
    
    // Prevent replay attacks (optional, but good practice. e.g., 5 min window)
    if (Date.now() - data.timestamp > 5 * 60 * 1000) {
      return NextResponse.json({ error: 'Payload expired' }, { status: 400 });
    }

    const tags: string[] = data.tags || [];

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: 'No tags provided' }, { status: 400 });
    }

    // Purge the requested tags
    tags.forEach(tag => {
      console.log(`[Webhook] Revalidating tag: ${tag}`);
      revalidateTag(tag);
    });

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
