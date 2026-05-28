import React from 'react'

import { numberWithSpaces } from 'uiSrc/utils/numbers'
import { millisecondsFormat } from 'uiSrc/utils'
import { BulkActionsType } from 'uiSrc/constants'
import { Text } from 'uiSrc/components/base/text'
import { Col, FlexItem } from 'uiSrc/components/base/layout/flex'
import { BROWSER_LABELS } from '../../../browser.labels'
import { SummaryContainer, SummaryValue } from './BulkActionSummary.styles'

export interface Props {
  type?: BulkActionsType
  processed?: number
  succeed?: number
  failed?: number
  duration?: number
  'data-testid': string
}

const BulkActionSummary = ({
  type = BulkActionsType.Delete,
  processed = 0,
  succeed = 0,
  failed = 0,
  duration = 0,
  'data-testid': testId,
}: Props) => (
  <Col gap="xxl">
    <Text color="primary" size="m" variant="semiBold">
      {BROWSER_LABELS.bulk.results}
    </Text>
    <SummaryContainer data-testid={testId} gap="xl">
      <FlexItem grow>
        <SummaryValue color="primary" size="L">
          {numberWithSpaces(processed)}
        </SummaryValue>
        <SummaryValue color="secondary" size="s">
          {type === BulkActionsType.Delete
            ? BROWSER_LABELS.bulk.keysProcessed
            : BROWSER_LABELS.bulk.commandsProcessed}
        </SummaryValue>
      </FlexItem>
      <FlexItem grow>
        <SummaryValue color="primary" size="L">
          {numberWithSpaces(succeed)}
        </SummaryValue>
        <SummaryValue color="secondary" size="s">
          {BROWSER_LABELS.bulk.success}
        </SummaryValue>
      </FlexItem>
      <FlexItem grow>
        <SummaryValue color="primary" size="L">
          {numberWithSpaces(failed)}
        </SummaryValue>
        <SummaryValue color="secondary" size="s">
          {BROWSER_LABELS.bulk.errors}
        </SummaryValue>
      </FlexItem>
      <FlexItem grow>
        <SummaryValue color="primary" size="L">
          {millisecondsFormat(duration, 'H:mm:ss.SSS')}
        </SummaryValue>
        <SummaryValue color="secondary" size="s">
          {BROWSER_LABELS.bulk.timeTaken}
        </SummaryValue>
      </FlexItem>
    </SummaryContainer>
  </Col>
)

export default BulkActionSummary
