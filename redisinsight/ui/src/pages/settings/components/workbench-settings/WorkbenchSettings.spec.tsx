import { cloneDeep } from 'lodash'
import React from 'react'
import { setWorkbenchCleanUp } from 'uiSrc/slices/user/user-settings'
import {
  cleanup,
  userEvent,
  mockedStore,
  render,
  screen,
} from 'uiSrc/utils/test-utils'

import WorkbenchSettings from './WorkbenchSettings'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

describe('WorkbenchSettings', () => {
  it('should render', () => {
    expect(render(<WorkbenchSettings />)).toBeTruthy()
  })

  it('should render localized workbench settings copy', () => {
    render(<WorkbenchSettings />)

    expect(screen.getByText('编辑器清理')).toBeInTheDocument()
    expect(screen.getByText('运行命令后清空编辑器')).toBeInTheDocument()
    expect(screen.getByText('Pipeline 模式')).toBeInTheDocument()
    expect(screen.getByText('Pipeline 中的命令数：')).toBeInTheDocument()
  })

  it('should call proper actions after click on switch wb clear mode', async () => {
    render(<WorkbenchSettings />)

    const afterRenderActions = [...store.getActions()]

    await userEvent.click(screen.getByTestId('switch-workbench-cleanup'))

    expect(store.getActions()).toEqual([
      ...afterRenderActions,
      setWorkbenchCleanUp(false),
    ])
  })

  it('should pipeline-bunch render ', () => {
    render(<WorkbenchSettings />)

    expect(screen.getByTestId(/pipeline-bunch/)).toBeInTheDocument()
  })
})
