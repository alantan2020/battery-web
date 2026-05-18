<template>
  <div class="max-w-4xl mx-auto px-4 py-8">

    <!-- Hero -->
    <section class="text-center py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-3">
        Car Battery Replacement Singapore
      </h1>
      <p class="text-gray-500 mb-6">Find the right Amaron battery for your car — price, specs, and nearby installation.</p>

      <!-- Search -->
      <div class="max-w-md mx-auto">
        <input
          v-model="search"
          type="text"
          placeholder="Search by make or model (e.g. Toyota, Vios, Jazz...)"
          class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </section>

    <!-- Car list grouped by make -->
    <section>
      <template v-for="make in visibleMakes" :key="make">
        <div class="mb-6">
          <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{{ make }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="car in carsByMake[make]"
              :key="car.slug"
              :to="`/car/${car.slug}`"
              class="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between hover:border-blue-300 hover:shadow transition"
            >
              <div>
                <p class="font-semibold text-gray-800">{{ car.make }} {{ car.model }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ car.yearFrom }}–{{ car.yearTo }} · {{ car.batteries[0].partNo }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-blue-700 text-sm">from ${{ Math.min(...car.batteries.map(b => b.retailPrice)) }}</p>
                <p class="text-xs text-gray-400">{{ car.batteries[0].type }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </template>

      <p v-if="visibleMakes.length === 0" class="text-center text-gray-400 py-12">
        No results for "{{ search }}". <a href="https://wa.me/6581525875" class="text-blue-600">Ask us on WhatsApp</a>.
      </p>
    </section>

  </div>
</template>

<script setup>
import cars from '~/data/cars.json'

const search = ref('')

const filtered = computed(() => {
  if (!search.value.trim()) return cars
  const q = search.value.toLowerCase()
  return cars.filter(c =>
    c.make.toLowerCase().includes(q) ||
    c.model.toLowerCase().includes(q) ||
    c.batteries.some(b => b.partNo.toLowerCase().includes(q))
  )
})

const carsByMake = computed(() => {
  const map = {}
  for (const car of filtered.value) {
    if (!map[car.make]) map[car.make] = []
    map[car.make].push(car)
  }
  return map
})

const visibleMakes = computed(() => Object.keys(carsByMake.value).sort())

useSeoMeta({
  title: 'Car Battery Replacement Singapore | Genuine Amaron',
  description: 'Find the right Amaron battery for your car in Singapore. Toyota, Honda, Nissan, BMW, Mercedes and more. Competitive prices, same-day workshop installation.',
})
</script>
