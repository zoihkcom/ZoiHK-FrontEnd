<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">URBTIX
              票务</span>
          </h1>
          <p class="text-slate-600">选择日期获取 URBTIX 官方批量数据（XML）</p>
        </div>

        <!-- Controls -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-6">
          <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div class="flex-1">
              <label class="block text-sm text-slate-600 mb-2">选择日期</label>
              <n-date-picker v-model:value="selectedDate" type="date" clearable :actions="['now']" />
            </div>
            <div class="flex-1">
              <label class="block text-sm text-slate-600 mb-2">搜索（标题 / 场地 / 类别）</label>
              <n-input v-model:value="search" clearable placeholder="输入关键字过滤结果" />
            </div>
            <div class="flex items-end gap-3">
              <n-button type="primary" :loading="loading" @click="loadData">
                <template #icon><i class="fa fa-refresh"></i></template>
                获取数据
              </n-button>
              <n-button tertiary @click="resetFilters">重置</n-button>
            </div>
          </div>

          <div v-if="batch" class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="bg-slate-50 rounded-xl px-4 py-3 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ filtered.length }}</div>
              <div class="text-xs text-slate-500">返回项目数</div>
            </div>
            <div class="bg-slate-50 rounded-xl px-4 py-3 text-center">
              <div class="text-2xl font-bold text-green-600">{{ batch.total }}</div>
              <div class="text-xs text-slate-500">来源总数 (XML)</div>
            </div>
            <div class="bg-slate-50 rounded-xl px-4 py-3 text-center">
              <div class="text-2xl font-bold text-purple-600">{{ uniqueVenues.length }}</div>
              <div class="text-xs text-slate-500">唯一场地</div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在获取数据...</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-16">
          <div class="text-red-500 mb-4">{{ error }}</div>
          <n-button type="primary" @click="loadData">重试</n-button>
          <p class="text-xs text-slate-500 mt-2">
            如果跨域受限，可尝试在新标签打开：
            <a :href="xmlUrl" class="text-blue-600 underline" target="_blank" rel="noopener">{{ xmlUrl }}</a>
          </p>
        </div>

        <!-- Empty -->
        <div v-else-if="filtered.length === 0" class="text-center py-16">
          <i class="fa fa-search text-6xl text-slate-300 mb-4"></i>
          <div class="text-slate-700 mb-2">没有找到匹配的项目</div>
          <div class="text-slate-500 text-sm">请更换关键词或选择其他日期</div>
        </div>

        <!-- List -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="ev in filtered" :key="ev.code"
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <h3 class="text-lg font-semibold text-slate-900 truncate">{{ ev.titleTc || ev.titleEg }}</h3>
                  <p class="text-sm text-slate-500 truncate" v-if="ev.titleEg && ev.titleTc">{{ ev.titleEg }}</p>
                </div>
                <a v-if="ev.link" :href="ev.link" target="_blank" rel="noopener"
                  class="shrink-0 inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  <i class="fa fa-external-link"></i> 详情
                </a>
              </div>

              <div class="mt-4 space-y-2 text-sm text-slate-700">
                <div class="flex items-center gap-2">
                  <i class="fa fa-calendar text-blue-500"></i>
                  <span>{{ formatRange(ev.stDate, ev.edDate) }}</span>
                </div>
                <div v-if="ev.category.main.tc || ev.category.sub.tc" class="flex items-center gap-2">
                  <i class="fa fa-tag text-emerald-500"></i>
                  <span class="truncate">
                    {{ [ev.category.main.tc || ev.category.main.eg, ev.category.sub.tc ||
                      ev.category.sub.eg].filter(Boolean).join(' · ') }}
                  </span>
                </div>
                <div v-if="ev.location.venueTc || ev.location.venueEg" class="flex items-center gap-2">
                  <i class="fa fa-map-marker text-rose-500"></i>
                  <span class="truncate">
                    {{ [ev.location.venueTc || ev.location.venueEg, ev.location.regionTc ||
                      ev.location.regionEg].filter(Boolean).join(' · ') }}
                  </span>
                </div>
              </div>

              <div v-if="ev.performances && ev.performances.length" class="mt-4">
                <details class="group">
                  <summary class="cursor-pointer select-none text-sm text-blue-700 hover:text-blue-800">
                    场次（{{ ev.performances.length }}）
                  </summary>
                  <ul class="mt-2 divide-y divide-slate-100 max-h-56 overflow-auto">
                    <li v-for="p in ev.performances" :key="p.refNo" class="py-2 flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="text-sm text-slate-900">{{ p.datetime }}</div>
                        <div class="text-xs text-slate-500 truncate" v-if="p.titleTc || p.titleEg">{{ p.titleTc ||
                          p.titleEg }}
                        </div>
                        <div class="text-xs text-slate-400 truncate" v-if="p.remarkTc || p.remarkEg">{{ p.remarkTc ||
                          p.remarkEg
                          }}</div>
                      </div>
                      <a v-if="p.link" :href="p.link" target="_blank" rel="noopener"
                        class="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
                        <i class="fa fa-external-link"></i>
                        查看
                      </a>
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>

        <p class="mt-10 text-center text-xs text-slate-500">
          数据来源：URBTIX（以所选日期的批量 XML 为准）。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { getTicketsBatch, formatYmd } from '@/api/tickets.js'

const loading = ref(false)
const error = ref('')
const selectedDate = ref(Date.now())
const batch = ref(null)
const events = ref([])
const search = ref('')

const xmlUrl = computed(() => {
  return `https://fs-open-1304240968.cos.ap-hongkong.myqcloud.com/prod/gprd/URBTIX_eventBatch_${formatYmd(selectedDate.value)}.xml`
})

const uniqueVenues = computed(() => {
  const set = new Set(events.value.map(e => e.location?.venueCode || `${e.location?.venueTc}|${e.location?.venueEg}`))
  return Array.from(set).filter(Boolean)
})

const formatRange = (st, ed) => {
  const fmt = (yyyymmdd) => {
    if (!yyyymmdd) return ''
    return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
  }
  if (!st && !ed) return '日期待定'
  if (st === ed) return fmt(st)
  return `${fmt(st)} ~ ${fmt(ed)}`
}

const filtered = computed(() => {
  if (!search.value) return events.value
  const q = search.value.toLowerCase()
  return events.value.filter(ev => [
    ev.titleTc, ev.titleEg,
    ev.location?.venueTc, ev.location?.venueEg,
    ev.category?.main?.tc, ev.category?.main?.eg,
    ev.category?.sub?.tc, ev.category?.sub?.eg,
  ].some(v => (v || '').toLowerCase().includes(q)))
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const { batch: b, events: list } = await getTicketsBatch(selectedDate.value)
    batch.value = b
    events.value = list
  } catch (e) {
    console.error(e)
    error.value = '获取或解析数据失败，请稍后重试。'
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  search.value = ''
}

onMounted(loadData)
watch(() => selectedDate.value, () => { if (!loading.value) loadData() })
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
