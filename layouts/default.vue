<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-blue-600">SGCarPass</span>
          <span class="text-sm text-gray-500">汽车供应链管家</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink to="/price" class="text-sm text-gray-600 font-medium hover:text-blue-600">价格表</NuxtLink>
          <a
            href="https://wa.me/6581525875?text=Hi%2C%20I%27d%20like%20to%20check%20battery%20price."
            target="_blank"
            class="text-sm text-green-600 font-medium"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-white border-t mt-12">
      <div class="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
        © {{ new Date().getFullYear() }} SGCarPass · 汽车供应链管家 · Genuine Amaron · Singapore
      </div>
    </footer>
  </div>
</template>

<script setup>
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'SGCarPass Battery',
        url: 'https://battery.sgcarpass.com',
        telephone: '+6581525875',
        areaServed: 'Singapore',
        description: 'Genuine Amaron car battery supplier in Singapore. Competitive prices, same-day workshop installation for all car makes and models.',
        sameAs: [],
      }),
    },
  ],
})
</script>
