# Redis Insight 中文化维护与打包说明

这份文档给以后接手的 AI 或维护者使用。目标是：官方 RedisInsight 升级后，保留官方源码，重新套用中文化修改，验证 Command Helper 和 GEOSEARCH，再由用户验收后打 Windows 安装包。

## 当前仓库约定

- 源码目录：`F:\RedisInsight`
- 官方源码必须保留，不要直接在 `main` 上改中文化。
- 当前中文化分支：`codex/chinese-ui`
- 已保留的官方基线分支：`official/main-baseline-3.4.2`
- 打包必须等用户页面验收通过后再执行。

## 中文化修改位置

优先维护这些集中标签文件，避免到处散落硬编码：

- `redisinsight/ui/src/components/navigation-menu/navigation.labels.ts`
- `redisinsight/ui/src/pages/home/home.labels.ts`
- `redisinsight/ui/src/components/command-helper/command-helper.labels.ts`
- `redisinsight/ui/src/components/command-helper/command-helper.command-descriptions.ts`
- `redisinsight/ui/src/components/query/query.labels.ts`
- `redisinsight/ui/src/pages/workbench/workbench.labels.ts`

Command Helper 的命令说明采用“中文覆盖表”方式：

- 文件：`redisinsight/ui/src/components/command-helper/command-helper.command-descriptions.ts`
- 函数：`getCommandHelperSummary(commandName, fallbackSummary)`
- 原则：命中中文表就显示中文；没有翻译到的命令继续显示官方英文。
- 不要直接翻译 Redis 命令名、参数名、Redis 关键字，例如 `GEOSEARCH`、`FROMMEMBER`、`BYBOX`、`key`、`member`、`longitude`。

## Command Helper / GEOSEARCH 数据

如果 Command Helper 搜不到 `GEOSEARCH`、`GET`、`SET` 等核心命令，先检查 API 默认命令文件是否存在：

- `redisinsight/api/defaults/commands/main.json`
- `redisinsight/api/defaults/commands/redisbloom.json`
- `redisinsight/api/defaults/commands/redisearch.json`
- `redisinsight/api/defaults/commands/redisgears.json`
- `redisinsight/api/defaults/commands/redisjson.json`
- `redisinsight/api/defaults/commands/redistimeseries.json`

验证 API 是否包含 `GEOSEARCH`：

```powershell
cd F:\RedisInsight
$data = Invoke-RestMethod 'http://localhost:5540/api/commands' -TimeoutSec 30
$names = $data.PSObject.Properties.Name
"Total=$($names.Count)"
"Has_GEOSEARCH=$($names -contains 'GEOSEARCH')"
"GEOSEARCH=$($data.GEOSEARCH.summary)"
```

期望至少看到：

```text
Has_GEOSEARCH=True
```

## 官方升级时的建议流程

1. 确认当前修改已保存到中文化分支，或先备份：

```powershell
cd F:\RedisInsight
git status --short
git branch --show-current
git branch backup/chinese-ui-before-upgrade-YYYYMMDD
```

2. 获取官方更新：

```powershell
git fetch origin --tags
```

3. 选择官方稳定版本。优先使用 GitHub Release/tag；如果用户明确要跟随最新源码，再使用 `origin/main`。

```powershell
git tag --sort=-v:refname | Select-Object -First 20
```

4. 从新的官方版本创建新的中文化分支。示例：

```powershell
git switch main
git pull --ff-only origin main
git switch -c codex/chinese-ui-NEW_VERSION
```

如果要基于某个 tag：

```powershell
git switch -c codex/chinese-ui-NEW_VERSION TAG_NAME
```

5. 重新套用中文化。优先参考旧分支的这些文件和改动，而不是盲目覆盖新版本：

```powershell
git diff official/main-baseline-3.4.2..codex/chinese-ui -- redisinsight/ui/src/components/command-helper
git diff official/main-baseline-3.4.2..codex/chinese-ui -- redisinsight/ui/src/components/navigation-menu
git diff official/main-baseline-3.4.2..codex/chinese-ui -- redisinsight/ui/src/pages/home
git diff official/main-baseline-3.4.2..codex/chinese-ui -- redisinsight/ui/src/components/query
git diff official/main-baseline-3.4.2..codex/chinese-ui -- redisinsight/ui/src/pages/workbench
```

