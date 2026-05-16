<template>
  <div class="max-w-lg mx-auto px-4 py-8">
    <NuxtLink to="/" class="text-sm text-blue-600 mb-6 inline-block">← 返回</NuxtLink>

    <!-- 电瓶信息（后期从 API 拉） -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      <h1 class="text-xl font-bold text-gray-800 mb-1">NS60 标准型</h1>
      <p class="text-sm text-gray-400 mb-3">45Ah · 普通型 · 12个月保修</p>
      <p class="text-2xl font-bold text-blue-600">RM 189</p>
    </div>

    <!-- 获取优惠码表单 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 class="font-semibold text-gray-700 mb-4">获取优惠码</h2>

      <div v-if="!couponCode">
        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">手机号</label>
          <input
            v-model="phone"
            type="tel"
            placeholder="601XXXXXXXX"
            class="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          @click="generateCoupon"
          :disabled="loading || !phone"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ loading ? '生成中...' : '获取优惠码' }}
        </button>
        <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>
      </div>

      <!-- 成功：显示优惠码 -->
      <div v-else class="text-center">
        <p class="text-sm text-gray-500 mb-2">你的专属优惠码</p>
        <div class="text-4xl font-mono font-bold text-blue-600 tracking-widest mb-4">
          {{ couponCode }}
        </div>
        <p class="text-xs text-gray-400 mb-6">截图保存，到店出示给修理工即可</p>
        <a
          :href="`https://wa.me/60000000000?text=我有优惠码 ${couponCode}，想换电瓶`"
          target="_blank"
          class="block w-full bg-green-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-green-600 transition"
        >
          WhatsApp 预约门店
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const phone = ref('')
const loading = ref(false)
const error = ref('')
const couponCode = ref('')

const config = useRuntimeConfig()

async function generateCoupon() {
  if (!phone.value) return
  loading.value = true
  error.value = ''
  try {
    // 后端接好后取消注释
    // const res = await $fetch(`${config.public.apiBase}/public/coupon/generate`, {
    //   method: 'POST',
    //   body: { phone: phone.value, batteryProductId: useRoute().params.id },
    // })
    // couponCode.value = res.data.code

    // 暂时模拟
    await new Promise(r => setTimeout(r, 800))
    couponCode.value = 'BAT-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  } catch (e) {
    error.value = '生成失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
