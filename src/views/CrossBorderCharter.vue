<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />
    <main class="pt-20 pb-16">
      <div class="px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="max-w-6xl mx-auto text-center space-y-3">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Cross-Border Charter</p>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900">跨境包车服务</h1>
          <p class="text-sm text-slate-500">在地图上选择上车点与下车点，系统会自动保存坐标并生成 Google Maps 导航链接，便于与司机沟通行程。</p>
        </div>
        <div class="container mx-auto space-y-6">
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              :class="activeTarget === 'pickup' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
              type="button" @click="setActiveTarget('pickup')">
              <i class="fa fa-map-marker text-sky-500"></i>
              设置上车点
            </button>
            <button
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              :class="activeTarget === 'dropoff' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
              type="button" @click="setActiveTarget('dropoff')">
              <i class="fa fa-map-marker text-emerald-500"></i>
              设置下车点
            </button>
            <span class="text-xs text-slate-500">当前操作：{{ activeLabel }}</span>
          </div>

          <div class="grid gap-6 lg:grid-cols-3">
            <section
              class="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" class="h-full" @ready="onMapReady"
                @error="onMapError" />
              <div
                class="flex flex-wrap items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                <span>提示：点击地图可设置 {{ activeLabel }}，拖动地图寻找更合适的位置。</span>
                <button class="text-sky-600 hover:text-sky-700 font-medium" type="button" @click="resetPoints">
                  清除全部选点
                </button>
              </div>
            </section>

            <aside class="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
              <section>
                <header class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-semibold text-slate-800">上车点</h2>
                    <p class="text-xs text-slate-500">输入关键词或点击地图即可设置</p>
                  </div>
                  <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600">Pickup</span>
                </header>
                <div class="mt-4 space-y-3">
                  <div class="flex gap-2">
                    <input v-model.trim="pickupQuery" type="text" placeholder="如：深圳湾口岸停车场"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
                      @keyup.enter="searchAddress('pickup')" />
                    <button
                      class="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 whitespace-nowrap"
                      type="button" :disabled="loadingTarget === 'pickup'" @click="searchAddress('pickup')">{{
                        loadingTarget === 'pickup' ? '搜索中' : '搜索' }}</button>
                  </div>
                  <p v-if="errors.pickup" class="text-xs text-rose-500">{{ errors.pickup }}</p>
                  <div v-if="pickupPoint"
                    class="space-y-2 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
                    <p class="font-medium text-slate-800">{{ pickupPoint.address }}</p>
                    <p class="text-xs text-slate-500">坐标：{{ pickupPoint.position.lat.toFixed(6) }}, {{
                      pickupPoint.position.lng.toFixed(6) }}</p>
                    <div class="flex flex-wrap gap-2 pt-1">
                      <button
                        class="rounded-full border border-sky-400 px-3 py-1 text-xs font-medium text-sky-600 hover:bg-sky-100"
                        type="button" @click="focusPoint('pickup')">
                        地图定位
                      </button>
                      <a :href="mapsSearchLink(pickupPoint)"
                        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
                        target="_blank" rel="noreferrer">
                        打开 Google 地图
                      </a>
                    </div>
                    <p class="text-xs text-slate-400">更新时间：{{ pickupPoint.updatedAt }}</p>
                  </div>
                  <div v-else class="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                    暂未选择上车点，先点击地图或输入地址搜索。
                  </div>
                </div>
              </section>

              <section>
                <header class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-semibold text-slate-800">下车点</h2>
                    <p class="text-xs text-slate-500">可输入目的地地址或者直接点选</p>
                  </div>
                  <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">Dropoff</span>
                </header>
                <div class="mt-4 space-y-3">
                  <div class="flex gap-2">
                    <input v-model.trim="dropoffQuery" type="text" placeholder="如：香港国际机场 T1"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                      @keyup.enter="searchAddress('dropoff')" />
                    <button
                      class="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 whitespace-nowrap"
                      type="button" :disabled="loadingTarget === 'dropoff'" @click="searchAddress('dropoff')">{{
                        loadingTarget === 'dropoff' ? '搜索中' : '搜索' }}</button>
                  </div>
                  <p v-if="errors.dropoff" class="text-xs text-rose-500">{{ errors.dropoff }}</p>
                  <div v-if="dropoffPoint"
                    class="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-slate-700">
                    <p class="font-medium text-slate-800">{{ dropoffPoint.address }}</p>
                    <p class="text-xs text-slate-500">坐标：{{ dropoffPoint.position.lat.toFixed(6) }}, {{
                      dropoffPoint.position.lng.toFixed(6) }}</p>
                    <div class="flex flex-wrap gap-2 pt-1">
                      <button
                        class="rounded-full border border-emerald-400 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                        type="button" @click="focusPoint('dropoff')">
                        地图定位
                      </button>
                      <a :href="mapsSearchLink(dropoffPoint)"
                        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
                        target="_blank" rel="noreferrer">
                        打开 Google 地图
                      </a>
                    </div>
                    <p class="text-xs text-slate-400">更新时间：{{ dropoffPoint.updatedAt }}</p>
                  </div>
                  <div v-else class="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                    暂未选择下车点，点击地图或输入地址即可完成设置。
                  </div>
                </div>
              </section>

              <section class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <i class="fa fa-road text-sky-500"></i>
                  行程概览
                </div>
                <div v-if="pickupPoint && dropoffPoint" class="space-y-2 text-sm text-slate-600">
                  <p>预计直线距离约 {{ distanceText }}，实际车程以实时路况为准。</p>
                  <ul class="space-y-1 text-xs text-slate-500">
                    <li>上车：{{ pickupPoint.address }}</li>
                    <li>下车：{{ dropoffPoint.address }}</li>
                    <li>坐标：{{ pickupPoint.position.lat.toFixed(5) }}, {{ pickupPoint.position.lng.toFixed(5) }} → {{
                      dropoffPoint.position.lat.toFixed(5) }}, {{ dropoffPoint.position.lng.toFixed(5) }}</li>
                  </ul>
                  <a :href="directionLink"
                    class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
                    target="_blank" rel="noreferrer">
                    <i class="fa fa-external-link"></i>
                    打开 Google Maps 导航
                  </a>
                </div>
                <div v-else class="text-xs text-slate-400">
                  完成上下车点设置后，这里会展示行程摘要与导航链接。
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GoogleMap from '@/components/GoogleMap.vue'

