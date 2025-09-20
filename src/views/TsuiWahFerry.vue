<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100">
    <Navbar />

    <div class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            翠华船务航班与票价总览
          </h1>
          <p class="text-lg text-slate-600">
            汇总翠华船务（香港仔 ⇄ 榕树湾，经北角村）的航班时间表与票价信息，数据来源：Tsui Wah Ferry Service (H.K.) Ltd. OpenData。
          </p>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-slate-600">正在获取最新航班与票价数据...</p>
        </div>

        <div v-else-if="error" class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <div class="text-xl font-semibold text-red-600 mb-3">加载失败</div>
          <p class="text-slate-600 mb-6">{{ error }}</p>
          <button @click="loadFerryData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

          <div class="bg-white/90 rounded-2xl ring-1 ring-slate-200/60 mb-10 overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-slate-900 mb-2">数据说明</h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                航线分为持牌渡轮（L）与街渡（K）两类，目前公开数据覆盖香港仔 ⇄ 榕树湾航线（L）。
                时间表按「星期一至星期六（公众假期除外）」与「星期日及公众假期」划分，航班分别以「香港仔」或「榕树湾」为出发点。
                票价涵盖成人、儿童、长者、残疾人士的标准票、分段票、居民当日往返票、月票及货物收费。
              </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div class="p-5 bg-slate-50/60">
                <div class="text-sm text-slate-500 mb-1">航线方向</div>
                <div class="text-base text-slate-700">香港仔 → 榕树湾（经北角村）、榕树湾 → 香港仔（经北角村）</div>
              </div>
              <div class="p-5 bg-slate-50/60">
                <div class="text-sm text-slate-500 mb-1">数据更新时间</div>
                <div class="text-base text-slate-700">平台按官方开放数据实时获取，最后同步取决于官方发布</div>
              </div>
            </div>
          </div>

          <div v-for="route in routes" :key="route.routeType"
            class="bg-white rounded-3xl ring-1 ring-slate-200/70 mb-12 overflow-hidden">
            <div class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                    {{ route.typeLabel }}
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
                        <div class="flex flex-wrap gap-3 justify-center">
                          <div v-for="time in start.times" :key="time.id"
                            class="text-sm font-medium text-slate-700 bg-slate-50 rounded-xl px-4 py-2 text-center min-w-[72px]">
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
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Navbar from '../components/Navbar.vue'

const loading = ref(true)
const error = ref('')
const fareRows = ref([])
const timeRows = ref([])

const routeTypeDetails = {
  L: {
    label: '持牌渡轮服务',
    title: '香港仔 ⇄ 榕树湾（经北角村）',
    description: 'Licensed ferry service，覆盖香港仔至榕树湾往返航线。',
  },
  K: {
    label: '街渡服务',
    title: 'Kaito 街渡服务',
    description: 'Kaito service，通常服务离岛及小型码头。',
  },
}

const dateTypeDetails = {
  W: {
    label: '星期一至星期六（公众假期除外）',
    short: '周一至周六',
    description: 'Mondays to Saturdays except public holidays',
    order: 1,
  },
  S: {
    label: '星期日及公众假期',
    short: '周日及公众假期',
    description: 'Sunday & public holidays',
    order: 2,
  },
}

const routeStartDetails = {
  A: {
    label: '香港仔出发',
    description: '香港仔 → 榕树湾，经北角村',
    order: 1,
  },
  Y: {
    label: '榕树湾出发',
    description: '榕树湾 → 香港仔，经北角村',
    order: 2,
  },
}

