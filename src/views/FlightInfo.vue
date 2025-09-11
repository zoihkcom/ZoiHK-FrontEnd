<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
              香港机场航班信息
            </span>
          </h1>
          <p class="text-xl text-slate-600 mb-8">实时航班到达和出发信息</p>

          <div class="flex flex-col items-center gap-4">
            <div class="flex gap-4">
              <button @click="activeTab = 'arrivals'; refreshData()"
                :class="activeTab === 'arrivals' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'"
                class="px-6 py-3 font-semibold rounded-xl border border-blue-600 transition-all duration-200 shadow-lg">
                到达航班
              </button>
              <button @click="activeTab = 'departures'; refreshData()"
                :class="activeTab === 'departures' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'"
                class="px-6 py-3 font-semibold rounded-xl border border-blue-600 transition-all duration-200 shadow-lg">
                出发航班
              </button>
            </div>

            <button @click="refreshData" :disabled="loading"
              class="group inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-2">
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                <path fill="currentColor" class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.293 9.293a1 1 0 011.414 0L8 13.586V10a1 1 0 012 0v3.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
              <span>{{ loading ? '刷新中...' : '刷新数据' }}</span>
            </button>

            <div class="text-sm text-slate-500">
              显示所有航班信息 · 当前时间：{{ currentTime }}
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center gap-4">
          <i class="fa fa-warning text-red-500 text-2xl"></i>
          <div class="flex-1">
            <h3 class="text-red-800 font-semibold text-lg mb-1">数据加载失败</h3>
            <p class="text-red-600 text-sm mb-3">{{ error }}</p>
            <button @click="refreshData"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              重试
            </button>
          </div>
        </div>

        <div v-else-if="loading && !flightData" class="flex flex-col items-center justify-center py-20">
          <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-slate-600 text-lg">正在获取数据...</p>
          </div>
        </div>

        <div v-else-if="flightData && flightData.length > 0" class="space-y-8">
          <div
            class="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-4">
              <i class="fa fa-info-circle text-2xl text-blue-600"></i>
              <h3 class="text-xl font-bold text-blue-800">航班信息说明</h3>
            </div>
            <div class="text-blue-700 text-sm leading-relaxed">
              <p class="mb-2">• 显示时间为{{ activeTab === 'arrivals' ? '预计到达' : '预计出发' }}时间</p>
              <p class="mb-2">• 状态包括：到闸口、预计、取消等</p>
              <p>• 数据每5分钟自动更新一次</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-lg p-8 h-full">
                <div class="flex items-center gap-3 mb-6">
                  <i class="fa fa-plane text-3xl text-blue-500"></i>
                  <h3 class="text-xl font-semibold text-slate-900">航班统计</h3>
                </div>

                <div class="space-y-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600 mb-2">{{ filteredFlights.length }}</div>
                    <div class="text-sm text-slate-600">{{ activeTab === 'arrivals' ? '到达' : '出发' }}航班</div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 text-center">
                    <div>
                      <div class="text-2xl font-bold text-green-600">{{ onTimeFlights }}</div>
                      <div class="text-xs text-slate-500">正常航班</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-orange-600">{{ delayedFlights }}</div>
                      <div class="text-xs text-slate-500">延误航班</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-red-600">{{ cancelledFlights }}</div>
                      <div class="text-xs text-slate-500">取消航班</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-3">
              <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div class="p-6 border-b border-slate-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <i class="fa fa-list text-2xl text-slate-600"></i>
                      <h3 class="text-xl font-semibold text-slate-900">
                        {{ activeTab === 'arrivals' ? '到达' : '出发' }}航班列表
                      </h3>
                    </div>
                    <div class="text-sm text-slate-500">
                      共 {{ filteredFlights.length }} 个航班
                    </div>
                  </div>
                </div>

                <div class="max-h-[600px] overflow-y-auto">
                  <div v-if="filteredFlights.length === 0" class="p-12 text-center">
                    <i class="fa fa-plane text-4xl text-slate-300 mb-4"></i>
                    <p class="text-slate-500 text-lg">暂无航班信息</p>
                  </div>

                  <div v-else class="divide-y divide-slate-100">
                    <div v-for="flight in filteredFlights" :key="flight.time + flight.flight[0].no"
                      class="p-6 hover:bg-slate-50 transition-colors">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                          <div class="flex items-center gap-4 mb-3">
                            <div class="text-2xl font-bold text-blue-600">{{ flight.time }}</div>
                            <div class="flex flex-wrap gap-2">
                              <span v-for="flightInfo in flight.flight" :key="flightInfo.no"
                                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {{ flightInfo.no }}
                              </span>
                            </div>
                          </div>

                          <div v-if="activeTab === 'arrivals'" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div class="text-slate-500 mb-1">起点</div>
                              <div class="font-semibold text-slate-900">
                                {{ flight.origin ? flight.origin.join(', ') : '-' }}
                              </div>
                            </div>
                            <div>
                              <div class="text-slate-500 mb-1">行李带</div>
                              <div class="font-semibold text-slate-900">{{ flight.baggage || '-' }}</div>
                            </div>
                            <div>
                              <div class="text-slate-500 mb-1">大厅</div>
                              <div class="font-semibold text-slate-900">{{ flight.hall || '-' }}</div>
                            </div>
                            <div>
                              <div class="text-slate-500 mb-1">停机位</div>
                              <div class="font-semibold text-slate-900">{{ flight.stand || '-' }}</div>
                            </div>
                          </div>
                          <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div class="text-slate-500 mb-1">目的地</div>
                              <div class="font-semibold text-slate-900">
                                {{ flight.destination ? flight.destination.join(', ') : '-' }}
                              </div>
                            </div>
                            <div>
                              <div class="text-slate-500 mb-1">登机门</div>
                              <div class="font-semibold text-slate-900">{{ flight.gate || '-' }}</div>
                            </div>
                            <div>
                              <div class="text-slate-500 mb-1">检票通道</div>
                              <div class="font-semibold text-slate-900">{{ flight.aisle || '-' }}</div>
                            </div>
                            <div>
                              <div class="text-slate-500 mb-1">航站楼</div>
                              <div class="font-semibold text-slate-900">{{ flight.terminal || '-' }}</div>
                            </div>
                          </div>
                        </div>

                        <div class="text-right min-w-[120px]">
                          <div class="px-4 py-2 rounded-lg text-sm font-medium inline-block min-w-[100px] text-center"
                            :class="getStatusBadgeColor(flight.status)">
                            {{ flight.status }}
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

        <div v-else class="flex flex-col items-center justify-center py-20">
          <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <i class="fa fa-plane text-6xl text-slate-300 mb-6"></i>
            <p class="text-slate-600 text-lg">暂无航班信息</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { fetchFlightArrivals, fetchFlightDepartures } from '@/api/flight.js'

