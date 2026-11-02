// 数据守门：车型页只许显示“已核实”的电瓶型号。未核实（verified 不是 true）的车型，batteries 和 faq 必须是空的；
// 已核实的必须写明依据（evidence），型号必须在供货商价格表（data/prices.json）里，否则构建失败。
import { readFileSync } from 'node:fs'
const cars = JSON.parse(readFileSync(new URL('../data/cars.json', import.meta.url), 'utf8'))
const prices = JSON.parse(readFileSync(new URL('../data/prices.json', import.meta.url), 'utf8')).items
const bad = []
for (const c of cars) {
  if (c.verified === true) {
    if (!c.evidence || c.evidence.length < 20) bad.push(`${c.slug}: 已核实但没写依据 evidence`)
    for (const b of c.batteries) if (!prices[b.partNo]) bad.push(`${c.slug}: ${b.partNo} 不在价格表里`)
    if (!c.batteries.length) bad.push(`${c.slug}: 已核实却没有电瓶型号`)
  } else if (c.batteries.length || (c.faq || []).length || c.batteryNote) {
    bad.push(`${c.slug}: 未核实的车型不许带电瓶型号/FAQ/说明`)
  }
}
if (bad.length) { console.error('数据检查失败：\n' + bad.join('\n')); process.exit(1) }
console.log(`数据检查通过：${cars.length} 款车型，${cars.filter((c) => c.verified).length} 款已核实`)
