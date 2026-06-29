# Summary of previous conversation
Previous conversation logs are offloaded to dialog/YYYY-MM-DD.jsonl (or nearby date files).
Here is the summary:
## 目标
构建并运行完整的 **SPROUTHR** Next.js 应用程序——一个职业机会平台（工作、实习、奖学金等），包含 CV 商店和仪表板。规范来自用户上传的 `note.md`。

## 约束和偏好
- 使用 Next.js（App Router），部署位置 `F:\Double X`
- 必须逐步构建：每步 `npm install` 并调试，确保无错误
- 移除所有 Docker 相关文件
- 系统无法使用原生二进制（SWC、Turbopack、lightningcss），必须回退到 WASM/Webpack
- 最终用户通过 `npm run dev` 运行，且 CSS 正确加载

## 进展
### 已完成
- [x] 在 `F:\Double X\sprouthr` 创建 Next.js 项目（`create-next-app`）
- [x] 安装 Tailwind CSS v3、PostCSS、autoprefixer（替代 v4，避免 lightningcss 二进制缺失）
- [x] 配置 `next.config.ts` 使用 Webpack，`postcss.config.mjs` 使用 tailwindcss，`tailwind.config.js` 指向 `./src/**/*`
- [x] 创建数据层：`opportunities.ts`（32 条）、`companies.ts`、`cvstore.ts`、`index.ts`
- [x] 创建工具函数 (`utils.ts`) 和全局状态管理 (`AppContext.tsx`)
- [x] 创建共享组件：Navbar、Footer、ToastContainer、BackToTop
- [x] 创建所有页面：首页 (`/`)、浏览 (`/browse`)、CV 商店 (`/cv-store`)、CV 构建器 (`/cv-builder`)、用户仪表盘 (`/dashboard`)、雇主面板 (`/employer`)、管理员 (`/admin`)、机会详情 (`/opportunity/[id]`)
- [x] 更新布局 (`layout.tsx`, `ClientLayout.tsx`) 包含字体 (Google Fonts) 和 FontAwesome CDN
- [x] 成功构建（`next build --webpack`），9 条路由全部编译
- [x] 修复 CSS 加载：移除 Tailwind v4 & lightningcss，安装 v3，更新全局样式
- [x] 更新 `package.json` 脚本内嵌 `--webpack` 标志
- [x] 更新 Navbar 使用 `next/link` 组件形式，添加 Admin / CV Builder 导航链接
- [x] CV Store 页面添加 Free CV Builder 入口横幅
- [x] Dashboard 页面添加 "Build CV" 按钮
- [x] 所有 9 条路由在 `npm run dev --webpack` 下返回 HTTP 200
- [x] 扩展机会数据至 32 条
- [x] 构建 CV Builder 交互向导（6 步骤：个人信息、摘要、教育、经历、技能、项目，附带实时预览）
- [x] 构建 Admin Dashboard（概览/机会管理/公司管理/报告审核）

### 进行中
- [ ] 搜索查询参数支持（URL 同步）
- [ ] 最终视觉/功能测试

## 关键决策
- **使用 Next.js 代替单文件 HTML**: 用户明确要求 "use nextJS"
- **切换到 Tailwind v3**: v4 需要 `lightningcss` 原生二进制，系统缺失；v3 不依赖该包
- **使用 Webpack 代替 Turbopack**: Turbopack 原生二进制不可用，WASM 回退不支持 Turbopack
- **将所有样式内联在 Tailwind 类中**: 组件广泛使用 Tailwind 实用类，自定义 CSS 放在 `globals.css`

## 运行方法
```bash
cd F:\Double X\sprouthr
npm run dev
# 浏览器打开 http://localhost:3000
```

## 页面路由
| 路由 | 描述 |
|------|------|
| `/` | 首页（Hero + 精选机会 + 步骤引导） |
| `/browse` | 浏览所有机会（分类筛选 + 搜索） |
| `/opportunity/[id]` | 机会详情（申请按钮） |
| `/cv-store` | CV 商店（Revamp/Templates/Cover Letter 等） |
| `/cv-builder` | CV 构建器（6 步交互向导 + 实时预览） |
| `/dashboard` | 用户仪表盘（概览/申请/收藏/CV/设置） |
| `/employer` | 雇主面板（发布机会/套餐） |
| `/admin` | 管理员面板（平台管理/审核/报表） |

## 关键上下文
- **项目路径**: `F:\Double X\sprouthr`
- **规范文件**: `C:\Users\Black\.qwenpaw\workspaces\QwenPaw_QA_Agent_0.2\media\ba633f51723543889f92fe1d7f61d83e_note.md`
- **运行命令**: `cd F:\Double X\sprouthr && npm run dev` (会自动使用 `--webpack`)
- **已知警告**: `@next/swc-win32-x64-msvc` 二进制无效，但 Next.js 自动回退到 WASM，功能不受影响
- **设计系统**: 深色背景 (`#0a0a0f`)、绿色强调色 (`#22c55e`)、字体 Space Grotesk + DM Sans，图标使用 FontAwesome 6.5
