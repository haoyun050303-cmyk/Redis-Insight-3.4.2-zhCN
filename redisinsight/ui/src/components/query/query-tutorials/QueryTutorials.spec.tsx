import React from 'react'
import reactRouterDom from 'react-router-dom'
import { fireEvent, render, screen } from 'uiSrc/utils/test-utils'

import { findTutorialPath } from 'uiSrc/utils'

import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'

import { TutorialsIds } from 'uiSrc/constants'
import QueryTutorials from './QueryTutorials'

const mockedTutorials = [
  {
    id: TutorialsIds.IntroToSearch,
    title: '搜索入门',
  },
  {
    id: TutorialsIds.BasicRedisUseCases,
    title: '基础使用场景',
  },
  {
    id: TutorialsIds.IntroVectorSearch,
    title: '向量搜索入门',
  },
]

jest.mock('uiSrc/utils', () => ({
  ...jest.requireActual('uiSrc/utils'),
  findTutorialPath: jest.fn(),
}))

jest.mock('uiSrc/telemetry', () => ({
  ...jest.requireActual('uiSrc/telemetry'),
  sendEventTelemetry: jest.fn(),
}))

describe('QueryTutorial', () => {
  it('should render', () => {
    expect(
      render(<QueryTutorials tutorials={mockedTutorials} source="source" />),
    ).toBeTruthy()
    expect(screen.getByText('教程：')).toBeInTheDocument()
    expect(screen.getByText('搜索入门')).toBeInTheDocument()
  })

  it('should call proper history push after click on guide with tutorial', () => {
    const pushMock = jest.fn()
    reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock })
    ;(findTutorialPath as jest.Mock).mockImplementation(() => 'path')

    render(<QueryTutorials tutorials={mockedTutorials} source="source" />)

    fireEvent.click(screen.getByTestId('query-tutorials-link_sq-intro'))

    expect(pushMock).toHaveBeenCalledWith({
      search: 'path=tutorials/path',
    })
  })

  it('should call proper telemetry event after click on guide', () => {
    const sendEventTelemetryMock = jest.fn()
    ;(sendEventTelemetry as jest.Mock).mockImplementation(
      () => sendEventTelemetryMock,
    )
    ;(findTutorialPath as jest.Mock).mockImplementation(() => 'path')

    render(<QueryTutorials tutorials={mockedTutorials} source="source" />)

    fireEvent.click(screen.getByTestId('query-tutorials-link_sq-intro'))

    expect(sendEventTelemetry).toBeCalledWith({
      event: TelemetryEvent.EXPLORE_PANEL_TUTORIAL_OPENED,
      eventData: {
        path: 'path',
        databaseId: 'instanceId',
        source: 'source',
      },
    })
  })
})
