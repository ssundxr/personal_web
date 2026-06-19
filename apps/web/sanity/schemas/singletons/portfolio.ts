import { defineField, defineType } from 'sanity'
import { commonGroups, lifecycleFields } from '../commonFields'

export default defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  groups: commonGroups,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'subheading', title: 'Subheading', type: 'text' },
        { name: 'ctaText', title: 'Call to Action Text', type: 'string' },
      ],
    }),
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'bio', title: 'Biography', type: 'array', of: [{ type: 'block' }] },
        { name: 'profileImage', title: 'Profile Image', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', title: 'Category', type: 'string' },
            { name: 'items', title: 'Skill Items', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'company', title: 'Company', type: 'string' },
            { name: 'startDate', title: 'Start Date', type: 'date' },
            { name: 'endDate', title: 'End Date', type: 'date' },
            { name: 'current', title: 'Current Role', type: 'boolean', initialValue: false },
            { name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'degree', title: 'Degree', type: 'string' },
            { name: 'institution', title: 'Institution', type: 'string' },
            { name: 'year', title: 'Year (or Range)', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),
    ...lifecycleFields,
  ],
})
