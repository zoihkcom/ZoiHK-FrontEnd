<template>
  <div class="min-h-screen bg-white">
    <Navbar />

    <!-- Hero -->
    <section class="min-h-screen bg-white pt-20 px-4 sm:px-6 lg:px-8 flex items-center">
      <div class="max-w-6xl mx-auto w-full">
        <div class="py-20 sm:py-28 lg:py-32">
          <div class="text-center space-y-8">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
              <span
                class="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">SmartHK
                商城</span>
            </h1>
            <p class="text-xl sm:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
              智慧香港，一站购齐。从数字服务到实用配件，让生活更简单。
            </p>

            <!-- Subtle search (visual only) -->
            <div class="max-w-2xl mx-auto pt-8">
              <div
                class="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input class="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-lg"
                  placeholder="你想找什么？例如：订阅、数据套餐、SIM卡、周边" />
              </div>
            </div>
          </div>

          <!-- Promos -->
          <div class="mt-24 grid gap-8 lg:grid-cols-2">
            <div
              class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(60%_40%_at_80%_0%,#60a5fa,transparent)]">
              </div>
              <div class="p-10 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center h-full">
                <div class="lg:col-span-3 flex flex-col justify-between h-full min-h-[280px]">
                  <div>
                    <div class="text-sm tracking-wide text-white/60 uppercase font-medium">SmartHK Pro</div>
                    <h2 class="mt-6 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight">订阅，解锁更强体验
                    </h2>
                    <p class="mt-6 text-xl text-white/70 leading-relaxed">更快响应、更全数据、更多 AI 能力。</p>
                  </div>
                  <div class="mt-8">
                    <router-link to="/pricing"
                      class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                      立即了解
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </router-link>
                  </div>
                </div>
                <div
                  class="lg:col-span-2 w-full h-48 lg:h-56 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=edges"
                    alt="SmartHK Pro" class="w-full h-full object-cover opacity-80" />
                </div>
              </div>
            </div>

            <div
              class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200">
              <div class="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-blue-200/40 blur-2xl"></div>
              <div class="p-10 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center h-full">
                <div class="lg:col-span-3 flex flex-col justify-between h-full min-h-[280px]">
                  <div>
                    <div class="text-sm tracking-wide text-blue-700/60 uppercase font-medium">SIM Card</div>
                    <h2
                      class="mt-6 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-tight">
                      香港 SIM 卡</h2>
                    <p class="mt-6 text-xl text-slate-600 leading-relaxed">无限流量、本地通话、高速网络，香港生活必备。</p>
                  </div>
                  <div class="mt-8">
                    <router-link to="/datahub"
                      class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                      查看套餐
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </router-link>
                  </div>
                </div>
                <div
                  class="lg:col-span-2 w-full h-48 lg:h-56 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-slate-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop&crop=center"
                    alt="SIM卡" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-6xl mx-auto">
        <div class="mb-16 sm:mb-20 text-center">
          <h3 class="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">精选商品</h3>
          <p class="mt-6 text-xl text-slate-500 font-light max-w-2xl mx-auto">香港生活必需品，从数字服务到实用配件，一站式购齐。</p>
        </div>

        <div class="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="p in products" :key="p.id"
            class="group rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <div class="h-48 sm:h-52 overflow-hidden">
              <img :src="p.image" :alt="p.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-6 sm:p-8">
              <h4 class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 mb-3">{{ p.title }}</h4>
              <p class="text-slate-600 leading-relaxed mb-6">{{ p.desc }}</p>
              <div class="flex items-center justify-between">
                <div class="text-slate-900 font-semibold text-lg">{{ p.price }}</div>
                <button @click="go(p.cta.to)"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black transition-colors duration-200 font-medium">
                  {{ p.cta.text }}
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Service bar -->
        <div class="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div class="rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div class="text-2xl mb-3">🚚</div>
            <div class="text-sm text-slate-600 font-medium">快速访问与交付</div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div class="text-2xl mb-3">🔒</div>
            <div class="text-sm text-slate-600 font-medium">安全支付与隐私</div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div class="text-2xl mb-3">💬</div>
            <div class="text-sm text-slate-600 font-medium">7×24 支持</div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div class="text-2xl mb-3">♻️</div>
            <div class="text-sm text-slate-600 font-medium">灵活升级与退款</div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()

const products = ref([
  {
    id: 'pro',
    title: 'SmartHK Pro 订阅',
    desc: '进阶 AI 能力与高级数据服务，为您提供更精准的香港城市信息体验。',
    price: 'HK$ 28 / 月',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&crop=center',
    cta: { text: '立即订阅', to: '/pricing' }
  },
  {
    id: 'simcard',
    title: '香港 SIM 卡套餐',
    desc: '多种流量套餐可选，包含本地通话，支持5G高速网络，新用户专享优惠。',
    price: 'HK$ 88 起',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center',
    cta: { text: '选择套餐', to: '/simcard' }
  },
  {
    id: 'merch',
    title: '香港生活套装',
    desc: '八达通贴纸、地铁周边、实用小工具等配件，让香港生活更便捷。',
    price: 'HK$ 19 起',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&crop=center',
    cta: { text: '即将上架', to: '/store' }
  },
])

const go = (to) => router.push(to)

onMounted(() => {
  document.title = '商城 - SmartHK'
})
</script>

<style scoped>
/* 轻微的动效，保持克制 */
.group:hover .floating {
  transform: translateY(-2px);
}
</style>
