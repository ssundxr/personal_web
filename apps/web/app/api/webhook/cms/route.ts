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
    
    // Prevent replay attacks
    if (Date.now() - (data.timestamp || Date.now()) > 5 * 60 * 1000) {
      return NextResponse.json({ error: 'Payload expired' }, { status: 400 });
    }

    const { type, action, documentId } = data;
    console.log(`[Webhook] Event: ${action} on ${type} (ID: ${documentId})`);

    // TARGET 1: Next.js Cache Revalidation
    const tags: string[] = data.tags || [];
    if (tags.length > 0) {
      tags.forEach(tag => {
        console.log(`[Webhook] Revalidating tag: ${tag}`);
        (revalidateTag as any)(tag);
      });
    }

    // TARGET 2: Atlas Rebuild
    if (type === 'atlasNode' || type === 'journal' || type === 'timelineEvent' || type === 'atlasSettings') {
      console.log(`[Webhook] Triggering Atlas Rebuild...`);
      // await triggerAtlasRebuild();
    }

    // TARGET 3: Search Reindex
    if (['journal', 'project', 'photoStory', 'atlasNode', 'timelineEvent', 'analysisEntry'].includes(type)) {
      console.log(`[Webhook] Triggering Search Reindex for ${documentId}...`);
      // await syncToMeilisearch(data.document);
    }

    // TARGET 4: OG Regeneration
    console.log(`[Webhook] Triggering OG Regeneration...`);
    // await generateOgImages(documentId);

    // TARGET 5: AI Processing (Embeddings, Summaries)
    if (action === 'publish' || action === 'update') {
      console.log(`[Webhook] Enqueueing AI Processing task...`);
      // await triggerAiProcessing(documentId);
    }

    // TARGET 6: Analytics Sync
    console.log(`[Webhook] Syncing analytics...`);
    // await syncAnalytics(documentId);

    return NextResponse.json({ success: true, tags, action, type, now: Date.now() });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
