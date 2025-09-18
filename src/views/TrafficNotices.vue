<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />

    <div class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <span class="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            香港运输署数据源
          </span>
          <h1 class="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            交通通告资讯中心
          </h1>
          <p class="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            集中展示禁区、限速、封路、特别安排等最新通告，协助快速掌握各类道路与公共交通资讯。
          </p>

          <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              type="button"
              :disabled="isSelectedCategoryLoading || isSelectedCategoryRefreshing"
              @click="handleRefresh"
            >
              <svg
                v-if="isSelectedCategoryRefreshing || isSelectedCategoryLoading"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <i v-else class="fa fa-refresh"></i>
              <span>
                {{
                  isSelectedCategoryLoading
                    ? '加载中...'
                    : isSelectedCategoryRefreshing
                      ? '刷新中...'
                      : '手动刷新'
                }}
              </span>
            </button>

            <div v-if="currentLastRefreshedAt" class="flex items-center gap-2 text-sm text-slate-500">
              <i class="fa fa-clock-o"></i>
              <span>上次更新：{{ formatTimestamp(currentLastRefreshedAt) }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="currentError"
          class="mb-10 bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4"
        >
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600">
            <i class="fa fa-warning"></i>
          </div>
          <div class="flex-1 text-left">
            <h2 class="text-lg font-semibold text-red-700 mb-1">部分数据加载异常</h2>
            <p class="text-sm text-red-600 leading-relaxed">{{ currentError }}</p>
          </div>
        </div>

        <div v-if="isSelectedCategoryLoading" class="flex flex-col items-center justify-center py-24">
          <div class="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-slate-500 text-base">正在同步最新交通通告...</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <button
              v-for="category in categories"
              :key="category.key"
              type="button"
              @click="selectCategory(category.key)"
              class="bg-white border border-slate-200 rounded-2xl shadow-sm transition-shadow duration-200 p-6 flex flex-col gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              :class="[
                selectedCategoryKey === category.key
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'hover:shadow-md hover:border-blue-200'
              ]"
              :aria-pressed="selectedCategoryKey === category.key"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="category.summaryIconBg"
                >
                  <i :class="['fa', category.icon, category.summaryIconText, 'text-xl']"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">{{ category.name }}</h3>
                  <p class="text-xs text-slate-500 mt-1">{{ category.description }}</p>
                </div>
              </div>
              <div class="space-y-2 text-sm text-slate-600">
                <div>
                  通告数量：
                  <span
                    v-if="hasCategoryLoaded(category.key)"
                    class="font-semibold text-slate-900"
                  >
                    {{ getNoticeCount(category.key) }}
                  </span>
                  <span v-else class="text-slate-400">未加载</span>
                </div>
                <div v-if="getLatestNotice(category.key)">
                  最新生效：{{ formatEffectiveDate(getLatestNotice(category.key)?.startEffectiveDate) }}
                </div>
                <div v-else-if="hasCategoryLoaded(category.key)" class="text-slate-400">
                  暂无最新生效日期
                </div>
                <div v-else class="text-slate-400">
                  点击加载通告
                </div>
                <div
                  v-if="errorsByCategory[category.key]"
                  class="flex items-center gap-2 text-xs text-red-500"
                >
                  <i class="fa fa-exclamation-circle"></i>
                  <span>加载失败，请重试</span>
                </div>
              </div>
            </button>
          </div>

          <div class="space-y-12">
            <section
              v-if="selectedCategory"
              :key="selectedCategory.key"
              class="bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div class="p-6 sm:p-8 space-y-6">
                <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="flex items-start gap-4">
                    <div
                      class="w-14 h-14 rounded-2xl flex items-center justify-center"
                      :class="selectedCategory.headerIconBg"
                    >
                      <i :class="['fa', selectedCategory.icon, selectedCategory.headerIconText, 'text-2xl']"></i>
                    </div>
                    <div>
                      <h2 class="text-2xl font-semibold text-slate-900 tracking-tight">{{ selectedCategory.name }}</h2>
                      <p class="mt-1 text-sm text-slate-500 max-w-2xl">
                        {{ selectedCategory.description }}
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>通告数量：<span class="font-semibold text-slate-700">{{ getNoticeCount(selectedCategory.key) }}</span></span>
                    <span v-if="getLatestNotice(selectedCategory.key)">
                      最新生效：{{ formatEffectiveDate(getLatestNotice(selectedCategory.key)?.startEffectiveDate) }}
                    </span>
                  </div>
                </header>

                <div v-if="getNoticeCount(selectedCategory.key) > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <article
                    v-for="notice in currentNotices"
                    :key="getNoticeKey(notice)"
                    class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col gap-4"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <div class="text-xs uppercase tracking-wide text-slate-500">生效日期</div>
                        <div class="text-sm font-semibold text-slate-900">{{ formatEffectiveDate(notice.startEffectiveDate) }}</div>
                      </div>
                      <span class="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                        编号 {{ notice.id || '—' }}
                      </span>
                    </div>

                    <h3 class="text-lg font-semibold text-slate-900 leading-snug">
                      {{ displayTitle(notice) }}
                    </h3>

                    <p class="text-sm text-slate-600 leading-relaxed">
                      {{ getNoticePreview(notice) }}
                    </p>

                    <div class="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span class="px-2 py-1 bg-slate-100 rounded-full">
                        类型 {{ notice.trafficNoticesTypeId || '—' }}
                      </span>
                      <span class="px-2 py-1 bg-slate-100 rounded-full">
                        地区 {{ formatDistrict(notice.trafficNoticesDistrictId) }}
                      </span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        @click="toggleNotice(selectedCategory.key, getNoticeKey(notice))"
                      >
                        {{ isExpanded(selectedCategory.key, getNoticeKey(notice)) ? '收合详情' : '查看详情' }}
                      </button>

                      <a
                        v-for="(link, index) in notice.attachments"
                        :key="`${getNoticeKey(notice)}-${link.href}`"
                        :href="link.href"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        :class="
                          isPdfAttachment(link)
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        "
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          v-if="isPdfAttachment(link)"
                          class="fa fa-file-pdf-o text-rose-500"
                          aria-hidden="true"
                        ></i>
                        <span>{{ getAttachmentLabel(link, index) }}</span>
                      </a>
                    </div>

                    <div
                      v-if="isExpanded(selectedCategory.key, getNoticeKey(notice))"
                      class="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-sm text-slate-700 leading-relaxed"
                    >
                      <p
                        v-for="(paragraph, index) in getNoticeParagraphs(notice)"
                        :key="index"
                      >
                        {{ paragraph }}
                      </p>
                    </div>
                  </article>
                </div>

                <div
                  v-else
                  class="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm"
                >
                  暂无相关通告，建议稍后再查看。
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import {
  fetchProhibitedZoneNotices,
  fetchSpeedLimitsNotices,
  fetchRoadClosureNotices,
  fetchClearwaysNotices,
  fetchPublicTransportNotices,
  fetchSpecialArrangementNotices,
  fetchExpresswaysNotices,
  fetchOtherNotices
} from '@/api/traffic.js'

const categories = [
  {
    key: 'specialArrangement',
    name: '特别交通安排',
    description: '大型活动、节庆及紧急工程所需的交通与公共运输措施。',
    icon: 'fa-bullhorn',
    summaryIconBg: 'bg-rose-100',
    summaryIconText: 'text-rose-600',
    headerIconBg: 'bg-rose-100',
    headerIconText: 'text-rose-600',
    fetcher: fetchSpecialArrangementNotices
  },
  {
    key: 'roadClosure',
    name: '临时封路安排',
    description: '道路维修、活动或事故导致的封闭路段与改道安排。',
    icon: 'fa-road',
    summaryIconBg: 'bg-orange-100',
    summaryIconText: 'text-orange-600',
    headerIconBg: 'bg-orange-100',
    headerIconText: 'text-orange-600',
    fetcher: fetchRoadClosureNotices
  },
  {
    key: 'prohibitedZone',
    name: '临时禁区通告',
    description: '指定路段临时禁止特定车辆驶入或停泊的安排。',
    icon: 'fa-ban',
    summaryIconBg: 'bg-red-100',
    summaryIconText: 'text-red-600',
    headerIconBg: 'bg-red-100',
    headerIconText: 'text-red-600',
    fetcher: fetchProhibitedZoneNotices
  },
  {
    key: 'clearways',
    name: '禁止上下客区',
    description: '临时限制区与禁止上下客/货的路段公告。',
    icon: 'fa-exclamation-circle',
    summaryIconBg: 'bg-amber-100',
    summaryIconText: 'text-amber-600',
    headerIconBg: 'bg-amber-100',
    headerIconText: 'text-amber-600',
    fetcher: fetchClearwaysNotices
  },
  {
    key: 'speedLimits',
    name: '临时车速限制',
    description: '为工程或安全需要而调整的临时车速限制。',
    icon: 'fa-tachometer',
    summaryIconBg: 'bg-blue-100',
    summaryIconText: 'text-blue-600',
    headerIconBg: 'bg-blue-100',
    headerIconText: 'text-blue-600',
    fetcher: fetchSpeedLimitsNotices
  },
  {
    key: 'publicTransport',
    name: '公共交通安排',
    description: '巴士、小巴及其他公共交通服务的临时调整。',
    icon: 'fa-bus',
    summaryIconBg: 'bg-emerald-100',
    summaryIconText: 'text-emerald-600',
    headerIconBg: 'bg-emerald-100',
    headerIconText: 'text-emerald-600',
    fetcher: fetchPublicTransportNotices
  },
  {
    key: 'expressways',
    name: '快速公路通告',
    description: '快速公路界限及相关特别安排更新。',
    icon: 'fa-bolt',
    summaryIconBg: 'bg-indigo-100',
    summaryIconText: 'text-indigo-600',
    headerIconBg: 'bg-indigo-100',
    headerIconText: 'text-indigo-600',
    fetcher: fetchExpresswaysNotices
  },
  {
    key: 'otherNotices',
    name: '其他交通通告',
    description: '未分类但与道路安全及监管相关的官方公告。',
    icon: 'fa-info-circle',
    summaryIconBg: 'bg-slate-200',
    summaryIconText: 'text-slate-600',
    headerIconBg: 'bg-slate-200',
    headerIconText: 'text-slate-600',
    fetcher: fetchOtherNotices
  }
]

const selectedCategoryKey = ref(categories[0]?.key || '')
const noticesByCategory = ref({})
const loadingCategory = ref('')
const refreshingCategory = ref('')
const errorsByCategory = ref({})
const lastRefreshedAtMap = ref({})
const expandedNotices = ref({})
const selectedCategory = computed(() =>
  categories.find(category => category.key === selectedCategoryKey.value) || null
)

const currentNotices = computed(
  () => noticesByCategory.value[selectedCategoryKey.value] || []
)

const isSelectedCategoryLoading = computed(
  () => loadingCategory.value === selectedCategoryKey.value
)

const isSelectedCategoryRefreshing = computed(
  () => refreshingCategory.value === selectedCategoryKey.value
)

const currentError = computed(
  () => errorsByCategory.value[selectedCategoryKey.value] || ''
)

const currentLastRefreshedAt = computed(
  () => lastRefreshedAtMap.value[selectedCategoryKey.value] || null
)

const ensureCategoryData = async (categoryKey, { force = false } = {}) => {
  const category = categories.find(item => item.key === categoryKey)
  if (!category) {
    return
  }

  const hasLoaded = Boolean(lastRefreshedAtMap.value[categoryKey])
  const isBusy =
    loadingCategory.value === categoryKey || refreshingCategory.value === categoryKey

  if (!force && (hasLoaded || isBusy)) {
    return
  }

  if (force) {
    refreshingCategory.value = categoryKey
  } else {
    loadingCategory.value = categoryKey
  }

  errorsByCategory.value = {
    ...errorsByCategory.value,
    [categoryKey]: ''
  }

  try {
    const data = await category.fetcher()
    noticesByCategory.value = {
      ...noticesByCategory.value,
      [categoryKey]: data
    }
    lastRefreshedAtMap.value = {
      ...lastRefreshedAtMap.value,
      [categoryKey]: new Date()
    }
  } catch (err) {
    console.error(`加载交通通告失败 (${categoryKey}):`, err)
    errorsByCategory.value = {
      ...errorsByCategory.value,
      [categoryKey]: err?.message || '交通通告数据加载失败，请稍后再试。'
    }
  } finally {
    if (loadingCategory.value === categoryKey) {
      loadingCategory.value = ''
    }
    if (refreshingCategory.value === categoryKey) {
      refreshingCategory.value = ''
    }
  }
}

const handleRefresh = () => {
  const categoryKey = selectedCategoryKey.value
  if (!categoryKey) {
    return
  }

  if (
    loadingCategory.value === categoryKey ||
    refreshingCategory.value === categoryKey
  ) {
    return
  }

  ensureCategoryData(categoryKey, { force: true })
}

const selectCategory = categoryKey => {
  if (!categoryKey || selectedCategoryKey.value === categoryKey) {
    ensureCategoryData(categoryKey)
    return
  }

  selectedCategoryKey.value = categoryKey
  expandedNotices.value = {}
  ensureCategoryData(categoryKey)
}

const hasCategoryLoaded = categoryKey => {
  return Boolean(lastRefreshedAtMap.value[categoryKey])
}

const getNoticeCount = categoryKey => {
  return noticesByCategory.value[categoryKey]?.length || 0
}

const getLatestNotice = categoryKey => {
  const list = noticesByCategory.value[categoryKey] || []
  return list.length > 0 ? list[0] : null
}

const formatEffectiveDate = value => {
  if (!value) {
    return '待定'
  }

  const parts = value.split('.')

  if (parts.length !== 3) {
    return value
  }

  const [day, month, year] = parts
  return `${year}年${month.padStart(2, '0')}月${day.padStart(2, '0')}日`
}

const formatTimestamp = date => {
  if (!date) {
    return ''
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const displayTitle = notice => {
  return notice.titleTc || notice.titleSc || notice.titleEn || '未命名通告'
}

const getNoticeKey = notice => {
  if (!notice) {
    return 'unknown-notice'
  }

  if (notice.id) {
    return `${notice.id}`
  }

  const title = displayTitle(notice)
  const date = notice.startEffectiveDate || 'undated'
  return `${title}-${date}`
}

const truncateText = (text, length = 160) => {
  if (!text) {
    return '暂无详细内容'
  }

  if (text.length <= length) {
    return text
  }

  return `${text.slice(0, length)}...`
}

const getNoticePreview = notice => {
  return truncateText(notice.summary)
}

const isPdfAttachment = link => {
  if (!link?.href) {
    return false
  }
  return link.href.toLowerCase().endsWith('.pdf')
}

const getAttachmentLabel = (link, index) => {
  if (isPdfAttachment(link)) {
    return `文件${index + 1}`
  }
  if (link?.label) {
    return link.label
  }
  return `附件${index + 1}`
}

const formatDistrict = districtId => {
  if (!districtId) {
    return '全港'
  }
  return `#${districtId}`
}

const isExpanded = (categoryKey, noticeId) => {
  if (!noticeId) {
    return false
  }
  const key = `${categoryKey}-${noticeId}`
  return Boolean(expandedNotices.value[key])
}

const toggleNotice = (categoryKey, noticeId) => {
  if (!noticeId) {
    return
  }
  const key = `${categoryKey}-${noticeId}`
  expandedNotices.value = {
    ...expandedNotices.value,
    [key]: !expandedNotices.value[key]
  }
}

const getNoticeParagraphs = notice => {
  if (!notice?.contents) {
    return []
  }

  const preferred = [notice.contents.tc, notice.contents.sc, notice.contents.en]
  for (const item of preferred) {
    if (item?.paragraphs && item.paragraphs.length > 0) {
      return item.paragraphs
    }
  }

  return []
}

onMounted(() => {
  if (selectedCategoryKey.value) {
    ensureCategoryData(selectedCategoryKey.value)
  }
})
</script>
