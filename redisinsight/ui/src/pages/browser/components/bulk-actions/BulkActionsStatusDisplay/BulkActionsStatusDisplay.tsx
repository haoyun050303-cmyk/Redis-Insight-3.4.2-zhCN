import React from 'react'
import { isUndefined } from 'lodash'

import { BulkActionsStatus } from 'uiSrc/constants'
import { getApproximatePercentage, Maybe } from 'uiSrc/utils'
import { ColorText } from 'uiSrc/components/base/text'

import { BROWSER_LABELS } from '../../../browser.labels'
import { isProcessedBulkAction } from '../utils'
import { Props } from '../BulkActionsInfo/BulkActionsInfo'
import { Banner } from 'uiSrc/components/base/display'

export interface BulkActionsStatusDisplayProps {
  status: Props['status']
  total: Maybe<number>
  scanned: Maybe<number>
  error?: string
}

export const BulkActionsStatusDisplay = ({
  status,
  total,
  scanned,
  error,
}: BulkActionsStatusDisplayProps) => {
  if (!isUndefined(status) && !isProcessedBulkAction(status)) {
    return (
      <Banner
        message={
          <>
            {BROWSER_LABELS.bulk.inProgress}
            <ColorText size="XS">{` ${getApproximatePercentage(total, scanned)}`}</ColorText>
          </>
        }
        data-testid="bulk-status-progress"
      />
    )
  }

  if (status === BulkActionsStatus.Aborted) {
    return (
      <Banner
        variant="danger"
        message={
          <>
            {BROWSER_LABELS.bulk.stopped}{' '}
            {getApproximatePercentage(total, scanned)}
          </>
        }
        data-testid="bulk-status-stopped"
      />
    )
  }

  if (status === BulkActionsStatus.Completed) {
    return (
      <Banner
        showIcon
        variant="success"
        message={BROWSER_LABELS.bulk.actionCompleted}
        data-testid="bulk-status-completed"
      />
    )
  }

  if (status === BulkActionsStatus.Failed) {
    return (
      <Banner
        variant="danger"
        message={error || BROWSER_LABELS.bulk.actionFailed}
        data-testid="bulk-status-failed"
      />
    )
  }

  if (status === BulkActionsStatus.Disconnected) {
    return (
      <Banner
        variant="danger"
        message={`${BROWSER_LABELS.bulk.connectionLost} ${getApproximatePercentage(total, scanned)}`}
        data-testid="bulk-status-disconnected"
      />
    )
  }

  return null
}

export default BulkActionsStatusDisplay
