<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="font-serif text-3xl text-gray-900 leading-tight">Exide batteries</h1>
    <p class="text-gray-700 mt-3 leading-relaxed">We are updating our Exide price list. For a current price, send your car model or a photo of your battery label on WhatsApp.</p>
    <p class="mt-4"><a :href="wa" target="_blank" rel="noopener" class="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 font-medium">Ask on WhatsApp</a></p>
    <p class="mt-6"><NuxtLink to="/price" class="text-blue-700 underline">See Amaron prices</NuxtLink></p>
  </div>
</template>

<script setup>
const wa = `https://wa.me/6581525875?text=${encodeURIComponent("Hi, I'd like to check an Exide battery.\n\n(ref: sgcarpass /eprice/ ask)")}`
useSeoMeta({ title: 'Exide Batteries Singapore | SGCarPass Battery', description: 'Exide car batteries in Singapore. Ask on WhatsApp for the current price.', robots: 'noindex, follow' })
</script>
