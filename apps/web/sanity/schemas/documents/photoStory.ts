import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields, aiFields } from '../commonFields'

export default defineType({
  name: 'photoStory',
  title: 'Photo Story',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({ name: 'title', title: 'Story Title', type: 'string', validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required(), group: 'content' }),
    defineField({ name: 'photographerNotes', title: 'Photographer Notes', type: 'text', group: 'content' }),
    defineField({ name: 'camera', title: 'Camera', type: 'string', group: 'content' }),
    defineField({ name: 'lens', title: 'Lens', type: 'string', group: 'content' }),
    defineField({ name: 'location', title: 'Location', type: 'string', group: 'content' }),
    defineField({ name: 'exifData', title: 'EXIF Data (JSON string)', type: 'string', group: 'content' }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], group: 'media' }),
    defineField({ name: 'relatedMediaCollection', title: 'Related Media Collection', type: 'reference', to: [{ type: 'mediaCollection' }], group: 'relations' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ...lifecycleFields,
    ...aiFields,
  ],
})
