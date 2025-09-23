<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-12">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Air Quality</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">空气质素健康指数</h1>
          <p class="text-base sm:text-lg text-slate-600">香港各区实时空气质量监测数据</p>

          <div class="flex flex-col items-center gap-4">
            <button @click="refreshData" :disabled="loading"
              class="group inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-2">
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

            <div v-if="airQualityData && airQualityData.length > 0" class="text-sm text-slate-500">
              最后更新：{{ formatUpdateTime(airQualityData[0].publish_date) }}
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

        <div v-else-if="loading && !airQualityData" class="flex flex-col items-center justify-center py-20">
          <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-green-600 border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-slate-600 text-lg">正在获取数据...</p>
          </div>
        </div>

        <div v-else-if="airQualityData && airQualityData.length > 0" class="space-y-8">
          <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-l-4 border-green-500 rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-4">
              <i class="fa fa-info-circle text-2xl text-green-600"></i>
              <h3 class="text-xl font-bold text-green-800">空气质素健康指数说明</h3>
            </div>
            <div class="text-green-700 text-sm leading-relaxed">
              <p class="mb-2">• AQHI 1-3: <span class="font-semibold text-green-600">低健康风险</span></p>
              <p class="mb-2">• AQHI 4-6: <span class="font-semibold text-yellow-600">中等健康风险</span></p>
              <p class="mb-2">• AQHI 7-10: <span class="font-semibold text-orange-600">高健康风险</span></p>
              <p>• AQHI 10+: <span class="font-semibold text-red-600">严重健康风险</span></p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-lg p-8 h-full">
                <div class="flex items-center gap-3 mb-6">
                  <i class="fa fa-leaf text-3xl text-green-500"></i>
                  <h3 class="text-xl font-semibold text-slate-900">整体概况</h3>
                </div>
                
                <div class="space-y-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2" :class="getAverageAqhiColor(averageAqhi)">
                      {{ averageAqhi.toFixed(1) }}
                    </div>
                    <div class="text-sm text-slate-600">平均指数</div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div class="text-2xl font-bold text-green-600">{{ lowRiskCount }}</div>
                      <div class="text-xs text-slate-500">低风险站点</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-yellow-600">{{ moderateRiskCount }}</div>
                      <div class="text-xs text-slate-500">中等风险站点</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-600">最高指数</span>
                      <span class="font-semibold" :class="getAqhiTextColor(maxAqhi.aqhi)">
                        {{ maxAqhi.station }}: {{ maxAqhi.aqhi }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-600">最低指数</span>
                      <span class="font-semibold" :class="getAqhiTextColor(minAqhi.aqhi)">
                        {{ minAqhi.station }}: {{ minAqhi.aqhi }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-3">
              <div class="bg-white rounded-2xl shadow-lg p-8">
                <div class="flex items-center gap-3 mb-6">
                  <i class="fa fa-bar-chart text-2xl text-slate-600"></i>
                  <h3 class="text-xl font-semibold text-slate-900">各区指数分布</h3>
                </div>
                <div class="h-96">
                  <canvas ref="aqhiChartRef" class="w-full h-full"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="station in sortedStations" :key="station.station"
              class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4"
              :class="getAqhiColor(station.aqhi)">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-slate-900 mb-3 leading-tight">
                    {{ getChineseStationName(station.station) }}
                  </h3>
                  
                  <div class="flex items-center gap-3 mb-4">
                    <div class="flex items-center gap-2">
                      <i class="fa fa-leaf text-lg" :class="getAqhiIconColor(station.aqhi)"></i>
                      <span class="text-3xl font-bold" :class="getAqhiTextColor(station.aqhi)">
                        {{ station.aqhi }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 mb-3">
                    <div class="px-3 py-1 rounded-full text-xs font-medium"
                      :class="getHealthRiskBadgeColor(station.health_risk)">
                      {{ getChineseHealthRisk(station.health_risk) }}
                    </div>
                  </div>

                  <div class="text-xs text-slate-500">
                    {{ station.station }}
                  </div>
                </div>

                <div class="flex-shrink-0">
                  <i class="fa fa-cloud text-3xl text-slate-400"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-3 mb-6">
              <i class="fa fa-pie-chart text-2xl text-slate-600"></i>
              <h3 class="text-xl font-semibold text-slate-900">健康风险分布</h3>
            </div>
            <div class="h-80 flex justify-center">
              <canvas ref="riskPieChartRef" class="max-w-sm"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { fetchAirQualityData } from '@/api/air-quality.js'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend
)

const airQualityData = ref(null)
const loading = ref(false)
const error = ref('')
const aqhiChartRef = ref(null)
const riskPieChartRef = ref(null)

let aqhiChart = null
let riskPieChart = null
let refreshInterval = null

const fetchAirQualityDataLocal = async () => {
  try {
    loading.value = true
    error.value = ''

    const data = await fetchAirQualityData()
    airQualityData.value = Array.isArray(data) ? data : []

    await new Promise(resolve => setTimeout(resolve, 100))
    createCharts()

  } catch (err) {
    console.error('Error fetching air quality data:', err)
    error.value = '无法获取空气质量数据，请稍后重试'
    throw err
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchAirQualityDataLocal()
}

const formatUpdateTime = (timeString) => {
  try {
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return timeString
  }
}

const getAqhiColor = (aqhi) => {
  if (aqhi <= 3) return 'border-green-500'
  if (aqhi <= 6) return 'border-yellow-500'
  if (aqhi <= 10) return 'border-orange-500'
  return 'border-red-500'
}

const getAqhiIconColor = (aqhi) => {
  if (aqhi <= 3) return 'text-green-600'
  if (aqhi <= 6) return 'text-yellow-600'
  if (aqhi <= 10) return 'text-orange-600'
  return 'text-red-600'
}

const getAqhiTextColor = (aqhi) => {
  if (aqhi <= 3) return 'text-green-700'
  if (aqhi <= 6) return 'text-yellow-700'
  if (aqhi <= 10) return 'text-orange-700'
  return 'text-red-700'
}

const getAverageAqhiColor = (aqhi) => {
  if (aqhi <= 3) return 'text-green-600'
  if (aqhi <= 6) return 'text-yellow-600'
  if (aqhi <= 10) return 'text-orange-600'
  return 'text-red-600'
}

const getHealthRiskBadgeColor = (risk) => {
  switch (risk.toLowerCase()) {
    case 'low': return 'bg-green-100 text-green-800'
    case 'moderate': return 'bg-yellow-100 text-yellow-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'very high': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getChineseHealthRisk = (risk) => {
  switch (risk.toLowerCase()) {
    case 'low': return '低风险'
    case 'moderate': return '中等风险'
    case 'high': return '高风险'
    case 'very high': return '严重风险'
    default: return risk
  }
}

const getChineseStationName = (station) => {
  const nameMap = {
    'Central/Western': '中西区',
    'Southern': '南区',
    'Eastern': '东区',
    'Kwun Tong': '观塘',
    'Sham Shui Po': '深水埗',
    'Kwai Chung': '葵涌',
    'Tsuen Wan': '荃湾',
    'Tseung Kwan O': '将军澳',
    'Yuen Long': '元朗',
    'Tuen Mun': '屯门',
    'Tung Chung': '东涌',
    'Tai Po': '大埔',
    'Sha Tin': '沙田',
    'North': '北区',
    'Tap Mun': '塔门',
    'Causeway Bay': '铜锣湾',
    'Central': '中环',
    'Mong Kok': '旺角'
  }
  return nameMap[station] || station
}

const sortedStations = computed(() => {
  if (!airQualityData.value) return []
  return [...airQualityData.value].sort((a, b) => b.aqhi - a.aqhi)
})

const averageAqhi = computed(() => {
  if (!airQualityData.value || airQualityData.value.length === 0) return 0
  const sum = airQualityData.value.reduce((acc, station) => acc + station.aqhi, 0)
  return sum / airQualityData.value.length
})

const lowRiskCount = computed(() => {
  if (!airQualityData.value) return 0
  return airQualityData.value.filter(station => station.aqhi <= 3).length
})

const moderateRiskCount = computed(() => {
  if (!airQualityData.value) return 0
  return airQualityData.value.filter(station => station.aqhi >= 4 && station.aqhi <= 6).length
})

const maxAqhi = computed(() => {
  if (!airQualityData.value || airQualityData.value.length === 0) return { station: '', aqhi: 0 }
  return airQualityData.value.reduce((max, station) => 
    station.aqhi > max.aqhi ? station : max
  )
})

const minAqhi = computed(() => {
  if (!airQualityData.value || airQualityData.value.length === 0) return { station: '', aqhi: 0 }
  return airQualityData.value.reduce((min, station) => 
    station.aqhi < min.aqhi ? station : min
  )
})

const createCharts = () => {
  createAqhiChart()
  createRiskPieChart()
}

const createAqhiChart = () => {
  if (!aqhiChartRef.value || !airQualityData.value) return

  if (aqhiChart) {
    aqhiChart.destroy()
  }

  const ctx = aqhiChartRef.value.getContext('2d')
  const sortedData = [...airQualityData.value].sort((a, b) => b.aqhi - a.aqhi)

  aqhiChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedData.map(item => getChineseStationName(item.station)),
      datasets: [{
        label: 'AQHI指数',
        data: sortedData.map(item => item.aqhi),
        backgroundColor: sortedData.map(item => {
          if (item.aqhi <= 3) return 'rgba(34, 197, 94, 0.8)'
          if (item.aqhi <= 6) return 'rgba(234, 179, 8, 0.8)'
          if (item.aqhi <= 10) return 'rgba(249, 115, 22, 0.8)'
          return 'rgba(239, 68, 68, 0.8)'
        }),
        borderColor: sortedData.map(item => {
          if (item.aqhi <= 3) return 'rgba(34, 197, 94, 1)'
          if (item.aqhi <= 6) return 'rgba(234, 179, 8, 1)'
          if (item.aqhi <= 10) return 'rgba(249, 115, 22, 1)'
          return 'rgba(239, 68, 68, 1)'
        }),
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1d1d1f',
          bodyColor: '#1d1d1f',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          cornerRadius: 12,
          callbacks: {
            title: function(context) {
              const index = context[0].dataIndex
              return sortedData[index].station
            },
            label: function (context) {
              const index = context.dataIndex
              return `AQHI: ${sortedData[index].aqhi} (${getChineseHealthRisk(sortedData[index].health_risk)})`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...sortedData.map(item => item.aqhi)) + 2,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#8e8e93',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"'
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#8e8e93',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"'
            },
            maxRotation: 45,
            minRotation: 0
          }
        }
      }
    }
  })
}

const createRiskPieChart = () => {
  if (!riskPieChartRef.value || !airQualityData.value) return

  if (riskPieChart) {
    riskPieChart.destroy()
  }

  const ctx = riskPieChartRef.value.getContext('2d')
  
  const riskCounts = {
    'Low': 0,
    'Moderate': 0,
    'High': 0,
    'Very High': 0
  }

  airQualityData.value.forEach(station => {
    if (riskCounts[station.health_risk] !== undefined) {
      riskCounts[station.health_risk]++
    }
  })

  const labels = Object.keys(riskCounts).filter(key => riskCounts[key] > 0)
  const data = labels.map(key => riskCounts[key])
  const chineseLabels = labels.map(key => getChineseHealthRisk(key))

  riskPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chineseLabels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#1d1d1f',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"'
            },
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1d1d1f',
          bodyColor: '#1d1d1f',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          cornerRadius: 12,
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: ${context.parsed}站 (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  fetchAirQualityDataLocal()
  refreshInterval = setInterval(() => {
    fetchAirQualityDataLocal()
  }, 10 * 60 * 1000) // 10 minutes
})

onUnmounted(() => {
  if (aqhiChart) aqhiChart.destroy()
  if (riskPieChart) riskPieChart.destroy()
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>
