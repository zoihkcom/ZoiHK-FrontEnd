<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Bank ATMs</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港银行自动柜员机信息</h1>
          <p class="text-base sm:text-lg text-slate-600">查看香港各区银行自动柜员机位置、支持功能与网络</p>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载自动柜员机数据...</span>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button
            @click="loadAtms"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ atms.length }}</div>
              <div class="text-sm text-slate-500">自动柜员机总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ bankCount }}</div>
              <div class="text-sm text-slate-500">覆盖银行</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-emerald-600">{{ roundTheClockCount }}</div>
              <div class="text-sm text-slate-500">24小时服务</div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">自动柜员机地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图查看筛选后的自动柜员机标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <div class="flex flex-col xl:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索银行、地址或功能..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedBank" :options="bankOptions" clearable placeholder="全部银行" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedNetwork" :options="networkOptions" clearable placeholder="全部网络" />
            </div>
            <div class="w-full sm:w-56 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2">
              <span class="text-sm text-slate-600">仅看24小时</span>
              <n-switch v-model:value="onlyRoundTheClock" size="small" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="atm in filteredAtms"
              :key="atmKey(atm)"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
            >
              <div class="p-6 flex flex-col h-full">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ atm.bankName }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ atm.typeOfMachine }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ atm.district }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2 text-right">
                    <span
                      v-if="atm.is24Hours"
                      class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                    >
                      24小时
                    </span>
                    <span
                      v-if="atm.hasBarrierFree"
                      class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full"
                    >
                      无障碍
                    </span>
                  </div>
                </div>

                <div class="flex-1 flex flex-col">
                  <div class="space-y-3 text-sm text-slate-600">
                    <div class="flex gap-2">
                      <i class="fa fa-home text-slate-400 mt-0.5"></i>
                      <span>{{ atm.address }}</span>
                    </div>
                    <div v-if="atm.serviceHoursLines.length" class="flex gap-2">
                      <i class="fa fa-clock-o text-slate-400 mt-0.5"></i>
                      <div class="space-y-1">
                        <div v-for="line in atm.serviceHoursLines" :key="line">{{ line }}</div>
                      </div>
                    </div>
                    <div v-if="atm.functionItems.length" class="flex gap-2">
                      <i class="fa fa-credit-card text-slate-400 mt-0.5"></i>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="item in atm.functionItems"
                          :key="item"
                          class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium"
                        >
                          {{ item }}
                        </span>
                      </div>
                    </div>
                    <div v-if="atm.barrierFreeText" class="flex gap-2">
                      <i class="fa fa-universal-access text-slate-400 mt-0.5"></i>
                      <span>{{ atm.barrierFreeText }}</span>
                    </div>
                    <div class="flex gap-2">
                      <i class="fa fa-globe text-slate-400 mt-0.5"></i>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="nw in atm.networkItems"
                          :key="nw"
                          class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium"
                        >
                          {{ nw }}
                        </span>
                      </div>
                    </div>
                    <div v-if="atm.currencies.length" class="flex gap-2">
                      <i class="fa fa-money text-slate-400 mt-0.5"></i>
                      <span>{{ atm.currencies.join(' / ') }}</span>
                    </div>
                  </div>

                  <div class="mt-auto">
                    <div class="border-t border-slate-100 pt-4 mt-4 space-y-4">
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div class="text-center">
                          <div class="text-lg font-semibold text-blue-600">{{ atm.latitude.toFixed(4) }}</div>
                          <div class="text-xs text-slate-500">纬度</div>
                        </div>
                        <div class="text-center">
                          <div class="text-lg font-semibold text-purple-600">{{ atm.longitude.toFixed(4) }}</div>
                          <div class="text-xs text-slate-500">经度</div>
                        </div>
                        <div class="text-center" v-if="atm.functionItems.length">
                          <div class="text-lg font-semibold text-emerald-600">{{ atm.functionItems.length }}</div>
                          <div class="text-xs text-slate-500">提供功能项</div>
                        </div>
                      </div>

                      <button
                        @click="viewOnMap(atm)"
                        class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <i class="fa fa-map mr-2"></i>
                        地图查看
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredAtms.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的自动柜员机</h3>
            <p class="text-slate-600 mb-6">请尝试调整搜索条件或筛选器</p>
            <button
              @click="resetFilters"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              重置筛选器
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GoogleMap from '@/components/GoogleMap.vue'

