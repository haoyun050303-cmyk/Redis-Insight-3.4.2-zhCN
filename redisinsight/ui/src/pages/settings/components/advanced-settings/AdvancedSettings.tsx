import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { validateCountNumber } from 'uiSrc/utils'
import { SCAN_COUNT_DEFAULT } from 'uiSrc/constants/api'
import { SettingItem } from 'uiSrc/components'
import {
  updateUserConfigSettingsAction,
  userSettingsConfigSelector,
} from 'uiSrc/slices/user/user-settings'
import { Spacer } from 'uiSrc/components/base/layout/spacer'
import { SETTINGS_LABELS } from 'uiSrc/pages/settings/settings.labels'

const AdvancedSettings = () => {
  const { scanThreshold = '' } = useSelector(userSettingsConfigSelector) ?? {}

  const dispatch = useDispatch()

  const handleApplyKeysToScanChanges = (value: string) => {
    // eslint-disable-next-line no-nested-ternary
    const data = value
      ? +value < SCAN_COUNT_DEFAULT
        ? SCAN_COUNT_DEFAULT
        : +value
      : null

    dispatch(updateUserConfigSettingsAction({ scanThreshold: data }))
  }

  return (
    <>
      <SettingItem
        initValue={scanThreshold.toString()}
        onApply={handleApplyKeysToScanChanges}
        validation={validateCountNumber}
        title={SETTINGS_LABELS.advancedSettings.keysToScanTitle}
        summary={SETTINGS_LABELS.advancedSettings.keysToScanSummary}
        testid="keys-to-scan"
        placeholder="10 000"
        label={SETTINGS_LABELS.advancedSettings.keysToScanLabel}
      />
      <Spacer size="m" />
    </>
  )
}

export default AdvancedSettings
