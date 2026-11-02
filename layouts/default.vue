<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
    <header class="border-b border-gray-300 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-baseline justify-between gap-4">
        <NuxtLink to="/" class="font-serif text-xl text-gray-900">SGCarPass <span class="text-blue-700">Battery</span></NuxtLink>
        <nav class="flex items-baseline gap-5 text-sm">
          <NuxtLink to="/" class="text-gray-700 hover:underline">Find your car</NuxtLink>
          <NuxtLink to="/price" class="text-gray-700 hover:underline">Amaron prices</NuxtLink>
          <a :href="waHref" target="_blank" rel="noopener" class="text-green-700 font-medium hover:underline">WhatsApp</a>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-300 mt-12">
      <div class="max-w-3xl mx-auto px-4 py-6 text-sm text-gray-500">
        <p>SGCarPass Battery, Singapore. Prices are as of November 2026, GST included. Not sure which battery you have? Send a photo of the label on WhatsApp.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const route = useRoute()
// 来源标记：同一个 WhatsApp 号接两个网站，消息末尾带 (ref: sgcarpass 页面路径 位置)，客服后台据此区分渠道
const waHref = computed(() => `https://wa.me/6581525875?text=${encodeURIComponent(`Hi, I'd like to check battery price.\n\n(ref: sgcarpass ${route.path} header)`)}`)
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
        description: 'Car battery prices and fitment guide for Singapore, with replacement arranged on WhatsApp.',
        sameAs: [],
      }),
    },
  ],
})
</script>
