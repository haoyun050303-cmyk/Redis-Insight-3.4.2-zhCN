import React from 'react'
import { render, screen, userEvent } from 'uiSrc/utils/test-utils'
import ConsentOption from './ConsentOption'
import { IConsent } from '../ConsentsSettings'

const mockConsent: IConsent = {
  agreementName: 'example',
  title: 'Analytics',
  label: 'Share usage data',
  description: 'Help us improve Redis Insight by sharing usage data.',
  required: false,
  editable: true,
  disabled: false,
  defaultValue: false,
  displayInSetting: true,
  since: '1.0.0',
  linkToPrivacyPolicy: false,
}

const mockOnChangeAgreement = jest.fn()

const defaultProps = {
  consent: mockConsent,
  onChangeAgreement: mockOnChangeAgreement,
  checked: false,
}

describe('ConsentOption', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    expect(render(<ConsentOption {...defaultProps} />)).toBeTruthy()
  })

  it('should render switch with correct test id', () => {
    render(<ConsentOption {...defaultProps} />)
    expect(screen.getByTestId('switch-option-example')).toBeInTheDocument()
  })

  it('should call onChangeAgreement when switch is clicked', async () => {
    render(<ConsentOption {...defaultProps} />)

    await userEvent.click(screen.getByTestId('switch-option-example'))

    expect(mockOnChangeAgreement).toHaveBeenCalledWith(true, 'example')
  })

  it('should render description without privacy policy link when linkToPrivacyPolicy is false', () => {
    const consentWithDescription = {
      ...mockConsent,
      description: 'Help us improve Redis Insight by sharing usage data.',
      linkToPrivacyPolicy: false,
    }

    render(<ConsentOption {...defaultProps} consent={consentWithDescription} />)

    expect(
      screen.getByText('Help us improve Redis Insight by sharing usage data.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Privacy Policy')).not.toBeInTheDocument()
  })

  it('should render description with privacy policy link when linkToPrivacyPolicy is true', () => {
    const consentWithPrivacyLink = {
      ...mockConsent,
      description: 'Help us improve Redis Insight by sharing usage data.',
      linkToPrivacyPolicy: true,
    }

    render(<ConsentOption {...defaultProps} consent={consentWithPrivacyLink} />)

    // Verify that the Privacy Policy link is rendered
    expect(screen.getByText('隐私政策')).toBeInTheDocument()

    const privacyPolicyLink = screen.getByText('隐私政策')
    expect(privacyPolicyLink.closest('a')).toHaveAttribute(
      'href',
      'https://redis.io/legal/privacy-policy/?utm_source=redisinsight&utm_medium=app&utm_campaign=telemetry',
    )
  })

  it('should render description with privacy policy link on settings page when linkToPrivacyPolicy is true', () => {
    const consentWithPrivacyLink = {
      ...mockConsent,
      description: 'Help us improve Redis Insight by sharing usage data.',
      linkToPrivacyPolicy: true,
    }

    render(
      <ConsentOption
        {...defaultProps}
        consent={consentWithPrivacyLink}
        isSettingsPage
      />,
    )

    // Verify that the Privacy Policy link is rendered
    expect(screen.getByText('隐私政策')).toBeInTheDocument()
  })

  it('should not render privacy policy link on settings page when linkToPrivacyPolicy is false', () => {
    const consentWithoutPrivacyLink = {
      ...mockConsent,
      description: 'Help us improve Redis Insight by sharing usage data.',
      linkToPrivacyPolicy: false,
    }

    render(
      <ConsentOption
        {...defaultProps}
        consent={consentWithoutPrivacyLink}
        isSettingsPage
      />,
    )

    expect(
      screen.getByText('Help us improve Redis Insight by sharing usage data.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Privacy Policy')).not.toBeInTheDocument()
  })

  it('should localize known settings consent copy', () => {
    const analyticsConsent = {
      ...mockConsent,
      agreementName: 'analytics',
      label: 'Usage Data',
      description:
        'Help improve Redis Insight by sharing anonymous usage data. This helps us understand feature usage and make the app better. By enabling this, you agree to our ',
      linkToPrivacyPolicy: true,
    }

    render(
      <ConsentOption
        {...defaultProps}
        consent={analyticsConsent}
        isSettingsPage
      />,
    )

    expect(screen.getByText('使用数据')).toBeInTheDocument()
    expect(
      screen.getByText(
        '分享匿名使用数据以帮助改进 Redis Insight。这能帮助我们了解功能使用情况并持续优化应用。启用后，即表示你同意我们的',
        { exact: false },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('隐私政策')).toBeInTheDocument()
  })

  it('should render disabled switch when consent is disabled', () => {
    const disabledConsent = {
      ...mockConsent,
      disabled: true,
    }

    render(<ConsentOption {...defaultProps} consent={disabledConsent} />)

    const switchElement = screen.getByTestId('switch-option-example')
    expect(switchElement).toBeDisabled()
  })

  it('should render checked switch when checked prop is true', () => {
    render(<ConsentOption {...defaultProps} checked />)

    const switchElement = screen.getByTestId('switch-option-example')
    expect(switchElement).toBeChecked()
  })
})
