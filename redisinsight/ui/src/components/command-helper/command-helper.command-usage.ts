import { ICommandArg } from 'uiSrc/constants'

export interface CommandUsageItem {
  name: string
  description: string
}

type CommandHelperArg = ICommandArg & {
  display_text?: string | string[]
  token?: string | string[]
  arguments?: CommandHelperArg[]
}

const tokenDescriptions: Record<string, string> = {
  key: '键名。',
  source: '源键名。',
  destination: '目标键名。',
  destkey: '目标键名。',
  value: '要写入或比较的值。',
  member: '成员名称。',
  element: '列表或集合元素。',
  field: '字段名称。',
  count: '数量限制。',
  consumer: '消费者名称。',
  group: '消费组名称。',
  id: '消息 ID 或起始 ID。',
  stream: 'Stream 键名。',
  milliseconds: '等待时间，单位为毫秒。',
  timeout: '超时时间。',
  longitude: '经度。',
  latitude: '纬度。',
  radius: '半径。',
  width: '矩形宽度。',
  height: '矩形高度。',
  unit: '距离单位，例如 m、km、ft 或 mi。',
  pattern: '匹配模式。',
  match: '匹配模式。',
  cursor: '游标位置。',
  score: '有序集合分数。',
  increment: '递增值。',
  seconds: '过期时间，单位为秒。',
  offset: '偏移量。',
  start: '起始位置或最小值。',
  stop: '结束位置。',
  min: '最小值。',
  max: '最大值。',
  rank: '排名位置。',
  type: '键或客户端类型。',
  db: '数据库索引。',
  channel: '频道名称。',
  message: '发布或传递的消息内容。',
  username: '用户名。',
  password: '密码。',
  slot: 'Cluster 哈希槽编号。',
  'node-id': 'Cluster 节点 ID。',
  encoding: '位域编码格式。',
  bit: '位值，只能是 0 或 1。',
  ip: 'IP 地址。',
  port: '端口号。',
  host: '主机名或地址。',
  rule: 'ACL 规则，例如启用状态、密码、键模式或命令权限。',
  parameter: '配置参数名称。',
  numkeys: '脚本或函数后面传入的键数量。',
  script: '要执行的 Lua 脚本文本。',
  sha1: '已缓存脚本的 SHA1 摘要。',
  query: '搜索查询表达式。',
  index: '索引名称或位置，具体含义取决于命令。',
  path: 'JSON 路径，例如 $ 表示根路径。',
  schema: '索引字段结构定义。',
  prefix: '文档键名前缀。',
  item: '要添加、删除或查询的元素。',
  items: '一个或多个元素。',
  capacity: '预估容量。',
  error_rate: '允许的误判率。',
  probability: '概率值。',
  timestamp: '时间戳；* 通常表示使用服务器当前时间。',
  retention: '数据保留时间，单位通常为毫秒。',
  label: '标签名称。',
  labels: '标签键值对。',
  sample: '时间序列样本值。',
  quantile: '分位数，例如 0.95。',
  compression: '压缩精度参数。',
  depth: '深度参数。',
  k: 'Top-K 保留的热点数量。',
  vector: '向量二进制值或向量参数。',
  function: '函数名称。',
  'library-name': '函数库名称。',
  library: '函数库名称或函数库代码。',
  replace: '替换已有内容。',
  get: '返回修改前的旧值。',
  nx: '仅在目标不存在时执行。',
  xx: '仅在目标已存在时执行。',
  limit: '返回结果的偏移量和数量限制。',
  sortby: '排序字段。',
  order: '排序方向。',
  payload: '附加负载数据。',
  language: '语言或分词器设置。',
  dialect: 'RediSearch 查询方言版本。',
  reducer: '聚合函数。',
  expression: '表达式内容。',
  clientid: '客户端 ID。',
  'client-id': '客户端 ID。',
  addr: '客户端地址。',
  laddr: '本地监听地址。',
  libname: '函数库名称。',
  name: '名称。',
  mode: '运行模式或选项模式。',
  category: 'ACL 分类名称。',
  command: 'Redis 命令名称。',
  subcommand: '子命令名称。',
  node: 'Cluster 节点。',
  epoch: 'Cluster 配置纪元。',
  bus_port: 'Cluster 总线端口。',
  replicas: '副本数量。',
  master: '主节点 ID。',
  replica: '副本节点 ID。',
  option: '命令选项。',
  keyword: 'Redis 关键字。',
}

