import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'url', title: 'URL', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'icon', title: 'Icon (Lucide name)', type: 'string' }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({ 
      name: 'visibility', 
      title: 'Visibility', 
      type: 'string', 
      options: { list: ['Main Navbar', 'Footer Navigation', 'Atlas Navigation', 'Mobile Navigation', 'Quick Links'] }
    }),
    defineField({ name: 'parent', title: 'Parent Navigation Item', type: 'reference', to: [{ type: 'navigation' }] }),
    defineField({ name: 'external', title: 'External Link', type: 'boolean', initialValue: false }),
  ],
})
