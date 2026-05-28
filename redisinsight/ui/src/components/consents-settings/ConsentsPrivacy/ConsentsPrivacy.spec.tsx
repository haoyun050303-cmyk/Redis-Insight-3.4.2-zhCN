import React from 'react'
import { cloneDeep } from 'lodash'
import {
  render,
  userEvent,
  screen,
  mockedStore,
  cleanup,
  clearStoreActions,
} from 'uiSrc/utils/test-utils'
import { updateUserConfigSettings } from 'uiSrc/slices/user/user-settings'
import ConsentsPrivacy from './ConsentsPrivacy'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})
const COMMON_CONSENT_CONTENT = {
  defaultValue: false,
  required: false,
  editable: true,
  disabled: false,
  displayInSetting: true,
  since: '1.0.0',
  title: 'Title',
  label: '<a>Text</a>',
}

jest.mock('uiSrc/slices/user/user-settings', () => ({
  ...jest.requireActual('uiSrc/slices/user/user-settings'),
  userSettingsSelector: jest.fn().mockReturnValue({
    isShowConceptsPopup: true,
    config: {
      agreements: {
        eula: true,
        version: '1.0.1',
      },
    },
    spec: {
      version: '1.0.0',
      agreements: {
        eula: {
          ...COMMON_CONSENT_CONTENT,
          editable: false,
          displayInSetting: false,
          required: true,
        },
        eulaNew: {
          ...COMMON_CONSENT_CONTENT,
          editable: false,
          displayInSetting: false,
          required: true,
        },
        analytics: {
          ...COMMON_CONSENT_CONTENT,
          category: 'privacy',
          agreementName: 'analytics',
          label: 'Usage Data',
          description:
            'Help improve Redis Insight by sharing anonymous usage data. This helps us understand feature usage and make the app better. By enabling this, you agree to our ',
          linkToPrivacyPolicy: true,
        },
        notifications: {
          ...COMMON_CONSENT_CONTENT,
          category: 'notifications',
        },
        disabledConsent: {
          ...COMMON_CONSENT_CONTENT,
          disabled: true,
        },
      },
    },
  }),
}))

describe('ConsentsPrivacy', () => {
  it('should render', () => {
    expect(render(<ConsentsPrivacy />)).toBeTruthy()
  })

  it('should render localized privacy copy', () => {
    render(<ConsentsPrivacy />)

    expect(
      screen.getByText('为了优化你的体验，Redis Insight 会使用第三方工具。'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('使用数据')).toHaveLength(2)
    expect(
      screen.getByText(
        '分享匿名使用数据以帮助改进 Redis Insight。这能帮助我们了解功能使用情况并持续优化应用。启用后，即表示你同意我们的',
        { exact: false },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('隐私政策')).toBeInTheDocument()
  })

  it('should render proper elements', () => {
    render(<ConsentsPrivacy />)
    expect(screen.getAllByTestId(/switch-option/)).toHaveLength(1)
  })

  describe('update settings', () => {
    it('option change should call "updateUserConfigSettingsAction"', async () => {
      render(<ConsentsPrivacy />)

      const elements = screen.getAllByTestId(/switch-option/)
      await Promise.all(elements.map((el) => userEvent.click(el)))

      const expectedActions = [updateUserConfigSettings()]
      expect(
        clearStoreActions(store.getActions().slice(0, expectedActions.length)),
      ).toEqual(clearStoreActions(expectedActions))
    })
  })
})