const commandUsageOverrides: Record<string, CommandUsageItem[]> = {
  BITCOUNT: [
    { name: 'key', description: '保存位图数据的字符串键名。' },
    {
      name: 'start end',
      description: '可选范围。默认按字节偏移；指定 BIT 时按位偏移。',
    },
    {
      name: 'BYTE | BIT',
      description: '指定 start/end 使用字节偏移还是位偏移。',
    },
  ],
  BITFIELD: [
    { name: 'key', description: '保存位图或二进制字符串的键名。' },
    {
      name: 'GET encoding offset',
      description: '读取指定编码和偏移量上的整数位域。',
    },
    {
      name: 'SET encoding offset value',
      description: '设置指定编码和偏移量上的整数位域。',
    },
    {
      name: 'INCRBY encoding offset increment',
      description: '对指定整数位域递增或递减。',
    },
    {
      name: 'OVERFLOW WRAP | SAT | FAIL',
      description: '设置写入或递增溢出时的处理方式。',
    },
    {
      name: 'encoding',
      description:
        '位域整数编码，例如 u8 表示 8 位无符号整数，i16 表示 16 位有符号整数。',
    },
    {
      name: 'offset',
      description: '位偏移量；也可使用 #N 表示第 N 个同宽度位域。',
    },
  ],
  BITFIELD_RO: [
    { name: 'key', description: '保存位图或二进制字符串的键名。' },
    {
      name: 'GET encoding offset',
      description: '以只读方式读取指定编码和偏移量上的整数位域。',
    },
    {
      name: 'encoding',
      description:
        '位域整数编码，例如 u8 表示 8 位无符号整数，i16 表示 16 位有符号整数。',
    },
    {
      name: 'offset',
      description: '位偏移量；也可使用 #N 表示第 N 个同宽度位域。',
    },
  ],
  BITOP: [
    { name: 'AND | OR | XOR | NOT', description: '要执行的按位运算。' },
    { name: 'destkey', description: '保存运算结果的目标键名。' },
    { name: 'key', description: '参与运算的一个或多个源键名。' },
  ],
  BITPOS: [
    { name: 'key', description: '保存位图数据的字符串键名。' },
    { name: 'bit', description: '要查找的位值，只能是 0 或 1。' },
    {
      name: 'start end',
      description: '可选搜索范围。默认按字节偏移；指定 BIT 时按位偏移。',
    },
    {
      name: 'BYTE | BIT',
      description: '指定 start/end 使用字节偏移还是位偏移。',
    },
  ],
  GETBIT: [
    { name: 'key', description: '保存位图数据的字符串键名。' },
    { name: 'offset', description: '从 0 开始的位偏移量。' },
  ],
  SETBIT: [
    {
      name: 'key',
      description: '保存位图数据的字符串键名；不存在时会自动创建。',
    },
    { name: 'offset', description: '从 0 开始的位偏移量。' },
    { name: 'value', description: '要设置的位值，只能是 0 或 1。' },
  ],
  XREADGROUP: [
    { name: 'group', description: '消费组名称。' },
    {
      name: 'consumer',
      description: '消费者名称；如果不存在，读取时会自动创建。',
    },
    { name: 'COUNT count', description: '本次读取的最大消息数量。' },
    {
      name: 'BLOCK milliseconds',
      description: '没有消息时最长等待时间，单位为毫秒。',
    },
    { name: 'NOACK', description: '读取后自动确认，不进入待确认列表。' },
    { name: 'STREAMS key', description: '要读取的 Stream 键名。' },
    {
      name: 'ID',
      description:
        '`>` 表示读取从未投递的新消息；其他 ID 表示从待确认列表读取历史消息。',
    },
  ],
  XGROUP: [{ name: '子命令', description: '管理 Stream 消费组。' }],
  XACK: [
    { name: 'key', description: 'Stream 键名。' },
    { name: 'group', description: '消费组名称。' },
    { name: 'ID', description: '要确认已处理的消息 ID。' },
  ],
  XPENDING: [
    { name: 'key', description: 'Stream 键名。' },
    { name: 'group', description: '消费组名称。' },
    {
      name: 'IDLE min-idle-time',
      description: '只查看空闲时间达到条件的消息。',
    },
    { name: 'start end count', description: '按 ID 范围和数量限制查询。' },
    { name: 'consumer', description: '只查看指定消费者的待确认消息。' },
  ],
  GEOSEARCH: [
    { name: 'key', description: '地理空间索引键名。' },
    {
      name: 'FROMMEMBER member',
      description: '以已有成员的位置作为查询中心。',
    },
    {
      name: 'FROMLONLAT longitude latitude',
      description: '以指定经纬度作为查询中心。',
    },
    { name: 'BYRADIUS radius unit', description: '按圆形半径查询。' },
    { name: 'BYBOX width height unit', description: '按矩形范围查询。' },
    { name: 'ASC | DESC', description: '按距离升序或降序返回。' },
    {
      name: 'COUNT count [ANY]',
      description: '限制返回数量；ANY 允许提前返回。',
    },
    { name: 'WITHCOORD', description: '返回成员坐标。' },
    { name: 'WITHDIST', description: '返回成员与中心点的距离。' },
    { name: 'WITHHASH', description: '返回成员的 Geohash 整数值。' },
  ],
  GEOADD: [
    { name: 'key', description: '地理空间索引键名。' },
    { name: 'NX | XX', description: '只添加新成员，或只更新已有成员。' },
    { name: 'CH', description: '返回新增和更新的成员数量。' },
    {
      name: 'longitude latitude member',
      description: '成员的经度、纬度和名称，可一次添加多个。',
    },
  ],
  SET: [
    { name: 'key', description: '键名。' },
    { name: 'value', description: '要保存的字符串值。' },
    { name: 'NX | XX', description: '仅在键不存在或已存在时设置。' },
    { name: 'GET', description: '返回设置前的旧值。' },
    {
      name: 'EX | PX | EXAT | PXAT | KEEPTTL',
      description: '设置或保留过期时间。',
    },
  ],
  HSET: [
    { name: 'key', description: '哈希键名。' },
    { name: 'field value', description: '字段和值，可一次设置多组。' },
  ],
  ZADD: [
    { name: 'key', description: '有序集合键名。' },
    {
      name: 'score member',
      description: '成员分数和成员名称，可一次添加多组。',
    },
    { name: 'NX | XX', description: '只添加新成员，或只更新已有成员。' },
    { name: 'GT | LT', description: '只在新分数大于或小于当前分数时更新。' },
    { name: 'CH', description: '返回新增和更新的成员数量。' },
    { name: 'INCR', description: '对成员分数执行递增操作。' },
  ],
  SCAN: [
    { name: 'cursor', description: '本次扫描的游标，首次使用 0。' },
    { name: 'MATCH pattern', description: '只返回匹配模式的键。' },
    { name: 'COUNT count', description: '本次扫描期望返回的元素数量。' },
    { name: 'TYPE type', description: '只返回指定类型的键。' },
  ],
}

