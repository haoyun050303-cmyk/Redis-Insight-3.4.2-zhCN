import { ICommandArg } from 'uiSrc/constants'

export interface CommandExampleItem {
  description: string
  command: string
}

type CommandHelperArg = ICommandArg & {
  display_text?: string | string[]
  token?: string | string[]
  arguments?: CommandHelperArg[]
}

const manualExamples: Record<string, CommandExampleItem[]> = {
  GET: [{ description: '读取字符串键的值。', command: 'GET key:1' }],
  SET: [
    {
      description: '设置字符串值，并在 60 秒后过期。',
      command: 'SET key:1 value1 EX 60',
    },
  ],
  DEL: [{ description: '删除一个或多个键。', command: 'DEL key:1 key:2' }],
  EXPIRE: [
    {
      description: '给键设置 60 秒过期时间。',
      command: 'EXPIRE key:1 60',
    },
  ],
  BITCOUNT: [
    {
      description: '统计整个位图中值为 1 的位数量。',
      command: 'BITCOUNT bitmap:visits',
    },
    {
      description: '按位偏移统计指定范围内值为 1 的位数量。',
      command: 'BITCOUNT bitmap:visits 0 15 BIT',
    },
  ],
  BITFIELD: [
    {
      description: '写入 8 位无符号整数，然后读取同一位域。',
      command: 'BITFIELD bitmap:visits SET u8 0 12 GET u8 0',
    },
    {
      description: '递增位域，并在溢出时截断到最大/最小值。',
      command: 'BITFIELD bitmap:visits OVERFLOW SAT INCRBY u8 0 1',
    },
  ],
  BITFIELD_RO: [
    {
      description: '以只读方式读取 8 位无符号整数位域。',
      command: 'BITFIELD_RO bitmap:visits GET u8 0',
    },
  ],
  BITOP: [
    {
      description: '对两个位图执行 AND 运算，并把结果保存到目标键。',
      command: 'BITOP AND bitmap:both bitmap:user:1 bitmap:user:2',
    },
    {
      description: '对一个位图执行 NOT 运算，并把结果保存到目标键。',
      command: 'BITOP NOT bitmap:not bitmap:user:1',
    },
  ],
  BITPOS: [
    {
      description: '查找第一个值为 1 的位的位置。',
      command: 'BITPOS bitmap:visits 1',
    },
    {
      description: '按位偏移范围查找第一个值为 0 的位。',
      command: 'BITPOS bitmap:visits 0 0 31 BIT',
    },
  ],
  GETBIT: [
    {
      description: '读取指定偏移量上的位值。',
      command: 'GETBIT bitmap:visits 7',
    },
  ],
  SETBIT: [
    {
      description: '把指定偏移量上的位设置为 1。',
      command: 'SETBIT bitmap:visits 7 1',
    },
    {
      description: '把指定偏移量上的位清零。',
      command: 'SETBIT bitmap:visits 7 0',
    },
  ],
  HSET: [
    {
      description: '设置哈希中的一个或多个字段。',
      command: 'HSET user:1 name Alice age 30',
    },
  ],
  HGETALL: [
    {
      description: '读取哈希中的所有字段和值。',
      command: 'HGETALL user:1',
    },
  ],
  LPUSH: [
    {
      description: '从列表头部插入多个元素。',
      command: 'LPUSH queue:1 job1 job2',
    },
  ],
  LRANGE: [
    {
      description: '读取列表中的一段元素。',
      command: 'LRANGE queue:1 0 -1',
    },
  ],
  SADD: [
    {
      description: '向集合添加一个或多个成员。',
      command: 'SADD tags redis cache',
    },
  ],
  SMEMBERS: [
    {
      description: '读取集合中的所有成员。',
      command: 'SMEMBERS tags',
    },
  ],
  ZADD: [
    {
      description: '向有序集合添加成员和分数。',
      command: 'ZADD leaderboard 100 alice 80 bob',
    },
  ],
  ZRANGE: [
    {
      description: '按排名读取有序集合成员，并返回分数。',
      command: 'ZRANGE leaderboard 0 -1 WITHSCORES',
    },
  ],
  SCAN: [
    {
      description: '从游标 0 开始按模式增量扫描键。',
      command: 'SCAN 0 MATCH user:* COUNT 100',
    },
  ],
  GEOADD: [
    {
      description: '向地理空间索引添加一个位置成员。',
      command: 'GEOADD places 116.397128 39.916527 beijing',
    },
  ],
  GEOSEARCH: [
    {
      description: '按经纬度中心和半径查询附近成员。',
      command:
        'GEOSEARCH places FROMLONLAT 116.397128 39.916527 BYRADIUS 5 km WITHDIST',
    },
  ],
  XADD: [
    {
      description: '向 Stream 追加一条消息。',
      command: 'XADD mystream * user alice action login',
    },
  ],
  XREADGROUP: [
    {
      description: '消费组读取未投递的新消息。',
      command: 'XREADGROUP GROUP group1 consumer1 COUNT 2 STREAMS mystream >',
    },
  ],
  XACK: [
    {
      description: '确认消费组中的消息已处理。',
      command: 'XACK mystream group1 1700000000000-0',
    },
  ],
  MULTI: [
    {
      description: '开启事务，后续命令会进入事务队列。',
      command: 'MULTI',
    },
  ],
  EXEC: [
    {
      description: '执行事务队列中的所有命令。',
      command: 'EXEC',
    },
  ],
  EVAL: [
    {
      description: '执行 Lua 脚本，并把 1 个键传给 KEYS[1]。',
      command: 'EVAL "return redis.call(\'GET\', KEYS[1])" 1 key:1',
    },
  ],
  EVALSHA: [
    {
      description: '通过脚本 SHA1 执行已缓存的 Lua 脚本。',
      command: 'EVALSHA sha1 1 key:1',
    },
  ],
  'FT.CREATE': [
    {
      description: '为 user: 前缀的 Hash 文档创建搜索索引。',
      command: 'FT.CREATE idx:users ON HASH PREFIX 1 user: SCHEMA name TEXT',
    },
  ],
  'FT.SEARCH': [
    {
      description: '在搜索索引中查询 name 字段，并限制返回数量。',
      command: 'FT.SEARCH idx:users "@name:Alice" LIMIT 0 10',
    },
  ],
  'JSON.SET': [
    {
      description: '在 JSON 文档根路径写入对象。',
      command: 'JSON.SET doc:1 $ \'{"name":"Alice"}\'',
    },
  ],
  'JSON.GET': [
    {
      description: '读取 JSON 文档根路径内容。',
      command: 'JSON.GET doc:1 $',
    },
  ],
  'TS.CREATE': [
    {
      description: '创建时间序列键，设置保留时间并添加标签。',
      command: 'TS.CREATE temperature:1 RETENTION 86400000 LABELS sensor s1',
    },
  ],
  'TS.ADD': [
    {
      description: '向时间序列追加一个当前时间戳样本。',
      command: 'TS.ADD temperature:1 * 23.5',
    },
  ],
  'BF.RESERVE': [
    {
      description: '创建 Bloom Filter，指定误判率和容量。',
      command: 'BF.RESERVE bf:users 0.01 1000',
    },
  ],
  'BF.ADD': [
    {
      description: '向 Bloom Filter 添加一个元素。',
      command: 'BF.ADD bf:users user:1',
    },
  ],
  'CF.ADD': [
    {
      description: '向 Cuckoo Filter 添加一个元素。',
      command: 'CF.ADD cf:users user:1',
    },
  ],
  'CMS.INITBYDIM': [
    {
      description: '按宽度和深度初始化 Count-Min Sketch。',
      command: 'CMS.INITBYDIM cms:views 2000 5',
    },
  ],
  'CMS.INCRBY': [
    {
      description: '增加 Count-Min Sketch 中元素的计数。',
      command: 'CMS.INCRBY cms:views /home 1 /docs 2',
    },
  ],
  'TOPK.ADD': [
    {
      description: '向 Top-K 结构添加多个元素。',
      command: 'TOPK.ADD topk:pages /home /docs',
    },
  ],
  'TOPK.RESERVE': [
    {
      description: '初始化 Top-K 结构并设置保留的热点数量。',
      command: 'TOPK.RESERVE topk:pages 10 2000 7 0.925',
    },
  ],
  'TDIGEST.ADD': [
    {
      description: '向 t-digest 结构添加多个数值样本。',
      command: 'TDIGEST.ADD tdigest:latency 12 15 20',
    },
  ],
  'TDIGEST.CREATE': [
    {
      description: '创建 t-digest 结构并设置压缩参数。',
      command: 'TDIGEST.CREATE tdigest:latency COMPRESSION 100',
    },
  ],
  'ACL SETUSER': [
    {
      description: '创建或修改 ACL 用户，启用用户并授予只读权限。',
      command: 'ACL SETUSER appuser on >password ~app:* +@read',
    },
  ],
  'CLIENT KILL': [
    {
      description: '按客户端类型关闭普通客户端连接，请谨慎使用。',
      command: 'CLIENT KILL TYPE normal',
    },
  ],
  'CLUSTER SETSLOT': [
    {
      description: '把哈希槽绑定到当前节点配置中的指定节点。',
      command: 'CLUSTER SETSLOT 7000 NODE',
    },
  ],
  'CONFIG GET': [
    {
      description: '读取服务器配置参数。',
      command: 'CONFIG GET maxmemory',
    },
  ],
}