const mapCenter = ref({ lat: 22.3193, lng: 114.1694 })
const mapInstance = ref(null)
const geocoder = ref(null)
const pickupPoint = ref(null)
const dropoffPoint = ref(null)
const pickupQuery = ref('')
const dropoffQuery = ref('')
const activeTarget = ref('pickup')
const loadingTarget = ref('')
const errors = reactive({ pickup: '', dropoff: '' })

const activeLabel = computed(() => activeTarget.value === 'pickup' ? '上车点' : '下车点')

const mapMarkers = computed(() => {
  const list = []
  if (pickupPoint.value) {
    list.push({
      lat: pickupPoint.value.position.lat,
      lng: pickupPoint.value.position.lng,
      title: '上车点',
      icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    })
  }
  if (dropoffPoint.value) {
    list.push({
      lat: dropoffPoint.value.position.lat,
      lng: dropoffPoint.value.position.lng,
      title: '下车点',
      icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    })
  }
  return list
})

const distanceText = computed(() => {
  if (!pickupPoint.value || !dropoffPoint.value) return ''
  const distanceKm = haversineDistance(
    pickupPoint.value.position.lat,
    pickupPoint.value.position.lng,
    dropoffPoint.value.position.lat,
    dropoffPoint.value.position.lng
  )
  if (distanceKm < 0.1) return `${(distanceKm * 1000).toFixed(0)} 米`
  return `${distanceKm.toFixed(distanceKm > 50 ? 0 : 1)} 公里`
})

const directionLink = computed(() => {
  if (!pickupPoint.value || !dropoffPoint.value) return ''
  const origin = `${pickupPoint.value.position.lat},${pickupPoint.value.position.lng}`
  const destination = `${dropoffPoint.value.position.lat},${dropoffPoint.value.position.lng}`
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
})

