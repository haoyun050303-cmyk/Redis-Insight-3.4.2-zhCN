import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { CommandGroup } from 'uiSrc/constants'
import { goBackFromCommand } from 'uiSrc/slices/cli/cli-settings'
import { getDocUrlForCommand } from 'uiSrc/utils'
import { Text } from 'uiSrc/components/base/text'

import { Link } from 'uiSrc/components/base/link/Link'
import CHCommandInfo from '../components/command-helper-info'
import CHSearchWrapper from '../components/command-helper-search'
import CHSearchOutput from '../components/command-helper-search-output'
import { CommandExampleItem } from '../command-helper.command-examples'
import { CommandUsageItem } from '../command-helper.command-usage'
import { COMMAND_HELPER_LABELS } from '../command-helper.labels'

import styles from './styles.module.scss'

export interface Props {
  commandLine: string
  isSearching: boolean
  searchedCommands: string[]
  argString: string
  argList: ReactElement[]
  summary: string
  usage: CommandUsageItem[]
  examples: CommandExampleItem[]
  group: CommandGroup | string
  complexity: string
  complexityShort: string
  since: string
}

const CommandHelper = (props: Props) => {
  const {
    commandLine = '',
    isSearching = false,
    searchedCommands = [],
    argString = '',
    argList = [],
    summary = '',
    usage = [],
    examples = [],
    group = CommandGroup.Generic,
    complexity = '',
    complexityShort = '',
    since = '',
  } = props

  const dispatch = useDispatch()
  const handleBackClick = () => dispatch(goBackFromCommand())

  const readMore = (commandName = '') => {
    const docUrl = getDocUrlForCommand(commandName)
    return (
      <Link
        href={docUrl}
        target="_blank"
        data-testid="read-more"
        size="S"
        variant="inline"
        color="primary"
      >
        {COMMAND_HELPER_LABELS.readMore}
      </Link>
    )
  }

  return (
    <div className={styles.container} data-testid="cli-helper">
      <div className={styles.searchWrapper}>
        <CHSearchWrapper />
      </div>
      {isSearching && (
        <div className={styles.outputWrapper}>
          <CHSearchOutput searchedCommands={searchedCommands} />
        </div>
      )}
      {!isSearching && (
        <div className={styles.outputWrapper}>
          {commandLine && (
            <div style={{ width: '100%' }}>
              <CHCommandInfo
                args={argString}
                group={group}
                complexity={complexityShort}
                onBackClick={handleBackClick}
              />
              {summary && (
                <Text
                  className={styles.summary}
                  data-testid="cli-helper-summary"
                >
                  <span style={{ paddingRight: 5 }}>{summary}</span>{' '}
                  {readMore(commandLine)}
                </Text>
              )}
              {!!usage.length && (
                <div className={styles.field} data-testid="cli-helper-usage">
                  <Text color="primary" className={styles.fieldTitle}>
                    {COMMAND_HELPER_LABELS.usage}
                  </Text>
                  <div className={styles.usageList}>
                    {usage.map(({ name, description }) => (
                      <Text
                        key={`${name}-${description}`}
                        className={styles.usageItem}
                        size="s"
                      >
                        <span className={styles.usageName}>{name}</span>
                        {'：'}
                        {description}
                      </Text>
                    ))}
                  </div>
                </div>
              )}
              {!!examples.length && (
                <div className={styles.field} data-testid="cli-helper-examples">
                  <Text color="primary" className={styles.fieldTitle}>
                    {COMMAND_HELPER_LABELS.examples}
                  </Text>
                  <div className={styles.exampleList}>
                    {examples.map(({ description, command }) => (
                      <div
                        key={`${description}-${command}`}
                        className={styles.exampleItem}
                      >
                        <Text size="s" className={styles.exampleDescription}>
                          {description}
                        </Text>
                        <code className={styles.exampleCommand}>{command}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!!argList.length && (
                <div
                  className={styles.field}
                  data-testid="cli-helper-arguments"
                >
                  <Text color="primary" className={styles.fieldTitle}>
                    {COMMAND_HELPER_LABELS.arguments}
                  </Text>
                  {argList}
                </div>
              )}
              {since && (
                <div className={styles.field} data-testid="cli-helper-since">
                  <Text color="primary" className={styles.fieldTitle}>
                    {COMMAND_HELPER_LABELS.since}
                  </Text>
                  {since}
                </div>
              )}
              {!complexityShort && complexity && (
                <div
                  className={styles.field}
                  data-testid="cli-helper-complexity"
                >
                  <Text color="primary" className={styles.fieldTitle}>
                    {COMMAND_HELPER_LABELS.complexity}
                  </Text>
                  {complexity}
                </div>
              )}
            </div>
          )}
          {!commandLine && (
            <Text
              color="primary"
              className={styles.defaultScreen}
              data-testid="cli-helper-default"
            >
              {COMMAND_HELPER_LABELS.defaultScreen}
            </Text>
          )}
        </div>
      )}
    </div>
  )
}

export default CommandHelper
