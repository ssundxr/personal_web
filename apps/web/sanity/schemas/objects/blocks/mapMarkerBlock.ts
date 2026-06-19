import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mapMarkerBlock',
  title: 'Map Marker',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'coordinates', title: 'Coordinates', type: 'object', fields: [{ name: 'lat', type: 'number' }, { name: 'lng', type: 'number' }] }),
    defineField({ name: 'zoom', title: 'Zoom Level', type: 'number', initialValue: 12 }),
  ],
})
