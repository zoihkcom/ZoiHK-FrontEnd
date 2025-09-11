<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content with proper spacing for navbar -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              香港天气
            </span>
          </h1>
          <p class="text-xl text-slate-600 mb-8">实时天气信息与数据分析</p>

          <div class="flex flex-col items-center gap-4">
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

            <div v-if="weatherData?.updateTime" class="text-sm text-slate-500">
              最后更新：{{ formatUpdateTime(weatherData.updateTime) }}
            </div>
          </div>
        </div>

        <!-- Error State -->
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

        <!-- Loading State -->
        <div v-else-if="loading && !weatherData" class="flex flex-col items-center justify-center py-20">
          <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-slate-600 text-lg">正在获取数据...</p>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else-if="weatherData" class="space-y-12">
          <!-- Weather Overview Cards -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Current Weather Card -->
            <div
              class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-6">
                <i class="fa fa-sun-o text-3xl text-blue-500"></i>
                <h3 class="text-xl font-semibold text-slate-900">当前天气</h3>
              </div>

              <div v-if="mainTemperature" class="text-center">
                <div class="text-5xl font-bold text-blue-600 mb-2">
                  {{ mainTemperature.value }}°{{ mainTemperature.unit }}
                </div>
                <div class="text-slate-600 text-lg mb-6">
                  {{ mainTemperature.place }}
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div v-if="weatherData.humidity?.data?.[0]" class="text-center">
                    <div class="text-sm text-slate-500 mb-1">湿度</div>
                    <div class="text-lg font-semibold text-slate-900">{{ weatherData.humidity.data[0].value }}%</div>
                  </div>
                  <div v-if="weatherData.uvindex?.data?.[0]" class="text-center">
                    <div class="text-sm text-slate-500 mb-1">紫外线</div>
                    <div class="text-lg font-semibold text-slate-900">{{ weatherData.uvindex.data[0].desc }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- UV Index Card -->
            <div
              class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-6">
                <i class="fa fa-sun-o text-3xl text-yellow-500"></i>
                <h3 class="text-xl font-semibold text-slate-900">紫外线指数</h3>
              </div>

              <div class="relative flex justify-center items-center" style="height: 200px;">
                <canvas ref="uvGaugeRef" class="w-40 h-20"></canvas>
                <div v-if="weatherData.uvindex?.data?.[0]" class="absolute bottom-4 text-center">
                  <div class="text-3xl font-bold text-orange-500">{{ weatherData.uvindex.data[0].value }}</div>
                  <div class="text-sm font-medium text-slate-900">{{ weatherData.uvindex.data[0].desc }}</div>
                  <div class="text-xs text-slate-500">{{ weatherData.uvindex.data[0].place }}</div>
                </div>
              </div>
            </div>

            <!-- Humidity Card -->
            <div v-if="weatherData.humidity?.data?.[0]"
              class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-6">
                <i class="fa fa-tint text-3xl text-blue-400"></i>
                <h3 class="text-xl font-semibold text-slate-900">湿度</h3>
              </div>

              <div class="flex justify-center items-center" style="height: 180px;">
                <div class="relative">
                  <svg class="transform -rotate-90" width="120" height="120">
                    <circle cx="60" cy="60" r="50" stroke="#f1f5f9" stroke-width="10" fill="none"></circle>
                    <circle cx="60" cy="60" r="50" stroke="#10b981" stroke-width="10" fill="none" stroke-dasharray="314"
                      :stroke-dashoffset="314 - (314 * weatherData.humidity.data[0].value) / 100"
                      class="transition-all duration-1000 ease-out"></circle>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <div class="text-2xl font-bold text-green-600">{{ weatherData.humidity.data[0].value }}%</div>
                    <div class="text-xs text-slate-500 mt-1">{{ weatherData.humidity.data[0].place }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 9-Day Forecast -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <i class="fa fa-calendar text-2xl text-purple-600"></i>
              <h3 class="text-2xl font-bold text-slate-900">未来9天天气预报</h3>
            </div>

            <!-- Forecast error state (non-blocking) -->
            <div v-if="forecastError"
              class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
              {{ forecastError }}
            </div>

            <!-- General Situation -->
            <div v-if="forecastData?.generalSituation"
              class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 mb-6">
              <div class="flex items-start gap-3">
                <i class="fa fa-info-circle text-indigo-600 mt-0.5"></i>
                <p class="text-slate-700 leading-relaxed">{{ forecastData.generalSituation }}</p>
              </div>
              <div v-if="forecastData?.updateTime" class="text-xs text-slate-500 mt-3">
                预报更新时间：{{ formatUpdateTime(forecastData.updateTime) }}
              </div>
            </div>

            <!-- Forecast Cards -->
            <div v-if="dailyForecasts.length"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div v-for="d in dailyForecasts" :key="d.forecastDate"
                class="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <div class="text-slate-900 font-semibold">{{ d.week }}</div>
                    <div class="text-slate-500 text-sm">{{ formatForecastDate(d.forecastDate) }}</div>
                  </div>
                  <img :src="getHkoIconUrl(d.ForecastIcon)" alt="icon" class="w-12 h-12" />
                </div>

                <div class="flex items-baseline gap-3 mb-2">
                  <div class="text-2xl font-bold text-blue-600">{{ d.forecastMaxtemp.value }}°C</div>
                  <div class="text-slate-500">/{{ d.forecastMintemp.value }}°C</div>
                </div>

                <div class="text-sm text-slate-600 mb-2">
                  相对湿度：{{ d.forecastMinrh.value }}–{{ d.forecastMaxrh.value }}%
                </div>
                <div class="text-sm text-slate-600 mb-3 line-clamp-2">{{ d.forecastWeather }}</div>

                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500 truncate" :title="d.forecastWind">{{ d.forecastWind }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="psrBadgeClass(d.PSR)">
                    降雨概率：{{ d.PSR }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div v-if="weatherData.warningMessage || weatherData.tcmessage?.length"
            class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
            <div class="flex items-start gap-3">
              <i class="fa fa-info-circle text-indigo-600 mt-0.5"></i>
              <div class="flex-1 space-y-2">
                <p v-if="weatherData.warningMessage" class="text-slate-700 leading-relaxed">
                  {{ weatherData.warningMessage }}
                </p>
                <p v-for="(message, index) in weatherData.tcmessage" :key="index"
                  class="text-slate-700 leading-relaxed">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Temperature Chart -->
            <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <i class="fa fa-thermometer-half text-2xl text-red-500"></i>
                <h3 class="text-xl font-semibold text-slate-900">各地区温度分布</h3>
              </div>
              <div class="h-96">
                <canvas ref="temperatureChartRef" class="w-full h-full"></canvas>
              </div>
            </div>

            <!-- Rainfall Chart -->
            <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <i class="fa fa-cloud text-2xl text-blue-600"></i>
                <h3 class="text-xl font-semibold text-slate-900">降雨量分布</h3>
              </div>
              <div class="h-96">
                <canvas ref="rainfallChartRef" class="w-full h-full"></canvas>
              </div>
            </div>
          </div>

          <!-- Region Details -->
          <div>
            <h2 class="text-3xl font-bold text-slate-900 text-center mb-8">各地区详细信息</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div v-for="region in processedRegions" :key="region.name"
                class="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div class="flex justify-between items-center">
                  <h4 class="font-semibold text-slate-900 text-sm">{{ region.name }}</h4>
                  <div class="text-lg font-bold text-blue-600">
                    {{ region.temperature }}°C
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  DoughnutController
} from 'chart.js'

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  DoughnutController
)

const weatherData = ref(null)
const loading = ref(false)
const error = ref('')
const forecastData = ref(null)
const forecastError = ref('')
const temperatureChartRef = ref(null)
const rainfallChartRef = ref(null)
const uvGaugeRef = ref(null)

let temperatureChart = null
let rainfallChart = null
let uvGauge = null
let refreshInterval = null

const API_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=sc'
const FND_API_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=sc'

const fetchWeatherData = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    weatherData.value = data

    // Wait for next tick to ensure DOM elements are available
    await new Promise(resolve => setTimeout(resolve, 100))
    createCharts()

  } catch (err) {
    console.error('Error fetching weather data:', err)
    error.value = '无法获取天气数据，请稍后重试'
    // Keep error, but don't throw to avoid blocking other data
  }
}

