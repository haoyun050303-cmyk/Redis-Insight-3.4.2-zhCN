import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { connectedInstanceSelector } from 'uiSrc/slices/instances/instances'
import {
  changeSelectedTab,
  changeSidePanel,
} from 'uiSrc/slices/panels/sidePanels'
import { InsightsPanelTabs, SidePanels } from 'uiSrc/slices/interfaces/insights'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'

import BulbImg from 'uiSrc/assets/img/workbench/bulb.svg'
import ArrowToGuidesIcon from 'uiSrc/assets/img/workbench/arrow-to-guides.svg?react'

import { FlexItem } from 'uiSrc/components/base/layout/flex'
import { Spacer } from 'uiSrc/components/base/layout/spacer'
import { PrimaryButton } from 'uiSrc/components/base/forms/buttons'
import { LightBulbIcon } from 'uiSrc/components/base/icons'
import { Title } from 'uiSrc/components/base/text/Title'
import { Text } from 'uiSrc/components/base/text'
import { Card } from 'uiSrc/components/base/layout'

import styles from './styles.module.scss'
import { Panel } from 'uiSrc/components/panel'
import { WORKBENCH_LABELS } from '../../workbench.labels'

const WbNoResultsMessage = () => {
  const { provider } = useSelector(connectedInstanceSelector)

  const { instanceId } = useParams<{ instanceId: string }>()
  const dispatch = useDispatch()

  const handleOpenInsights = () => {
    dispatch(changeSelectedTab(InsightsPanelTabs.Explore))
    dispatch(changeSidePanel(SidePanels.Insights))

    sendEventTelemetry({
      event: TelemetryEvent.INSIGHTS_PANEL_OPENED,
      eventData: {
        databaseId: instanceId,
        provider,
        source: 'workbench',
      },
    })
  }

  return (
    <div className={styles.noResults} data-testid="wb_no-results">
      <Text
        className={styles.noResultsTitle}
        data-testid="wb_no-results__title"
      >
        {WORKBENCH_LABELS.noResultsTitle}
      </Text>
      <Title style={{ marginTop: 12, fontSize: 28 }}>
        {WORKBENCH_LABELS.advancedCliTitle}
      </Title>
      <Title style={{ marginTop: 6, fontSize: 20, lineHeight: 1.2 }}>
        {WORKBENCH_LABELS.redisCommandsSubtitle}
      </Title>
      <Spacer />

      <Card className={styles.noResultsPanel}>
        <ArrowToGuidesIcon className={styles.arrowToGuides} />
        <Panel gap="m" responsive>
          <FlexItem>
            <img
              className={styles.noResultsIcon}
              src={BulbImg}
              alt={WORKBENCH_LABELS.noResultsAlt}
              data-testid="wb_no-results__icon"
            />
          </FlexItem>
          <FlexItem grow>
            <Text
              className={styles.noResultsText}
              data-testid="wb_no-results__summary"
            >
              {WORKBENCH_LABELS.tutorialSummary}
            </Text>
            <Spacer size="xl" />
            <div>
              <PrimaryButton
                icon={LightBulbIcon}
                onClick={() => handleOpenInsights()}
                className={styles.exploreBtn}
                data-testid="no-results-explore-btn"
              >
                {WORKBENCH_LABELS.explore}
              </PrimaryButton>
            </div>
            <Spacer size="s" />
            <Text textAlign="left" size="xs">
              {WORKBENCH_LABELS.topRightHint}
            </Text>
          </FlexItem>
        </Panel>
      </Card>
    </div>
  )
}

export default WbNoResultsMessage
