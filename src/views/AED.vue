<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong AED</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港AED（自动体外除颤器）信息</h1>
          <p class="text-base sm:text-lg text-slate-600">查看各地点AED分布与可达性</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载AED数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadAedData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ aeds.length }}</div>
              <div class="text-sm text-slate-500">AED总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ brandCount }}</div>
              <div class="text-sm text-slate-500">品牌数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ publicAccessibleCount }}</div>
              <div class="text-sm text-slate-500">可供任何人使用</div>
            </div>
          </div>

          <!-- Map View (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">AED分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的位置</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索名称、地址或安装位置..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedAccess" :options="accessOptions" clearable placeholder="是否对公众开放" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedGround" :options="groundOptions" clearable placeholder="地面类别" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedBrand" :options="brandOptions" clearable placeholder="品牌" />
            </div>
          </div>

          <!-- AED List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="(item, idx) in filteredAeds" :key="idx"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ item.name }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ item.address }}</p>
                    <div v-if="item.locationDetail" class="text-sm text-slate-600">
                      <i class="fa fa-map-pin mr-2"></i>
                      {{ item.locationDetail }}
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {{ item.brand || '未知品牌' }}
                    </span>
                    <div v-if="item.model" class="text-xs text-slate-500 mt-1">{{ item.model }}</div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold" :class="item.accessibleAnyone === 'Yes' ? 'text-green-600' : 'text-slate-600'">
                      {{ item.accessibleAnyone === 'Yes' ? '对公众开放' : (item.accessibleAnyone || '未知') }}
                    </div>
                    <div class="text-xs text-slate-500">可供任何人使用</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ formatCoord(item.lat) }}</div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ formatCoord(item.lng) }}</div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span v-if="item.groundLevel" class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {{ item.groundLevel }}
                    </span>
                    <span v-if="item.allowedOperator" class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      操作人：{{ item.allowedOperator }}
                    </span>
                    <span v-if="item.accessPerson" class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      可接触：{{ item.accessPerson }}
                    </span>
                    <span v-if="item.serviceHours" class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-md font-medium">
                      服务时间：{{ item.serviceHours || '—' }}
                    </span>
                    <span v-if="item.remark" class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-medium">
                      备注：{{ item.remark }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(item)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      地图查看
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredAeds.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的AED</h3>
            <p class="text-slate-600 mb-6">请尝试调整搜索条件或筛选器</p>
            <button @click="resetFilters"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
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
import request from '@/api/request.js'

const loading = ref(true)
const error = ref('')
const aeds = ref([])
const searchQuery = ref('')
const selectedAccess = ref('')
const selectedGround = ref('')
const selectedBrand = ref('')

const loadAedData = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await request.get('/aed/aed_list')
    const data = response.data || []
    // 规范化数据结构，方便后续使用
    aeds.value = data
      .map((raw, i) => ({
        id: i,
        name: raw['AED Name']?.trim?.() || '',
        address: raw['AED Address']?.trim?.() || '',
        locationDetail: raw['Detailed location of the AED installed']?.trim?.() || '',
        lat: parseFloat(raw['Location Google Map coordinate: latitude']),
        lng: parseFloat(raw['Location Google Map coordinate: longitude']),
        accessibleAnyone: raw['Whether the AED can be used by anyone'] || '',
        allowedOperator: raw['Person allowed to operate the AED'] || '',
        accessPerson: raw['Person who has access to the AED'] || '',
        groundLevel: raw['Ground level categories'] || '',
        serviceHours: raw['Service Hour Remark'] || '',
        brand: raw['AED brand'] || '',
        model: raw['AED model'] || '',
        remark: raw['AED remark'] || ''
      }))
      .filter(item => item.name && !Number.isNaN(item.lat) && !Number.isNaN(item.lng))
  } catch (err) {
    error.value = '加载AED数据失败，请稍后重试'
    console.error('Error loading AED data:', err)
  } finally {
    loading.value = false
  }
}

const filteredAeds = computed(() => {
  let list = aeds.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.locationDetail.toLowerCase().includes(q)
    )
  }

  if (selectedAccess.value) {
    list = list.filter(item => (item.accessibleAnyone || '').toLowerCase() === selectedAccess.value.toLowerCase())
  }

  if (selectedGround.value) {
    list = list.filter(item => item.groundLevel === selectedGround.value)
  }

  if (selectedBrand.value) {
    list = list.filter(item => item.brand === selectedBrand.value)
  }

  return list
})

const accessOptions = [
  { label: 'Yes（对公众开放）', value: 'Yes' },
  { label: 'No（限制使用）', value: 'No' }
]

const grounds = computed(() => {
  return [...new Set(aeds.value.map(i => i.groundLevel).filter(Boolean))].sort()
})
const brands = computed(() => {
  return [...new Set(aeds.value.map(i => i.brand).filter(Boolean))].sort()
})
const groundOptions = computed(() => grounds.value.map(g => ({ label: g, value: g })))
const brandOptions = computed(() => brands.value.map(b => ({ label: b, value: b })))

const brandCount = computed(() => brands.value.length)
const publicAccessibleCount = computed(() => aeds.value.filter(i => i.accessibleAnyone === 'Yes').length)

const viewOnMap = (item) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedAccess.value = ''
  selectedGround.value = ''
  selectedBrand.value = ''
}

onMounted(() => {
  loadAedData()
})

const mapCenter = computed(() => {
  const first = filteredAeds.value[0]
  if (first && !Number.isNaN(first.lat) && !Number.isNaN(first.lng)) {
    return { lat: first.lat, lng: first.lng }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredAeds.value
    .filter(i => !Number.isNaN(i.lat) && !Number.isNaN(i.lng))
    .map(i => ({ lat: i.lat, lng: i.lng, title: i.name }))
)

const formatCoord = (v) => {
  if (typeof v !== 'number' || Number.isNaN(v)) return '—'
  return v.toFixed(4)
}
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