const refreshData = async () => {
  try {
    loading.value = true
    error.value = ''
    forecastError.value = ''
    await Promise.allSettled([
      fetchWeatherData(),
      fetchForecastData()
    ])
  } catch (err) {
    console.error('获取数据失败:', err)
  } finally {
    loading.value = false
  }
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

const mainTemperature = computed(() => {
  if (!weatherData.value?.temperature?.data) return null
  // Find Hong Kong Observatory temperature
  const hko = weatherData.value.temperature.data.find(t => t.place === '香港天文台')
  return hko || weatherData.value.temperature.data[0]
})

const processedRegions = computed(() => {
  if (!weatherData.value?.temperature?.data) return []

  // Only use temperature data, no need to merge with rainfall
  return weatherData.value.temperature.data.map(temp => ({
    name: temp.place,
    temperature: temp.value
  }))
})

const createCharts = () => {
  createTemperatureChart()
  createRainfallChart()
  createUvGauge()
}

// 9-day forecast helpers
const fetchForecastData = async () => {
  try {
    const res = await fetch(FND_API_URL)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    forecastData.value = data
  } catch (err) {
    console.error('Error fetching forecast data:', err)
    forecastError.value = '无法获取9天天气预报数据'
  }
}

const dailyForecasts = computed(() => Array.isArray(forecastData.value?.weatherForecast) ? forecastData.value.weatherForecast : [])

const formatForecastDate = (yyyymmdd) => {
  if (!yyyymmdd) return ''
  try {
    const s = String(yyyymmdd)
    const y = Number(s.slice(0, 4))
    const m = Number(s.slice(4, 6))
    const d = Number(s.slice(6, 8))
    const dt = new Date(y, m - 1, d)
    return dt.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  } catch {
    return yyyymmdd
  }
}

const getHkoIconUrl = (code) => {
  return `https://rss.weather.gov.hk/img/pic${code}.png`
}

const psrBadgeClass = (psr) => {
  // 低 / 中低 / 中 / 中高 / 高
  const base = 'border text-xs'
  switch (psr) {
    case '高':
      return `${base} bg-red-50 text-red-700 border-red-200`
    case '中高':
      return `${base} bg-orange-50 text-orange-700 border-orange-200`
    case '中':
      return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`
    case '中低':
      return `${base} bg-lime-50 text-lime-700 border-lime-200`
    default:
      return `${base} bg-green-50 text-green-700 border-green-200`
  }
}

const createTemperatureChart = () => {
  if (!temperatureChartRef.value || !weatherData.value?.temperature?.data) return

  // Destroy existing chart
  if (temperatureChart) {
    temperatureChart.destroy()
  }

  const ctx = temperatureChartRef.value.getContext('2d')
  const tempData = weatherData.value.temperature.data

  temperatureChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tempData.map(item => item.place),
      datasets: [{
        label: '温度 (°C)',
        data: tempData.map(item => item.value),
        backgroundColor: tempData.map((item) => {
          const hue = Math.max(0, Math.min(240, 240 - (item.value - 20) * 8))
          return `hsla(${hue}, 70%, 60%, 0.8)`
        }),
        borderColor: tempData.map((item) => {
          const hue = Math.max(0, Math.min(240, 240 - (item.value - 20) * 8))
          return `hsla(${hue}, 70%, 50%, 1)`
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
            label: function (context) {
              return `温度: ${context.parsed.y}°C`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
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
              return value + '°C'
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

const createRainfallChart = () => {
  if (!rainfallChartRef.value || !weatherData.value?.rainfall?.data) return

  // Destroy existing chart
  if (rainfallChart) {
    rainfallChart.destroy()
  }

  const ctx = rainfallChartRef.value.getContext('2d')
  const rainfallData = weatherData.value.rainfall.data

  rainfallChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: rainfallData.map(item => item.place),
      datasets: [{
        label: '降雨量 (mm)',
        data: rainfallData.map(item => item.max),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
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
          cornerRadius: 12
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: '#8e8e93',
            backdropColor: 'transparent',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"'
            }
          },
          pointLabels: {
            color: '#1d1d1f',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"',
              size: 11
            }
          }
        }
      }
    }
  })
}

const createUvGauge = () => {
  if (!uvGaugeRef.value || !weatherData.value?.uvindex?.data?.[0]) return

  // Destroy existing chart
  if (uvGauge) {
    uvGauge.destroy()
  }

  const ctx = uvGaugeRef.value.getContext('2d')
  const uvValue = weatherData.value.uvindex.data[0].value
  const maxUV = 12

  uvGauge = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [uvValue, maxUV - uvValue],
        backgroundColor: [
          getUvColor(uvValue),
          'rgba(240, 240, 240, 0.3)'
        ],
        borderWidth: 0,
        cutout: '80%',
        rotation: -90,
        circumference: 180
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
          enabled: false
        }
      }
    }
  })
}

const getUvColor = (value) => {
  if (value <= 2) return '#34C759' // Green - Low
  if (value <= 5) return '#FFCC02' // Yellow - Moderate
  if (value <= 7) return '#FF9500' // Orange - High
  if (value <= 10) return '#FF3B30' // Red - Very High
  return '#AF52DE' // Purple - Extreme
}

onMounted(() => {
  refreshData()
  // Auto refresh every 5 minutes
  refreshInterval = setInterval(() => {
    refreshData()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  // Cleanup charts
  if (temperatureChart) temperatureChart.destroy()
  if (rainfallChart) rainfallChart.destroy()
  if (uvGauge) uvGauge.destroy()

  // Cleanup interval
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

/* Ensure canvas responsiveness */
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>
