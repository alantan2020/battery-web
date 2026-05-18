# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

新加坡汽车电瓶营销网站。消费者按车型找电瓶 → WhatsApp 咨询 → 到合作修理厂安装换电。

---

## 项目定位

**用户**：供货商（Amaron 电瓶批发/分销），合作修理厂是他的下游客户。  
**商业逻辑**：消费者在此网站按车型查电瓶规格和价格，通过 WhatsApp 联系，到合作修理厂安装。修理厂销量好则向用户进更多货。

WhatsApp 号码（硬编码在代码中）：`6581525875`

---

## 技术栈

- **框架**：Nuxt 3，`ssr: true`，部署为 SSG（`npm run generate`）
- **样式**：Tailwind CSS
- **部署**：Cloudflare Pages，`npm run generate` → 输出目录 `dist`，NODE_VERSION=20
- **域名**：`battery.sgcarpass.com`

---

## 常用命令

```bash
# 项目根目录（/home/alan/tys/battery-web/）运行
npm run dev       # 开发服务器（默认 3000）
npm run generate  # 静态生成（部署用，输出 dist/）
npm run build     # SSR 构建（本项目不用，部署用 generate）
```

---

## 架构

### 数据层

所有车型数据在 `data/cars.json`，目前无后端 API。每条记录结构：

```json
{
  "slug": "toyota-vios",       // URL 路径 /car/toyota-vios
  "make": "Toyota",
  "model": "Vios",
  "yearFrom": 2007, "yearTo": 2023,
  "batteries": [               // 第一个是推荐型号
    { "type": "Standard|EFB|AGM", "series": "HILIFE|EFB|AGM|PRO DIN",
      "partNo": "60B24L", "equivalent": "46B24L",
      "retailPrice": 120, "cca": 390, "capacityAh": 45 }
  ],
  "batteryNote": "...",        // 可选，重要提示（Start-Stop、BMS 等）
  "faq": [{ "q": "...", "a": "..." }]  // 可选，车型专属 FAQ
}
```

### 页面路由

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `pages/index.vue` | 车型列表，按品牌分组，支持搜索 |
| `/car/[slug]` | `pages/car/[slug].vue` | 车型详情落地页（主要 SEO 页面） |
| `/battery/[id]` | `pages/battery/[id].vue` | 旧版占位页（中文，模拟优惠码），暂未使用 |

### 车型详情页（`/car/[slug].vue`）

这是核心 SEO 页面，包含：
1. 推荐电瓶列表（type 决定显示颜色：Standard/EFB/AGM）
2. 新加坡气候说明 + Start-Stop 警告（type 非 Standard 时显示）
3. FAQ（优先用 `car.faq`，无则用模板自动生成 6 个通用 FAQ）
4. WhatsApp CTA（`ownerWaLink`）+ 修理工反馈入口（`mechanicWaLink`）
5. 同品牌其他车型内链（`sameMakeCars`）
6. Schema.org 结构化数据：BreadcrumbList + FAQPage + Product（含多个 Offer）

### SEO 策略

**按车型做落地页**，不按电瓶型号。新加坡消费者搜索 `"Toyota Harrier battery Singapore"`，不是 `"EFB Q85"`。

`useSeoMeta` 在每个 `/car/[slug]` 页面动态生成 title 和 description，格式：  
`{Make} {Model} Battery Singapore | Amaron {partNo} | SGCarPass Battery`

`nuxt-simple-sitemap` 模块在 generate 时自动生成 `/sitemap.xml`。

---

## 环境变量

```bash
# .env（本地开发，复制自 .env.example）
NUXT_PUBLIC_API_BASE=https://api.sgcarpass.com
```

`runtimeConfig.public.apiBase` 在 `nuxt.config.ts` 中配置，目前仅 `pages/battery/[id].vue` 的注释代码中引用。

---

## 后端 API（待开发）

`pages/battery/[id].vue` 中有注释的 API 调用示例，指向 `https://api.sgcarpass.com`（RuoYi Spring Boot）。主流程目前全部用 `data/cars.json` 静态数据，无需后端。

---

## 添加新车型

在 `data/cars.json` 中追加一条记录，`slug` 用 kebab-case（如 `honda-city`）。`npm run generate` 后 Cloudflare Pages 会自动重新构建（push 到 GitHub main 分支即触发）。

---

## 当前进度（2026-05-16）

- [x] Nuxt 3 + Tailwind，本地可跑
- [x] 车型落地页（`/car/[slug]`）+ `data/cars.json`（30+ 车型）
- [x] Schema.org 结构化数据（BreadcrumbList、FAQPage、Product）
- [x] Cloudflare Pages 部署 + 域名 `battery.sgcarpass.com`
- [ ] Google Search Console 验证
- [ ] 后端 public API 开发（优惠码流程）
- [ ] 前端接通真实 API（取消注释 `battery/[id].vue` 中的代码）
