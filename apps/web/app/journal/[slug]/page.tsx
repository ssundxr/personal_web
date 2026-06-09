import { Metadata, ResolvingMetadata } from "next";
import EditorialClientPage from "./EditorialClientPage";

// Mock data fetcher for Metadata
const getArticleData = (slug: string) => {
  return {
    title: "The Spatial Spark: When Interfaces Disappear",
    subtitle: "An exploration into how we can move past screen-bound interaction into true spatial computing.",
    date: "Jan 12, 2022",
    location: "San Francisco, USA",
    author: "The Author",
    category: "Thoughts",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2670&auto=format&fit=crop"
  };
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = getArticleData(params.slug);
  const ogImageUrl = `https://sunder.dev/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}&location=${encodeURIComponent(article.location)}&readTime=${encodeURIComponent(article.readTime)}&image=${encodeURIComponent(article.image)}`;

  return {
    title: `${article.title} | Sunder Journal`,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      url: `https://sunder.dev/journal/atlas?category=${encodeURIComponent(article.category)}&post=${params.slug}`,
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

export default function EditorialReadingPage({ params, searchParams }: { params: { slug: string }, searchParams: { ref?: string } }) {
  const article = getArticleData(params.slug);
  const isSharedLink = searchParams.ref === 'share';

  return (
    <EditorialClientPage 
      article={article} 
      slug={params.slug} 
      isSharedLink={isSharedLink} 
    />
  );
}