如果新版本文件结构变化，按新结构重新接入标签文件，不要强行覆盖整文件。

6. 更新官方基线分支，方便下次比较：

```powershell
git branch official/main-baseline-NEW_VERSION
```

## 本机依赖与安装

本机当前使用：

- Node：`D:\develop\node-current\node.exe`
- Yarn：`D:\develop\node-current\yarn.CMD`

安装依赖：

```powershell
cd F:\RedisInsight
& 'D:\develop\node-current\yarn.CMD' install
```

如果 native 模块安装失败，当前曾经用过的手动预编译包在：

- `D:\develop\better-sqlite3-v12.8.0-node-v127-win32-x64.tar.gz`
- `D:\develop\keytar-v7.9.0-napi-v3-win32-x64.tar.gz`

修复后可执行：

```powershell
cd F:\RedisInsight
npm rebuild better-sqlite3 keytar
& 'D:\develop\node-current\yarn.CMD' generate:api-client
```

## 开发启动

通常需要同时启动 API 和 UI。当前开发验证使用：

- UI：`http://localhost:8080/`
- API：`http://localhost:5540/`

命令：

```powershell
cd F:\RedisInsight
& 'D:\develop\node-current\yarn.CMD' dev:electron:api
& 'D:\develop\node-current\yarn.CMD' dev:electron:ui
```

也可以尝试一次性启动桌面开发模式：

```powershell
cd F:\RedisInsight
& 'D:\develop\node-current\yarn.CMD' dev:desktop
```

## 验证清单

打包前至少验证：

1. 页面能打开：`http://localhost:8080/`
2. 左侧导航、首页添加数据库、Workbench 主要按钮显示中文。
3. Command Helper：
   - 标题显示 `命令助手`
   - 搜索框显示 `搜索命令`
   - 参数区显示 `参数：`、`必填`、`可选`、`多个`
   - 搜索 `GEOSEARCH` 能出现命令
   - `GEOSEARCH` 说明显示中文或至少命令存在
4. API 命令列表包含 `GEOSEARCH`。

建议运行的测试：

```powershell
cd F:\RedisInsight
& 'F:\RedisInsight\node_modules\.bin\jest.cmd' `
  'redisinsight/ui/src/components/command-helper/CommandHelper/CommandHelper.spec.tsx' `
  'redisinsight/ui/src/components/command-helper/CommandHelperWrapper.spec.tsx' `
  'redisinsight/ui/src/components/query/query-actions/QueryActions.spec.tsx' `
  'redisinsight/ui/src/components/query/query-results/QueryResults.spec.tsx' `
  'redisinsight/ui/src/pages/workbench/components/wb-no-results-message/WbNoResultsMessage.spec.tsx' `
  -c 'jest.config.cjs' --runInBand
git diff --check
```

Jest 可能提示 `redisinsight/api/dist` 和源码 mock 重名，这是现有构建产物导致的警告；只要测试最终通过即可。

## 打包 Windows 应用

只有用户确认页面效果后，才执行打包。

建议先关闭开发服务器，避免端口占用或旧进程干扰。

Windows x64 打包命令：

```powershell
cd F:\RedisInsight
& 'D:\develop\node-current\yarn.CMD' package:win
```

该命令等价于：

```text
yarn build:prod && electron-builder build --win --x64 -p never
```

打包产物通常在项目的 `dist` 或 `redisinsight/dist` 相关输出目录中，具体以 electron-builder 输出为准。打包完成后，把最终安装包路径告诉用户。

## 给未来 AI 的注意事项

- 不要直接修改 `main`。
- 不要删除官方基线分支。
- 不要在用户验收前打包。
- 不要翻译 Redis 命令语法本身，只翻译界面标签和解释性说明。
- 官方升级时，先理解新版本文件结构，再迁移中文化；不要用旧文件覆盖新文件。
- 如果 Command Helper 缺命令，优先检查 API 默认命令 JSON，而不是只改前端自动补全。
