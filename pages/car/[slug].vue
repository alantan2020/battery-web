<template>
  <div>
    <div class="border-b border-gray-200 bg-gray-100">
      <div class="max-w-3xl mx-auto px-4 py-6">
        <nav class="text-xs text-gray-500 mb-2"><NuxtLink to="/" class="hover:underline">All cars</NuxtLink> / {{ car.make }}</nav>
        <h1 class="font-serif text-3xl text-gray-900 leading-tight">{{ car.make }} {{ car.model }} battery, Singapore</h1>
        <p class="text-gray-600 mt-1">{{ car.yearFrom }} to {{ car.yearTo }} models</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <section v-if="!car.verified">
        <h2 class="font-serif text-xl text-gray-900 mb-3">The battery for your {{ car.model }}</h2>
        <p class="text-gray-700 leading-relaxed">The {{ car.make }} {{ car.model }} was sold in Singapore from {{ car.yearFrom }} to {{ car.yearTo }}, and the battery size can change with the year and the engine. We have not confirmed it for every version, so we do not print a size here that might be wrong.</p>
        <p v-if="car.kind === 'european'" class="text-gray-700 leading-relaxed mt-3">Cars like this are usually fitted with an AGM or EFB battery, and a new battery often has to be registered with the car's computer. A plain replacement battery is not a safe swap. A person checks every {{ car.make }} before we quote.</p>
        <p v-if="car.kind === 'hybrid'" class="text-gray-700 leading-relaxed mt-3">A hybrid has a small 12V battery as well as the big hybrid battery. Only the 12V one is replaced here, and it is usually a special type, so we check it before quoting.</p>
        <h3 class="font-serif text-lg text-gray-900 mt-6 mb-2">The quickest way to the right battery</h3>
        <ol class="list-decimal pl-5 space-y-1 text-gray-700">
          <li>Open the bonnet and find the battery. If it is under a seat or in the boot, send us your car model and year instead.</li>
          <li>Photograph the label on top. It has a code such as 55B24L or DIN66, and sometimes the words EFB or AGM.</li>
          <li>Send the photo on WhatsApp. We confirm the size and the type and tell you the price.</li>
        </ol>
        <p class="text-sm text-gray-600 mt-3">Already know the size? <NuxtLink to="/price" class="text-blue-700 underline">Look it up on the Amaron price list</NuxtLink>.</p>
        <p class="mt-4"><a :href="askLink" target="_blank" rel="noopener" class="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 font-medium">Send the label on WhatsApp</a></p>
      </section>

      <section v-if="car.verified">
        <h2 class="font-serif text-xl text-gray-900 mb-3">What fits</h2>
        <div v-for="(b, i) in car.batteries" :key="b.partNo" class="border border-gray-300 bg-white p-4 mb-3">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <p class="text-lg text-gray-900"><strong>{{ seriesOf(b) }} {{ b.partNo }}</strong> <span class="text-sm text-gray-500">({{ b.type }})</span></p>
            <p v-if="priceOf(b)" class="text-2xl font-serif text-blue-700">S${{ priceOf(b) }}</p>
            <p v-else class="text-sm text-gray-600">Price on request</p>
          </div>
          <p class="text-sm text-gray-600 mt-1">
            <template v-if="b.equivalent">Replaces {{ b.equivalent }}. </template>
            <template v-if="b.cca">{{ b.cca }} CCA, {{ b.capacityAh }}Ah. </template>
            
          </p>
          <p v-if="priceOf(b)" class="text-xs text-gray-500 mt-2">Price at our partner fitting point, GST included, as of {{ fmtAsOf }}. Fitting is included. Home visit is possible, we quote it on WhatsApp.</p>
          <p v-if="b.type !== 'Standard'" class="text-sm text-gray-800 mt-2 border-l-4 border-blue-500 pl-3">This car needs an {{ b.type }} battery because of its stop-start system. A standard battery is not a safe swap.</p>
        </div>
        <p class="text-sm text-gray-600">{{ car.evidence }} Another year or trim can use a different battery, so the label on your old battery has the final say.</p>
        <p class="mt-4"><a :href="askLink" target="_blank" rel="noopener" class="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 font-medium">Ask on WhatsApp</a></p>
      </section>

      <section v-if="car.fieldNote">
        <h2 class="font-serif text-xl text-gray-900 mb-3">From a recent job</h2>
        <p class="text-gray-700 leading-relaxed">{{ car.fieldNote }}</p>
      </section>

      <section v-if="car.batteryNote">
        <h2 class="font-serif text-xl text-gray-900 mb-3">A note on the {{ car.model }}</h2>
        <p class="text-gray-700 leading-relaxed">{{ car.batteryNote }}</p>
      </section>

      <section v-if="faqs.length">
        <h2 class="font-serif text-xl text-gray-900 mb-3">Questions we get</h2>
        <details v-for="f in faqs" :key="f.q" class="border-b border-gray-200 py-3">
          <summary class="cursor-pointer text-gray-900 font-medium">{{ f.q }}</summary>
          <p class="text-gray-700 mt-2 leading-relaxed">{{ f.a }}</p>
        </details>
      </section>

      <section v-if="sameMakeCars.length">
        <h2 class="text-sm text-gray-500 uppercase tracking-wide mb-2">Other {{ car.make }} models</h2>
        <p><NuxtLink v-for="c in sameMakeCars" :key="c.slug" :to="`/car/${c.slug}`" class="inline-block mr-4 mb-1 text-blue-700 hover:underline">{{ c.model }}</NuxtLink></p>
      </section>

      <section class="text-sm text-gray-500">
        Fitted a different battery than the one listed? <a :href="feedbackLink" target="_blank" rel="noopener" class="text-blue-700 underline">Tell us</a> and we will correct this page.
      </section>
    </div>
  </div>
