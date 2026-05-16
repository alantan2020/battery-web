# battery-web CLAUDE.md

新加坡汽车电瓶营销网站。消费者选电瓶 → 获取优惠码 → 到合作修理厂安装换电。

---

## 项目定位

**用户**：供货商（电瓶批发/分销），合作修理厂是他的下游客户。
**商业逻辑**：消费者在此网站找电瓶、拿优惠码，到合作修理厂安装。修理厂扫码核销赚佣金，修理厂销量好则向用户进更多货。

---

## 技术栈

- **框架**：Nuxt 3（SSR/SSG，利于 SEO）
- **样式**：Tailwind CSS
- **部署**：Vercel，Root Directory 设为 `app/battery-web`
- **域名**：`battery.sgcarpass.com`（Cloudflare DNS-only 灰云，SSL 由 Vercel 管）
- **后端 API**：`https://api.sgcarpass.com`（现有 RuoYi Spring Boot，同一台服务器）

---

## 常用命令

```bash
# 在 app/battery-web/ 目录下运行
npm install       # 安装依赖
npm run dev       # 开发服务器（默认 3000，或指定 --port 3100）
npm run build     # 生产构建
npm run generate  # 静态生成（SSG）
```

---

## 目录结构

```
app/battery-web/
  nuxt.config.ts        ← API 地址在 runtimeConfig.public.apiBase
  .env.example          ← 本地开发复制为 .env
  layouts/
    default.vue         ← 顶部导航 + 底部
  pages/
    index.vue           ← 首页：电瓶列表（当前假数据）
    battery/[id].vue    ← 详情页：获取优惠码（当前假数据+模拟）
  components/           ← 待加：BatteryCard、CouponModal、ShopMap 等
  composables/          ← 待加：useApi.ts 封装 $fetch
```

---

## 环境变量

```bash
# .env（本地开发，复制自 .env.example）
NUXT_PUBLIC_API_BASE=http://localhost:8080

# Vercel 生产环境变量（在 Vercel Dashboard 设置）
NUXT_PUBLIC_API_BASE=https://api.sgcarpass.com
```

---

## 后端 API（待开发，在 ruoyi-tys 模块加）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/public/battery/list` | 电瓶型号列表（无需登录） |
| GET | `/public/battery/{id}` | 单个型号详情 |
| GET | `/public/shop/list` | 合作门店列表（含经纬度） |
| POST | `/public/coupon/generate` | 消费者生成优惠码（传手机号+电瓶ID） |
| POST | `/tys/coupon/redeem` | 修理工核销（需修理工 JWT） |
| GET | `/tys/coupon/my-commission` | 修理工查看自己的佣金记录 |

**新增数据库表（跑在同一个 ry-warranty 库）：**
- `tys_bw_promo_coupon` — 优惠码（code, battery_product_id, phone, status, create_time）
- `tys_bw_coupon_redemption` — 核销记录（coupon_id, mechanic_id, shop_id, commission_amount）

---

## SEO 策略

**核心原则**：按车型做落地页，不按电瓶 size。新加坡消费者搜索习惯是 `"Toyota Corolla Altis battery Singapore"`，不是 `"NS60 battery"`。

**第一批车型页（优先）：**
```
/battery/toyota-corolla-altis    ← 新加坡路上最多
/battery/honda-civic
/battery/toyota-camry
/battery/mazda-3
/battery/honda-jazz
```

**第二批（欧陆车，客单价高）：**
```
/battery/bmw-3-series
/battery/mercedes-c-class
/battery/volkswagen-golf
```

每个页面结构：车型图 + 适配型号+价格 + 获取优惠码 CTA + FAQ（重要！影响 SEO）+ 附近门店地图。

---

## 优惠码核销流程

```
消费者在网站生成码（如 BAT-7X3K）
  → 截图保存
  → 到合作修理厂出示

修理工在 WhatsApp 发「核销 BAT-7X3K」
  → 复用现有 WhatsApp DispatchService（加一个新 case）
  → 系统记录：mechanic_id + shop_id + 时间 + 佣金金额

后台管理：佣金报表、门店转化统计
```

---

## 当前进度（2026-05-14）

- [x] Nuxt 3 骨架建立，本地可跑
- [x] 首页电瓶列表（假数据）
- [x] 详情页 + 优惠码表单（模拟生成）
- [ ] SEO 车型落地页（从 Toyota Corolla Altis 开始）
- [ ] 后端 public API 开发
- [ ] 前端接通真实 API
- [ ] Vercel 部署 + Cloudflare DNS
- [ ] WhatsApp 核销指令
