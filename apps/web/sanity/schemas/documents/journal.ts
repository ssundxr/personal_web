import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'journal',
  title: 'Journal Entry',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true }, group: 'media' }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], group: 'media' }),
    defineField({ name: 'videos', title: 'Videos URLs', type: 'array', of: [{ type: 'url' }], group: 'media' }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content' }),
    defineField({ name: 'country', title: 'Country', type: 'string', group: 'content' }),
    defineField({ name: 'city', title: 'City', type: 'string', group: 'content' }),
    defineField({ name: 'coordinates', title: 'Coordinates', type: 'object', fields: [{ name: 'lat', type: 'number' }, { name: 'lng', type: 'number' }], group: 'content' }),
    defineField({ name: 'mood', title: 'Mood', type: 'string', group: 'content' }),
    defineField({ name: 'readingTime', title: 'Reading Time', type: 'string', group: 'content' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, group: 'content' }),
    
    // Will link to blockContent later in Phase 3
    // For now we just use a basic block array, but we will upgrade it in Phase 3
    defineField({ name: 'content', title: 'Content', type: 'blockContent', group: 'content' }),

    // Relationships
    defineField({ name: 'relatedTimelineEvents', title: 'Related Timeline Events', type: 'array', of: [{ type: 'reference', to: [{ type: 'timelineEvent' }] }], group: 'relations' }),
    defineField({ name: 'relatedAtlasNodes', title: 'Related Atlas Nodes', type: 'array', of: [{ type: 'reference', to: [{ type: 'atlasNode' }] }], group: 'relations' }),
    defineField({ name: 'relatedMedia', title: 'Related Media Collections', type: 'array', of: [{ type: 'reference', to: [{ type: 'mediaCollection' }] }], group: 'relations' }),
    defineField({ name: 'relatedProjects', title: 'Related Projects', type: 'array', of: [{ type: 'reference', to: [{ type: 'project' }] }], group: 'relations' }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
