import { merge } from 'lodash'
import { defaultMonacoOptions, TutorialsIds } from 'uiSrc/constants'

export const aroundQuotesRegExp = /(^["']|["']$)/g

export const options = merge({}, defaultMonacoOptions, {
  suggest: {
    showWords: false,
    showIcons: true,
    insertMode: 'replace',
    filterGraceful: false,
    matchOnWordStartOnly: true,
  },
})

export const TUTORIALS = [
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
