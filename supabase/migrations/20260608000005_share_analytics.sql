-- Social Share Analytics Schema

CREATE TABLE IF NOT EXISTS public.journal_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    reads INTEGER DEFAULT 0,
    whatsapp_shares INTEGER DEFAULT 0,
    instagram_shares INTEGER DEFAULT 0,
    snapchat_shares INTEGER DEFAULT 0,
    link_copies INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(slug)
);

-- Function to increment shares securely
CREATE OR REPLACE FUNCTION increment_share(
    p_slug TEXT,
    p_platform TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.journal_analytics (slug, views, reads, whatsapp_shares, instagram_shares, snapchat_shares, link_copies)
    VALUES (p_slug, 0, 0, 0, 0, 0, 0)
    ON CONFLICT (slug) DO NOTHING;

    IF p_platform = 'whatsapp' THEN
        UPDATE public.journal_analytics SET whatsapp_shares = whatsapp_shares + 1, updated_at = NOW() WHERE slug = p_slug;
    ELSIF p_platform = 'instagram' THEN
        UPDATE public.journal_analytics SET instagram_shares = instagram_shares + 1, updated_at = NOW() WHERE slug = p_slug;
    ELSIF p_platform = 'snapchat' THEN
        UPDATE public.journal_analytics SET snapchat_shares = snapchat_shares + 1, updated_at = NOW() WHERE slug = p_slug;
    ELSIF p_platform = 'link' THEN
        UPDATE public.journal_analytics SET link_copies = link_copies + 1, updated_at = NOW() WHERE slug = p_slug;
    END IF;
END;
$$;
