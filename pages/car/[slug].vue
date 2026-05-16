<template>
  <div v-if="!car" class="max-w-3xl mx-auto px-4 py-20 text-center">
    <p class="text-gray-400 text-lg">Car model not found.</p>
    <NuxtLink to="/" class="text-blue-600 text-sm mt-4 inline-block">← Back to all models</NuxtLink>
  </div>

  <div v-else>

    <!-- Hero band -->
    <div class="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
      <div class="max-w-3xl mx-auto px-4 py-8">
        <nav class="text-xs text-slate-400 mb-3">
          <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span>{{ car.make }} {{ car.model }}</span>
        </nav>
        <h1 class="text-2xl md:text-3xl font-bold leading-tight mb-1">
          {{ car.make }} {{ car.model }} Battery Replacement
          <span class="text-slate-300 font-normal text-xl">— Singapore</span>
        </h1>
        <p class="text-slate-400 text-sm mt-1">{{ car.yearFrom }}–{{ car.yearTo }} · Genuine Amaron</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-8 space-y-10">

      <!-- Battery options -->
      <section>
        <h2 class="text-lg font-bold text-gray-800 mb-4">Recommended Batteries</h2>
        <div class="space-y-3">
          <div
            v-for="(b, i) in car.batteries"
            :key="b.partNo"
            class="rounded-2xl border-2 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            :class="i === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  :class="{
                    'bg-gray-700 text-white': b.type === 'Standard',
                    'bg-green-600 text-white': b.type === 'EFB',
                    'bg-purple-600 text-white': b.type === 'AGM',
                  }"
                >{{ b.type }}</span>
                <span v-if="i === 0" class="text-xs text-blue-600 font-semibold">Recommended</span>
              </div>
              <p class="font-bold text-gray-900 text-lg">Amaron {{ b.series }} {{ b.partNo }}</p>
              <p class="text-sm text-gray-500">Replaces {{ b.equivalent }}</p>
              <p v-if="b.cca" class="text-xs text-gray-400 mt-1">{{ b.cca }} CCA · {{ b.capacityAh }}Ah</p>
              <p v-if="b.type === 'AGM'" class="key-warning text-xs text-purple-700 mt-1 font-semibold">⚠ Required for Start-Stop system — standard battery will fail prematurely</p>
              <p v-if="b.type === 'EFB'" class="key-warning text-xs text-green-700 mt-1 font-semibold">⚠ Required for Start-Stop system — standard battery will fail prematurely</p>
            </div>
            <div class="text-left sm:text-right shrink-0">
              <p class="text-3xl font-black text-blue-700">${{ b.retailPrice }}</p>
              <p class="text-xs text-gray-400">incl. GST · battery only</p>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Prices subject to change. WhatsApp us for latest availability.</p>
      </section>

      <!-- What you need to know -->
      <section class="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h2 class="font-bold text-amber-900 text-base mb-3">
          What {{ car.make }} {{ car.model }} owners in Singapore should know
        </h2>
        <div class="text-sm text-amber-800 space-y-3 leading-relaxed">
          <!-- Car-specific note from JSON (A6) -->
          <p v-if="car.batteryNote" class="key-warning font-medium text-amber-900 bg-amber-100 rounded-lg px-4 py-3 border border-amber-300">
            {{ car.batteryNote }}
          </p>
          <p>
            Singapore's year-round heat and humidity are unusually harsh on car batteries. The average battery lifespan here
            is <strong>2–3 years</strong> — significantly shorter than the 4–5 years typical in cooler climates. If your
            {{ car.make }} {{ car.model }} is showing any of the symptoms below, your battery may be due for a check:
          </p>
          <ul class="list-disc list-inside space-y-1 text-amber-700">
            <li>Engine cranks slowly, especially in the morning</li>
            <li>Headlights dim when the engine is idling</li>
            <li>Battery warning light appears on the dashboard</li>
            <li>Battery is more than 3 years old</li>
            <li>Car needed a jump-start in the past few months</li>
          </ul>
          <p v-if="car.batteries[0].type === 'AGM' || car.batteries[0].type === 'EFB'">
            <strong class="key-warning">Important:</strong> The {{ car.make }} {{ car.model }} is equipped with a Start-Stop system.
            This requires a purpose-built {{ car.batteries[0].type }} battery. Fitting a standard lead-acid battery will
            cause premature failure and may trigger warning lights. Always replace with the correct type.
          </p>
          <p v-else>
            The {{ car.make }} {{ car.model }} uses a standard lead-acid battery with no special management system,
            making it one of the more straightforward replacements. A quality Amaron HILIFE battery is a direct fit
            and carries a manufacturer warranty.
          </p>
        </div>
      </section>

      <!-- Why Amaron -->
      <section>
        <h2 class="text-lg font-bold text-gray-800 mb-4">Why Amaron for your {{ car.make }} {{ car.model }}?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p class="font-semibold text-gray-800 mb-1">Built for heat</p>
            <p class="text-sm text-gray-500">Amaron batteries use Silven-X alloy plates specifically designed to handle tropical temperatures above 35°C.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p class="font-semibold text-gray-800 mb-1">Zero maintenance</p>
            <p class="text-sm text-gray-500">Sealed maintenance-free design. No topping up, no corrosion checks. Fit and forget.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p class="font-semibold text-gray-800 mb-1">Manufacturer warranty</p>
            <p class="text-sm text-gray-500">Backed by Amaron's regional warranty. Defective units are replaced, not repaired.</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section>
        <h2 class="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <details
            v-for="faq in faqs"
            :key="faq.q"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden group"
          >
            <summary class="px-5 py-4 font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50">
              {{ faq.q }}
              <span class="text-gray-400 text-lg ml-4 shrink-0 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-green-600 rounded-2xl p-6 text-white text-center">
        <p class="font-bold text-xl mb-1">Ready to replace your battery?</p>
        <p class="text-green-100 text-sm mb-5">WhatsApp us — we'll confirm the right battery for your exact car and connect you with a nearby workshop.</p>
        <a
          :href="ownerWaLink"
          target="_blank"
          class="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-7 py-3 rounded-full shadow hover:bg-green-50 transition text-sm"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp for Price &amp; Availability
        </a>
      </section>

      <!-- More models (B4: internal links) -->
      <section v-if="sameMakeCars.length" class="border-t pt-6">
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">More {{ car.make }} models</h2>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="c in sameMakeCars"
            :key="c.slug"
            :to="`/car/${c.slug}`"
            class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
          >
            {{ c.model }}
          </NuxtLink>
        </div>
      </section>

      <!-- Mechanic feedback -->
      <section class="border-t pt-6">
        <div class="rounded-xl border border-dashed border-gray-300 p-5 bg-gray-50">
          <p class="font-semibold text-gray-700 mb-1">Workshop or mechanic?</p>
          <p class="text-sm text-gray-500 mb-3">
            If the battery listed above does not match what you see on a <strong>{{ car.make }} {{ car.model }}</strong>
            in your workshop, send us a photo of the correct battery label via WhatsApp. We'll update this page,
            and your workshop gets credited — giving the next owner of this car model a reason to find you.
          </p>
          <a
            :href="mechanicWaLink"
            target="_blank"
            class="inline-flex items-center gap-2 text-sm border border-gray-400 text-gray-600 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition"
          >
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Report correct spec via WhatsApp
          </a>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import cars from '~/data/cars.json'

