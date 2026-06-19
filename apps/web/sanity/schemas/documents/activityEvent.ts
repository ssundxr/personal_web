import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'activityEvent',
  title: 'Activity Event',
  type: 'document',
  readOnly: true, // Only generated via webhooks/system
  fields: [
    defineField({ name: 'user', title: 'User', type: 'string' }),
    defineField({ name: 'action', title: 'Action', type: 'string' }),
    defineField({ name: 'contentType', title: 'Content Type', type: 'string' }),
    defineField({ name: 'timestamp', title: 'Timestamp', type: 'datetime' }),
    defineField({ name: 'metadata', title: 'Metadata (JSON)', type: 'text' }),
    defineField({ name: 'documentId', title: 'Document ID', type: 'string' }),
  ],
})
