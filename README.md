# uni-app-hbuild-start

基于 **uni-app（Vue 3）** 的应用脚手架：集成 **Tailwind CSS v4**、**Wot Design Uni**、**Pinia**、**TanStack Vue Query**、**自定义路由守卫**、**明暗主题**与 **小程序友好的 Wot 主题生成**。适用于 H5、小程序与 App 多端起步开发。

---

## 功能概览

| 模块 | 说明 |
|------|------|
| **路由与登录** | 基于 `pages.json` 的路由封装（`router/`）：`push` / `switchTab` / `login` / `nextLogin`；全局 `beforeEach`：除登录页外需有效 token，否则跳转登录。 |
| **启动与分流** | **启动页**（`pages/splash`）根据本地 token：无则 `reLaunch` 登录，有则进入首页 Tab。 |
| **页面容器** | **`container-paging`**：基于 **z-paging** 的页面外壳，可选标题栏、自定义导航、列表分页、`needAuth` 等与反馈层联动。 |
| **主题** | **`ThemeProvider`**：根节点挂载 `light` / `dark`（Pinia `themeStore`，持久化 storage）与 **`cover-wd`**；Tailwind 语义色与 Wot `--wot-*` 对齐；首页提供明暗切换浮钮示例。 |
| **Wot 小程序主题** | 构建脚本将 `tailwind.css` 中的 oklch 语义色展开为 **hex/rgba**，写入 `styles/cover.css` 生成区（见下文「主题生成」）。 |
| **组件库** | **Wot Design Uni**（`easycom` 按需 `wd-*`）；全局 Toast / Dialog 等反馈组件（`feedback-provider`）。 |
| **网络** | **@uni-helper/uni-network** 封装实例（`service/`），含拦截器；示例接口请求二次元图片（`getSingleImg`）配合 Vue Query 演示。 |
| **数据与状态** | **Pinia**：用户 token / 信息与主题；**Vue Query**：列表与接口缓存、焦点与在线状态与 App 生命周期联动（`App.vue`）。 |
| **国际化** | **vue-i18n**（`i18n/`），入口挂载 `$t`。 |
| **样式** | **Tailwind v4**（`tailwind.css`、`@theme inline`）；**weapp-tailwindcss** 适配小程序；**Iconify** 图标（如 `icon-[akar-icons--moon]`）。**`@theme inline`** 已将 **`--wot-*`** 注册为颜色令牌（如 `bg-wot-primary-6`、`text-wot-text-main`），需在带 **`cover-wd`** 与明暗类的祖先下才有具体颜色。 |
| **TabBar** | **自定义 TabBar**（`tabBar.custom: true`，高度配置为 0，由 **`q-tabbar`** 等组件承接）。 |
| **动画示例** | 首页使用 **popmotion** 弹簧动画演示。 |

---

## 技术栈

- **框架**：Vue 3、uni-app（`@dcloudio/uni-app`）
- **构建**：Vite 5、`@tailwindcss/postcss`、`weapp-tailwindcss`
- **UI**：`@wot-ui/ui`、`uni_modules/z-paging`
- **状态**：Pinia
- **请求**：`@uni-helper/uni-network`、`@tanstack/vue-query`
- **工具**：lodash-es、dayjs、bignumber.js、popmotion 等

---

## 页面结构

| 路由 | 作用 |
|------|------|
| `pages/splash/index` | 启动分流：token → 首页 Tab；否则登录 |
| `pages/index/index` | 首页（Tab）：Vue Query 示例、Wot 按钮、主题切换、动画 |
| `pages/login/index` | 登录：Wot Form 校验；演示写入测试 token 后 `nextLogin` |
| `pages/my/index` | 我的（Tab）：占位页 |

`pages.json` 中为 **自定义导航栏**（`navigationStyle: custom`），标题由容器组件承担。

---

## 目录说明（摘要）

```
├── App.vue                 # 生命周期与网络状态、Vue Query 焦点
├── main.ts                 # 入口：Pinia、i18n、Vue Query、tailwind / cover 样式
├── tailwind.css            # Tailwind 入口：主题变量、@theme、工具类
├── pages.json              # 页面与 TabBar、Wot easycom
├── router/                 # 路由封装与登录守卫
├── store/                  # theme、user 等 Pinia 仓库
├── service/                # 网络实例与 API 模块
├── components/             # container-paging、theme-provider、tabbar、反馈等
├── scripts/                # generate-wot-cover-from-tailwind.mjs（主题生成）
├── styles/cover.css        # Wot 变量（脚本生成区）
└── i18n/                   # 国际化配置
```

---

## Wot 主题生成（小程序安全色）

Tailwind 语义色写在 **`tailwind.css`** 的 `.light` / `.dark` 中（`oklch(...)`）。微信小程序等对 **`color-mix`、`oklch()`** 支持不完整，因此 Wot 所需的 **`--wot-*`** 由脚本预先展开为 **`#RRGGBB` / `rgba()`**，写入 **`styles/cover.css`** 的标记区域内。

### 修改主题后如何更新

1. 编辑 **`tailwind.css`** 里 `.light`、`.dark` 下的变量（如 `--primary`、`--destructive`、`--background` 等）。
2. 在项目根目录执行：

   ```bash
   npm run generate:cover
   ```

3. 请勿手改 **`styles/cover.css`** 中下列注释之间的生成内容：

   - `/* BEGIN GENERATED WOT COVER */`
   - `/* END GENERATED WOT COVER */`

### 生成逻辑说明

- 脚本：**`scripts/generate-wot-cover-from-tailwind.mjs`**
- 读取 **`tailwind.css`**（若不存在则尝试 **`styles/tailwind.css`**），解析 `.light` / `.dark` 中的 oklch，换算为 sRGB 十六进制并插值，生成浅色 / 深色两套选择器（如 `.light.cover-wd`、`.dark.cover-wd` 及 portal 相关选择器）。
- 成功色 / 警告色 / 分类标签等辅助色在脚本内 **`ACCENT`** 常量中维护；调整绿 / 橙 / 标签色请改脚本后重新执行 **`npm run generate:cover`**。

### 与运行时主题的关系

根组件（如 **`ThemeProvider`**）需同时带有 **`light` 或 `dark`** 与 **`cover-wd`**，生成的 CSS 才能命中对应变量表。

### 构建时自动生成

生产 **`vite build`** 时，`vite.config.ts` 中的插件会在打包前执行一次生成逻辑，与手动执行 **`npm run generate:cover`** 一致。日常开发改完 `tailwind.css` 后，建议在本地执行一次 **`generate:cover`**，以便立即看到 `cover.css` 更新。

---

## 开发与构建

- 安装依赖：`npm install`
- 生成 Wot 覆盖样式：`npm run generate:cover`
- 具体运行 / 发行命令以 **HBuilderX** 或 **uni-app 官方 CLI** 项目配置为准（本仓库为典型 Vite + uni-app 结构）。

---

## 备注

- **登录与 token**：当前登录流程为演示（写入固定测试 token）；接入真实接口时需替换 `pages/login` 与 `store/user` 中的逻辑。
- **推送**：`App.vue` 内预留 **5+ App** `plus.push` 监听示例，按业务自行启用与配置。
- **接口地址**：`service/index.ts` 中 `getBaseUrl()` 等为示例环境，上线前请改为正式域名与鉴权策略。
