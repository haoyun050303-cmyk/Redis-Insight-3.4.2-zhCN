import { toNumber } from 'lodash'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SettingItem } from 'uiSrc/components'
import { PIPELINE_COUNT_DEFAULT } from 'uiSrc/constants/api'
import {
  setWorkbenchCleanUp,
  updateUserConfigSettingsAction,
  userSettingsConfigSelector,
  userSettingsWBSelector,
} from 'uiSrc/slices/user/user-settings'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import { validateNumber } from 'uiSrc/utils'
import { Spacer } from 'uiSrc/components/base/layout/spacer'
import { FormField } from 'uiSrc/components/base/forms/FormField'
import { SwitchInput } from 'uiSrc/components/base/inputs'
import { Title } from 'uiSrc/components/base/text/Title'
import { Link } from 'uiSrc/components/base/link/Link'
import { SETTINGS_LABELS } from 'uiSrc/pages/settings/settings.labels'

const WorkbenchSettings = () => {
  const { cleanup } = useSelector(userSettingsWBSelector)
  const { batchSize = PIPELINE_COUNT_DEFAULT } =
    useSelector(userSettingsConfigSelector) ?? {}

  const dispatch = useDispatch()

  const onSwitchWbCleanUp = (val: boolean) => {
    dispatch(setWorkbenchCleanUp(val))
    sendEventTelemetry({
      event: TelemetryEvent.SETTINGS_WORKBENCH_EDITOR_CLEAR_CHANGED,
      eventData: {
        currentValue: !val,
        newValue: val,
      },
    })
  }

  const handleApplyPipelineCountChanges = (value: string) => {
    dispatch(updateUserConfigSettingsAction({ batchSize: toNumber(value) }))
  }

  return (
    <>
      <Title size="M">{SETTINGS_LABELS.workbenchSettings.editorCleanup}</Title>
      <Spacer size="m" />
      <FormField>
        <SwitchInput
          checked={cleanup}
          onCheckedChange={onSwitchWbCleanUp}
          title={SETTINGS_LABELS.workbenchSettings.clearEditor}
          data-testid="switch-workbench-cleanup"
        />
      </FormField>
      <Spacer size="xl" />
      <SettingItem
        initValue={batchSize.toString()}
        onApply={handleApplyPipelineCountChanges}
        validation={(value) => validateNumber(value)}
        title={SETTINGS_LABELS.workbenchSettings.pipelineMode}
        testid="pipeline-bunch"
        placeholder={`${PIPELINE_COUNT_DEFAULT}`}
        label={SETTINGS_LABELS.workbenchSettings.commandsInPipeline}
        summary={
          <>
            {SETTINGS_LABELS.workbenchSettings.pipelineSummaryPrefix}
            <Link
              variant="inline"
              href="https://redis.io/docs/latest/develop/use/pipelining/"
              target="_blank"
              data-testid="pipelining-link"
              style={{ padding: 0 }}
            >
              {SETTINGS_LABELS.workbenchSettings.pipelineLink}
            </Link>
            {SETTINGS_LABELS.workbenchSettings.pipelineSummarySuffix}
          </>
        }
      />
    </>
  )
}

export default WorkbenchSettings