const route = useRoute()
const car = cars.find(c => c.slug === route.params.slug) ?? null

// B4: same-make cars for internal linking
const sameMakeCars = car
  ? cars.filter(c => c.make === car.make && c.slug !== car.slug).slice(0, 8)
  : []

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

const faqs = car?.faq?.length ? car.faq.map(f => ({ q: f.q, a: f.a })) : templateFaqs

const WA_NUMBER = '6581525879'

const ownerWaLink = car
  ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I'd like to check the battery price for my ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo}).`)}`
  : '#'

const mechanicWaLink = car
  ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`[Battery Spec Feedback] ${car.make} ${car.model} (${car.yearFrom}–${car.yearTo})\nListed: ${car.batteries.map(b => `${b.partNo} ($${b.retailPrice})`).join(', ')}\nActual battery on this car: \n(Please attach photo of battery label)`)}`
  : '#'

if (car) {
  useSeoMeta({
    title: `${car.make} ${car.model} Battery Singapore | Amaron ${car.batteries[0].partNo} | SGCarPass Battery`,
    description: `${car.make} ${car.model} (${car.yearFrom}–${car.yearTo}) battery in Singapore. Amaron ${car.batteries[0].partNo} from $${car.batteries[0].retailPrice} incl. GST. ${car.batteries[0].type !== 'Standard' ? 'EFB/AGM for Start-Stop system.' : 'Same-day workshop installation.'} WhatsApp for price and availability.`,
    ogTitle: `${car.make} ${car.model} Battery Singapore | Amaron ${car.batteries[0].partNo}`,
    ogDescription: `Correct battery spec, competitive price, nearby workshop installation. Singapore's tropical climate guide included.`,
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://battery.sgcarpass.com' },
              { '@type': 'ListItem', position: 2, name: `${car.make} ${car.model} Battery`, item: `https://battery.sgcarpass.com/car/${car.slug}` },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${car.make} ${car.model} Replacement Battery`,
            description: `Amaron replacement battery for ${car.make} ${car.model} ${car.yearFrom}–${car.yearTo} in Singapore`,
            brand: { '@type': 'Brand', name: 'Amaron' },
            offers: car.batteries.map(b => ({
              '@type': 'Offer',
              name: `Amaron ${b.series} ${b.partNo}`,
              price: b.retailPrice,
              priceCurrency: 'SGD',
              availability: 'https://schema.org/InStock',
              areaServed: 'Singapore',
            })),
          },
        ]),
      },
    ],
  })
}
</script>
