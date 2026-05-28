import { getConfig } from 'uiSrc/config'
import { RiSelectOption } from 'uiSrc/components/base/forms/select/RiSelect'

const riConfig = getConfig()

export enum Theme {
  Dark = 'DARK',
  Light = 'LIGHT',
  System = 'SYSTEM',
}

export const DEFAULT_THEME = riConfig.app.defaultTheme

export const THEMES: RiSelectOption[] = [
  {
    inputDisplay: '跟随系统',
    value: Theme.System,
  },
  {
    inputDisplay: '深色主题',
    value: Theme.Dark,
  },
  {
    inputDisplay: '浅色主题',
    value: Theme.Light,
  },
]

export const THEME_MATCH_MEDIA_DARK = '(prefers-color-scheme: dark)'

export default THEMES
