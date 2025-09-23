<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />
    <div class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <header class="text-center space-y-3">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Cross-Border Bus</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">跨境巴士查询</h1>
          <p class="text-slate-600 text-base sm:text-lg">
            选择城市与站点，即时查看跨境班次信息与票价。
          </p>
        </header>

        <section class="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700" for="on-city">出发城市</label>
              <n-select
                v-model:value="selectedOnCityId"
                :options="departureCityOptions"
                placeholder="请选择出发城市"
                clearable
                class="w-full"
                :input-props="{ id: 'on-city' }"
              />
              <p v-if="departureError" class="text-xs text-red-500">{{ departureError }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700" for="off-city">到达城市</label>
              <n-select
                v-model:value="selectedOffCityId"
                :options="arrivalCityOptions"
                placeholder="请选择到达城市"
                clearable
                class="w-full"
                :disabled="!selectedOnCityId || arrivalLoading"
                :loading="arrivalLoading"
                :input-props="{ id: 'off-city' }"
              />
              <p v-if="arrivalError" class="text-xs text-red-500">{{ arrivalError }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700" for="departure-date">出发日期</label>
              <n-date-picker
                v-model:value="departureDate"
                type="date"
                clearable
                placeholder="请选择出发日期"
                value-format="yyyy-MM-dd"
                :input-props="{ id: 'departure-date' }"
                class="w-full"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700" for="on-station">出发站点</label>
              <n-select
                v-model:value="selectedOnStationId"
                :options="onStationOptions"
                placeholder="请选择出发站点"
                clearable
                class="w-full"
                :disabled="onStationsLoading || !flattenedOnStations.length"
                :loading="onStationsLoading"
                :input-props="{ id: 'on-station' }"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700" for="off-station">到达站点</label>
              <n-select
                v-model:value="selectedOffStationId"
                :options="offStationOptions"
                placeholder="请选择到达站点"
                clearable
                class="w-full"
                :disabled="offStationsLoading || !flattenedOffStations.length"
                :loading="offStationsLoading"
                :input-props="{ id: 'off-station' }"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <i class="fa fa-info-circle text-blue-500"></i>
              <span>当选择城市或日期后，站点列表将自动刷新。</span>
            </div>
            <n-button
              type="primary"
              size="large"
              :loading="runsLoading"
              :disabled="runButtonDisabled"
              @click="loadRuns"
            >
              {{ runsLoading ? '查询中...' : '查询班次' }}
            </n-button>
          </div>
        </section>

        <section class="space-y-4">
          <div v-if="runsError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {{ runsError }}
          </div>

          <div v-if="runsLoading" class="bg-white rounded-2xl border border-slate-200 px-6 py-10 text-center">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-slate-600">正在获取班次与票价信息...</p>
          </div>

          <div v-else-if="runInfoList.length" class="space-y-4">
            <article v-for="run in runInfoList" :key="run.runId"
              class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div class="text-sm text-slate-500">班次ID：{{ run.runId }}</div>
                  <h2 class="text-xl font-semibold text-slate-900 mt-1">{{ run.runDate }} · {{ run.runTime }}</h2>
                  <p class="text-sm text-slate-500 mt-1">
                    {{ run.onCityName }} · {{ run.onAreaName }} → {{ run.offCityName }} · {{ run.offAreaName }}
                  </p>
                </div>
                <div class="text-right text-sm text-slate-600">
                  <div>口岸：{{ run.crossPortName || '待定' }}</div>
                  <div v-if="seatInfoFor(run.runId)">
                    余座：{{ seatInfoFor(run.runId).canSaleSeatNum }} / {{ seatInfoFor(run.runId).allSeatNum }}
                  </div>
                  <div v-else>
                    余座：{{ run.remainSeatNum }} / {{ run.totalSeats }}
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-xl p-4">
                <div class="text-xs text-slate-500 mb-2">票价详情</div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <div v-for="price in run.priceList" :key="price.priceId"
                    class="bg-white rounded-lg border border-slate-200 px-4 py-3">
                    <div class="text-sm font-semibold text-slate-900">{{ price.priceTypeName }}</div>
                    <div class="text-xl font-bold text-blue-600 mt-1">HK$ {{ price.price }}</div>
                    <div class="text-xs text-slate-400 mt-1">票面价：HK$ {{ price.originalPrice }}</div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-else-if="runsLoaded" class="bg-white rounded-2xl border border-slate-200 px-6 py-10 text-center text-slate-500">
            暂无可展示的班次，请调整站点或日期后重试。
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { crossBorderBusApi } from '@/api/crossBorderBus.js'

const SINGLE_TRIP = 0

const getTodayString = () => {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10)
}

const departureCities = ref([])
const arrivalCities = ref([])
const flattenedOnStations = ref([])
const flattenedOffStations = ref([])
const seatInfoMap = ref({})

const departureCityOptions = computed(() =>
  departureCities.value.map((city) => ({
    label: city.name,
    value: city.id
  }))
)

const arrivalCityOptions = computed(() =>
  arrivalCities.value.map((city) => ({
    label: city.name,
    value: city.id
  }))
)

const onStationOptions = computed(() =>
  flattenedOnStations.value.map((station) => ({
    label: station.areaName ? `${station.stationName} · ${station.areaName}` : station.stationName,
    value: station.stationId
  }))
)

const offStationOptions = computed(() =>
  flattenedOffStations.value.map((station) => ({
    label: station.areaName ? `${station.stationName} · ${station.areaName}` : station.stationName,
    value: station.stationId
  }))
)

const selectedOnCityId = ref('')
const selectedOffCityId = ref('')
const selectedOnStationId = ref('')
const selectedOffStationId = ref('')

const departureDate = ref(getTodayString())

const departureError = ref('')
const arrivalError = ref('')
const runsError = ref('')

const arrivalLoading = ref(false)
const onStationsLoading = ref(false)
const offStationsLoading = ref(false)
const runsLoading = ref(false)

const runInfoList = ref([])
const runsLoaded = ref(false)

const handleApiResponse = (payload) => {
  if (payload?.errCd !== 0) {
    throw new Error(payload?.errorInfo || '接口返回异常')
  }
  return payload?.data ?? []
}

const resetArrival = () => {
  arrivalCities.value = []
  selectedOffCityId.value = ''
  arrivalError.value = ''
}

const resetStations = () => {
  flattenedOnStations.value = []
  flattenedOffStations.value = []
  selectedOnStationId.value = ''
  selectedOffStationId.value = ''
  seatInfoMap.value = {}
}

const resetRuns = () => {
  runInfoList.value = []
  runsLoaded.value = false
  runsError.value = ''
  seatInfoMap.value = {}
}

const fetchDepartureCities = async () => {
  try {
    departureError.value = ''
    const res = await crossBorderBusApi.fetchDepartureCities(SINGLE_TRIP)
    departureCities.value = handleApiResponse(res)
  } catch (error) {
    departureError.value = error.message || '无法获取出发城市'
  }
}

const fetchArrivalCities = async (onCityId) => {
  if (!onCityId) return
  try {
    arrivalLoading.value = true
    arrivalError.value = ''
    const res = await crossBorderBusApi.fetchArrivalCities(onCityId, SINGLE_TRIP)
    arrivalCities.value = handleApiResponse(res)
  } catch (error) {
    arrivalError.value = error.message || '无法获取到达城市'
  } finally {
    arrivalLoading.value = false
  }
}

const flattenStations = (list) => {
  if (!Array.isArray(list)) return []
  return list.flatMap((area) => {
    if (!Array.isArray(area?.stationList)) return []
    return area.stationList.map((station) => ({
      ...station,
      areaName: area.areaName
    }))
  })
}

const fetchStations = async () => {
  if (!selectedOnCityId.value || !selectedOffCityId.value || !departureDate.value) {
    resetStations()
    return
  }
  const payload = {
    onCityId: selectedOnCityId.value,
    offCityId: selectedOffCityId.value,
    departureDate: departureDate.value,
    singleTrip: SINGLE_TRIP
  }
  try {
    onStationsLoading.value = true
    offStationsLoading.value = true
    const [onRes, offRes] = await Promise.all([
      crossBorderBusApi.fetchOnStations(payload),
      crossBorderBusApi.fetchOffStations(payload)
    ])
    flattenedOnStations.value = flattenStations(handleApiResponse(onRes))
    flattenedOffStations.value = flattenStations(handleApiResponse(offRes))
    runsError.value = ''
  } catch (error) {
    runsError.value = error.message || '获取站点信息失败'
    resetStations()
  } finally {
    onStationsLoading.value = false
    offStationsLoading.value = false
  }
}

const fetchSeatInfo = async (runIds) => {
  if (
    !Array.isArray(runIds) ||
    !runIds.length ||
    !selectedOnStationId.value ||
    !selectedOffStationId.value
  ) {
    seatInfoMap.value = {}
    return
  }
  try {
    const res = await crossBorderBusApi.fetchSeatInfo({
      runIds,
      beginStopId: selectedOnStationId.value,
      endStopId: selectedOffStationId.value,
      ticketId: ''
    })
    const list = handleApiResponse(res)
    const map = {}
    if (Array.isArray(list)) {
      list.forEach((item) => {
        if (item?.runId) {
          map[item.runId] = item
        }
      })
    }
    seatInfoMap.value = map
  } catch (error) {
    console.error('获取座位信息失败', error)
  }
}

const loadRuns = async () => {
  if (!selectedOnStationId.value || !selectedOffStationId.value) {
    runsError.value = '请先选择完整的站点信息'
    return
  }
  seatInfoMap.value = {}
  try {
    runsLoading.value = true
    runsError.value = ''
    const res = await crossBorderBusApi.fetchRuns({
      date: departureDate.value,
      onStationId: selectedOnStationId.value,
      offStationId: selectedOffStationId.value,
      singleTrip: SINGLE_TRIP
    })
    const data = handleApiResponse(res)
    runInfoList.value = Array.isArray(data?.runInfoList) ? data.runInfoList : []
    runsLoaded.value = true
    await fetchSeatInfo(runInfoList.value.map((run) => run.runId))
  } catch (error) {
    runsError.value = error.message || '获取班次信息失败'
    runInfoList.value = []
    runsLoaded.value = false
  } finally {
    runsLoading.value = false
  }
}

const runButtonDisabled = computed(() => {
  return runsLoading.value || !selectedOnStationId.value || !selectedOffStationId.value
})

const seatInfoFor = (runId) => seatInfoMap.value?.[runId] || null

watch(selectedOnCityId, async (newVal, oldVal) => {
  if (newVal === oldVal) return
  resetArrival()
  resetStations()
  resetRuns()
  if (!newVal) return
  await fetchArrivalCities(newVal)
})

watch([selectedOffCityId, departureDate], async () => {
  resetStations()
  resetRuns()
  await fetchStations()
})

watch([selectedOnStationId, selectedOffStationId], () => {
  runsError.value = ''
  seatInfoMap.value = {}
})

onMounted(async () => {
  await fetchDepartureCities()
})
</script>
