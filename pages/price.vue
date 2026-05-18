<template>
  <div>
    <!-- Sticky search bar -->
    <div class="sticky top-14 z-10 bg-white shadow-sm px-4 pt-3 pb-2">
      <input
        v-model="search"
        type="search"
        placeholder="输入型号查价，如：60B24L、Q85、DIN74L"
        class="w-full px-4 py-3 text-base border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
      />
      <p class="text-center text-xs text-gray-400 mt-1">All prices incl. GST</p>
    </div>

    <!-- Brand filter -->
    <div class="flex gap-2 px-4 py-2 overflow-x-auto border-b bg-white" style="-ms-overflow-style:none;scrollbar-width:none">
      <button
        v-for="b in brandOptions"
        :key="b.val"
        @click="brandFilter = b.val"
        class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
        :class="brandFilter === b.val ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'"
      >{{ b.label }}</button>
    </div>

    <!-- Type filter -->
    <div class="flex gap-2 px-4 py-2 overflow-x-auto border-b bg-white" style="-ms-overflow-style:none;scrollbar-width:none">
      <button
        v-for="t in typeOptions"
        :key="t.val"
        @click="typeFilter = t.val"
        class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
        :class="typeFilter === t.val ? activeTypeClass(t.val) : 'bg-white text-gray-600 border-gray-300'"
      >{{ t.label }}</button>
    </div>

    <!-- Count -->
    <p class="px-4 py-2 text-xs text-gray-400">{{ filtered.length }} 款</p>

    <!-- Product cards (mobile only) -->
    <div class="md:hidden px-4 pb-10 space-y-3">
      <div
        v-for="p in filtered"
        :key="p.brand + p.series + p.model"
        class="bg-white rounded-xl shadow-sm border-l-4 p-4"
        :class="borderClass(p.type)"
      >
        <!-- Top row: brand/series + type badge -->
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-gray-400">{{ p.brand }} {{ p.series }}</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="badgeClass(p.type)">{{ p.type }}</span>
        </div>

        <!-- Model number (big) -->
        <div class="text-2xl font-bold text-gray-900 mb-2 tracking-wide">{{ p.model }}</div>

        <!-- Prices -->
        <div class="flex gap-8 mb-2">
          <div>
            <div class="text-xs text-gray-400 mb-0.5">零售</div>
            <div class="text-xl font-bold text-blue-700">${{ p.retail.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-0.5">×1.09</div>
            <div class="text-xl font-bold text-green-700">${{ p.final.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Equiv (if any) -->
        <div v-if="p.equiv" class="text-xs text-gray-400 mb-1">等效 {{ p.equiv }}</div>

        <!-- Short code -->
        <div class="text-xs text-gray-400">简码 <span class="font-mono text-gray-500">{{ p.wa }}</span></div>
      </div>

      <!-- No results (mobile) -->
      <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">🔋</div>
        <div class="text-sm">没有找到匹配的型号</div>
        <div class="text-xs mt-1">试试只输入数字部分，如 60B24L 改搜 60</div>
      </div>
    </div>

    <!-- Desktop table (md and above) -->
    <div class="hidden md:block px-6 pb-10">
      <!-- No results (desktop) -->
      <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">🔋</div>
        <div class="text-sm">没有找到匹配的型号</div>
      </div>
      <table v-else class="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm text-sm">
        <thead>
          <tr class="bg-gray-800 text-white text-xs tracking-wide">
            <th class="px-4 py-3 text-left">品牌</th>
            <th class="px-4 py-3 text-left">系列</th>
            <th class="px-4 py-3 text-left font-bold">型号</th>
            <th class="px-4 py-3 text-left text-gray-400">等效</th>
            <th class="px-4 py-3 text-right text-blue-300">零售</th>
            <th class="px-4 py-3 text-right text-green-300">×1.09</th>
            <th class="px-4 py-3 text-left text-purple-300">简码</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.brand + p.series + p.model"
            class="border-t border-gray-100 hover:bg-blue-50 transition-colors"
          >
            <td class="px-4 py-2.5 text-gray-600">{{ p.brand }}</td>
            <td class="px-4 py-2.5">
              <span class="text-gray-600">{{ p.series }}</span>
              <span class="ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium" :class="badgeClass(p.type)">{{ p.type }}</span>
            </td>
            <td class="px-4 py-2.5 font-bold text-gray-900 tracking-wide">{{ p.model }}</td>
            <td class="px-4 py-2.5 text-gray-400 text-xs">{{ p.equiv || '-' }}</td>
            <td class="px-4 py-2.5 text-right font-bold text-blue-700">${{ p.retail.toFixed(2) }}</td>
            <td class="px-4 py-2.5 text-right font-bold text-green-700">${{ p.final.toFixed(2) }}</td>
            <td class="px-4 py-2.5 font-mono text-purple-700 text-xs">{{ p.wa }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Battery Price List Singapore | Amaron Prices | SGCarPass Battery',
  description: 'Quick battery price lookup for Singapore workshops. Amaron HILIFE, PRO, EFB, AGM, HOPPECKE, OCEAN — all prices incl. GST.',
  ogTitle: 'Battery Price List Singapore | SGCarPass Battery',
  ogDescription: 'Quick battery price lookup for Singapore workshops. Amaron, HOPPECKE, OCEAN retail prices, incl. GST.',
})

const products = [
  {brand:'Amaron',series:'HILIFE',model:'50B20L',equiv:'',retail:110.25,final:120.17,wa:'a 50B20L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'42B20R',equiv:'',retail:110.25,final:120.17,wa:'a 42B20R',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'60B24L',equiv:'',retail:126.0,final:137.34,wa:'a 60B24L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'60B24R',equiv:'',retail:126.0,final:137.34,wa:'a 60B24R',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'60B24LS',equiv:'',retail:126.0,final:137.34,wa:'a 60B24LS',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'60B24RS',equiv:'',retail:126.0,final:137.34,wa:'a 60B24RS',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'65B24L',equiv:'',retail:136.5,final:148.79,wa:'a 65B24L',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'65B24R',equiv:'',retail:136.5,final:148.79,wa:'a 65B24R',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'65B24LS',equiv:'',retail:136.5,final:148.79,wa:'a 65B24LS',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'85D23L',equiv:'',retail:147.0,final:160.23,wa:'a 85D23L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'85D23R',equiv:'',retail:147.0,final:160.23,wa:'a 85D23R',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'90D23L',equiv:'',retail:168.0,final:183.12,wa:'a 90D23L',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'90D23R',equiv:'',retail:168.0,final:183.12,wa:'a 90D23R',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'110D26L',equiv:'',retail:189.0,final:206.01,wa:'a 110D26L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'80D26L',equiv:'',retail:157.5,final:171.68,wa:'a 80D26L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'80D26R',equiv:'',retail:157.5,final:171.68,wa:'a 80D26R',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'95D26L',equiv:'',retail:168.0,final:183.12,wa:'a 95D26L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'95D26R',equiv:'',retail:168.0,final:183.12,wa:'a 95D26R',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'105D31L',equiv:'',retail:178.5,final:194.57,wa:'a 105D31L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'105D31R',equiv:'',retail:178.5,final:194.57,wa:'a 105D31R',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'125D31L',equiv:'',retail:189.0,final:206.01,wa:'a 125D31L',type:'普通'},
  {brand:'Amaron',series:'PRO',model:'125D31R',equiv:'',retail:189.0,final:206.01,wa:'a 125D31R',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'95D31L',equiv:'',retail:178.5,final:194.57,wa:'a 95D31L',type:'普通'},
  {brand:'Amaron',series:'HILIFE',model:'95D31R',equiv:'',retail:178.5,final:194.57,wa:'a 95D31R',type:'普通'},
  {brand:'Amaron',series:'PRO DIN',model:'DIN45L',equiv:'',retail:147.0,final:160.23,wa:'a DIN45L',type:'普通'},
  {brand:'Amaron',series:'PRO DIN',model:'DIN55L',equiv:'',retail:157.5,final:171.68,wa:'a DIN55L',type:'普通'},
  {brand:'Amaron',series:'PRO DIN',model:'DIN66L',equiv:'',retail:168.0,final:183.12,wa:'a DIN66L',type:'普通'},
  {brand:'Amaron',series:'PRO DIN',model:'DIN74L',equiv:'',retail:189.0,final:206.01,wa:'a DIN74L',type:'普通'},
  {brand:'Amaron',series:'PRO DIN',model:'DIN80L',equiv:'',retail:262.5,final:286.12,wa:'a DIN80L',type:'普通'},
  {brand:'Amaron',series:'PRO DIN',model:'DIN100L',equiv:'',retail:273.0,final:297.57,wa:'a DIN100L',type:'普通'},
  {brand:'HOPPECKE',series:'EFB',model:'N55L',equiv:'65B24L',retail:168.0,final:183.12,wa:'H N55L',type:'EFB'},
  {brand:'HOPPECKE',series:'EFB',model:'L3',equiv:'575065',retail:252.0,final:274.68,wa:'H L3',type:'EFB'},
  {brand:'HOPPECKE',series:'AGM',model:'AGM80 L4',equiv:'DIN80',retail:336.0,final:366.24,wa:'H L4',type:'AGM'},
  {brand:'HOPPECKE',series:'AGM',model:'AGM95 L5',equiv:'DIN100',retail:378.0,final:412.02,wa:'H L5',type:'AGM'},
  {brand:'HOPPECKE',series:'AGM',model:'AGM60 L2',equiv:'DIN60',retail:262.5,final:286.12,wa:'H L2',type:'AGM'},
  {brand:'OCEAN',series:'EFB',model:'Q85',equiv:'90D23L',retail:231.0,final:251.79,wa:'O Q85',type:'EFB'},
  {brand:'Amaron',series:'EFB',model:'M42L',equiv:'60B20L',retail:147.0,final:160.23,wa:'a M42L',type:'EFB'},
  {brand:'Amaron',series:'EFB',model:'N55L',equiv:'80B24L',retail:168.0,final:183.12,wa:'a N55L',type:'EFB'},
  {brand:'Amaron',series:'EFB',model:'Q85',equiv:'100D23L',retail:231.0,final:251.79,wa:'a Q85',type:'EFB'},
  {brand:'Amaron',series:'EFB',model:'S95',equiv:'130D26L',retail:252.0,final:274.68,wa:'a S95',type:'EFB'},
  {brand:'Amaron',series:'EFB',model:'L3',equiv:'DIN 74L',retail:273.0,final:297.57,wa:'a L3',type:'EFB'},
  {brand:'Amaron',series:'AGM',model:'LN1',equiv:'DIN50',retail:252.0,final:274.68,wa:'a LN1',type:'AGM'},
  {brand:'Amaron',series:'AGM',model:'LN2',equiv:'DIN60',retail:273.0,final:297.57,wa:'a LN2',type:'AGM'},
  {brand:'Amaron',series:'AGM',model:'LN3',equiv:'DIN70',retail:294.0,final:320.46,wa:'a LN3',type:'AGM'},
  {brand:'Amaron',series:'AGM',model:'LN4',equiv:'DIN80',retail:315.0,final:343.35,wa:'a LN4',type:'AGM'},
  {brand:'Amaron',series:'AGM',model:'LN5',equiv:'DIN100',retail:336.0,final:366.24,wa:'a LN5',type:'AGM'},
]

const brandOptions = [
  { val: 'all', label: '全部品牌' },
  { val: 'Amaron', label: 'Amaron' },
  { val: 'HOPPECKE', label: 'HOPPECKE' },
  { val: 'OCEAN', label: 'OCEAN' },
]

const typeOptions = [
  { val: 'all', label: '全部类型' },
  { val: '普通', label: '普通 Standard' },
  { val: 'EFB', label: 'EFB' },
  { val: 'AGM', label: 'AGM' },
]

const search = ref('')
const brandFilter = ref('all')
const typeFilter = ref('all')

const filtered = computed(() => {
  const q = search.value.trim().toUpperCase()
  return products.filter(p => {
    const matchBrand = brandFilter.value === 'all' || p.brand === brandFilter.value
    const matchType = typeFilter.value === 'all' || p.type === typeFilter.value
    const matchSearch = !q ||
      p.model.toUpperCase().includes(q) ||
      p.brand.toUpperCase().includes(q) ||
      p.series.toUpperCase().includes(q) ||
      p.wa.toUpperCase().includes(q) ||
      p.equiv.toUpperCase().includes(q)
    return matchBrand && matchType && matchSearch
  })
})

function borderClass(type) {
  if (type === 'EFB') return 'border-l-green-500'
  if (type === 'AGM') return 'border-l-amber-500'
  return 'border-l-blue-400'
}

function badgeClass(type) {
  if (type === 'EFB') return 'bg-green-100 text-green-700'
  if (type === 'AGM') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-100 text-blue-700'
}

function activeTypeClass(val) {
  if (val === 'EFB') return 'bg-green-600 text-white border-green-600'
  if (val === 'AGM') return 'bg-amber-600 text-white border-amber-600'
  return 'bg-blue-600 text-white border-blue-600'
}
</script>
