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

    <!-- Mobile cards -->
    <div class="md:hidden px-4 pb-10 space-y-3">
      <div
        v-for="p in filtered"
        :key="p.type + p.model"
        class="bg-white rounded-xl shadow-sm border-l-4 p-4"
        :class="borderClass(p.type)"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-gray-400">Exide</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="badgeClass(p.type)">{{ p.type }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900 mb-2 tracking-wide">{{ p.model }}</div>
        <div class="flex gap-8 mb-2">
          <div>
            <div class="text-xs text-gray-400 mb-0.5">零售</div>
            <div class="text-xl font-bold text-blue-700">${{ p.retail.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-0.5">×1.09</div>
            <div class="text-xl font-bold text-green-700">${{ finalPrice(p.retail).toFixed(2) }}</div>
          </div>
        </div>
        <div class="flex gap-4 mb-2 text-xs text-gray-500">
          <span>{{ p.ah }} Ah</span>
          <span>CCA {{ p.cca }}</span>
        </div>
        <div v-if="p.equiv" class="text-xs text-gray-400 mb-1">等效 {{ p.equiv }}</div>
        <div class="text-xs text-gray-400">简码 <span class="font-mono text-gray-500">{{ p.wa }}</span></div>
      </div>

      <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">🔋</div>
        <div class="text-sm">没有找到匹配的型号</div>
        <div class="text-xs mt-1">试试只输入数字部分，如 60B24L 改搜 60</div>
      </div>
    </div>

    <!-- Desktop table -->
    <div class="hidden md:block px-6 pb-10">
      <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">🔋</div>
        <div class="text-sm">没有找到匹配的型号</div>
      </div>
      <table v-else class="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm text-sm">
        <thead>
          <tr class="bg-gray-800 text-white text-xs tracking-wide">
            <th class="px-3 py-3 text-left">类型</th>
            <th class="px-3 py-3 text-left font-bold">型号</th>
            <th class="px-3 py-3 text-left text-gray-400">等效</th>
            <th class="px-3 py-3 text-right text-gray-300">AH</th>
            <th class="px-3 py-3 text-right text-gray-300">CCA</th>
            <th class="px-3 py-3 text-right text-blue-300">零售</th>
            <th class="px-3 py-3 text-right text-green-300">×1.09</th>
            <th class="px-3 py-3 text-left text-purple-300">简码</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.type + p.model"
            class="border-t border-gray-100 hover:bg-blue-50 transition-colors"
          >
            <td class="px-3 py-2.5">
              <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="badgeClass(p.type)">{{ p.type }}</span>
            </td>
            <td class="px-3 py-2.5 font-bold text-gray-900 tracking-wide">{{ p.model }}</td>
            <td class="px-3 py-2.5 text-gray-400 text-xs">{{ p.equiv || '-' }}</td>
            <td class="px-3 py-2.5 text-right text-gray-600">{{ p.ah }}</td>
            <td class="px-3 py-2.5 text-right text-gray-600">{{ p.cca }}</td>
            <td class="px-3 py-2.5 text-right font-bold text-blue-700">${{ p.retail.toFixed(2) }}</td>
            <td class="px-3 py-2.5 text-right font-bold text-green-700">${{ finalPrice(p.retail).toFixed(2) }}</td>
            <td class="px-3 py-2.5 font-mono text-purple-700 text-xs">{{ p.wa }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Exide Battery Price List Singapore | SGCarPass Battery',
  description: 'Exide battery prices for Singapore workshops. MF, EFB (JIS), EFB (DIN), AGM — all prices incl. GST.',
  ogTitle: 'Exide Battery Price List Singapore | SGCarPass Battery',
  ogDescription: 'Exide MF, EFB, AGM battery retail prices for Singapore workshops, incl. GST.',
})

const products = [
  // Maintenance Free
  { type: 'MF', model: '44B20L',      equiv: '',     ah: 35,  cca: 272,  retail: 105, wa: 'e 44B20L'   },
  { type: 'MF', model: '44B20R',      equiv: '',     ah: 35,  cca: 272,  retail: 105, wa: 'e 44B20R'   },
  { type: 'MF', model: '60B24L',      equiv: '',     ah: 45,  cca: 370,  retail: 120, wa: 'e 60B24L'   },
  { type: 'MF', model: '60B24R',      equiv: '',     ah: 45,  cca: 370,  retail: 120, wa: 'e 60B24R'   },
  { type: 'MF', model: '75D23L',      equiv: '',     ah: 60,  cca: 500,  retail: 150, wa: 'e 75D23L'   },
  { type: 'MF', model: '75D23R',      equiv: '',     ah: 60,  cca: 500,  retail: 150, wa: 'e 75D23R'   },
  { type: 'MF', model: '90D26L',      equiv: '',     ah: 70,  cca: 540,  retail: 165, wa: 'e 90D26L'   },
  { type: 'MF', model: '90D26R',      equiv: '',     ah: 70,  cca: 540,  retail: 165, wa: 'e 90D26R'   },
  { type: 'MF', model: '105D31L',     equiv: '',     ah: 90,  cca: 720,  retail: 185, wa: 'e 105D31L'  },
  { type: 'MF', model: '105D31R',     equiv: '',     ah: 90,  cca: 720,  retail: 185, wa: 'e 105D31R'  },
  { type: 'MF', model: '95E41L',      equiv: 'N100', ah: 100, cca: 640,  retail: 240, wa: 'e 95E41L'   },
  { type: 'MF', model: '95E41R',      equiv: 'N100', ah: 100, cca: 640,  retail: 240, wa: 'e 95E41R'   },
  { type: 'MF', model: 'MF130',       equiv: 'N120', ah: 130, cca: 680,  retail: 300, wa: 'e MF130'    },
  { type: 'MF', model: 'MF150',       equiv: 'N150', ah: 150, cca: 785,  retail: 335, wa: 'e MF150'    },
  { type: 'MF', model: 'MF200',       equiv: 'N200', ah: 200, cca: 1150, retail: 450, wa: 'e MF200'    },
  // EFB (JIS)
  { type: 'EFB (JIS)', model: 'M42',   equiv: 'B20L', ah: 40, cca: 340, retail: 125, wa: 'e M42'   },
  { type: 'EFB (JIS)', model: 'N55',   equiv: 'B24L', ah: 50, cca: 430, retail: 140, wa: 'e N55'   },
  { type: 'EFB (JIS)', model: 'Q85',   equiv: 'D23L', ah: 70, cca: 550, retail: 180, wa: 'e Q85'   },
  { type: 'EFB (JIS)', model: 'S95',   equiv: 'D26L', ah: 80, cca: 680, retail: 200, wa: 'e S95'   },
  { type: 'EFB (JIS)', model: 'T110L', equiv: 'D31L', ah: 90, cca: 720, retail: 245, wa: 'e T110L' },
  // EFB (DIN)
  { type: 'EFB (DIN)', model: 'DIN50L-EFB',  equiv: 'L1', ah: 50,  cca: 430, retail: 150, wa: 'e EFB L1' },
  { type: 'EFB (DIN)', model: 'DIN60L-EFB',  equiv: 'L2', ah: 60,  cca: 500, retail: 165, wa: 'e EFB L2' },
  { type: 'EFB (DIN)', model: 'DIN74L-EFB',  equiv: 'L3', ah: 74,  cca: 650, retail: 185, wa: 'e EFB L3' },
  { type: 'EFB (DIN)', model: 'DIN80L-EFB',  equiv: 'L4', ah: 80,  cca: 750, retail: 265, wa: 'e EFB L4' },
  { type: 'EFB (DIN)', model: 'DIN100L-EFB', equiv: 'L5', ah: 100, cca: 800, retail: 275, wa: 'e EFB L5' },
  // AGM
  { type: 'AGM', model: 'DIN50-AGM L1', equiv: 'L1', ah: 50, cca: 540, retail: 225, wa: 'e AGM L1' },
  { type: 'AGM', model: 'DIN60-AGM L2', equiv: 'L2', ah: 60, cca: 660, retail: 250, wa: 'e AGM L2' },
  { type: 'AGM', model: 'DIN70-AGM L3', equiv: 'L3', ah: 70, cca: 760, retail: 270, wa: 'e AGM L3' },
  { type: 'AGM', model: 'DIN80-AGM L4', equiv: 'L4', ah: 80, cca: 800, retail: 315, wa: 'e AGM L4' },
  { type: 'AGM', model: 'DIN95-AGM L5', equiv: 'L5', ah: 95, cca: 850, retail: 380, wa: 'e AGM L5' },
]

const typeOptions = [
  { val: 'all',       label: '全部类型'   },
  { val: 'MF',        label: 'MF'         },
  { val: 'EFB (JIS)', label: 'EFB (JIS)'  },
  { val: 'EFB (DIN)', label: 'EFB (DIN)'  },
  { val: 'AGM',       label: 'AGM'        },
]

const search = ref('')
const typeFilter = ref('all')

const filtered = computed(() => {
  const q = search.value.trim().toUpperCase()
  return products.filter(p => {
    const matchType = typeFilter.value === 'all' || p.type === typeFilter.value
    const matchSearch = !q ||
      p.model.toUpperCase().includes(q) ||
      p.type.toUpperCase().includes(q) ||
      p.wa.toUpperCase().includes(q) ||
      p.equiv.toUpperCase().includes(q) ||
      String(p.ah).includes(q) ||
      String(p.cca).includes(q)
    return matchType && matchSearch
  })
})

function finalPrice(retail) {
  return Math.round(retail * 1.09 * 100) / 100
}

function borderClass(type) {
  if (type === 'EFB (JIS)') return 'border-l-green-500'
  if (type === 'EFB (DIN)') return 'border-l-teal-500'
  if (type === 'AGM')       return 'border-l-amber-500'
  return 'border-l-blue-400'
}

function badgeClass(type) {
  if (type === 'EFB (JIS)') return 'bg-green-100 text-green-700'
  if (type === 'EFB (DIN)') return 'bg-teal-100 text-teal-700'
  if (type === 'AGM')       return 'bg-amber-100 text-amber-700'
  return 'bg-blue-100 text-blue-700'
}

function activeTypeClass(val) {
  if (val === 'MF')        return 'bg-blue-600 text-white border-blue-600'
  if (val === 'EFB (JIS)') return 'bg-green-600 text-white border-green-600'
  if (val === 'EFB (DIN)') return 'bg-teal-600 text-white border-teal-600'
  if (val === 'AGM')       return 'bg-amber-600 text-white border-amber-600'
  return 'bg-gray-800 text-white border-gray-800'
}
</script>
