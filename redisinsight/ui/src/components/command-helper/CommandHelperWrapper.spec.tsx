import { cloneDeep } from 'lodash'
import React from 'react'
import { cliSettingsSelector } from 'uiSrc/slices/cli/cli-settings'
import { appRedisCommandsSelector } from 'uiSrc/slices/app/redis-commands'
import { cleanup, mockedStore, render, screen } from 'uiSrc/utils/test-utils'
import { ICommands, MOCK_COMMANDS_SPEC } from 'uiSrc/constants'
import CommandHelperWrapper from './CommandHelperWrapper'

const ALL_REDIS_COMMANDS: ICommands = MOCK_COMMANDS_SPEC
const redisCommandsPath = 'uiSrc/slices/app/redis-commands'
const cliHelperTestId = 'cli-helper'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

jest.mock('uiSrc/slices/cli/cli-settings', () => ({
  ...jest.requireActual('uiSrc/slices/cli/cli-settings'),
  cliSettingsSelector: jest.fn().mockReturnValue({
    matchedCommand: '',
    isSearching: false,
    isEnteringCommand: false,
    searchedCommand: '',
    searchingCommand: '',
  }),
}))

jest.mock(redisCommandsPath, () => {
  const defaultState = jest.requireActual(redisCommandsPath).initialState
  const { MOCK_COMMANDS_SPEC, MOCK_COMMANDS_ARRAY } =
    jest.requireActual('uiSrc/constants')
  return {
    ...jest.requireActual(redisCommandsPath),
    appRedisCommandsSelector: jest.fn().mockReturnValue({
      ...defaultState,
      spec: MOCK_COMMANDS_SPEC,
      commandsArray: MOCK_COMMANDS_ARRAY,
    }),
  }
})

interface IMockedCommands {
  matchedCommand: string
  argStr?: string
  argListText?: string
  complexityShort?: string
}

const mockedCommands: IMockedCommands[] = [
  {
    matchedCommand: 'xgroup',
    argStr: 'XGROUP',
    argListText: '',
  },
  {
    matchedCommand: 'hset',
    argStr: 'HSET key field value [field value ...]',
    argListText: '参数：必填key多个field value',
  },
  {
    matchedCommand: 'acl setuser',
    argStr: 'ACL SETUSER username [rule [rule ...]]',
    argListText: '参数：必填username多个[rule]',
  },
  {
    matchedCommand: 'bitfield',
    argStr:
      'BITFIELD key [GET encoding offset | [OVERFLOW WRAP | SAT | FAIL] SET encoding offset value | INCRBY encoding offset increment [GET encoding offset | [OVERFLOW WRAP | SAT | FAIL] SET encoding offset value | INCRBY encoding offset increment ...]]',
    argListText:
      '参数：必填key多个[GET encoding offset | [OVERFLOW WRAP | SAT | FAIL] SET encoding offset value | INCRBY encoding offset increment]',
  },
  {
    matchedCommand: 'client kill',
    argStr:
      'CLIENT KILL ip:port | [ID client-id] | [TYPE NORMAL | MASTER | SLAVE | REPLICA | PUBSUB] | [USER username] | [ADDR ip:port] | [LADDR ip:port] | [SKIPME YES | NO] [[ID client-id] | [TYPE NORMAL | MASTER | SLAVE | REPLICA | PUBSUB] | [USER username] | [ADDR ip:port] | [LADDR ip:port] | [SKIPME YES | NO] ...]',
    argListText:
      '参数：必填ip:port | [ID client-id] | [TYPE NORMAL | MASTER | SLAVE | REPLICA | PUBSUB] | [USER username] | [ADDR ip:port] | [LADDR ip:port] | [SKIPME YES | NO] [[ID client-id] | [TYPE NORMAL | MASTER | SLAVE | REPLICA | PUBSUB] | [USER username] | [ADDR ip:port] | [LADDR ip:port] | [SKIPME YES | NO] ...]',
  },
  {
    matchedCommand: 'geoadd',
    argStr:
      'GEOADD key [NX | XX] [CH] longitude latitude member [longitude latitude member ...]',
    argListText:
      '参数：必填key可选[NX | XX]可选[CH]多个longitude latitude member',
  },
  {
    matchedCommand: 'zadd',
    argStr:
      'ZADD key [NX | XX] [GT | LT] [CH] [INCR] score member [score member ...]',
    argListText:
      '参数：必填key可选[NX | XX]可选[GT | LT]可选[CH]可选[INCR]多个score member',
  },
]

