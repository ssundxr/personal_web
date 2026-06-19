import { groq } from 'next-sanity'

export const JOURNAL_ENTRIES_QUERY = groq`
  *[_type == "journal" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    "year": string::split(coalesce(publishedAt, _createdAt), "-")[0],
    "date": coalesce(publishedAt, _createdAt),
    "type": category
  }
`

export const JOURNAL_ENTRY_BY_SLUG_QUERY = groq`
  *[_type == "journal" && slug.current == $slug][0] {
    _id,
    title,
    "subtitle": excerpt,
    "slug": slug.current,
    "date": coalesce(publishedAt, _createdAt),
    "location": city + ", " + country,
    "category": category,
    "readTime": coalesce(readingTime, "5 min read"),
    "image": coalesce(coverImage.asset->url, "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2670&auto=format&fit=crop"),
    content
  }
`
