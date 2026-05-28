export const HOME_LABELS = {
  tabs: {
    redisDatabases: 'Redis 数据库',
    redisDataIntegration: 'Redis 数据集成',
  },
  databaseList: {
    createFreeCloudDatabase: '创建免费 Cloud 数据库',
    connectExistingDatabase: '连接已有数据库',
  },
  addDatabase: {
    title: '添加数据库',
    connectionUrl: '连接 URL',
    testConnection: '测试连接',
    connectionSettings: '连接设置',
    submit: '添加数据库',
    separator: '或',
    connectionUrlError: '提供的连接 URL 格式不受支持。',
    connectionUrlErrorHint: '请尝试使用连接表单添加数据库。',
  },
  connectivityOptions: {
    cloudAccount: '开始使用 Redis Cloud 账号',
    addDatabases: '添加数据库',
    newDatabase: '新建数据库',
    moreOptions: '更多连接方式',
    importFromFile: '从文件导入',
    cancel: '取消',
  },
} as const
