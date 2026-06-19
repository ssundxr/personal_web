import { Metadata, ResolvingMetadata } from "next";
import EditorialClientPage from "./EditorialClientPage";
import { sanityFetch } from "../../../sanity/lib/client";
import { JOURNAL_ENTRY_BY_SLUG_QUERY } from "../../../sanity/lib/queries";
import { notFound } from "next/navigation";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const article = await sanityFetch<any>({ 
    query: JOURNAL_ENTRY_BY_SLUG_QUERY, 
    params: { slug: params.slug },
    tags: [`journal:${params.slug}`]
  });

  if (!article) return { title: 'Not Found' };

  const ogImageUrl = `https://sunder.dev/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || '')}&location=${encodeURIComponent(article.location || '')}&readTime=${encodeURIComponent(article.readTime || '')}&image=${encodeURIComponent(article.image || '')}`;

  return {
    title: `${article.title} | Sunder Journal`,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      url: `https://sunder.dev/journal/atlas?category=${encodeURIComponent(article.category || '')}&post=${params.slug}`,
      siteName: 'Sunder Journal',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle,
      images: [ogImageUrl],
    },
  };
}

export default async function EditorialReadingPage(
  props: { params: Promise<{ slug: string }>, searchParams: Promise<{ ref?: string }> }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isSharedLink = searchParams.ref === 'share';

  const article = await sanityFetch<any>({ 
    query: JOURNAL_ENTRY_BY_SLUG_QUERY, 
    params: { slug: params.slug },
    tags: [`journal:${params.slug}`]
  });

  if (!article) {
    const allSlugs = await sanityFetch<string[]>({ query: `*[_type == "journal"].slug.current`, tags: [] });
    return (
      <div className="pt-32 px-12 text-white">
        <h1>404 Debug Mode</h1>
        <p>Could not find article for slug: <strong>{params.slug}</strong></p>
        <p>Available slugs in Sanity:</p>
        <ul>
          {allSlugs.map(s => <li key={s}>{s}</li>)}
        </ul>
        <p>Is your slug exactly matching one of the above?</p>
      </div>
    );
  }

  return (
    <EditorialClientPage 
      article={article} 
      slug={params.slug} 
      isSharedLink={isSharedLink} 
    />
  );
}
