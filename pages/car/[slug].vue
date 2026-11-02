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
      <section>
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
            <template v-if="i === 0 && car.batteries.length > 1">The usual choice. </template>
          </p>
          <p v-if="priceOf(b)" class="text-xs text-gray-500 mt-2">Price at our partner fitting point, GST included, as of {{ fmtAsOf }}. Fitting is included. Home visit is possible, we quote it on WhatsApp.</p>
          <p v-if="b.type !== 'Standard'" class="text-sm text-gray-800 mt-2 border-l-4 border-blue-500 pl-3">This car needs an {{ b.type }} battery because of its stop-start system. A standard battery is not a safe swap.</p>
        </div>
        <p class="text-sm text-gray-600">Same model, different year or trim can use a different battery. The label on your old battery has the final say.</p>
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

      <section>
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

// A4: use car.faq from JSON if available, otherwise fallback to template
const templateFaqs = car ? [
  {
    q: `What battery size does the ${car.make} ${car.model} use?`,
    a: `The ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo}) uses ${car.batteries.map(b => `Amaron ${b.partNo} (replaces ${b.equivalent})`).join(' or ')}. ${car.batteries[0].type === 'AGM' ? 'This model requires an AGM battery due to its Start-Stop system — a standard battery will not be compatible.' : car.batteries[0].type === 'EFB' ? 'This model requires an EFB or AGM battery due to its Start-Stop system.' : 'A standard Amaron HILIFE battery is the correct fit for this model.'}`
  },
  {
    q: `How often should I replace the battery on a ${car.make} ${car.model} in Singapore?`,
    a: `In Singapore's tropical climate, expect to replace the battery every 2 to 3 years. Heat is the primary cause of early battery failure — it accelerates the breakdown of internal plate material. A battery over 3 years old should be load-tested even if it seems fine, as capacity drops significantly before it fails completely.`
  },
  {
    q: `How long does a ${car.make} ${car.model} battery replacement take?`,
    a: `A straightforward replacement takes 20–30 minutes at a workshop. ${car.batteries[0].type !== 'Standard' ? `Because the ${car.make} ${car.model} has a Battery Management System (BMS), the mechanic will need to reset or register the new battery after fitting — this is a normal step that takes a few extra minutes and requires a diagnostic tool.` : `The battery terminals and hold-down bracket will be checked and cleaned before the new battery is fitted.`}`
  },
  {
    q: `What are the signs that my ${car.make} ${car.model} battery is failing?`,
    a: `The most common signs are: slow engine cranking (especially on hot mornings), dimming headlights at idle, a battery warning light on the dashboard, or the car needing a jump-start. In Singapore's heat, batteries can fail suddenly without much warning, particularly after the 2.5-year mark.`
  },
  {
    q: `Can I replace the ${car.make} ${car.model} battery myself?`,
    a: `${car.batteries[0].type !== 'Standard' ? `We strongly recommend a workshop for the ${car.make} ${car.model}. The Battery Management System needs to be reset or programmed after a battery change. Skipping this step can cause the alternator to overcharge the new battery, shortening its life significantly.` : `It is possible to do it yourself, but we recommend a workshop to ensure the battery is correctly secured, terminals are properly connected, and any electronic reset is handled if needed.`}`
  },
  {
    q: `Is Amaron a good battery brand for Singapore?`,
    a: `Yes. Amaron is one of the most widely used battery brands in Singapore and Southeast Asia. Manufactured by Amara Raja Batteries in India, Amaron batteries are specifically engineered for tropical climates with high heat tolerance. They are maintenance-free, carry a manufacturer warranty, and are widely available at workshops across Singapore.`
  },
] : []

const faqs = car.faq?.length ? car.faq.map(f => ({ q: f.q, a: f.a })) : templateFaqs

const WA_NUMBER = '6581525875'
const waLink = (text, pos) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`${text}\n\n(ref: sgcarpass /car/${car.slug}/ ${pos})`)}`
const askLink = waLink(`Hi, I'd like to check the battery price for my ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo}).`, 'owner')
const feedbackLink = waLink(`[Battery Spec Feedback] ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo})\nListed: ${car.batteries.map(b => b.partNo).join(', ')}\nActual battery on this car: \n(Please attach photo of battery label)`, 'feedback')

const first = car.batteries[0]
const firstPrice = priceOf(first)
useSeoMeta({
  title: `${car.make} ${car.model} Battery in Singapore: Size ${first.partNo} | SGCarPass Battery`,
  description: `Which battery fits the ${car.make} ${car.model} (${car.yearFrom}-${car.yearTo})? Size ${first.partNo}${first.equivalent ? ', replaces ' + first.equivalent : ''}, what to check before buying, and how to get a price on WhatsApp.`,
  ogTitle: `${car.make} ${car.model} battery in Singapore`,
  ogDescription: `Battery size, type and what to check for the ${car.make} ${car.model}.`,
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
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ]),
  }],
})
</script>
