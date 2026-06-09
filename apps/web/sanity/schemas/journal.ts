export default {
  name: 'journal',
  title: 'Journal Entry',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Publication Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'abstract',
      title: 'Abstract / Summary',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'readTime',
      title: 'Reading Time (e.g. 5 min read)',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location Name (e.g. San Francisco)',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content (Scrollytelling Blocks)',
      type: 'array',
      of: [
        {
          type: 'block', // Default rich-text styling
        },
        {
          name: 'journeyMarker',
          title: 'Journey Marker (Map & Video Link)',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Checkpoint Title',
              type: 'string',
            },
            {
              name: 'latitude',
              title: 'Latitude',
              type: 'number',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'longitude',
              title: 'Longitude',
              type: 'number',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'zoom',
              title: 'Map Zoom Level (Default 12)',
              type: 'number',
              initialValue: 12,
            },
            {
              name: 'pitch',
              title: 'Map Pitch / Angle (0 to 85)',
              type: 'number',
              initialValue: 45,
            },
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video URL', value: 'video' },
                ],
              },
              initialValue: 'image',
            },
            {
              name: 'image',
              title: 'Image File',
              type: 'image',
              hidden: ({ parent }: any) => parent?.mediaType !== 'image',
            },
            {
              name: 'videoUrl',
              title: 'Direct MP4 Video Link',
              type: 'url',
              hidden: ({ parent }: any) => parent?.mediaType !== 'video',
            },
          ],
        },
      ],
    },
  ],
}
