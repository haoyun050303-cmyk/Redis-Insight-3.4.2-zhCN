import { BreadcrumbsLinks } from '../breadcrumbs'

describe('BreadcrumbsLinks', () => {
  it('should localize browser breadcrumbs labels', () => {
    const [home, database] = BreadcrumbsLinks.BrowserPage({
      connectedInstanceName: 'local',
      connection: 'localhost:6379',
      version: '7.2.0',
      user: 'default',
    })

    expect(home.text).toEqual('Redis 数据库')
    expect(database.tooltipOptions).toEqual([
      { label: '数据库名称', value: 'local' },
      { label: '连接', value: 'localhost:6379' },
      { label: '版本', value: '7.2.0' },
      { label: '用户名', value: 'default' },
    ])
  })
})
