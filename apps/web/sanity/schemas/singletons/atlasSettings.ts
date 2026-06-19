import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'atlasSettings',
  title: 'Atlas Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'defaultGlobePosition',
      title: 'Default Globe Position',
      type: 'object',
      fields: [
        { name: 'latitude', title: 'Latitude', type: 'number' },
        { name: 'longitude', title: 'Longitude', type: 'number' },
      ],
    }),
    defineField({
      name: 'defaultZoomLevel',
      title: 'Default Zoom Level',
      type: 'number',
      initialValue: 2,
    }),
    defineField({
      name: 'globeRotationSpeed',
      title: 'Globe Rotation Speed',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'atmosphereIntensity',
      title: 'Atmosphere Intensity',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'flightDuration',
      title: 'Flight Duration (ms)',
      type: 'number',
      initialValue: 2000,
    }),
    defineField({
      name: 'pinColors',
      title: 'Pin Colors',
      type: 'object',
      fields: [
        { name: 'default', title: 'Default Pin Color', type: 'string' },
        { name: 'active', title: 'Active Pin Color', type: 'string' },
        { name: 'visited', title: 'Visited Pin Color', type: 'string' },
      ],
    }),
    defineField({
      name: 'clusterSettings',
      title: 'Cluster Settings',
      type: 'object',
      fields: [
        { name: 'enabled', title: 'Enable Clustering', type: 'boolean', initialValue: true },
        { name: 'clusterRadius', title: 'Cluster Radius', type: 'number', initialValue: 50 },
      ],
    }),
    defineField({
      name: 'pathAnimationSettings',
      title: 'Path Animation Settings',
      type: 'object',
      fields: [
        { name: 'enabled', title: 'Enable Animation', type: 'boolean', initialValue: true },
        { name: 'speed', title: 'Animation Speed', type: 'number', initialValue: 1 },
      ],
    }),
    defineField({
      name: 'mapTheme',
      title: 'Map Theme Style URL',
      type: 'string',
    }),
    defineField({
      name: 'dayNightCycle',
      title: 'Day/Night Cycle Settings',
      type: 'object',
      fields: [
        { name: 'enabled', title: 'Enable Day/Night Cycle', type: 'boolean', initialValue: false },
      ],
    }),
  ],
})
