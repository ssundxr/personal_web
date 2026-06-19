import { defineType } from 'sanity'
export default defineType({ name: 'codeBlock', title: 'Code Block', type: 'object', fields: [{ name: 'language', type: 'string' }, { name: 'code', type: 'text' }] })
