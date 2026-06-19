import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'themeSettings',
  title: 'Theme Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'primaryColor',
      title: 'Primary Color (Hex)',
      type: 'string',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color (Hex)',
      type: 'string',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Border Radius',
      type: 'string',
      description: 'e.g., 0.5rem, 8px',
    }),
    defineField({
      name: 'typographyScale',
      title: 'Typography Scale',
      type: 'number',
      initialValue: 1.2,
    }),
    defineField({
      name: 'glassEffectIntensity',
      title: 'Glass Effect Intensity',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'shadowIntensity',
      title: 'Shadow Intensity',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'animationSpeed',
      title: 'Animation Speed (ms)',
      type: 'number',
      initialValue: 300,
    }),
    defineField({
      name: 'darkModeSettings',
      title: 'Dark Mode Settings',
      type: 'object',
      fields: [
        { name: 'background', title: 'Background Color', type: 'string' },
        { name: 'text', title: 'Text Color', type: 'string' },
      ],
    }),
    defineField({
      name: 'lightModeSettings',
      title: 'Light Mode Settings',
      type: 'object',
      fields: [
        { name: 'background', title: 'Background Color', type: 'string' },
        { name: 'text', title: 'Text Color', type: 'string' },
      ],
    }),
  ],
})
