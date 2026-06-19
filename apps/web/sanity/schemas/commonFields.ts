import { defineField } from 'sanity'

export const lifecycleFields = [
  defineField({
    name: 'status',
    title: 'Status',
    type: 'string',
    options: {
      list: [
        { title: 'Draft', value: 'draft' },
        { title: 'Review', value: 'review' },
        { title: 'Scheduled', value: 'scheduled' },
        { title: 'Published', value: 'published' },
        { title: 'Archived', value: 'archived' },
      ],
    },
    initialValue: 'draft',
    group: 'lifecycle',
  }),
  defineField({
    name: 'versionNumber',
    title: 'Version Number',
    type: 'number',
    initialValue: 1,
    group: 'lifecycle',
  }),
  defineField({
    name: 'publishDate',
    title: 'Scheduled Publish Date',
    type: 'datetime',
    group: 'lifecycle',
  }),
]

export const aiFields = [
  defineField({
    name: 'aiSummary',
    title: 'AI Summary',
    type: 'text',
    hidden: true,
    group: 'ai',
  }),
  defineField({
    name: 'aiTags',
    title: 'AI Tags',
    type: 'array',
    of: [{ type: 'string' }],
    hidden: true,
    group: 'ai',
  }),
  defineField({
    name: 'aiGeneratedTitle',
    title: 'AI Generated Title',
    type: 'string',
    hidden: true,
    group: 'ai',
  }),
  defineField({
    name: 'semanticKeywords',
    title: 'Semantic Keywords',
    type: 'array',
    of: [{ type: 'string' }],
    hidden: true,
    group: 'ai',
  }),
  defineField({
    name: 'aiInsights',
    title: 'AI Insights',
    type: 'text',
    hidden: true,
    group: 'ai',
  }),
  defineField({
    name: 'aiEmbeddings',
    title: 'AI Embeddings (Vector)',
    type: 'array',
    of: [{ type: 'number' }],
    hidden: true,
    group: 'ai',
  }),
  defineField({
    name: 'aiCategoryPrediction',
    title: 'AI Category Prediction',
    type: 'string',
    hidden: true,
    group: 'ai',
  }),
]

export const commonGroups = [
  { name: 'content', title: 'Content' },
  { name: 'media', title: 'Media' },
  { name: 'relations', title: 'Relationships' },
  { name: 'seo', title: 'SEO' },
  { name: 'lifecycle', title: 'Lifecycle & Status' },
  { name: 'ai', title: 'AI & Metadata' },
]
