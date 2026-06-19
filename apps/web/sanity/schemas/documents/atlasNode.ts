import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'atlasNode',
  title: 'Atlas Node',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'title', title: 'Location Title', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'coordinates', title: 'Coordinates', type: 'object', fields: [{ name: 'lat', type: 'number' }, { name: 'lng', type: 'number' }], validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'region', title: 'Region/Country', type: 'string', group: 'content' }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content' }),
    defineField({ name: 'dateVisited', title: 'Date Visited', type: 'date', group: 'content' }),
    defineField({ name: 'relatedJournals', title: 'Related Journals', type: 'array', of: [{ type: 'reference', to: [{ type: 'journal' }] }], group: 'relations' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
