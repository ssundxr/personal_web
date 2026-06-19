import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'fullDescription', title: 'Full Description', type: 'blockContent', group: 'content' }),
    defineField({ name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    defineField({ name: 'github', title: 'GitHub URL', type: 'url', group: 'content' }),
    defineField({ name: 'demo', title: 'Demo URL', type: 'url', group: 'content' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true }, group: 'media' }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image' }], group: 'media' }),
    defineField({ name: 'featured', title: 'Featured Project', type: 'boolean', initialValue: false, group: 'content' }),
    defineField({ name: 'relatedJournals', title: 'Related Journals', type: 'array', of: [{ type: 'reference', to: [{ type: 'journal' }] }], group: 'relations' }),
    defineField({ name: 'relatedMedia', title: 'Related Media Collections', type: 'array', of: [{ type: 'reference', to: [{ type: 'mediaCollection' }] }], group: 'relations' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
