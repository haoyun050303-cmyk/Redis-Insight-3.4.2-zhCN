import React, { ReactElement, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import cn from 'classnames'

import { CommandGroup, ICommand, ICommandArgGenerated } from 'uiSrc/constants'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import { cliSettingsSelector } from 'uiSrc/slices/cli/cli-settings'
import { appRedisCommandsSelector } from 'uiSrc/slices/app/redis-commands'
import {
  generateArgs,
  generateArgsNames,
  getComplexityShortNotation,
  removeDeprecatedModuleCommands,
  checkDeprecatedModuleCommand,
} from 'uiSrc/utils'
import { FlexItem, Row } from 'uiSrc/components/base/layout/flex'
import { RiBadge } from 'uiSrc/components/base/display/badge/RiBadge'

import CommandHelper from './CommandHelper'
import CommandHelperHeader from './CommandHelperHeader'
import { getCommandHelperSummary } from './command-helper.command-descriptions'
import { getCommandHelperExamples } from './command-helper.command-examples'
import { getCommandHelperUsage } from './command-helper.command-usage'
import { COMMAND_HELPER_LABELS } from './command-helper.labels'

import styles from './CommandHelper/styles.module.scss'

const CommandHelperWrapper = () => {
  const {
    matchedCommand = '',
    searchedCommand = '',
    isSearching,
    isEnteringCommand,
    searchingCommand,
    searchingCommandFilter,
  } = useSelector(cliSettingsSelector)
  const { spec: ALL_REDIS_COMMANDS, commandsArray } = useSelector(
    appRedisCommandsSelector,
  )
  const { instanceId = '' } = useParams<{ instanceId: string }>()
  const lastMatchedCommand =
    isEnteringCommand &&
    matchedCommand &&
    !checkDeprecatedModuleCommand(matchedCommand)
      ? matchedCommand
      : searchedCommand

  const KEYS_OF_COMMANDS = useMemo(
    () =>
      removeDeprecatedModuleCommands(
        commandsArray.length ? commandsArray : Object.keys(ALL_REDIS_COMMANDS),
      ),
    [commandsArray, ALL_REDIS_COMMANDS],
  )
  let searchedCommands: string[] = []

  useEffect(() => {
    if (!isSearching && isEnteringCommand && matchedCommand) {
      sendEventTelemetry({
        event: TelemetryEvent.COMMAND_HELPER_INFO_DISPLAYED_FOR_CLI_INPUT,
        eventData: {
          databaseId: instanceId,
          command: matchedCommand,
        },
      })
    }
  }, [isSearching, isEnteringCommand, matchedCommand])

  const {
    arguments: args = [],
    summary = '',
    group = CommandGroup.Generic,
    complexity = '',
    since = '',
    provider,
  }: ICommand = ALL_REDIS_COMMANDS[lastMatchedCommand.toUpperCase()] ?? {}

  if (isSearching) {
    searchedCommands = KEYS_OF_COMMANDS.filter((command) => {
      const commandSpec = ALL_REDIS_COMMANDS[command]
      if (!commandSpec) {
        return false
      }
      const isSuitableForFilter = searchingCommandFilter
        ? commandSpec.group === searchingCommandFilter
        : true
      return (
        isSuitableForFilter &&
        command.toLowerCase().indexOf(searchingCommand.toLowerCase()) > -1
      )
    })
  }

  const generatedArgs = generateArgs(provider, args)
  const complexityShort = getComplexityShortNotation(complexity)
  const localizedSummary = getCommandHelperSummary(lastMatchedCommand, summary)
  const usage = getCommandHelperUsage(lastMatchedCommand, args)
  const examples = getCommandHelperExamples(lastMatchedCommand, args)
  const commandLine = lastMatchedCommand
  const argString = [
    lastMatchedCommand.toUpperCase(),
    ...generateArgsNames(provider, args),
  ].join(' ')

  const generateArgData = (
    arg: ICommandArgGenerated,
    i: number,
  ): ReactElement => {
    const type = arg.multiple
      ? COMMAND_HELPER_LABELS.multiple
      : arg.optional
        ? COMMAND_HELPER_LABELS.optional
        : COMMAND_HELPER_LABELS.required
    return (
      <Row justify="between" align="center" className={styles.arg} key={i}>
        <FlexItem>
          <RiBadge
            variant="light"
            className={cn(styles.badge, 'text-capitalize')}
            label={type}
          />
        </FlexItem>
        <FlexItem grow>{arg.generatedName}</FlexItem>
      </Row>
    )
  }

  return (
    <div className={styles.commandHelperWrapper} data-testid="command-helper">
      <CommandHelperHeader />
      <CommandHelper
        commandLine={commandLine}
        searchedCommands={searchedCommands}
        isSearching={isSearching}
        argString={argString}
        summary={localizedSummary}
        usage={usage}
        examples={commandLine ? examples : []}
        group={group}
        since={since}
        complexity={complexity}
        complexityShort={complexityShort}
        argList={generatedArgs.map((obj, i) => generateArgData(obj, i))}
      />
    </div>
  )
}

export default React.memo(CommandHelperWrapper)
