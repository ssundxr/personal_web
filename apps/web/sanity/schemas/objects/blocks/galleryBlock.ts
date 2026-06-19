import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryBlock',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'carousel', 'masonry'] },
      initialValue: 'grid'
    }),
  ],
})
