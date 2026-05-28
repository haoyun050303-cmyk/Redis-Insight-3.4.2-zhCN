import { FeatureFlags, Pages } from 'uiSrc/constants'
import { TabInfo } from 'uiSrc/components/base/layout/tabs'
import { HOME_LABELS } from 'uiSrc/pages/home/home.labels'

type HomeTab = TabInfo & {
  path: string
  featureFlag?: FeatureFlags
}

const tabs: HomeTab[] = [
  {
    value: 'databases',
    label: HOME_LABELS.tabs.redisDatabases,
    content: null,
    path: Pages.home,
  },
  {
    value: 'rdi-instances',
    label: HOME_LABELS.tabs.redisDataIntegration,
    content: null,
    path: Pages.rdi,
    featureFlag: FeatureFlags.rdi,
  },
]

export { tabs }
