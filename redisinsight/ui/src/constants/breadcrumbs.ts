const RedisDatabases = {
  text: 'Redis 数据库',
  href: '/',
}

export interface BrowserPageOptions {
  connectedInstanceName: string
  postfix?: string
  connection: string
  version: string
  user: string
}

export const BreadcrumbsLinks = {
  BrowserPage: ({
    connectedInstanceName,
    connection,
    version,
    user,
    postfix = '',
  }: BrowserPageOptions) => [
    { ...RedisDatabases },
    {
      postfix,
      text: connectedInstanceName,
      tooltipOptions: [
        {
          label: '数据库名称',
          value: connectedInstanceName + (postfix ? ` ${postfix}` : ''),
        },
        {
          label: '连接',
          value: connection,
        },
        {
          label: '版本',
          value: version,
        },
        {
          label: '用户名',
          value: user,
        },
      ],
    },
  ],
}
