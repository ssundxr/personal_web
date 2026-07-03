import { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Command Center')
    .items([
      S.listItem()
        .title('Dashboard')
        .child(
          S.documentTypeList('journal') // Temporary placeholder for dashboard custom tool
            .title('Dashboard Metrics Placeholder')
        ),
      S.listItem()
        .title('Portfolio (Singleton)')
        .child(
          S.document()
            .schemaType('portfolio')
            .documentId('portfolio')
            .title('Portfolio')
        ),
      S.divider(),
      
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('journal').title('Journals'),
      S.documentTypeListItem('atlasNode').title('Atlas Locations'),
      S.documentTypeListItem('timelineEvent').title('Timeline Events'),
      S.documentTypeListItem('photoStory').title('Photography'),
      S.documentTypeListItem('analysisEntry').title('Current Affairs'),
      S.documentTypeListItem('mediaCollection').title('Media Collections'),
      S.documentTypeListItem('navigation').title('Navigation'),
      S.documentTypeListItem('activityEvent').title('Activity Center'),
      S.documentTypeListItem('contentTemplate').title('Content Templates'),
      
      S.divider(),

      S.listItem()
        .title('Global Settings')
        .child(
          S.list()
            .title('Global Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Theme Settings')
                .child(
                  S.document()
                    .schemaType('themeSettings')
                    .documentId('themeSettings')
                ),
              S.listItem()
                .title('Atlas Settings')
                .child(
                  S.document()
                    .schemaType('atlasSettings')
                    .documentId('atlasSettings')
                ),
              S.listItem()
                .title('Live Stream Settings')
                .child(
                  S.document()
                    .schemaType('liveStreamConfig')
                    .documentId('liveStreamConfig')
                ),
            ])
        ),
    ])
