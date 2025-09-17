<template>
  <div class="min-h-screen bg-white">
    <Navbar />

    <!-- Hero -->
    <section class="pt-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="py-16 sm:py-20 lg:py-24">
          <div class="text-center space-y-6">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">SmartHK 商城</span>
            </h1>
            <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              极简、克制、留白。发现为香港生活打造的精选服务与周边。
            </p>

            <!-- Subtle search (visual only) -->
            <div class="max-w-xl mx-auto">
              <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input class="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400" placeholder="你想找什么？例如：订阅、数据套餐、周边" />
              </div>
            </div>
          </div>

          <!-- Promos -->
          <div class="mt-16 grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(60%_40%_at_80%_0%,#60a5fa,transparent)]"></div>
              <div class="p-8 sm:p-10 lg:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                <div>
                  <div class="text-sm tracking-wide text-white/70">SmartHK Pro</div>
                  <h2 class="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">订阅，解锁更强体验</h2>
                  <p class="mt-3 text-white/70">更快响应、更全数据、更多 AI 能力。</p>
                  <div class="mt-6">
                    <router-link to="/pricing" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition">
                      立即了解
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </router-link>
                  </div>
                </div>
                <div class="shrink-0 w-full sm:w-64 h-40 sm:h-44 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"></div>
              </div>
            </div>

            <div class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200">
              <div class="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-blue-200/40 blur-2xl"></div>
              <div class="p-8 sm:p-10 lg:p-12 flex items-center justify-between gap-8">
                <div>
                  <div class="text-sm tracking-wide text-blue-700/70">Data Packs</div>
                  <h2 class="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">城市数据套餐</h2>
                  <p class="mt-3 text-slate-600">离线下载、批量导出、API 额度叠加。</p>
                  <div class="mt-6">
                    <router-link to="/datahub" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                      前往信息中心
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </router-link>
                  </div>
                </div>
                <div class="hidden sm:block shrink-0 w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-7xl mx-auto">
        <div class="mb-10 sm:mb-12 text-center">
          <h3 class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">精选商品</h3>
          <p class="mt-3 text-slate-600">按照苹果风格的留白与层次，专注内容本身。</p>
        </div>

        <div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="p in products" :key="p.id" class="group rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm hover:shadow-lg">
            <div class="p-6 sm:p-8">
              <div class="h-40 sm:h-44 mb-6 rounded-2xl bg-gradient-to-br" :class="p.bg"></div>
              <h4 class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">{{ p.title }}</h4>
              <p class="mt-2 text-slate-600">{{ p.desc }}</p>
              <div class="mt-6 flex items-center justify-between">
                <div class="text-slate-900 font-medium">{{ p.price }}</div>
                <button @click="go(p.cta.to)" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black transition">
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
        <div class="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="rounded-2xl bg-white border border-slate-200 p-4">
            <div class="text-2xl">🚚</div>
            <div class="mt-1 text-sm text-slate-600">快速访问与交付</div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200 p-4">
            <div class="text-2xl">🔒</div>
            <div class="mt-1 text-sm text-slate-600">安全支付与隐私</div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200 p-4">
            <div class="text-2xl">💬</div>
            <div class="mt-1 text-sm text-slate-600">7×24 支持</div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200 p-4">
            <div class="text-2xl">♻️</div>
            <div class="mt-1 text-sm text-slate-600">灵活升级与退款</div>
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
    desc: '进阶 AI 能力与高级数据服务。',
    price: 'HK$ 28 / 月',
    bg: 'from-slate-200 to-slate-100',
    cta: { text: '立即订阅', to: '/pricing' }
  },
  {
    id: 'pack',
    title: '城市数据导出包',
    desc: '批量导出与离线使用许可。',
    price: 'HK$ 49 起',
    bg: 'from-blue-200 to-indigo-100',
    cta: { text: '查看详情', to: '/datahub' }
  },
  {
    id: 'merch',
    title: 'SmartHK 周边',
    desc: '极简设计，贴纸与纪念卡片。',
    price: 'HK$ 19 起',
    bg: 'from-rose-200 to-pink-100',
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

