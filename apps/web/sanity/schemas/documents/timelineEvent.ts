import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'date', title: 'Date', type: 'datetime', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'description', title: 'Description', type: 'text', group: 'content' }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content' }),
    defineField({ name: 'coordinates', title: 'Coordinates', type: 'object', fields: [{ name: 'lat', type: 'number' }, { name: 'lng', type: 'number' }], group: 'content' }),
    defineField({ name: 'relatedJournal', title: 'Related Journal', type: 'reference', to: [{ type: 'journal' }], group: 'relations' }),
    defineField({ name: 'relatedProject', title: 'Related Project', type: 'reference', to: [{ type: 'project' }], group: 'relations' }),
    defineField({ name: 'relatedAtlasNode', title: 'Related Atlas Node', type: 'reference', to: [{ type: 'atlasNode' }], group: 'relations' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
