<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              香港设施与服务位置（FEHD）
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-6">基于 FEHD 数据的设施地图与列表</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在解析设施数据...</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="initData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">重试</button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ facilities.length }}</div>
              <div class="text-sm text-slate-500">总设施数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ filteredFacilities.length }}</div>
              <div class="text-sm text-slate-500">当前筛选</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ Object.keys(districtMap).length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
          </div>

          <!-- Controls (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedType" :options="typeSelectOptions" />
            </div>
          </div>

          <!-- Map (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">设施分布地图</h2>
              <p class="text-sm text-slate-600">默认展示“公厕”，可从右侧下拉切换类型</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="item in filteredList" :key="item.mapID"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ item.name }}</h3>
                    <p class="text-sm text-slate-600">{{ typeName(item.map_type) }}</p>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {{ districtName(item.districtID) }}
                    </span>
                  </div>
                </div>

                <div class="mb-4 text-sm text-slate-700">
                  <p class="mb-1"><i class="fa fa-map-marker mr-2"></i>{{ item.address }}</p>
                  <p v-if="item.openHr" class="mb-1"><i class="fa fa-clock-o mr-2"></i>{{ item.openHr }}</p>
                  <p v-if="item.updatedAt" class="text-slate-500 text-xs">更新: {{ item.updatedAt }}</p>
                  <p v-if="item.remarks" class="text-slate-500 text-xs mt-1">备注: {{ item.remarks }}</p>
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

          <div v-if="filteredList.length === 0" class="text-center py-12 text-slate-600">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import xmlRaw from '@/data/FE_HD_MAP.xml?raw'
import GoogleMap from '@/components/GoogleMap.vue'

const loading = ref(true)
const error = ref('')
const facilities = ref([])
const selectedType = ref('toilet') // 默认公厕
const searchQuery = ref('')
const typeMap = ref({}) // { id -> 中文名 }
const districtMap = ref({}) // { id -> 中文名 }
// removed iframe integration

// 解析 XML 字符串
const parseXml = (xmlText) => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')

  // map_type_CODE
  const typeNodes = Array.from(xml.getElementsByTagName('map_type_CODE')[0].getElementsByTagName('CODE'))
  const tMap = {}
  typeNodes.forEach(n => {
    tMap[n.getAttribute('ID')] = (n.textContent || '').trim()
  })

  // districtID_CODE
  const dNodes = Array.from(xml.getElementsByTagName('districtID_CODE')[0].getElementsByTagName('CODE'))
  const dMap = {}
  dNodes.forEach(n => {
    dMap[n.getAttribute('ID')] = (n.textContent || '').trim()
  })

  // locations
  const maps = Array.from(xml.getElementsByTagName('fehd_service_locations')[0].getElementsByTagName('map'))
  const items = maps.map(m => {
    const get = (tag) => (m.getElementsByTagName(tag)[0]?.textContent || '').trim()
    const coordinate = get('map_coordinate')
    let lat = null, lon = null
    if (coordinate && coordinate.includes(',')) {
      // 格式: "lat,lon"
      const [latStr, lonStr] = coordinate.split(',').map(s => s.trim())
      lat = parseFloat(latStr)
      lon = parseFloat(lonStr)
      if (!isFinite(lat) || !isFinite(lon)) {
        lat = null; lon = null
      }
    }
    return {
      mapID: get('mapID'),
      districtID: get('districtID'),
      map_type: get('map_type'),
      name: get('name_s'),
      address: get('address_s'),
      contact1: get('contact1'),
      contact2: get('contact2'),
      fax: get('fax'),
      openHr: get('openHr_s'),
      updatedAt: get('updateDate'),
      remarks: get('remarks_s'),
      lat, lon,
    }
  }).filter(it => it.name && it.lat && it.lon)

  return { tMap, dMap, items }
}

const typeOptions = computed(() => Object.entries(typeMap.value).map(([id, name]) => ({ id, name })))
const typeSelectOptions = computed(() => typeOptions.value.map(o => ({ label: o.name, value: o.id })))
const typeName = (id) => typeMap.value[id] || id
const districtName = (id) => districtMap.value[id] || id

const filteredFacilities = computed(() => facilities.value.filter(f => f.map_type === selectedType.value))

const filteredList = computed(() => {
  const q = (searchQuery.value || '').toLowerCase()
  if (!q) return filteredFacilities.value
  return filteredFacilities.value.filter(it =>
    (it.name || '').toLowerCase().includes(q) ||
    (it.address || '').toLowerCase().includes(q)
  )
})

const viewOnMap = (item) => {
  if (!item.lat || !item.lon) return
  const url = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`
  window.open(url, '_blank')
}

const initData = () => {
  try {
    loading.value = true
    error.value = ''
    const { tMap, dMap, items } = parseXml(xmlRaw)
    typeMap.value = tMap
    districtMap.value = dMap
    facilities.value = items
    // 默认选中公厕（toilet），若不存在则选第一个
    if (!typeMap.value[selectedType.value]) {
      selectedType.value = Object.keys(typeMap.value)[0] || 'toilet'
    }
    // no iframe messaging now
  } catch (e) {
    console.error('Parse FEHD XML failed:', e)
    error.value = '解析设施数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})

// Map data for Google Map component
const mapCenter = computed(() => {
  const first = filteredFacilities.value[0]
  if (first && first.lat && first.lon) {
    return { lat: Number(first.lat), lng: Number(first.lon) }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredFacilities.value
    .filter(it => it.lat && it.lon)
    .map(it => ({ lat: Number(it.lat), lng: Number(it.lon), title: it.name }))
)
</script>

<style scoped>
.backdrop-blur-sm { backdrop-filter: blur(4px); }
.h-180 { height: 45rem; }
</style>
