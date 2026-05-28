import React from 'react'
import { useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

import { RootState } from 'uiSrc/slices/store'
import { cleanup, mockedStore, render, screen } from 'uiSrc/utils/test-utils'

import BulkDeleteSummary from './BulkDeleteSummary'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

jest.mock('uiSrc/slices/browser/bulkActions', () => ({
  ...jest.requireActual('uiSrc/slices/browser/bulkActions'),
  selectedBulkActionsSelector: jest.fn().mockReturnValue({
    type: 'delete',
  }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

beforeEach(() => {
  const state: any = store.getState()

  ;(useSelector as jest.Mock).mockImplementation(
    (callback: (arg0: RootState) => RootState) =>
      callback({
        ...state,
        browser: {
          ...state.browser,
          keys: {
            ...state.browser.keys,
            data: {
              ...state.browser.keys.data,
            },
          },
        },
      }),
  )
})

describe('BulkDeleteSummary', () => {
  it('should render', () => {
    expect(render(<BulkDeleteSummary />)).toBeTruthy()
  })

  it('summary should contain calculated text', () => {
    const state: any = store.getState()

    ;(useSelector as jest.Mock).mockImplementation(
      (callback: (arg0: RootState) => RootState) =>
        callback({
          ...state,
          browser: {
            ...state.browser,
            keys: {
              ...state.browser.keys,
              data: {
                ...state.browser.keys.data,
                scanned: 10,
                total: 100,
                keys: [1],
              },
            },
          },
        }),
    )

    render(<BulkDeleteSummary />)
    const summaryEl = screen.queryByTestId('bulk-delete-summary')
    const expectedText = '已扫描 10% (10/100) ，找到 1 个键'

    expect(summaryEl).toHaveTextContent(expectedText)
  })

  it('should show folder key count when keyCount is set (folder delete)', () => {
    const state: any = store.getState()

    ;(useSelector as jest.Mock).mockImplementation(
      (callback: (arg0: RootState) => RootState) =>
        callback({
          ...state,
          browser: {
            ...state.browser,
            keys: {
              ...state.browser.keys,
              data: {
                ...state.browser.keys.data,
                scanned: 50,
                total: 100,
                keys: [1, 2, 3],
              },
            },
            bulkActions: {
              ...state.browser.bulkActions,
              bulkDelete: {
                ...state.browser.bulkActions.bulkDelete,
                keyCount: 25,
              },
            },
          },
        }),
    )

    render(<BulkDeleteSummary />)
    const summaryEl = screen.queryByTestId('bulk-delete-summary')
    // For folder delete, should show the folder's keyCount (25) instead of keys.length (3)
    const expectedText = '已扫描 50% (50/100) ，找到 25 个键'

    expect(summaryEl).toHaveTextContent(expectedText)
  })

  it('should show approximate title for folder delete when scan not complete', () => {
    const state: any = store.getState()

    ;(useSelector as jest.Mock).mockImplementation(
      (callback: (arg0: RootState) => RootState) =>
        callback({
          ...state,
          browser: {
            ...state.browser,
            keys: {
              ...state.browser.keys,
              data: {
                ...state.browser.keys.data,
                scanned: 50,
                total: 100,
                keys: [],
              },
            },
            bulkActions: {
              ...state.browser.bulkActions,
              bulkDelete: {
                ...state.browser.bulkActions.bulkDelete,
                keyCount: 25,
              },
            },
          },
        }),
    )

    render(<BulkDeleteSummary />)
    // Expected amount should be ~50 (keyCount * total / scanned = 25 * 100 / 50)
    expect(screen.getByText('预计数量: ~50 个键')).toBeInTheDocument()
  })

  it('should show N/A when scanned is 0 (avoid division by zero)', () => {
    const state: any = store.getState()

    ;(useSelector as jest.Mock).mockImplementation(
      (callback: (arg0: RootState) => RootState) =>
        callback({
          ...state,
          browser: {
            ...state.browser,
            keys: {
              ...state.browser.keys,
              data: {
                ...state.browser.keys.data,
                scanned: 0,
                total: 100,
                keys: [],
              },
            },
            bulkActions: {
              ...state.browser.bulkActions,
              bulkDelete: {
                ...state.browser.bulkActions.bulkDelete,
                keyCount: 25,
              },
            },
          },
        }),
    )

    render(<BulkDeleteSummary />)
    // When scanned is 0, should show N/A instead of Infinity
    expect(screen.getByText('预计数量: N/A')).toBeInTheDocument()
  })
})
