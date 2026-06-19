import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'analysisEntry',
  title: 'Analysis Entry (Current Affairs)',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'headline' }, validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'source', title: 'Source', type: 'string', group: 'content' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', group: 'content' }),
    defineField({ name: 'analysis', title: 'Analysis', type: 'blockContent', group: 'content' }),
    defineField({ name: 'implications', title: 'Implications', type: 'text', group: 'content' }),
    defineField({ name: 'prediction', title: 'Prediction', type: 'text', group: 'content' }),
    defineField({ name: 'confidenceLevel', title: 'Confidence Level (1-10)', type: 'number', validation: (R) => R.min(1).max(10), group: 'content' }),
    defineField({ name: 'relatedJournals', title: 'Related Journals', type: 'array', of: [{ type: 'reference', to: [{ type: 'journal' }] }], group: 'relations' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
