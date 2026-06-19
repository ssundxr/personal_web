import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kpke9uhw'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-10'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // False for development to ensure fresh data
})

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: any
  tags?: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600, // 0 for dev, 1 hour for prod
      tags: tags || ['sanity'], // Invalidate via webhook
    },
  })
}