</template>

<script setup>
import cars from '~/data/cars.json'
import prices from '~/data/prices.json'

const route = useRoute()
const car = cars.find(c => c.slug === route.params.slug) ?? null
if (!car) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const sameMakeCars = cars.filter(c => c.make === car.make && c.slug !== car.slug).slice(0, 8)
const priceOf = (b) => prices.items[b.partNo]?.price ?? null
const seriesOf = (b) => prices.items[b.partNo]?.series ?? `Amaron ${b.series}`
const fmtAsOf = new Date(prices.asOf + '-01').toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })

const faqs = (car.faq || []).map(f => ({ q: f.q, a: f.a }))

const WA_NUMBER = '6581525875'
const waLink = (text, pos) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`${text}\n\n(ref: sgcarpass /car/${car.slug}/ ${pos})`)}`
const askLink = waLink(`Hi, I'd like to check the battery price for my ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo}).`, 'owner')
const feedbackLink = waLink(`[Battery Spec Feedback] ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo})\nListed: ${car.batteries.map(b => b.partNo).join(', ') || 'none'}\nActual battery on this car: \n(Please attach photo of battery label)`, 'feedback')

const first = car.batteries[0]
useSeoMeta(car.verified ? {
  title: `${car.make} ${car.model} Battery in Singapore: Size ${first.partNo} | SGCarPass Battery`,
  description: `A real ${car.make} ${car.model} job: size ${first.partNo}, what to check before buying, and how to get a price on WhatsApp.`,
  ogTitle: `${car.make} ${car.model} battery in Singapore`,
  ogDescription: `Battery size and what to check for the ${car.make} ${car.model}.`,
} : {
  title: `${car.make} ${car.model} Battery in Singapore | SGCarPass Battery`,
  description: `How to find the right battery for a ${car.make} ${car.model} in Singapore: read the label, send a photo on WhatsApp, get the size and price confirmed.`,
  robots: 'noindex, follow',
})
useHead({
  link: [{ rel: 'canonical', href: `https://battery.sgcarpass.com/car/${car.slug}` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify([
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://battery.sgcarpass.com' },
        { '@type': 'ListItem', position: 2, name: `${car.make} ${car.model} battery`, item: `https://battery.sgcarpass.com/car/${car.slug}` },
      ] },
    ]),
  }],
})
</script>