const normalize = (value?: string | string[]) =>
  Array.isArray(value) ? value.join(' ') : value || ''

const itemName = (arg: CommandHelperArg): string => {
  const name = normalize(arg.display_text || arg.name)
  const token = normalize(arg.token)
  return [token, name].filter(Boolean).join(' ')
}

const readableName = (arg: CommandHelperArg): string =>
  itemName(arg) ||
  normalize(arg.display_text || arg.name || arg.token) ||
  normalize(arg.type as string | string[]) ||
  'argument'

const findDescription = (name: string): string | undefined => {
  const normalized = name.toLowerCase().replace(/[\[\]]/g, '')
  const parts = normalized.split(/\s+|\|/).filter(Boolean)
  const exact = tokenDescriptions[normalized]
  if (exact) return exact

  const matched = parts.find((part) => tokenDescriptions[part])
  return matched ? tokenDescriptions[matched] : undefined
}

const fallbackDescription = (arg: CommandHelperArg): string => {
  const type = normalize(arg.type as string | string[]).toLowerCase()
  const name = readableName(arg).toLowerCase()

  if (type === 'key') return '键名。'
  if (type === 'integer') return '整数参数。'
  if (type === 'double') return '数值参数。'
  if (type === 'pattern') return '匹配模式。'
  if (type === 'pure-token') return 'Redis 关键字，按语法原样填写。'
  if (type === 'oneof') return '可选分支之一，按实际场景选择。'
  if (type === 'block') return '一组按固定顺序填写的参数。'
  if (type === 'enum') return '枚举选项，按命令允许的值填写。'
  if (name.includes('password')) return '密码或密码规则。'
  if (name.includes('user')) return '用户名或用户相关参数。'
  if (name.includes('field')) return '字段名称。'
  if (name.includes('value')) return '参数值。'
  if (name.includes('count') || name.includes('num')) return '数量参数。'
  if (name.includes('time')) return '时间或超时参数。'
  if (name.includes('id')) return 'ID 标识。'
  if (name.includes('slot')) return 'Cluster 哈希槽编号。'
  if (name.includes('node')) return 'Cluster 节点 ID 或节点信息。'
  if (name.includes('index')) return '索引名称或位置。'
  if (name.includes('query')) return '查询表达式。'
  if (name.includes('path')) return '路径参数。'
  return '按命令语法填写的参数。'
}

const collectUsageItems = (args: ICommandArg[] = []): CommandUsageItem[] =>
  args.flatMap((arg) => {
    const helperArg = arg as CommandHelperArg
    const nested = collectUsageItems(
      (helperArg.arguments || (helperArg as any).block || []) as ICommandArg[],
    )
    const name = readableName(helperArg)
    const description = findDescription(name) || fallbackDescription(helperArg)
    const current = name ? [{ name, description }] : []
    return [...current, ...nested]
  })

export const getCommandHelperUsage = (
  commandName: string,
  args: ICommandArg[] = [],
): CommandUsageItem[] => {
  const commandKey = commandName.toUpperCase()
  const usage = commandUsageOverrides[commandKey] || collectUsageItems(args)
  const seen = new Set<string>()

  return usage.filter(({ name }) => {
    const key = name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
