<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              香港渡轮码头
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-2">查看香港六个渡轮码头的位置</p>
          <p class="text-sm text-slate-500">数据来源：HKKF Open Data</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载码头数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadPiers"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ piers.length }}</div>
              <div class="text-sm text-slate-500">码头数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ successfulCount }}</div>
              <div class="text-sm text-slate-500">成功加载</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ failedCount }}</div>
              <div class="text-sm text-slate-500">失败数量</div>
            </div>
          </div>

          <!-- Map -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">渡轮码头地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示六个码头位置</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="finalCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Piers List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="pier in piers" :key="pier.pier_id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ pier.name_tc || pier.name_sc }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ pier.name_en }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>纬度：{{ pier.lat.toFixed(6) }}，经度：{{ pier.long.toFixed(6) }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Pier ID: {{ pier.pier_id }}
                    </span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex gap-2">
                    <button @click="viewOnMap(pier)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      在 Google 地图打开
                    </button>
                    <button @click="focusMarker(pier)"
                      class="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      <i class="fa fa-crosshairs"></i>
                    </button>
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
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GoogleMap from '@/components/GoogleMap.vue'

const loading = ref(true)
const error = ref('')
const piers = ref([])

const loadPiers = async () => {
  loading.value = true
  error.value = ''
  piers.value = []
  try {
    const ids = [1, 2, 3, 4, 5, 6]
    const base = 'https://www.hkkfeta.com/opendata/pier/'

    // 并行请求，接口 content-type 为 text/html，需手动解析 JSON
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const res = await fetch(base + id, { method: 'GET' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        const data = JSON.parse(text)
        return data
      })
    )

    const ok = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(obj => obj && obj.data && typeof obj.data.lat === 'number' && typeof obj.data.long === 'number')
      .map(obj => obj.data)

    piers.value = ok

    const failed = results.filter(r => r.status === 'rejected').length
    if (ok.length === 0) {
      throw new Error('无法加载任何码头数据')
    } else if (failed > 0) {
      // 局部失败仅提示，不阻断渲染
      console.warn(`部分码头数据加载失败：${failed} 个`)
    }
  } catch (e) {
    console.error('加载码头数据失败:', e)
    error.value = '加载码头数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPiers()
})

const successfulCount = computed(() => piers.value.length)
const failedCount = computed(() => Math.max(0, 6 - piers.value.length))

const mapCenter = computed(() => {
  if (!piers.value.length) return { lat: 22.3027, lng: 114.1772 }
  const lat = piers.value.reduce((s, p) => s + p.lat, 0) / piers.value.length
  const lng = piers.value.reduce((s, p) => s + p.long, 0) / piers.value.length
  return { lat, lng }
})

const mapMarkers = computed(() =>
  piers.value.map(p => ({
    lat: p.lat,
    lng: p.long,
    title: p.name_tc || p.name_sc || p.name_en
  }))
)

const viewOnMap = (pier) => {
  const name = pier.name_sc
  if (name) {
    const query = `${name}`
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    window.open(url, '_blank')
  } else {
    // 兜底：无名称时仍用经纬度
    const url = `https://www.google.com/maps/search/?api=1&query=${pier.lat},${pier.long}`
    window.open(url, '_blank')
  }
}

// 仅用于辅助居中地图，由于 GoogleMap 组件没有直接暴露 map 实例，这里通过修改中心点实现
const mapCenterOverride = ref(null)
const finalCenter = computed(() => mapCenterOverride.value || mapCenter.value)
const focusMarker = (pier) => {
  mapCenterOverride.value = { lat: pier.lat, lng: pier.long }
}

</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
