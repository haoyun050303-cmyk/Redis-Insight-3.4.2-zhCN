import React from 'react'
import parse from 'html-react-parser'

import { FlexItem, Row } from 'uiSrc/components/base/layout/flex'
import { Spacer } from 'uiSrc/components/base/layout/spacer'

import { Text } from 'uiSrc/components/base/text'
import { SwitchInput } from 'uiSrc/components/base/inputs'
import { SETTINGS_LABELS } from 'uiSrc/pages/settings/settings.labels'

import { ItemDescription } from './components'
import { IConsent } from '../ConsentsSettings'

interface Props {
  consent: IConsent
  onChangeAgreement: (checked: boolean, name: string) => void
  checked: boolean
  isSettingsPage?: boolean
  withoutSpacer?: boolean
}

const ConsentOption = (props: Props) => {
  const {
    consent,
    onChangeAgreement,
    checked,
    isSettingsPage = false,
    withoutSpacer = false,
  } = props
  const localizedConsent = {
    ...consent,
    ...SETTINGS_LABELS.consentOverrides[
      consent.agreementName as keyof typeof SETTINGS_LABELS.consentOverrides
    ],
  }

  return (
    <FlexItem key={localizedConsent.agreementName} grow>
      {isSettingsPage && localizedConsent.description && (
        <>
          <Spacer size="s" />
          <Text size="M" color="primary">
            <ItemDescription
              description={localizedConsent.description}
              withLink={localizedConsent.linkToPrivacyPolicy}
            />
          </Text>
          <Spacer size="m" />
        </>
      )}
      <Row gap="m">
        <FlexItem>
          <Spacer size="xs" />
          <SwitchInput
            checked={checked}
            onCheckedChange={(checked) =>
              onChangeAgreement(checked, localizedConsent.agreementName)
            }
            data-testid={`switch-option-${localizedConsent.agreementName}`}
            disabled={localizedConsent?.disabled}
          />
        </FlexItem>
        <FlexItem>
          <Text size="M" color="primary">
            {parse(localizedConsent.label)}
          </Text>
          {!isSettingsPage && localizedConsent.description && (
            <>
              <Spacer size="xs" />
              <Text size="s" color="secondary">
                <ItemDescription
                  description={localizedConsent.description}
                  withLink={localizedConsent.linkToPrivacyPolicy}
                />
              </Text>
            </>
          )}
        </FlexItem>
      </Row>
      {!withoutSpacer && <Spacer />}
    </FlexItem>
  )
}

export default ConsentOption