const riskyCommands = new Set([
  'FLUSHALL',
  'FLUSHDB',
  'SHUTDOWN',
  'CONFIG SET',
  'FUNCTION FLUSH',
  'SCRIPT KILL',
])

const normalize = (value?: string | string[]) =>
  Array.isArray(value) ? value.join(' ') : value || ''

const exampleValueByName: Record<string, string> = {
  key: 'key:1',
  source: 'source:key',
  destination: 'destination:key',
  destkey: 'destination:key',
  field: 'field1',
  value: 'value1',
  member: 'member1',
  element: 'element1',
  score: '10',
  increment: '1',
  count: '10',
  cursor: '0',
  pattern: 'user:*',
  match: 'user:*',
  type: 'string',
  query: '"@name:Alice"',
  path: '$',
  script: '"return redis.call(\'GET\', KEYS[1])"',
  numkeys: '1',
  parameter: 'maxmemory',
  library: 'lib',
  'library-name': 'lib',
  function: 'fn',
  index: 'idx:users',
  schema: 'SCHEMA',
  item: 'user:1',
  items: 'user:1',
  capacity: '1000',
  error_rate: '0.01',
  error: '0.01',
  probability: '0.01',
  timestamp: '*',
  retention: '86400000',
  label: 'sensor',
  labels: 'sensor s1',
  sample: '23.5',
  quantile: '0.95',
  compression: '100',
  width: '10',
  depth: '5',
  k: '10',
  probability_decay: '0.925',
  start: '0',
  stop: '-1',
  min: '0',
  max: '100',
  offset: '0',
  seconds: '60',
  milliseconds: '1000',
  timeout: '1000',
  db: '0',
  channel: 'channel1',
  message: 'message1',
  username: 'default',
  password: 'password',
  slot: '0',
  'node-id': 'node-id',
  id: '1700000000000-0',
  group: 'group1',
  consumer: 'consumer1',
  longitude: '116.397128',
  latitude: '39.916527',
  radius: '5',
  unit: 'km',
  encoding: 'i8',
  vector: 'vector_blob',
  sha1: 'sha1',
  rule: '~app:*',
}

