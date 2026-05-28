import fs from 'fs'
import path from 'path'

import { ICommands } from 'uiSrc/constants'
import { getCommandHelperExamples } from './command-helper.command-examples'
import { getCommandHelperUsage } from './command-helper.command-usage'

const commandsDir = path.resolve(
  __dirname,
  '../../../../api/defaults/commands',
)

const loadCommands = (): ICommands =>
  fs
    .readdirSync(commandsDir)
    .filter((file) => file.endsWith('.json'))
    .reduce(
      (commands, file) => ({
        ...commands,
        ...JSON.parse(fs.readFileSync(path.join(commandsDir, file), 'utf8')),
      }),
      {},
    )

const allCommands = loadCommands()
const commandEntries = Object.entries(allCommands)

const commandText = (commandName: string) =>
  getCommandHelperExamples(
    commandName,
    allCommands[commandName]?.arguments || [],
  )
    .map(({ description, command }) => `${description} ${command}`)
    .join(' ')

const unsafeGenericCommands = [
  'FLUSHALL',
  'FLUSHDB',
  'SHUTDOWN',
  'CONFIG SET',
  'FUNCTION FLUSH',
  'SCRIPT KILL',
]

const representativeCommands: Record<string, string[]> = {
  SET: ['SET key:1 value1 EX 60'],
  SCAN: ['SCAN 0 MATCH user:* COUNT 100'],
  BITFIELD: ['BITFIELD bitmap:visits SET u8 0 12 GET u8 0'],
  ZADD: ['ZADD leaderboard 100 alice 80 bob'],
  XREADGROUP: ['XREADGROUP GROUP group1 consumer1 COUNT 2 STREAMS mystream >'],
  EVAL: ['EVAL "return redis.call(\'GET\', KEYS[1])" 1 key:1'],
  'FT.CREATE': ['FT.CREATE idx:users ON HASH PREFIX 1 user: SCHEMA name TEXT'],
  'FT.SEARCH': ['FT.SEARCH idx:users "@name:Alice" LIMIT 0 10'],
  'JSON.SET': ['JSON.SET doc:1 $ \'{"name":"Alice"}\''],
  'TS.CREATE': ['TS.CREATE temperature:1 RETENTION 86400000 LABELS sensor s1'],
  'BF.RESERVE': ['BF.RESERVE bf:users 0.01 1000'],
  'CF.ADD': ['CF.ADD cf:users user:1'],
  'TOPK.ADD': ['TOPK.ADD topk:pages /home /docs'],
  'TDIGEST.ADD': ['TDIGEST.ADD tdigest:latency 12 15 20'],
  'ACL SETUSER': ['ACL SETUSER appuser on >password ~app:* +@read'],
  'CLIENT KILL': ['CLIENT KILL TYPE normal'],
  'CLUSTER SETSLOT': ['CLUSTER SETSLOT 7000 NODE'],
  'CONFIG GET': ['CONFIG GET maxmemory'],
}

describe('Command Helper command coverage audit', () => {
  it('should load the complete Redis command catalog', () => {
    expect(commandEntries.length).toBeGreaterThanOrEqual(500)
  })

  it('should generate a non-empty example for every command', () => {
    const missing = commandEntries
      .map(([name, command]) => ({
        name,
        examples: getCommandHelperExamples(name, command.arguments || []),
      }))
      .filter(({ examples }) =>
        examples.some(
          ({ description, command }) => !description.trim() || !command.trim(),
        ),
      )

    expect(missing).toEqual([])
  })

  it('should generate usage notes for every command with arguments', () => {
    const missing = commandEntries
      .filter(([, command]) => !!command.arguments?.length)
      .map(([name, command]) => ({
        name,
        usage: getCommandHelperUsage(name, command.arguments || []),
      }))
      .filter(({ usage }) => usage.length === 0)

    expect(missing).toEqual([])
  })

  it('should show caution examples for unsafe commands', () => {
    const unsafeWithoutCaution = unsafeGenericCommands.filter((command) => {
      const text = commandText(command)
      return !text.includes('高风险命令') && !text.includes('谨慎')
    })

    expect(unsafeWithoutCaution).toEqual([])
  })

  it.each(Object.entries(representativeCommands))(
    'should generate a precise example for %s',
    (commandName, expectedParts) => {
      const text = commandText(commandName)
      expectedParts.forEach((part) => expect(text).toContain(part))
    },
  )
})
