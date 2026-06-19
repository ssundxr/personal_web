import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contentTemplate',
  title: 'Content Template',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Template Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'targetSchema', title: 'Target Schema Type', type: 'string', options: { list: ['journal', 'project', 'analysisEntry', 'photoStory'] } }),
    // To implement a true template, we'd store a JSON string or reference to a draft document.
    defineField({ name: 'templateData', title: 'Template Data (JSON)', type: 'text' }),
  ],
})