const loading = ref(true)
const error = ref('')
const atms = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')
const selectedBank = ref('')
const selectedNetwork = ref('')
const onlyRoundTheClock = ref(false)

const loadAtms = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('https://api.hkma.gov.hk/public/bank-svf-info/banks-atm-locator?lang=sc')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const records = Array.isArray(data?.result?.records) ? data.result.records : []

    atms.value = records
      .map(transformAtm)
      .filter(Boolean)
  } catch (err) {
    console.error('加载自动柜员机数据失败:', err)
    error.value = '加载自动柜员机数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const transformAtm = (item) => {
  if (!item) return null
  const lat = Number(item.latitude)
  const lng = Number(item.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const bankName = (item.bank_name || '').trim()
  const typeOfMachine = (item.type_of_machine || '').trim() || '自动柜员机'
  const district = (item.district || '').trim() || '未分类地区'
  const address = (item.address || '').trim()
  const barrierFreeText = normalizeSpace(item.barrier_free_access)
  const barrierFreeItems = barrierFreeText
    ? barrierFreeText.split(/[,，]/).map(part => part.trim()).filter(Boolean)
    : []

  return {
    bankName: bankName || '未知银行',
    typeOfMachine,
    district,
    address,
    latitude: lat,
    longitude: lng,
    serviceHoursLines: normalizeServiceHours(item.service_hours),
    barrierFreeText,
    hasBarrierFree: barrierFreeItems.length > 0,
    functionItems: splitItems(item.function),
    networkItems: splitItems(item.network),
    currencies: splitItems(item.currencies_supported),
    is24Hours: detectRoundTheClock(item.service_hours)
  }
}

const splitItems = (value) => {
  if (typeof value !== 'string') return []
  return value
    .split(/[,，]/)
    .map(part => part.trim())
    .filter(Boolean)
}

const normalizeServiceHours = (value) => {
  if (typeof value !== 'string') return []
  return value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .split(/\n+/)
    .flatMap(line => line.split(/(?=星期)/))
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

const normalizeSpace = (value) => {
  if (typeof value !== 'string') return ''
  return value
    .replace(/\s+/g, ' ')
    .trim()
}

const detectRoundTheClock = (value) => {
  if (typeof value !== 'string') return false
  return /24\s*小时/.test(value) || /24H/i.test(value)
}

const filteredAtms = computed(() => {
  let list = atms.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(atm =>
      atm.bankName.toLowerCase().includes(query) ||
      atm.address.toLowerCase().includes(query) ||
      atm.district.toLowerCase().includes(query) ||
      atm.functionItems.some(item => item.toLowerCase().includes(query)) ||
      atm.networkItems.some(item => item.toLowerCase().includes(query))
    )
  }

  if (selectedDistrict.value) {
    list = list.filter(atm => atm.district === selectedDistrict.value)
  }

  if (selectedBank.value) {
    list = list.filter(atm => atm.bankName === selectedBank.value)
  }

  if (selectedNetwork.value) {
    list = list.filter(atm => atm.networkItems.includes(selectedNetwork.value))
  }

  if (onlyRoundTheClock.value) {
    list = list.filter(atm => atm.is24Hours)
  }

  return list
})

const districts = computed(() => {
  return [...new Set(atms.value.map(atm => atm.district))].sort()
})

const banks = computed(() => {
  return [...new Set(atms.value.map(atm => atm.bankName))].sort()
})

const networks = computed(() => {
  return [...new Set(atms.value.flatMap(atm => atm.networkItems))]
    .filter(Boolean)
    .sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))
const bankOptions = computed(() => banks.value.map(b => ({ label: b, value: b })))
const networkOptions = computed(() => networks.value.map(n => ({ label: n, value: n })))

const bankCount = computed(() => banks.value.length)
const roundTheClockCount = computed(() => atms.value.filter(atm => atm.is24Hours).length)

const mapCenter = computed(() => {
  const first = filteredAtms.value[0]
  if (first) {
    return { lat: first.latitude, lng: first.longitude }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredAtms.value.map(atm => ({
    lat: atm.latitude,
    lng: atm.longitude,
    title: `${atm.bankName} - ${atm.typeOfMachine}`
  }))
)

const viewOnMap = (atm) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${atm.latitude},${atm.longitude}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  selectedBank.value = ''
  selectedNetwork.value = ''
  onlyRoundTheClock.value = false
}

const atmKey = (atm) => `${atm.bankName}-${atm.address}-${atm.latitude}-${atm.longitude}`

onMounted(() => {
  loadAtms()
})
</script>
