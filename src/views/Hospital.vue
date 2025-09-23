<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-12">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Hospital Wait</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">急症科轮候时间</h1>
          <p class="text-base sm:text-lg text-slate-600">香港各大医院急症科实时轮候时间</p>

          <div class="flex flex-col items-center gap-4">
            <button @click="refreshData" :disabled="loading"
              class="group inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-2">
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

            <div v-if="hospitalData?.updateTime" class="text-sm text-slate-500">
              最后更新：{{ hospitalData.updateTime }}
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

        <div v-else-if="loading && !hospitalData" class="flex flex-col items-center justify-center py-20">
          <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-red-600 border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-slate-600 text-lg">正在获取数据...</p>
          </div>
        </div>

        <div v-else-if="hospitalData" class="space-y-8">
          <div
            class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-4">
              <i class="fa fa-info-circle text-2xl text-blue-600"></i>
              <h3 class="text-xl font-bold text-blue-800">轮候时间说明</h3>
            </div>
            <div class="text-blue-700 text-sm leading-relaxed">
              <p class="mb-2">• 轮候时间为过去数小时的最长等候时间，只供参考</p>
              <p class="mb-2">• 实际轮候时间会因应个別情况及病症的严重程度而定</p>
              <p>• 如有疑问，请直接联络相关医院</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="hospital in hospitalData.waitTime" :key="hospital.hospName"
              class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4"
              :class="getWaitTimeColor(hospital.topWait)">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-slate-900 mb-3 leading-tight">
                    {{ hospital.hospName }}
                  </h3>

                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <i class="fa fa-clock-o text-lg" :class="getWaitTimeIconColor(hospital.topWait)"></i>
                      <span class="text-2xl font-bold" :class="getWaitTimeTextColor(hospital.topWait)">
                        {{ hospital.topWait }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center gap-2">
                    <div class="px-3 py-1 rounded-full text-xs font-medium"
                      :class="getWaitTimeBadgeColor(hospital.topWait)">
                      {{ getWaitTimeLevel(hospital.topWait) }}
                    </div>
                  </div>
                </div>

                <div class="flex-shrink-0">
                  <i class="fa fa-hospital-o text-3xl text-slate-400"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-3 mb-6">
              <i class="fa fa-bar-chart text-2xl text-slate-600"></i>
              <h3 class="text-xl font-semibold text-slate-900">轮候时间分布</h3>
            </div>
            <div class="h-96">
              <canvas ref="waitTimeChartRef" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { fetchHospitalWaitTime } from '@/api/hospital.js'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
)

const hospitalData = ref(null)
const loading = ref(false)
const error = ref('')
const waitTimeChartRef = ref(null)

let waitTimeChart = null
let refreshInterval = null

const fetchHospitalData = async () => {
  try {
    loading.value = true
    error.value = ''

    const data = await fetchHospitalWaitTime()
    hospitalData.value = data

    await new Promise(resolve => setTimeout(resolve, 100))
    createChart()

  } catch (err) {
    console.error('Error fetching hospital data:', err)
    error.value = '无法获取医院轮候时间数据，请稍后重试'
    throw err
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchHospitalData()
}

const getWaitTimeColor = (waitTime) => {
  if (waitTime.includes('1 小时')) return 'border-green-500'
  if (waitTime.includes('2 小时')) return 'border-yellow-500'
  if (waitTime.includes('3 小时')) return 'border-orange-500'
  if (waitTime.includes('4 小时') || waitTime.includes('5 小时')) return 'border-red-500'
  return 'border-gray-500'
}

const getWaitTimeIconColor = (waitTime) => {
  if (waitTime.includes('1 小时')) return 'text-green-600'
  if (waitTime.includes('2 小时')) return 'text-yellow-600'
  if (waitTime.includes('3 小时')) return 'text-orange-600'
  if (waitTime.includes('4 小时') || waitTime.includes('5 小时')) return 'text-red-600'
  return 'text-gray-600'
}

const getWaitTimeTextColor = (waitTime) => {
  if (waitTime.includes('1 小时')) return 'text-green-700'
  if (waitTime.includes('2 小时')) return 'text-yellow-700'
  if (waitTime.includes('3 小时')) return 'text-orange-700'
  if (waitTime.includes('4 小时') || waitTime.includes('5 小时')) return 'text-red-700'
  return 'text-gray-700'
}

const getWaitTimeBadgeColor = (waitTime) => {
  if (waitTime.includes('1 小时')) return 'bg-green-100 text-green-800'
  if (waitTime.includes('2 小时')) return 'bg-yellow-100 text-yellow-800'
  if (waitTime.includes('3 小时')) return 'bg-orange-100 text-orange-800'
  if (waitTime.includes('4 小时') || waitTime.includes('5 小时')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const getWaitTimeLevel = (waitTime) => {
  if (waitTime.includes('1 小时')) return '较短等候'
  if (waitTime.includes('2 小时')) return '一般等候'
  if (waitTime.includes('3 小时')) return '较长等候'
  if (waitTime.includes('4 小时') || waitTime.includes('5 小时')) return '长时间等候'
  return '超长时间等候'
}

const getWaitTimeValue = (waitTime) => {
  if (waitTime.includes('大约 1 小时')) return 1
  if (waitTime.includes('超过 1 小时')) return 1.5
  if (waitTime.includes('超过 2 小时')) return 2.5
  if (waitTime.includes('超过 3 小时')) return 3.5
  if (waitTime.includes('超过 4 小时')) return 4.5
  if (waitTime.includes('超过 5 小时')) return 5.5
  return 0
}

const createChart = () => {
  if (!waitTimeChartRef.value || !hospitalData.value?.waitTime) return

  if (waitTimeChart) {
    waitTimeChart.destroy()
  }

  const ctx = waitTimeChartRef.value.getContext('2d')
  const waitData = hospitalData.value.waitTime

  const sortedData = [...waitData].sort((a, b) => getWaitTimeValue(b.topWait) - getWaitTimeValue(a.topWait))

  waitTimeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedData.map(item => item.hospName.length > 10 ? item.hospName.substring(0, 10) + '...' : item.hospName),
      datasets: [{
        label: '轮候时间 (小时)',
        data: sortedData.map(item => getWaitTimeValue(item.topWait)),
        backgroundColor: sortedData.map(item => {
          const value = getWaitTimeValue(item.topWait)
          if (value <= 1.5) return 'rgba(34, 197, 94, 0.8)'
          if (value <= 2.5) return 'rgba(234, 179, 8, 0.8)'
          if (value <= 3.5) return 'rgba(249, 115, 22, 0.8)'
          return 'rgba(239, 68, 68, 0.8)'
        }),
        borderColor: sortedData.map(item => {
          const value = getWaitTimeValue(item.topWait)
          if (value <= 1.5) return 'rgba(34, 197, 94, 1)'
          if (value <= 2.5) return 'rgba(234, 179, 8, 1)'
          if (value <= 3.5) return 'rgba(249, 115, 22, 1)'
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
            title: function (context) {
              const index = context[0].dataIndex
              return sortedData[index].hospName
            },
            label: function (context) {
              const index = context.dataIndex
              return `轮候时间: ${sortedData[index].topWait}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 6,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#8e8e93',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"'
            },
            callback: function (value) {
              return value + '小时'
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

onMounted(() => {
  fetchHospitalData()
  refreshInterval = setInterval(() => {
    fetchHospitalData()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (waitTimeChart) waitTimeChart.destroy()
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>
