import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'videoBlock',
  title: 'Video Player',
  type: 'object',
  fields: [
    defineField({ 
      name: 'videoUrl', 
      title: 'Video URL (Direct MP4 or YouTube/Vimeo)', 
      type: 'url',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'altText',
      title: 'Alternative Text (Accessibility)',
      type: 'string',
      description: 'Describe the video for screen readers',
    }),
    defineField({ 
      name: 'autoPlay', 
      title: 'Autoplay', 
      type: 'boolean', 
      initialValue: false,
      description: 'Automatically play video when in view (forces mute)'
    }),
    defineField({ 
      name: 'loop', 
      title: 'Loop', 
      type: 'boolean', 
      initialValue: false 
    }),
    defineField({ 
      name: 'hideControls', 
      title: 'Hide Player Controls', 
      type: 'boolean', 
      initialValue: false 
    }),
  ],
  preview: {
    select: {
      title: 'videoUrl',
      subtitle: 'altText'
    },
    prepare(selection) {
      return {
        title: '🎥 Video Block',
        subtitle: selection.title
      }
    }
  }
})