function onMapReady({ map }) {
  mapInstance.value = map
  if (window.google?.maps) {
    geocoder.value = new window.google.maps.Geocoder()
    map.addListener('click', (event) => {
      if (!event?.latLng) return
      handleMapClick(event.latLng)
    })
  }
}

function onMapError(err) {
  console.error('Google Map 初始化失败', err)
  alert('Google 地图加载失败，请检查网络或 API Key 配置')
}

function setActiveTarget(target) {
  activeTarget.value = target
}

async function handleMapClick(latLng) {
  if (!geocoder.value) return
  const target = activeTarget.value
  loadingTarget.value = target
  errors[target] = ''
  const location = extractLatLng(latLng)
  if (!location) {
    errors[target] = '无法读取地图坐标'
    loadingTarget.value = ''
    return
  }
  try {
    const results = await geocode({ location })
    if (!results.length) {
      applyGeocodeResult(target, null, location)
      errors[target] = '已记录坐标，但未能识别具体地址'
      return
    }
    applyGeocodeResult(target, results[0], location)
    flyTo(location)
  } catch (error) {
    console.error('反向地理编码失败', error)
    applyGeocodeResult(target, null, location)
    errors[target] = '已记录坐标，但未能识别具体地址'
  } finally {
    loadingTarget.value = ''
  }
}

async function searchAddress(target) {
  const query = target === 'pickup' ? pickupQuery.value : dropoffQuery.value
  errors[target] = ''
  if (!query) {
    errors[target] = '请输入地址关键字'
    return
  }
  if (!geocoder.value) {
    errors[target] = '地图尚未完成加载，请稍后再试'
    return
  }
  loadingTarget.value = target
  try {
    const results = await geocode({ address: query, region: 'hk' })
    if (!results.length) {
      errors[target] = '未找到匹配地址，请尝试更精确的关键词'
      return
    }
    const top = results[0]
    const location = extractLatLng(top.geometry?.location)
    if (!location) {
      errors[target] = '无法解析该地址的坐标'
      return
    }
    applyGeocodeResult(target, top, location)
    flyTo(location)
  } catch (error) {
    console.error('地址搜索失败', error)
    errors[target] = error?.message || '搜索失败，请稍后重试'
  } finally {
    loadingTarget.value = ''
  }
}

function applyGeocodeResult(target, result, location) {
  if (!location) return
  const formatted = result?.formatted_address || '未命名位置'
  const point = {
    position: location,
    address: formatted,
    placeId: result?.place_id || '',
    updatedAt: formatTimestamp(new Date())
  }
  if (target === 'pickup') {
    pickupPoint.value = point
    if (formatted && formatted !== '未命名位置') pickupQuery.value = formatted
  } else {
    dropoffPoint.value = point
    if (formatted && formatted !== '未命名位置') dropoffQuery.value = formatted
  }
  mapCenter.value = location
}

function flyTo(location) {
  if (!mapInstance.value || !location) return
  mapInstance.value.panTo(location)
  mapInstance.value.setZoom(Math.max(mapInstance.value.getZoom() || 12, 14))
}

function geocode(params) {
  return new Promise((resolve, reject) => {
    geocoder.value.geocode(params, (results, status) => {
      if (status === 'OK') {
        resolve(results || [])
      } else if (status === 'ZERO_RESULTS') {
        resolve([])
      } else {
        reject(new Error(`Geocoder error: ${status}`))
      }
    })
  })
}

function extractLatLng(latLng) {
  if (!latLng) return null
  const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat
  const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6))
  }
}

function mapsSearchLink(point) {
  if (!point) return '#'
  return `https://www.google.com/maps/search/?api=1&query=${point.position.lat},${point.position.lng}`
}

function focusPoint(target) {
  const point = target === 'pickup' ? pickupPoint.value : dropoffPoint.value
  if (!point) return
  flyTo(point.position)
  activeTarget.value = target
}

function resetPoints() {
  pickupPoint.value = null
  dropoffPoint.value = null
  pickupQuery.value = ''
  dropoffQuery.value = ''
  errors.pickup = ''
  errors.dropoff = ''
}

function formatTimestamp(date) {
  if (!(date instanceof Date)) return ''
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return formatter.format(date)
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (val) => (val * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
</script>
