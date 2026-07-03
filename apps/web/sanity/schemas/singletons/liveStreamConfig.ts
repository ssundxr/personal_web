import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'liveStreamConfig',
  title: 'Live Stream Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'iframeUrl',
      title: 'Iframe Stream URL',
      type: 'url',
      description: 'The URL to embed in the Live Stream player (e.g. https://krxplor.github.io/mpd/mpd1.html)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shakaStreamUrl',
      title: 'Shaka Native Stream URL (Optional)',
      type: 'url',
      description: 'The direct .mpd or .m3u8 URL for the native player.',
    }),
    defineField({
      name: 'shakaKeyId',
      title: 'Shaka Key ID (Optional)',
      type: 'string',
      description: 'The DRM Key ID for the native player.',
    }),
    defineField({
      name: 'shakaKeyVal',
      title: 'Shaka Key Value (Optional)',
      type: 'string',
      description: 'The DRM Key Value for the native player.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Live Stream Settings'
      }
    }
  }
})