const exampleValue = (arg: CommandHelperArg): string => {
  const display = normalize(arg.display_text || arg.name).toLowerCase()
  const token = normalize(arg.token).toLowerCase()
  const type = normalize(arg.type as string | string[]).toLowerCase()
  const key = display || token || type

  if (exampleValueByName[key]) return exampleValueByName[key]
  if (exampleValueByName[display]) return exampleValueByName[display]
  if (exampleValueByName[token]) return exampleValueByName[token]
  if (type === 'key') return 'key:1'
  if (type === 'integer' || type === 'double') return '1'
  if (type === 'pattern') return 'user:*'
  return display || 'value1'
}

const collectExampleArgs = (args: CommandHelperArg[] = []): string[] =>
  args.flatMap((arg) => {
    if (arg.optional) return []

    const token = normalize(arg.token)
    const nested = (arg.arguments ||
      (arg as any).block ||
      []) as CommandHelperArg[]

    if (arg.type === 'pure-token') {
      return token ? [token] : []
    }

    if (arg.type === 'oneof') {
      return collectExampleArgs(nested.slice(0, 1))
    }

    if (arg.type === 'block') {
      return [token, ...collectExampleArgs(nested)].filter(Boolean)
    }

    return [token, exampleValue(arg)].filter(Boolean)
  })

const createGeneratedExample = (
  commandName: string,
  args: ICommandArg[] = [],
): CommandExampleItem[] => {
  const command = commandName.toUpperCase()
  const generatedArgs = collectExampleArgs(args as CommandHelperArg[])
  return [
    {
      description: '基础调用示例，请根据你的键名和数据替换示例值。',
      command: [command, ...generatedArgs].join(' '),
    },
  ]
}

export const getCommandHelperExamples = (
  commandName: string,
  args: ICommandArg[] = [],
): CommandExampleItem[] => {
  const commandKey = commandName.toUpperCase()

  if (riskyCommands.has(commandKey)) {
    return [
      {
        description: '高风险命令，示例请谨慎执行，并避免在生产环境中直接运行。',
        command: commandKey,
      },
    ]
  }

  return manualExamples[commandKey] || createGeneratedExample(commandKey, args)
}
