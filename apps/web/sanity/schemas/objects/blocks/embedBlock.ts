import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'embedBlock',
  title: 'Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: ['twitter', 'youtube', 'instagram', 'generic'] },
      validation: (R) => R.required()
    }),
    defineField({ name: 'url', title: 'URL', type: 'url', validation: (R) => R.required() }),
  ],
})
