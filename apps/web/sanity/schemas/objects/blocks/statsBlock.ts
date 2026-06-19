import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'statsBlock',
  title: 'Statistics',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Stats Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ]
        }
      ]
    })
  ],
})
