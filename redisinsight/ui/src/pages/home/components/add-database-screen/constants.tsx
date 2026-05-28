import { AllIconsType } from 'uiSrc/components/base/icons'
import { AddDbType } from 'uiSrc/pages/home/constants'
import { HOME_LABELS } from 'uiSrc/pages/home/home.labels'

export interface Values {
  connectionURL: string
}

export interface ConnectivityOptionConfig {
  id: string
  title: string
  type: AddDbType
  icon: AllIconsType
}

export interface ConnectivityOption extends ConnectivityOptionConfig {
  onClick: () => void
  loading?: boolean
  onCancel?: () => void
}

export const CONNECTIVITY_OPTIONS_CONFIG: ConnectivityOptionConfig[] = [
  {
    id: 'sentinel',
    title: 'Redis Sentinel',
    type: AddDbType.sentinel,
    icon: 'ShieldIcon',
  },
  {
    id: 'software',
    title: 'Redis Software',
    type: AddDbType.software,
    icon: 'RedisSoftwareIcon',
  },
  {
    id: 'azure',
    title: 'Azure Managed Redis',
    type: AddDbType.azure,
    icon: 'CloudIcon',
  },
  {
    id: 'import',
    title: HOME_LABELS.connectivityOptions.importFromFile,
    type: AddDbType.import,
    icon: 'DownloadIcon',
  },
]
