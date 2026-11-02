<template>
  <div class="max-w-3xl mx-auto px-4 py-8 space-y-10">
    <section>
      <h1 class="font-serif text-3xl md:text-4xl text-gray-900 leading-tight">Which battery does your car take?</h1>
      <p class="text-gray-700 mt-3 leading-relaxed">The battery size can change with the year and the engine, so the surest way is the label on your old battery. Send a photo of it on WhatsApp and we confirm the size and the type, then tell you the price. Below are the cars people ask us about, and the Amaron price list is under Amaron prices.</p>
      <p class="mt-4">
        <a :href="waHref" target="_blank" rel="noopener" class="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 font-medium">Ask on WhatsApp</a>
      </p>
    </section>

    <section>
      <label for="q" class="block text-sm text-gray-600 mb-1">Search by make or model</label>
      <input id="q" v-model="search" type="search" placeholder="e.g. Vios, Honda" class="w-full border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:border-blue-600" />
    </section>

    <section>
      <div v-for="make in visibleMakes" :key="make" class="mb-6">
        <h2 class="font-serif text-lg text-gray-900 border-b border-gray-300 pb-1 mb-2">{{ make }}</h2>
        <ul>
          <li v-for="c in carsByMake[make]" :key="c.slug" class="py-1.5 flex flex-wrap justify-between gap-2">
            <NuxtLink :to="`/car/${c.slug}`" class="text-blue-700 hover:underline">{{ c.model }} <span class="text-gray-500 text-sm">{{ c.yearFrom }}-{{ c.yearTo }}</span></NuxtLink>
          </li>
        </ul>
      </div>
      <p v-if="visibleMakes.length === 0" class="text-gray-600">
        Nothing matches "{{ search }}". <a :href="emptyLink" target="_blank" rel="noopener" class="text-blue-700 underline">Ask us on WhatsApp</a> and we will find it.
      </p>
    </section>

    <section>
      <h2 class="font-serif text-xl text-gray-900 mb-2">How it works</h2>
      <ol class="list-decimal pl-5 space-y-1 text-gray-700">
        <li>Message us on WhatsApp with your car model, and a photo of the label on your current battery if you can.</li>
        <li>We confirm the battery and the price. If your car is a European model or a hybrid, a person checks it before anything is quoted.</li>
        <li>Fit it at one of our partner fitting points, or ask for a home visit. The home visit price is quoted on WhatsApp.</li>
      </ol>
    </section>

    <section>
      <h2 class="font-serif text-xl text-gray-900 mb-2">What changed on this site</h2>
      <ul class="space-y-1 text-gray-700">
        <li v-for="u in updates" :key="u.date + u.text"><span class="text-gray-500 text-sm mr-2">{{ u.date }}</span>{{ u.text }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import cars from '~/data/cars.json'
import updates from '~/data/updates.json'

const search = ref('')
const wa = (text, pos) => `https://wa.me/6581525875?text=${encodeURIComponent(`${text}\n\n(ref: sgcarpass / ${pos})`)}`
const waHref = wa("Hi, I'd like to check battery price.", 'home')
const emptyLink = computed(() => wa(`Hi, I could not find my car on your battery site${search.value ? ' (searched: ' + search.value.slice(0, 40) + ')' : ''}.`, 'search-empty'))

const filtered = computed(() => {
  if (!search.value.trim()) return cars
  const q = search.value.toLowerCase()
  return cars.filter(c =>
    c.make.toLowerCase().includes(q) ||
    c.model.toLowerCase().includes(q) ||
    false
  )
})
const carsByMake = computed(() => {
  const map = {}
  for (const car of filtered.value) (map[car.make] ||= []).push(car)
  return map
})
const visibleMakes = computed(() => Object.keys(carsByMake.value).sort())

useSeoMeta({
  title: 'Car Battery Replacement Singapore | SGCarPass Battery',
  description: 'Car battery replacement in Singapore. Send a photo of your battery label on WhatsApp and we confirm the right size and type, then quote. Amaron price list included.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://battery.sgcarpass.com/' }] })
</script>