describe('CliBodyWrapper', () => {
  it('should render', () => {
    expect(render(<CommandHelperWrapper />)).toBeTruthy()
  })

  it('Title should be rendered according mocked data', () => {
    const titleArgsId = 'cli-helper-title-args'

    mockedCommands.forEach(({ matchedCommand, argStr = '' }) => {
      cliSettingsSelector.mockImplementation(() => ({
        matchedCommand,
        isEnteringCommand: true,
      }))

      const { unmount } = render(<CommandHelperWrapper />)

      expect(screen.getByTestId(cliHelperTestId)).toBeInTheDocument()
      expect(screen.getByTestId(titleArgsId)).toHaveTextContent(argStr)

      unmount()
    })
  })

  it('Arguments list text should be rendered according mocked data', () => {
    const argsId = 'cli-helper-arguments'

    mockedCommands.forEach(({ matchedCommand, argListText = '' }) => {
      cliSettingsSelector.mockImplementation(() => ({
        matchedCommand,
        isEnteringCommand: true,
      }))

      const { unmount } = render(<CommandHelperWrapper />)

      if (argListText) {
        expect(screen.getByTestId(cliHelperTestId)).toBeInTheDocument()
        expect(screen.getByTestId(argsId)).toHaveTextContent(argListText)
      }

      unmount()
    })
  })

  it('should render localized command summary when one is available', () => {
    const summaryId = 'cli-helper-summary'

    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'hset',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId(summaryId)).toHaveTextContent(
      '设置哈希字段的字符串值。',
    )
  })

  it('should render localized usage for XREADGROUP', () => {
    const spec: ICommands = {
      ...MOCK_COMMANDS_SPEC,
      XREADGROUP: {
        provider: 'main',
        summary:
          'Returns new or historical messages from a stream for a consumer in a group. Blocks until a message is available otherwise.',
        since: '5.0.0',
        group: 'stream',
        complexity: 'O(M)',
        arguments: [
          {
            name: 'group-block',
            type: 'block',
            token: 'GROUP',
            arguments: [
              { name: 'group', type: 'string', display_text: 'group' },
              {
                name: 'consumer',
                type: 'string',
                display_text: 'consumer',
              },
            ],
          },
          {
            name: 'count',
            type: 'integer',
            display_text: 'count',
            token: 'COUNT',
            optional: true,
          },
          {
            name: 'milliseconds',
            type: 'integer',
            display_text: 'milliseconds',
            token: 'BLOCK',
            optional: true,
          },
          {
            name: 'noack',
            type: 'pure-token',
            display_text: 'noack',
            token: 'NOACK',
            optional: true,
          },
        ],
      } as any,
    }

    ;(appRedisCommandsSelector as jest.Mock).mockReturnValueOnce({
      spec,
      commandsArray: Object.keys(spec),
    })
    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'xreadgroup',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'group：消费组名称。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'consumer：消费者名称；如果不存在，读取时会自动创建。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'COUNT count：本次读取的最大消息数量。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'BLOCK milliseconds：没有消息时最长等待时间，单位为毫秒。',
    )
    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'XREADGROUP GROUP group1 consumer1 COUNT 2 STREAMS mystream >',
    )
  })

  it('should render localized summary and usage for GEOSEARCH', () => {
    const spec: ICommands = {
      ...MOCK_COMMANDS_SPEC,
      GEOSEARCH: {
        provider: 'main',
        summary:
          'Queries a geospatial index for members inside an area of a box or a circle.',
        since: '6.2.0',
        group: 'geo',
        complexity: 'O(N+log(M))',
        arguments: [
          {
            name: 'key',
            type: 'key',
            display_text: 'key',
          },
          {
            name: 'from',
            type: 'oneof',
            arguments: [
              {
                name: 'member',
                type: 'string',
                display_text: 'member',
                token: 'FROMMEMBER',
              },
              {
                name: 'fromlonlat',
                type: 'block',
                token: 'FROMLONLAT',
                arguments: [
                  {
                    name: 'longitude',
                    type: 'double',
                    display_text: 'longitude',
                  },
                  {
                    name: 'latitude',
                    type: 'double',
                    display_text: 'latitude',
                  },
                ],
              },
            ],
          },
          {
            name: 'withdist',
            type: 'pure-token',
            display_text: 'withdist',
            token: 'WITHDIST',
            optional: true,
          },
        ],
      } as any,
    }

    ;(appRedisCommandsSelector as jest.Mock).mockReturnValueOnce({
      spec,
      commandsArray: Object.keys(spec),
    })
    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'geosearch',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-summary')).toHaveTextContent(
      '在地理空间索引中查询指定圆形或矩形范围内的成员。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'FROMMEMBER member：以已有成员的位置作为查询中心。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'WITHDIST：返回成员与中心点的距离。',
    )
    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'GEOSEARCH places FROMLONLAT 116.397128 39.916527 BYRADIUS 5 km WITHDIST',
    )
  })

  it('should render search results from spec when commandsArray is empty', () => {
    const spec: ICommands = {
      HSET: MOCK_COMMANDS_SPEC.HSET,
    }

    ;(appRedisCommandsSelector as jest.Mock).mockReturnValueOnce({
      spec,
      commandsArray: [],
    })
    cliSettingsSelector.mockImplementation(() => ({
      searchingCommand: 'hset',
      searchedCommand: '',
      isSearching: true,
    }))

    render(<CommandHelperWrapper />)

    expect(
      screen.getByTestId('cli-helper-output-title-HSET'),
    ).toBeInTheDocument()
  })

  it('should skip missing command specs without hiding valid search results', () => {
    const spec: ICommands = {
      HSET: MOCK_COMMANDS_SPEC.HSET,
    }

    ;(appRedisCommandsSelector as jest.Mock).mockReturnValueOnce({
      spec,
      commandsArray: ['HSET', 'MISSING.COMMAND'],
    })
    cliSettingsSelector.mockImplementation(() => ({
      searchingCommand: '',
      searchedCommand: '',
      isSearching: true,
    }))

    expect(() => render(<CommandHelperWrapper />)).not.toThrow()
    expect(
      screen.getByTestId('cli-helper-output-title-HSET'),
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId('cli-helper-output-title-MISSING.COMMAND'),
    ).not.toBeInTheDocument()
  })

  it('should render generated examples for commands without manual examples', () => {
    const spec: ICommands = {
      ...MOCK_COMMANDS_SPEC,
      TTL: {
        provider: 'main',
        summary: 'Returns the expiration time in seconds of a key.',
        since: '1.0.0',
        group: 'generic',
        complexity: 'O(1)',
        arguments: [
          {
            name: 'key',
            type: 'key',
            display_text: 'key',
          },
        ],
      } as any,
    }

    ;(appRedisCommandsSelector as jest.Mock).mockReturnValueOnce({
      spec,
      commandsArray: Object.keys(spec),
    })
    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'ttl',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'TTL key:1',
    )
  })

  it('should render caution examples for risky commands', () => {
    const spec: ICommands = {
      ...MOCK_COMMANDS_SPEC,
      FLUSHALL: {
        provider: 'main',
        summary: 'Deletes all keys from all databases.',
        since: '1.0.0',
        group: 'server',
        complexity: 'O(N)',
        arguments: [],
      } as any,
    }

    ;(appRedisCommandsSelector as jest.Mock).mockReturnValueOnce({
      spec,
      commandsArray: Object.keys(spec),
    })
    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'flushall',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      '高风险命令',
    )
    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'FLUSHALL',
    )
  })

  it('should render precise bitmap usage and examples for BITFIELD', () => {
    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'bitfield',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'GET encoding offset：读取指定编码和偏移量上的整数位域。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'SET encoding offset value：设置指定编码和偏移量上的整数位域。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'OVERFLOW WRAP | SAT | FAIL：设置写入或递增溢出时的处理方式。',
    )
    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'BITFIELD bitmap:visits SET u8 0 12 GET u8 0',
    )
    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'BITFIELD bitmap:visits OVERFLOW SAT INCRBY u8 0 1',
    )
  })

  it('should render precise bitmap examples for SETBIT and GETBIT', () => {
    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'setbit',
      isEnteringCommand: true,
    }))

    const { unmount } = render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'offset：从 0 开始的位偏移量。',
    )
    expect(screen.getByTestId('cli-helper-usage')).toHaveTextContent(
      'value：要设置的位值，只能是 0 或 1。',
    )
    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'SETBIT bitmap:visits 7 1',
    )

    unmount()

    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'getbit',
      isEnteringCommand: true,
    }))

    render(<CommandHelperWrapper />)

    expect(screen.getByTestId('cli-helper-examples')).toHaveTextContent(
      'GETBIT bitmap:visits 7',
    )
  })

  it('Since should be rendered according mocked data', () => {
    const sinceId = 'cli-helper-since'

    mockedCommands.forEach(({ matchedCommand = '' }) => {
      const since = ALL_REDIS_COMMANDS[matchedCommand?.toUpperCase()]?.since

      cliSettingsSelector.mockImplementation(() => ({
        matchedCommand,
        isEnteringCommand: true,
      }))

      const { unmount } = render(<CommandHelperWrapper />)

      expect(screen.getByTestId(cliHelperTestId)).toBeInTheDocument()
      expect(screen.getByTestId(sinceId)).toHaveTextContent(since)

      unmount()
    })
  })

  it('Complexity should be rendered according mocked data', () => {
    const complexityId = 'cli-helper-complexity'

    mockedCommands.forEach(({ matchedCommand = '' }) => {
      const complexity =
        ALL_REDIS_COMMANDS[matchedCommand?.toUpperCase()]?.complexity

      cliSettingsSelector.mockImplementation(() => ({
        matchedCommand,
        isEnteringCommand: true,
      }))

      const { unmount } = render(<CommandHelperWrapper />)

      expect(screen.getByTestId(cliHelperTestId)).toBeInTheDocument()

      if (complexity) {
        expect(screen.getByTestId(complexityId)).toBeInTheDocument()
        expect(screen.getByTestId(complexityId)).toHaveTextContent(complexity)
      }

      unmount()
    })
  })

  it('should render search results', () => {
    mockedCommands.forEach(({ matchedCommand }) => {
      cliSettingsSelector.mockImplementation(() => ({
        searchingCommand: matchedCommand,
        searchedCommand: '',
        isSearching: true,
      }))
      const { unmount } = render(<CommandHelperWrapper />)
      expect(
        screen.getByTestId(
          `cli-helper-output-title-${matchedCommand.toUpperCase()}`,
        ),
      ).toBeInTheDocument()
      unmount()
    })
  })

  it('should render default message when matched command is deprecated', () => {
    const sinceId = 'cli-helper-since'
    const cliHelperDefaultId = 'cli-helper-default'

    cliSettingsSelector.mockImplementation(() => ({
      matchedCommand: 'GRAPH.CONFIG SET',
      isEnteringCommand: true,
    }))

    const { unmount, queryByTestId } = render(<CommandHelperWrapper />)

    expect(queryByTestId(cliHelperDefaultId)).toBeInTheDocument()
    expect(queryByTestId(sinceId)).not.toBeInTheDocument()

    unmount()
  })
})
