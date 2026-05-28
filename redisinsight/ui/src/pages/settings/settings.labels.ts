export const SETTINGS_LABELS = {
  title: '设置',
  general: '常规',
  privacy: '隐私',
  workbench: '工作台',
  redisCloud: 'Redis Cloud',
  advanced: '高级',
  advancedWarning: '仅在你了解影响时才修改高级设置。',
  theme: {
    title: '颜色主题',
    summary: '指定 Redis Insight 使用的颜色主题：',
  },
  notifications: {
    title: '通知',
    description: '选择后会显示通知。否则，通知会显示在通知中心。',
    showNotification: '显示通知',
  },
  privacySettings: {
    intro: '为了优化你的体验，Redis Insight 会使用第三方工具。',
    usageData: '使用数据',
    usageDataDescription:
      '分享匿名使用数据以帮助改进 Redis Insight。这能帮助我们了解功能使用情况并持续优化应用。启用后，即表示你同意我们的 ',
    privacyPolicy: '隐私政策',
  },
  dateTime: {
    title: '日期和时间格式',
    dateSummary: '指定 Redis Insight 使用的日期和时间格式：',
    timezoneSummary: '指定 Redis Insight 使用的时区：',
    preview: '预览：',
    preselectedFormats: '预设格式',
    custom: '自定义',
    invalidFormat: '无效格式',
    unsupportedFormat: '不支持此格式。',
    formatTooLong: '格式不能超过 50 个字符',
    save: '保存',
  },
  workbenchSettings: {
    editorCleanup: '编辑器清理',
    clearEditor: '运行命令后清空编辑器',
    pipelineMode: 'Pipeline 模式',
    pipelineSummaryPrefix: '设置 Workbench 中 ',
    pipelineLink: 'pipeline',
    pipelineSummarySuffix:
      ' 模式的命令批处理大小。0 或 1 表示每条命令单独执行。',
    commandsInPipeline: 'Pipeline 中的命令数：',
  },
  advancedSettings: {
    keysToScanTitle: '列表视图扫描键数量',
    keysToScanSummary:
      '设置每次迭代扫描的键数量。对大量键按模式筛选可能会降低性能。',
    keysToScanLabel: '每次扫描的键数量：',
  },
  consentOverrides: {
    analytics: {
      label: '使用数据',
      description:
        '分享匿名使用数据以帮助改进 Redis Insight。这能帮助我们了解功能使用情况并持续优化应用。启用后，即表示你同意我们的 ',
    },
    notifications: {
      label: '显示通知',
      description: '选择后会显示通知。否则，通知会显示在通知中心。',
    },
  },
} as const
