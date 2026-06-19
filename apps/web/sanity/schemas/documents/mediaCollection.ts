import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'mediaCollection',
  title: 'Media Collection',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'title', title: 'Collection Title', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'description', title: 'Description', type: 'text', group: 'content' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true }, group: 'media' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    defineField({ name: 'relatedJournals', title: 'Related Journals', type: 'array', of: [{ type: 'reference', to: [{ type: 'journal' }] }], group: 'relations' }),
    defineField({ name: 'relatedProjects', title: 'Related Projects', type: 'array', of: [{ type: 'reference', to: [{ type: 'project' }] }], group: 'relations' }),
    defineField({ name: 'relatedAtlasNodes', title: 'Related Locations (Atlas)', type: 'array', of: [{ type: 'reference', to: [{ type: 'atlasNode' }] }], group: 'relations' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
