import siteSettings from './singletons/siteSettings'
import themeSettings from './singletons/themeSettings'
import atlasSettings from './singletons/atlasSettings'
import portfolio from './singletons/portfolio'
import liveStreamConfig from './singletons/liveStreamConfig'

import project from './documents/project'
import journal from './documents/journal'
import timelineEvent from './documents/timelineEvent'
import atlasNode from './documents/atlasNode'
import mediaCollection from './documents/mediaCollection'
import photoStory from './documents/photoStory'
import analysisEntry from './documents/analysisEntry'
import navigation from './documents/navigation'
import activityEvent from './documents/activityEvent'
import contentTemplate from './documents/contentTemplate'

import seo from './objects/seo'
import blockContent from './objects/blockContent'
import calloutBlock from './objects/blocks/calloutBlock'
import embedBlock from './objects/blocks/embedBlock'
import galleryBlock from './objects/blocks/galleryBlock'
import mapMarkerBlock from './objects/blocks/mapMarkerBlock'
import reflectionBlock from './objects/blocks/reflectionBlock'
import statsBlock from './objects/blocks/statsBlock'
import timelineBlock from './objects/blocks/timelineBlock'
import dividerBlock from './objects/blocks/dividerBlock'
import codeBlock from './objects/blocks/codeBlock'
import videoBlock from './objects/blocks/videoBlock'

export const schemaTypes = [
  siteSettings,
  themeSettings,
  atlasSettings,
  portfolio,
  liveStreamConfig,
  
  project,
  journal,
  timelineEvent,
  atlasNode,
  mediaCollection,
  photoStory,
  analysisEntry,
  navigation,
  activityEvent,
  contentTemplate,
  
  seo,
  blockContent,
  calloutBlock,
  embedBlock,
  galleryBlock,
  mapMarkerBlock,
  reflectionBlock,
  statsBlock,
  timelineBlock,
  dividerBlock,
  codeBlock,
  videoBlock,
]
