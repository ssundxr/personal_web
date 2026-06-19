import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'timelineBlock',
  title: 'Timeline Inline',
  type: 'object',
  fields: [
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', title: 'Date', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ]
        }
      ]
    })
  ],
})
