import { useHistory, useLocation } from 'react-router-dom'
import { last } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useState } from 'react'
import { Props as HighlightedFeatureProps } from 'uiSrc/components/hightlighted-feature/HighlightedFeature'
import { ANALYTICS_ROUTES } from 'uiSrc/components/main-router/constants/sub-routes'
import {
  appFeatureFlagsFeaturesSelector,
  appFeaturePagesHighlightingSelector,
  removeFeatureFromHighlighting,
} from 'uiSrc/slices/app/features'
import { connectedInstanceSelector } from 'uiSrc/slices/instances/instances'
import { connectedInstanceSelector as connectedRdiInstanceSelector } from 'uiSrc/slices/rdi/instances'

import { ONBOARDING_FEATURES } from 'uiSrc/components/onboarding-features'
import { BUILD_FEATURES } from 'uiSrc/constants/featuresHighlighting'
import { Pages, FeatureFlags, PageNames } from 'uiSrc/constants'

import { appContextSelector } from 'uiSrc/slices/app/context'
import { AppWorkspace } from 'uiSrc/slices/interfaces'
import {
  BrowserIcon,
  PipelineManagementIcon,
  PipelineStatisticsIcon,
  PubSubIcon,
  SlowLogIcon,
  WorkbenchIcon,
  SettingsIcon,
} from 'uiSrc/components/base/icons'
import { INavigations } from '../navigation.types'
import { NAVIGATION_LABELS } from '../navigation.labels'

const pubSubPath = `/${PageNames.pubSub}`

