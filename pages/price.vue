<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="font-serif text-3xl text-gray-900 leading-tight">Amaron battery prices, Singapore</h1>
    <p class="text-gray-700 mt-3 leading-relaxed">Price at our partner fitting point, GST included, fitting included. As of {{ fmtAsOf }}. A home visit is possible, we quote it on WhatsApp. If you are not sure which size your car takes, <NuxtLink to="/" class="text-blue-700 underline">look up your car</NuxtLink> or send us a photo of your old battery's label.</p>

    <label for="q" class="block text-sm text-gray-600 mt-6 mb-1">Search a battery size</label>
    <input id="q" v-model="search" type="search" placeholder="e.g. 60B24L, DIN66L" class="w-full border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:border-blue-600" autocomplete="off" autocorrect="off" spellcheck="false" />

    <div v-for="g in groups" :key="g.series" class="mt-8">
      <h2 class="font-serif text-lg text-gray-900 border-b border-gray-300 pb-1 mb-2">{{ g.series }}</h2>
      <table class="w-full text-left">
        <tbody>
          <tr v-for="r in g.rows" :key="r.model" class="border-b border-gray-200">
            <td class="py-2 text-gray-900">{{ r.model }}</td>
            <td class="py-2 text-gray-900 font-medium">S${{ r.price }}</td>
            <td class="py-2 text-right"><a :href="wa(r.model)" target="_blank" rel="noopener" class="text-green-700 hover:underline">Ask</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!groups.length" class="mt-6 text-gray-600">Nothing matches "{{ search }}". Send us the label photo on WhatsApp and we will check.</p>
  </div>
</template>

<script setup>
import prices from '~/data/prices.json'

const search = ref('')
const fmtAsOf = new Date(prices.asOf + '-01').toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })
const all = Object.entries(prices.items).map(([model, v]) => ({ model, series: v.series, price: v.price }))
const groups = computed(() => {
  const q = search.value.trim().toLowerCase()
  const rows = q ? all.filter(r => r.model.toLowerCase().includes(q)) : all
  const map = new Map()
  for (const r of rows) (map.get(r.series) ?? map.set(r.series, []).get(r.series)).push(r)
  return [...map].map(([series, rs]) => ({ series, rows: rs }))
})
const wa = (model) => `https://wa.me/6581525875?text=${encodeURIComponent(`Hi, I'd like to check the Amaron ${model} battery.\n\n(ref: sgcarpass /price/ row)`)}`

useSeoMeta({
  title: 'Amaron Battery Prices in Singapore | SGCarPass Battery',
  description: 'Amaron car battery prices in Singapore by size, GST included, fitting included. Look up your size, then ask on WhatsApp to confirm it fits your car.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://battery.sgcarpass.com/price/' }] })
</script>
