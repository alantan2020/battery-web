// 构建后检查（对已生成的 .output/public 逐页核对）：
//  - 未核实车型（cars.json verified≠true）：页面必须 noindex，且不得出现在 sitemap.xml；
//  - 已核实车型：页面不得 noindex，且必须在 sitemap.xml；
//  - /eprice 必须不在 sitemap。
// 用法：npm run generate && npm run check:built [构建目录，默认 .output/public]
import { readFileSync, existsSync } from 'node:fs'
const dir = process.argv[2] || '.output/public'
const cars = JSON.parse(readFileSync(new URL('../data/cars.json', import.meta.url), 'utf8'))
const sitemap = readFileSync(`${dir}/sitemap.xml`, 'utf8')
const bad = []
for (const c of cars) {
  const f = `${dir}/car/${c.slug}/index.html`
  if (!existsSync(f)) { bad.push(`${c.slug}: 没有生成页面 ${f}`); continue }
  const html = readFileSync(f, 'utf8')
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)
  const inMap = sitemap.includes(`/car/${c.slug}/`)
  if (c.verified === true) {
    if (noindex) bad.push(`${c.slug}: 已核实却是 noindex`)
    if (!inMap) bad.push(`${c.slug}: 已核实却不在 sitemap`)
  } else {
    if (!noindex) bad.push(`${c.slug}: 未核实却没有 noindex`)
    if (inMap) bad.push(`${c.slug}: 未核实却在 sitemap`)
  }
}
if (sitemap.includes('/eprice')) bad.push('/eprice 在 sitemap 里')
if (bad.length) { console.error('构建后检查失败：\n' + bad.join('\n')); process.exit(1) }
console.log(`构建后检查通过：${cars.length} 款车型页的 noindex/sitemap 与 verified 一致`)