const fareTypeDetails = {
  A: {
    label: '成人',
    description: '成人单程票',
    category: 'standard',
    badge: 'bg-blue-100 text-blue-700',
    order: 1,
  },
  C: {
    label: '儿童',
    description: '1至12岁（含）儿童单程票',
    category: 'standard',
    badge: 'bg-emerald-100 text-emerald-700',
    order: 2,
  },
  S: {
    label: '长者',
    description: '65岁或以上乘客单程票',
    category: 'standard',
    badge: 'bg-purple-100 text-purple-700',
    order: 3,
  },
  D: {
    label: '残疾人士',
    description: '合资格残疾人士单程票',
    category: 'standard',
    badge: 'bg-amber-100 text-amber-700',
    order: 4,
  },
  AS: {
    label: '成人分段票',
    description: '榕树湾 ⇄ 北角村路段',
    category: 'section',
    badge: 'bg-blue-50 text-blue-700',
    order: 1,
  },
  CS: {
    label: '儿童分段票',
    description: '榕树湾 ⇄ 北角村路段',
    category: 'section',
    badge: 'bg-emerald-50 text-emerald-700',
    order: 2,
  },
  SS: {
    label: '长者分段票',
    description: '榕树湾 ⇄ 北角村路段',
    category: 'section',
    badge: 'bg-purple-50 text-purple-700',
    order: 3,
  },
  DS: {
    label: '残疾人士分段票',
    description: '榕树湾 ⇄ 北角村路段',
    category: 'section',
    badge: 'bg-amber-50 text-amber-700',
    order: 4,
  },
  RRA: {
    label: '居民当日往返（成人）',
    description: '周日及公众假期当日往返（成人）',
    category: 'resident',
    badge: 'bg-slate-100 text-slate-700',
    order: 1,
  },
  RRC: {
    label: '居民当日往返（儿童）',
    description: '周日及公众假期当日往返（儿童）',
    category: 'resident',
    badge: 'bg-slate-100 text-slate-700',
    order: 2,
  },
  MT: {
    label: '月票',
    description: '月票（不限日期）',
    category: 'monthly',
    badge: 'bg-indigo-100 text-indigo-700',
    order: 1,
  },
  F: {
    label: '货物收费',
    description: '货物每平方米收费',
    category: 'freight',
    badge: 'bg-slate-200 text-slate-700',
    order: 1,
  },
}

const fareCategoryDetails = {
  standard: {
    label: '标准单程票价',
    description: '成人、儿童、长者及残疾人士单程票',
    order: 1,
  },
  section: {
    label: '分段票价（榕树湾 ⇄ 北角村）',
    description: '仅适用于榕树湾与北角村之间路段',
    order: 2,
  },
  resident: {
    label: '居民当日往返票',
    description: '同日往返、限定周日及公众假期',
    order: 3,
  },
  monthly: {
    label: '月票',
    description: '月票持有人不限次数乘坐',
    order: 4,
  },
  freight: {
    label: '货物收费',
    description: '按货物占用面积收取费用',
    order: 5,
  },
  other: {
    label: '其他票价',
    description: '官方未分类的其他费用',
    order: 6,
  },
}

const dateOrder = ['W', 'S']
const routeStartOrder = ['A', 'Y']

const withTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`)
const assetBase = withTrailingSlash(import.meta.env.BASE_URL || '/')
const getAssetUrl = (name) => `${assetBase}data/tsui-wah/${name}`

const parseCsv = (text) => {
  const lines = text.trim().split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length === 0) {
    return []
  }
  const headers = lines[0].split(',').map((item) => item.trim())
  return lines.slice(1).map((line) => {
    const cells = line.split(',')
    const record = {}
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? '').trim()
    })
    return record
  })
}

const parseFareRows = (records) => {
  return records.map((record) => {
    const price = Number(record.fare_price)
    return {
      routeType: record.route_type,
      dateType: record.date_type,
      fareType: record.fare_type,
      farePrice: Number.isFinite(price) ? price : null,
    }
  })
}

const parseTimeRows = (records) => {
  return records.map((record) => ({
    routeType: record.route_type,
    dateType: record.date_type,
    routeStart: record.route_start,
    time: record.time,
  }))
}

const loadFerryData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [fareResponse, timeResponse] = await Promise.all([
      fetch(getAssetUrl('fare.csv')),
      fetch(getAssetUrl('time.csv')),
    ])

    if (!fareResponse.ok || !timeResponse.ok) {
      throw new Error('无法读取官方开放数据')
    }

    const [fareText, timeText] = await Promise.all([
      fareResponse.text(),
      timeResponse.text(),
    ])

    fareRows.value = parseFareRows(parseCsv(fareText))
    timeRows.value = parseTimeRows(parseCsv(timeText))
  } catch (err) {
    console.error('[TsuiWahFerry] 加载数据失败', err)
    error.value = '加载翠华船务数据时出错，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFerryData()
})

const unique = (items) => Array.from(new Set(items))

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map((value) => Number(value) || 0)
  return hours * 60 + minutes
}

const sortTimes = (times) => {
  const seen = new Set()
  const uniqueTimes = []
  times.forEach((value) => {
    if (!value) {
      return
    }
    if (seen.has(value)) {
      return
    }
    seen.add(value)
    uniqueTimes.push(value)
  })
  return uniqueTimes.sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
}

const formatScheduleTime = (value) => {
  if (!value) {
    return '—'
  }
  const [hour = '0', minute = '0'] = value.split(':')
  const hoursNum = Number.parseInt(hour, 10)
  const minutesNum = Number.parseInt(minute, 10)
  const paddedHour = Number.isFinite(hoursNum) ? String(hoursNum).padStart(2, '0') : hour.padStart(2, '0')
  const paddedMinute = Number.isFinite(minutesNum)
    ? String(minutesNum).padStart(2, '0')
    : minute.padStart(2, '0')
  return `${paddedHour}:${paddedMinute}`
}

const buildTimetables = (routeType) => {
  const rows = timeRows.value.filter((row) => row.routeType === routeType)
  const groupedByDate = new Map()

  rows.forEach((row) => {
    if (!groupedByDate.has(row.dateType)) {
      groupedByDate.set(row.dateType, new Map())
    }
    const startMap = groupedByDate.get(row.dateType)
    if (!startMap.has(row.routeStart)) {
      startMap.set(row.routeStart, [])
    }
    startMap.get(row.routeStart).push(row.time)
  })

  return dateOrder
    .filter((dateType) => groupedByDate.has(dateType))
    .map((dateType) => {
      const dateMeta = dateTypeDetails[dateType] ?? {
        label: dateType,
        description: '',
      }
      const startMap = groupedByDate.get(dateType)
      const stops = routeStartOrder
        .filter((start) => startMap.has(start))
        .map((start) => {
          const meta = routeStartDetails[start] ?? {
            label: start,
            description: '',
          }
          const sortedTimes = sortTimes(startMap.get(start))
          const formattedTimes = sortedTimes.map((value, index) => ({
            id: `${dateType}-${start}-${value}-${index}`,
            value,
            display: formatScheduleTime(value),
          }))
          return {
            key: `${dateType}-${start}`,
            label: meta.label,
            description: meta.description,
            times: formattedTimes,
            firstDeparture: formatScheduleTime(sortedTimes[0]),
            lastDeparture: formatScheduleTime(sortedTimes[sortedTimes.length - 1]),
          }
        })

      const tripCount = stops.reduce((sum, item) => sum + item.times.length, 0)

      return {
        dateType,
        dateLabel: dateMeta.label,
        dateDescription: dateMeta.description,
        tripCount,
        stops,
      }
    })
}

const fallbackFareDetail = {
  label: '未命名票价',
  description: '官方未提供详细说明',
  category: 'other',
  badge: 'bg-slate-100 text-slate-600',
  order: 99,
}

const buildFareSections = (routeType) => {
  const rows = fareRows.value.filter((row) => row.routeType === routeType)
  const groupedByDate = new Map()

  rows.forEach((row) => {
    if (!groupedByDate.has(row.dateType)) {
      groupedByDate.set(row.dateType, new Map())
    }
    const categoryMap = groupedByDate.get(row.dateType)
    const detail = fareTypeDetails[row.fareType] ?? fallbackFareDetail
    if (!categoryMap.has(detail.category)) {
      categoryMap.set(detail.category, [])
    }
    categoryMap.get(detail.category).push({
      code: row.fareType,
      price: row.farePrice,
      ...detail,
    })
  })

  return dateOrder
    .filter((dateType) => groupedByDate.has(dateType))
    .map((dateType) => {
      const dateMeta = dateTypeDetails[dateType] ?? {
        label: dateType,
        description: '',
      }
      const categoryMap = groupedByDate.get(dateType)
      const categories = Array.from(categoryMap.entries())
        .map(([categoryKey, items]) => {
          const categoryMeta = fareCategoryDetails[categoryKey] ?? fareCategoryDetails.other
          const sortedItems = items
            .slice()
            .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.code.localeCompare(b.code))
            .map((item) => ({
              key: `${dateType}-${item.code}`,
              code: item.code,
              label: item.label,
              description: item.description,
              badge: item.badge,
              priceText: formatFare(item.price),
            }))
          return {
            key: categoryKey,
            label: categoryMeta.label,
            description: categoryMeta.description,
            items: sortedItems,
            order: categoryMeta.order,
          }
        })
        .sort((a, b) => a.order - b.order)

      const typeCount = categories.reduce((sum, category) => sum + category.items.length, 0)

      return {
        dateType,
        dateLabel: dateMeta.label,
        dateDescription: dateMeta.description,
        typeCount,
        categories,
      }
    })
}

const formatFare = (value) => {
  if (value == null) {
    return '—'
  }
  const hasDecimal = !Number.isInteger(value)
  const minimumFractionDigits = hasDecimal ? 1 : 0
  return `HK$${value.toLocaleString('zh-HK', {
    minimumFractionDigits,
    maximumFractionDigits: 1,
  })}`
}

const routeKeys = computed(() => {
  const keys = new Set()
  timeRows.value.forEach((row) => keys.add(row.routeType))
  fareRows.value.forEach((row) => keys.add(row.routeType))
  return Array.from(keys)
})

const routes = computed(() => {
  return routeKeys.value.map((routeType) => {
    const meta = routeTypeDetails[routeType] ?? {
      label: `路线 ${routeType}`,
      title: `路线 ${routeType}`,
      description: '官方尚未提供详细描述',
    }

    const timetables = buildTimetables(routeType)
    const fares = buildFareSections(routeType)

    const weekdayTrips = timetables
      .filter((section) => section.dateType === 'W')
      .reduce((sum, section) => sum + section.tripCount, 0)

    const holidayTrips = timetables
      .filter((section) => section.dateType === 'S')
      .reduce((sum, section) => sum + section.tripCount, 0)

    const totalTrips = timetables.reduce((sum, section) => sum + section.tripCount, 0)

    const fareTypes = unique(
      fares.flatMap((section) => section.categories.flatMap((category) => category.items.map((item) => item.code))),
    ).length

    return {
      routeType,
      typeLabel: meta.label,
      title: meta.title,
      description: meta.description,
      timetables,
      fares,
      weekdayTrips,
      holidayTrips,
      totalTrips,
      fareTypes,
    }
  })
})

const summaryMetrics = computed(() => {
  const routeCount = routeKeys.value.length
  const routeLabels = routeKeys.value
    .map((key) => routeTypeDetails[key]?.label ?? key)
    .join('、')

  const totalTrips = timeRows.value.length
  const weekdayTrips = timeRows.value.filter((row) => row.dateType === 'W').length
  const holidayTrips = timeRows.value.filter((row) => row.dateType === 'S').length

  const fareTypeCount = unique(fareRows.value.map((row) => row.fareType)).length
  const fareNamesPreview = unique(
    fareRows.value
      .map((row) => fareTypeDetails[row.fareType]?.label ?? row.fareType)
      .filter(Boolean),
  )
    .slice(0, 4)
    .join('、')

  return [
    {
      id: 'routes',
      label: '航线类型',
      value: routeCount,
      unit: '种',
      helper: routeLabels || '暂无航线数据',
      accent: 'text-blue-600',
    },
    {
      id: 'fareTypes',
      label: '票价种类',
      value: fareTypeCount,
      unit: '项',
      helper: fareNamesPreview || '暂无票价信息',
      accent: 'text-emerald-600',
    },
    {
      id: 'weekdayTrips',
      label: '工作日班次',
      value: weekdayTrips,
      unit: '班',
      helper: '星期一至星期六（公众假期除外）',
      accent: 'text-sky-600',
    },
    {
      id: 'holidayTrips',
      label: '假日班次',
      value: holidayTrips,
      unit: '班',
      helper: '星期日及公众假期',
      accent: 'text-indigo-600',
    },
  ]
})
</script>