const flightData = ref([])
const loading = ref(false)
const error = ref('')
const activeTab = ref('arrivals')
const currentTime = ref('')

let refreshInterval = null
let timeInterval = null

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchFlightData = async () => {
  try {
    loading.value = true
    error.value = ''

    let data
    if (activeTab.value === 'arrivals') {
      data = await fetchFlightArrivals()
    } else {
      data = await fetchFlightDepartures()
    }

    // Handle both single day data and multi-day data structure
    if (Array.isArray(data)) {
      // Multi-day data - combine all flight lists
      flightData.value = data.reduce((acc, dayData) => {
        if (dayData.list && Array.isArray(dayData.list)) {
          return acc.concat(dayData.list)
        }
        return acc
      }, [])
    } else if (data && data.list) {
      // Single day data
      flightData.value = data.list
    } else {
      flightData.value = []
    }

  } catch (err) {
    console.error('Error fetching flight data:', err)
    error.value = '无法获取航班信息，请稍后重试'
    throw err
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchFlightData()
}

const filteredFlights = computed(() => {
  if (!flightData.value) return []
  return flightData.value
})

const onTimeFlights = computed(() => {
  return filteredFlights.value.filter(flight =>
    !flight.status.includes('预计') &&
    !flight.status.includes('取消') &&
    !flight.status.includes('延误') &&
    // Add departure-specific normal status
    (flight.status.includes('启航') || flight.status.includes('现正登机') || flight.status.includes('预备登机') ||
      flight.status.includes('到闸口'))
  ).length
})

const delayedFlights = computed(() => {
  return filteredFlights.value.filter(flight =>
    flight.status.includes('预计') || flight.status.includes('延误') ||
    flight.status.includes('最后召集') || flight.status.includes('截止登机')
  ).length
})

const cancelledFlights = computed(() => {
  return filteredFlights.value.filter(flight =>
    flight.status.includes('取消')
  ).length
})


const getStatusBadgeColor = (status) => {
  // Cancelled flights
  if (status.includes('取消')) {
    return 'bg-red-100 text-red-800'
  }

  // Delayed or estimated flights
  if (status.includes('预计') || status.includes('延误') ||
    status.includes('最后召集') || status.includes('截止登机')) {
    return 'bg-orange-100 text-orange-800'
  }

  // Successful/completed flights
  if (status.includes('到闸口') || status.includes('启航')) {
    return 'bg-green-100 text-green-800'
  }

  // Active boarding status
  if (status.includes('现正登机') || status.includes('预备登机')) {
    return 'bg-blue-100 text-blue-800'
  }

  // Default status
  return 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  updateCurrentTime()
  fetchFlightData()

  // 每5分钟刷新数据
  refreshInterval = setInterval(() => {
    fetchFlightData()
  }, 5 * 60 * 1000)

  // 每秒更新时间
  timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
/* 滚动条样式 */
.max-h-\[600px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[600px\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
