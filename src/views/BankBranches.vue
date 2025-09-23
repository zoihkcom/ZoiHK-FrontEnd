<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Bank Branches</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港银行网点信息</h1>
          <p class="text-base sm:text-lg text-slate-600">查询香港银行分行位置、服务时间与无障碍设施</p>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载银行网点数据...</span>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button
            @click="loadBranches"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ branches.length }}</div>
              <div class="text-sm text-slate-500">网点总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ bankCount }}</div>
              <div class="text-sm text-slate-500">银行数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-emerald-600">{{ barrierFreeCount }}</div>
              <div class="text-sm text-slate-500">提供无障碍设施</div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">银行网点地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图查看筛选后的银行网点标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <div class="flex flex-col xl:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索银行名称、分行或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedBank" :options="bankOptions" clearable placeholder="全部银行" />
            </div>
            <div class="w-full sm:w-56 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2">
              <span class="text-sm text-slate-600">仅看无障碍</span>
              <n-switch v-model:value="barrierFreeOnly" size="small" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="branch in filteredBranches"
              :key="branchKey(branch)"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
            >
              <div class="p-6 flex flex-col h-full">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ branch.bankName }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ branch.branchName }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ branch.district }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span
                      v-if="branch.hasBarrierFree"
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
                      <span>{{ branch.address }}</span>
                    </div>
                    <div v-if="branch.serviceHoursLines.length" class="flex gap-2">
                      <i class="fa fa-clock-o text-slate-400 mt-0.5"></i>
                      <div class="space-y-1">
                        <div v-for="line in branch.serviceHoursLines" :key="line">{{ line }}</div>
                      </div>
                    </div>
                    <div v-if="branch.barrierFreeText" class="flex gap-2">
                      <i class="fa fa-universal-access text-slate-400 mt-0.5"></i>
                      <span>{{ branch.barrierFreeText }}</span>
                    </div>
                  </div>

                  <div v-if="branch.barrierFreeItems.length" class="flex flex-wrap gap-2 mt-4">
                    <span
                      v-for="item in branch.barrierFreeItems"
                      :key="item"
                      class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium"
                    >
                      {{ item }}
                    </span>
                  </div>

                  <div class="mt-auto">
                    <div class="border-t border-slate-100 pt-4 mt-4 space-y-4">
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div class="text-center">
                          <div class="text-lg font-semibold text-blue-600">{{ branch.latitude.toFixed(4) }}</div>
                          <div class="text-xs text-slate-500">纬度</div>
                        </div>
                        <div class="text-center">
                          <div class="text-lg font-semibold text-purple-600">{{ branch.longitude.toFixed(4) }}</div>
                          <div class="text-xs text-slate-500">经度</div>
                        </div>
                        <div class="text-center" v-if="branch.barrierFreeItems.length">
                          <div class="text-lg font-semibold text-emerald-600">{{ branch.barrierFreeItems.length }}</div>
                          <div class="text-xs text-slate-500">无障碍设施项</div>
                        </div>
                      </div>

                      <button
                        @click="viewOnMap(branch)"
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

          <div v-if="filteredBranches.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的银行网点</h3>
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
const branches = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')
const selectedBank = ref('')
const barrierFreeOnly = ref(false)

const loadBranches = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator?lang=sc')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const records = Array.isArray(data?.result?.records) ? data.result.records : []

    branches.value = records
      .map(transformBranch)
      .filter(Boolean)
  } catch (err) {
    console.error('加载银行网点数据失败:', err)
    error.value = '加载银行网点数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const transformBranch = (item) => {
  if (!item) return null
  const lat = Number(item.latitude)
  const lng = Number(item.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const bankName = (item.bank_name || '').trim()
  const branchName = (item.branch_name || '').trim()
  const district = (item.district || '').trim() || '未分类地区'
  const address = (item.address || '').trim()
  const barrierFreeText = normalizeSpace(item.barrier_free_access)
  const barrierFreeItems = barrierFreeText
    ? barrierFreeText.split(/[,，]/).map(part => part.trim()).filter(Boolean)
    : []

  return {
    bankName: bankName || '未知银行',
    branchName: branchName || '未命名分行',
    district,
    address,
    latitude: lat,
    longitude: lng,
    hasBarrierFree: barrierFreeItems.length > 0,
    barrierFreeText,
    barrierFreeItems,
    serviceHoursLines: normalizeServiceHours(item.service_hours)
  }
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

const filteredBranches = computed(() => {
  let list = branches.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(branch =>
      branch.bankName.toLowerCase().includes(query) ||
      branch.branchName.toLowerCase().includes(query) ||
      branch.address.toLowerCase().includes(query) ||
      branch.district.toLowerCase().includes(query)
    )
  }

  if (selectedDistrict.value) {
    list = list.filter(branch => branch.district === selectedDistrict.value)
  }

  if (selectedBank.value) {
    list = list.filter(branch => branch.bankName === selectedBank.value)
  }

  if (barrierFreeOnly.value) {
    list = list.filter(branch => branch.hasBarrierFree)
  }

  return list
})

const districts = computed(() => {
  return [...new Set(branches.value.map(branch => branch.district))].sort()
})

const banks = computed(() => {
  return [...new Set(branches.value.map(branch => branch.bankName))].sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))
const bankOptions = computed(() => banks.value.map(b => ({ label: b, value: b })))

const bankCount = computed(() => banks.value.length)
const barrierFreeCount = computed(() => branches.value.filter(branch => branch.hasBarrierFree).length)

const mapCenter = computed(() => {
  const first = filteredBranches.value[0]
  if (first) {
    return { lat: first.latitude, lng: first.longitude }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredBranches.value.map(branch => ({
    lat: branch.latitude,
    lng: branch.longitude,
    title: `${branch.bankName} - ${branch.branchName}`
  }))
)

const viewOnMap = (branch) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  selectedBank.value = ''
  barrierFreeOnly.value = false
}

const branchKey = (branch) => `${branch.bankName}-${branch.branchName}-${branch.latitude}-${branch.longitude}`

onMounted(() => {
  loadBranches()
})
</script>
