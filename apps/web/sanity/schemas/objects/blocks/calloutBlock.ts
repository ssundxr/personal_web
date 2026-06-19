import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'intent',
      title: 'Intent',
      type: 'string',
      options: { list: ['info', 'warning', 'success', 'danger', 'quote'] },
      initialValue: 'info'
    }),
    defineField({ name: 'text', title: 'Text', type: 'text' }),
  ],
})
