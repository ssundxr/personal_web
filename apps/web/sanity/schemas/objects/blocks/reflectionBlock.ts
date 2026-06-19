import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'reflectionBlock',
  title: 'Reflection',
  type: 'object',
  fields: [
    defineField({ name: 'topic', title: 'Topic', type: 'string' }),
    defineField({ name: 'content', title: 'Content', type: 'text' }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
  ],
})