export function useNavigation() {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const [activePage, setActivePage] = useState(Pages.home)

  const { workspace } = useSelector(appContextSelector)

  const { id: connectedInstanceId = '' } = useSelector(
    connectedInstanceSelector,
  )
  const { id: connectedRdiInstanceId = '' } = useSelector(
    connectedRdiInstanceSelector,
  )
  const highlightedPages = useSelector(appFeaturePagesHighlightingSelector)
  const { [FeatureFlags.vectorSearchV2]: vectorSearchFeature } = useSelector(
    appFeatureFlagsFeaturesSelector,
  )

  const isRdiWorkspace = workspace === AppWorkspace.RDI

  useEffect(() => {
    setActivePage(`/${last(location.pathname.split('/'))}`)
  }, [location])

  const handleGoPage = (page: string) => history.push(page)

  const isAnalyticsPath = (activePage: string) =>
    !!ANALYTICS_ROUTES.find(
      ({ path }) => `/${last(path.split('/'))}` === activePage,
    )

  const isPipelineManagementPath = () =>
    location.pathname?.startsWith(
      Pages.rdiPipelineManagement(connectedRdiInstanceId),
    )

  const isVectorSearchPath = () =>
    location.pathname.split('/')[2] === PageNames.vectorSearch

  const getAdditionPropsForHighlighting = (
    pageName: string,
  ): Omit<HighlightedFeatureProps, 'children'> => {
    if (BUILD_FEATURES[pageName]?.asPageFeature) {
      return {
        hideFirstChild: true,
        onClick: () => dispatch(removeFeatureFromHighlighting(pageName)),
        ...BUILD_FEATURES[pageName],
      }
    }

    return {}
  }

  const privateRoutes: INavigations[] = [
    {
      tooltipText: NAVIGATION_LABELS.browse.tooltipText,
      pageName: PageNames.browser,
      isActivePage: activePage === `/${PageNames.browser}`,
      ariaLabel: NAVIGATION_LABELS.browse.ariaLabel,
      onClick: () => handleGoPage(Pages.browser(connectedInstanceId)),
      dataTestId: 'browser-page-btn',
      connectedInstanceId,
      iconType: BrowserIcon,
      onboard: ONBOARDING_FEATURES.BROWSER_PAGE,
    },
    vectorSearchFeature?.flag && {
      tooltipText: NAVIGATION_LABELS.search.tooltipText,
      pageName: PageNames.vectorSearch,
      ariaLabel: NAVIGATION_LABELS.search.ariaLabel,
      onClick: () => handleGoPage(Pages.vectorSearch(connectedInstanceId)),
      dataTestId: 'vector-search-page-btn',
      connectedInstanceId,
      isActivePage: isVectorSearchPath(),
      iconType: SlowLogIcon,
      onboard: ONBOARDING_FEATURES.VECTOR_SEARCH_PAGE,
    },
    {
      tooltipText: NAVIGATION_LABELS.workbench.tooltipText,
      pageName: PageNames.workbench,
      ariaLabel: NAVIGATION_LABELS.workbench.ariaLabel,
      onClick: () => handleGoPage(Pages.workbench(connectedInstanceId)),
      dataTestId: 'workbench-page-btn',
      connectedInstanceId,
      isActivePage: activePage === `/${PageNames.workbench}`,
      iconType: WorkbenchIcon,
      onboard: ONBOARDING_FEATURES.WORKBENCH_PAGE,
    },
    {
      tooltipText: NAVIGATION_LABELS.analyze.tooltipText,
      pageName: PageNames.analytics,
      ariaLabel: NAVIGATION_LABELS.analyze.ariaLabel,
      onClick: () => handleGoPage(Pages.analytics(connectedInstanceId)),
      dataTestId: 'analytics-page-btn',
      connectedInstanceId,
      isActivePage: isAnalyticsPath(activePage),
      iconType: SlowLogIcon,
      featureFlag: FeatureFlags.envDependent,
    },
    {
      tooltipText: NAVIGATION_LABELS.pubSub.tooltipText,
      pageName: PageNames.pubSub,
      ariaLabel: NAVIGATION_LABELS.pubSub.ariaLabel,
      onClick: () => handleGoPage(Pages.pubSub(connectedInstanceId)),
      dataTestId: 'pub-sub-page-btn',
      connectedInstanceId,
      isActivePage: activePage === pubSubPath,
      iconType: PubSubIcon,
      onboard: ONBOARDING_FEATURES.PUB_SUB_PAGE,
      featureFlag: FeatureFlags.envDependent,
    },
  ].filter((tab) => !!tab) as INavigations[]

  const privateRdiRoutes: INavigations[] = [
    {
      tooltipText: NAVIGATION_LABELS.pipeline.tooltipText,
      pageName: PageNames.rdiPipelineManagement,
      ariaLabel: NAVIGATION_LABELS.pipeline.ariaLabel,
      onClick: () =>
        handleGoPage(Pages.rdiPipelineManagement(connectedRdiInstanceId)),
      dataTestId: 'pipeline-management-page-btn',
      isActivePage: isPipelineManagementPath(),
      iconType: PipelineManagementIcon,
    },
    {
      tooltipText: NAVIGATION_LABELS.analytics.tooltipText,
      pageName: PageNames.rdiStatistics,
      ariaLabel: NAVIGATION_LABELS.analytics.ariaLabel,
      onClick: () => handleGoPage(Pages.rdiStatistics(connectedRdiInstanceId)),
      dataTestId: 'pipeline-status-page-btn',
      isActivePage: activePage === `/${PageNames.rdiStatistics}`,
      iconType: PipelineStatisticsIcon,
    },
  ]

  const publicRoutes: INavigations[] = [
    {
      tooltipText: NAVIGATION_LABELS.settings.tooltipText,
      pageName: PageNames.settings,
      ariaLabel: NAVIGATION_LABELS.settings.ariaLabel,
      onClick: () => handleGoPage(Pages.settings),
      dataTestId: 'settings-page-btn',
      isActivePage: activePage === Pages.settings,
      iconType: SettingsIcon,
      featureFlag: FeatureFlags.envDependent,
    },
  ]

  return {
    isRdiWorkspace,
    privateRoutes,
    privateRdiRoutes,
    publicRoutes,
    getAdditionPropsForHighlighting,
    highlightedPages,
    activePage,
    setActivePage,
    handleGoPage,
    connectedInstanceId,
    connectedRdiInstanceId,
  }
}
