import { defineType } from 'sanity'
export default defineType({ name: 'dividerBlock', title: 'Divider', type: 'object', fields: [{ name: 'style', type: 'string', options: {list: ['solid', 'dashed', 'dotted']} }] })
