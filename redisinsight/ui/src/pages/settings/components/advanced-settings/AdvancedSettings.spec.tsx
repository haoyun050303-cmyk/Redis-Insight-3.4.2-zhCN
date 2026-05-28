import React from 'react'
import { render, screen } from 'uiSrc/utils/test-utils'
import AdvancedSettings from './AdvancedSettings'

jest.mock('uiSrc/slices/user/user-settings', () => ({
  ...jest.requireActual('uiSrc/slices/user/user-settings'),
  userSettingsSelector: jest.fn().mockReturnValue({
    config: {
      scanThreshold: 10000,
      batchSize: 5,
    },
  }),
  updateUserConfigSettingsAction: () => jest.fn,
}))

describe('AdvancedSettings', () => {
  it('should render', () => {
    expect(render(<AdvancedSettings />)).toBeTruthy()
  })

  it('should render localized advanced settings copy', () => {
    render(<AdvancedSettings />)

    expect(screen.getByText('列表视图扫描键数量')).toBeInTheDocument()
    expect(screen.getByText('每次扫描的键数量：')).toBeInTheDocument()
  })

  it('should Keys-to-scan-value render ', () => {
    render(<AdvancedSettings />)

    expect(screen.getByTestId(/keys-to-scan-value/)).toBeInTheDocument()
  })
})
