<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100">
    <Navbar />

    <div class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-8xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            渡轮航班与票价总览
          </h1>
          <p class="text-lg text-slate-600">
            汇总翠华船务、全记渡及天星小轮等运营商的航班时间表与票价信息，集中展示维港与离岛主要渡轮的数据来源。
          </p>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-slate-600">正在获取最新航班与票价数据...</p>
        </div>

        <div v-else-if="error"
          class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <div class="text-xl font-semibold text-red-600 mb-3">加载失败</div>
          <p class="text-slate-600 mb-6">{{ error }}</p>
          <button @click="loadFerryData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <div v-else>
          <div v-if="showSummaryMetrics" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div v-for="metric in summaryMetrics" :key="metric.id"
              class="bg-white/90 rounded-2xl ring-1 ring-slate-200/60 px-4 py-5">
              <div :class="['text-3xl font-bold', metric.accent]">
                {{ metric.value }}
                <span v-if="metric.unit" class="text-base font-medium text-slate-500 ml-1">{{ metric.unit }}</span>
              </div>
              <div class="text-sm text-slate-500 mt-2">{{ metric.label }}</div>
              <div v-if="metric.helper" class="text-xs text-slate-400 mt-1">{{ metric.helper }}</div>
            </div>
          </div>

          <div v-if="hasFilter"
            class="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/80 border border-blue-100 rounded-2xl px-5 py-4">
            <div>
              <div class="text-xs font-medium text-blue-500 uppercase tracking-widest">当前筛选</div>
              <div class="text-base font-semibold text-slate-900 mt-1">{{ filterTagline }}</div>
              <p class="text-xs text-slate-500 mt-1">仅展示指定渡轮航线，可返回上一页查看完整列表。</p>
            </div>
            <button @click="goBack"
              class="inline-flex items-center px-4 py-2 rounded-xl border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
              返回上一页
            </button>
          </div>

          <div class="bg-white/90 rounded-2xl ring-1 ring-slate-200/60 mb-10 overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-slate-900 mb-2">数据说明</h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                航线分为持牌渡轮（L）与街渡（K）两类，目前页面整合翠华船务（香港仔 ⇄ 榕树湾）、全记渡（香港仔 ⇄ 索罟湾）及天星小轮（中环 / 湾仔 ⇄ 尖沙咀）等运营商的开放数据。
                时间表按「星期一至星期六（公众假期除外）」与「星期日及公众假期」划分，航班出发点涵盖香港仔、榕树湾、索罟湾、中环、湾仔、尖沙咀等码头。
                票价涵盖成人、儿童、长者、残疾人士的标准票、分段票、居民当日往返票、月票、旅游票及货物/单车收费（以官方规定单位计费）。
              </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div class="p-5 bg-slate-50/60">
                <div class="text-sm text-slate-500 mb-1">航线方向</div>
                <div class="text-base text-slate-700">香港仔 ↔ 榕树湾（经北角村）；香港仔 ↔ 索罟湾（经模达）</div>
              </div>
              <div class="p-5 bg-slate-50/60">
                <div class="text-sm text-slate-500 mb-1">数据更新时间</div>
                <div class="text-base text-slate-700">平台按官方开放数据实时获取，最后同步取决于官方发布</div>
              </div>
            </div>
          </div>

          <div v-if="showNoResult" class="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 mb-12">
            未找到匹配的渡轮航班，请返回查看全部列表。
          </div>

          <div v-for="service in displayServices" :key="service.id" class="space-y-6 mb-12">
            <div
              class="bg-white rounded-3xl ring-1 ring-slate-200/70 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">{{ service.name }}</h2>
                <p class="text-sm text-slate-600 mt-1">{{ service.description }}</p>
                <p v-if="service.tagline" class="text-xs text-slate-500 mt-2">{{ service.tagline }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <div class="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl">
                  航线 {{ service.summary.routeCount }} 条
                </div>
                <div class="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl">
                  工作日 {{ service.summary.weekdayTrips }} 班
                </div>
                <div class="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl">
                  假日 {{ service.summary.holidayTrips }} 班
                </div>
              </div>
            </div>

            <div v-for="route in service.routes" :key="route.key"
              class="bg-white rounded-3xl ring-1 ring-slate-200/70 overflow-hidden">
              <div class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                      {{ route.typeLabel }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                      {{ route.providerName }}
                    </span>
                    <span class="text-xs text-slate-500">代码：{{ route.routeType }}</span>
                  </div>
                  <h3 class="text-2xl font-semibold text-slate-900">{{ route.title }}</h3>
                  <p class="text-sm text-slate-600 mt-1">{{ route.description }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div class="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl">
                    平日班次 {{ route.weekdayTrips }} 班
                  </div>
                  <div class="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl">
                    假日班次 {{ route.holidayTrips }} 班
                  </div>
                  <div class="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl">
                    票价种类 {{ route.fareTypes }} 种
                  </div>
                </div>
              </div>

              <div class="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl border border-blue-100/60 p-6 space-y-5">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-lg font-semibold text-blue-800">航班时间表</h4>
                      <p class="text-xs text-blue-600">按日期类型与出发站点划分</p>
                    </div>
                    <div class="text-sm text-blue-600 bg-blue-50/70 px-3 py-1 rounded-full">
                      共 {{ route.totalTrips }} 班次
                    </div>
                  </div>

                  <div class="space-y-5">
                    <div v-for="section in route.timetables" :key="section.dateType"
                      class="rounded-2xl bg-white p-5 space-y-4">
                      <div class="flex items-center justify-between mb-3">
                        <div>
                          <div class="text-sm font-medium text-blue-700">{{ section.dateLabel }}</div>
                          <div class="text-xs text-slate-500">{{ section.dateDescription }}</div>
                        </div>
                        <div class="text-xs text-blue-700 bg-white/80 px-3 py-1 rounded-full">
                          {{ section.tripCount }} 班
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-for="start in section.stops" :key="start.key"
                          class="bg-slate-50 rounded-xl p-4 space-y-3">
                          <div class="flex items-center justify-between mb-3">
                            <div>
                              <div class="text-sm font-semibold text-slate-800">{{ start.label }}</div>
                              <div class="text-xs text-slate-500">{{ start.description }}</div>
                            </div>
                            <div class="text-xs text-slate-500 text-right">
                              <div>首班 {{ start.firstDeparture }}</div>
                              <div>末班 {{ start.lastDeparture }}</div>
                            </div>
                          </div>
                          <div :class="[
                            start.layout === 'range'
                              ? 'flex flex-col gap-3 text-left'
                              : 'flex flex-wrap gap-3 justify-center'
                          ]">
                            <div v-for="time in start.times" :key="time.id" :class="[
                              'text-sm font-medium text-slate-700 rounded-xl px-4 py-2',
                              start.layout === 'range'
                                ? 'bg-white border border-slate-200/60 w-full text-left'
                                : 'bg-slate-50 text-center min-w-[72px]'
                            ]">
                              {{ time.display }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-2xl border border-emerald-100/60 p-6 space-y-5">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-lg font-semibold text-emerald-800">票价结构</h4>
                      <p class="text-xs text-emerald-600">按日期类型与票价类别展示</p>
                    </div>
                    <div class="text-sm text-emerald-700 bg-white/80 ring-1 ring-emerald-200/70 px-3 py-1 rounded-full">
                      共 {{ route.fareTypes }} 种票价
                    </div>
                  </div>

                  <div class="space-y-5">
                    <div v-for="fareSection in route.fares" :key="fareSection.dateType"
                      class="bg-white rounded-2xl p-5 space-y-4">
                      <div class="flex items-center justify-between mb-3">
                        <div>
                          <div class="text-sm font-medium text-emerald-700">{{ fareSection.dateLabel }}</div>
                          <div class="text-xs text-slate-500">{{ fareSection.dateDescription }}</div>
                        </div>
                        <div class="text-xs text-emerald-600 bg-emerald-50/80 px-3 py-1 rounded-full">
                          {{ fareSection.typeCount }} 种票价
                        </div>
                      </div>

                      <div class="space-y-3">
                        <div v-for="category in fareSection.categories" :key="category.key"
                          class="bg-white rounded-xl p-4 space-y-3">
                          <div class="flex items-center justify-between mb-2">
                            <div>
                              <div class="text-sm font-semibold text-slate-800">{{ category.label }}</div>
                              <div class="text-xs text-slate-500">{{ category.description }}</div>
                            </div>
                            <div class="text-xs text-slate-500">{{ category.items.length }} 项</div>
                          </div>

                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div v-for="item in category.items" :key="item.key"
                              class="bg-slate-50 rounded-xl px-3 py-3">
                              <div class="flex items-start justify-between">
                                <div>
                                  <div class="flex items-center gap-2">
                                    <span :class="['px-2 py-1 text-xs font-medium rounded-md', item.badge]">
                                      {{ item.label }}
                                    </span>
                                    <span class="text-xs text-slate-400">{{ item.code }}</span>
                                  </div>
                                  <div class="text-xs text-slate-500 mt-1">{{ item.description }}</div>
                                </div>
                                <div class="text-base font-semibold text-emerald-700">{{ item.priceText }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { useFerryServices } from '@/composables/useFerryServices'

const route = useRoute()
const router = useRouter()

const {
  loading,
  error,
  services,
  summaryMetrics,
  loadFerryData,
} = useFerryServices()

const selectedProviderId = computed(() => {
  const value = route.query.provider
  return typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '' : ''
})

const selectedRouteKey = computed(() => {
  const value = route.query.route
  return typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '' : ''
})

const hasFilter = computed(() => Boolean(selectedProviderId.value || selectedRouteKey.value))

const filteredServices = computed(() => {
  if (!hasFilter.value) {
    return services.value
  }

  return services.value
    .map((service) => {
      if (selectedProviderId.value && service.id !== selectedProviderId.value) {
        return null
      }

      const filteredRoutes = selectedRouteKey.value
        ? service.routes.filter((routeItem) => routeItem.key === selectedRouteKey.value)
        : service.routes

      if (!filteredRoutes.length) {
        return null
      }

      const summary = {
        routeCount: filteredRoutes.length,
        weekdayTrips: filteredRoutes.reduce((sum, routeItem) => sum + (routeItem.weekdayTrips || 0), 0),
        holidayTrips: filteredRoutes.reduce((sum, routeItem) => sum + (routeItem.holidayTrips || 0), 0),
      }

      return {
        ...service,
        routes: filteredRoutes,
        summary,
      }
    })
    .filter(Boolean)
})

const displayServices = computed(() => filteredServices.value)

const showSummaryMetrics = computed(() => !hasFilter.value)

const showNoResult = computed(() => hasFilter.value && !displayServices.value.length && !loading.value && !error.value)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.replace({ path: '/ferry' })
}

const filterTagline = computed(() => {
  if (!hasFilter.value) {
    return ''
  }
  if (!displayServices.value.length) {
    return '暂无匹配航班'
  }
  const serviceNames = Array.from(new Set(displayServices.value.map((item) => item.name))).join('、')
  const routeTitles = displayServices.value
    .flatMap((service) => service.routes.map((routeItem) => routeItem.title))
    .filter(Boolean)
  const routeText = routeTitles.length ? routeTitles.join('、') : ''
  return routeText ? `${serviceNames} · ${routeText}` : serviceNames
})
</script>
