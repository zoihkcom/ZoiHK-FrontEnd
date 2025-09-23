<template>
  <div class="page">
    <Navbar />
    <div class="page-body">
      <div class="header">
        <div class="title">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Declared Monuments</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">法定古蹟</h1>
          <p class="subtitle text-sm text-slate-500">数据来源：AMO（坐标：EPSG:4326）</p>
        </div>
        <div class="actions">
          <button class="btn" @click="reload" :disabled="loading">
            <i class="fa fa-refresh" /> 刷新
          </button>
          <button class="btn" @click="fitAll">重置视角</button>
        </div>
      </div>

      <div class="content">
        <div class="map-wrap">
          <GoogleMap :center="mapCenter" :zoom="12" :polygons="polygonItems" :fit-polygons-bounds="true"
            @polygon-click="onPolygonClick" @ready="onMapReady" />
        </div>

        <aside class="sidebar">
          <div v-if="loading" class="state">正在加载法定古蹟数据...</div>
          <div v-else-if="error" class="state error">{{ error }}</div>

          <template v-else>
            <div class="count">共 {{ features.length }} 处</div>

            <div class="list">
              <div v-for="f in features" :key="f.id" class="card" @click="focusFeature(f)">
                <div class="name">
                  <span>{{ f.properties.NAME_TC || f.properties.NAME }}</span>
                </div>
                <div class="meta">
                  <span>{{ f.properties.DISTRIC_TC || f.properties.DISTRICT }}</span>
                  <span v-if="f.properties.DEC_YEAR">｜{{ f.properties.DEC_YEAR }} 年宣布</span>
                </div>
              </div>
            </div>
          </template>

          <div v-if="activeFeature" class="detail">
            <h3>{{ activeFeature.properties.NAME_TC || activeFeature.properties.NAME }}</h3>
            <p class="addr">{{ activeFeature.properties.ADDRESS_TC || activeFeature.properties.ADDRESS }}</p>
            <div class="meta2">
              <span>编号：{{ activeFeature.properties.FILE_REF }}</span>
              <span>地区：{{ activeFeature.properties.DISTRIC_TC || activeFeature.properties.DISTRICT }}</span>
              <span v-if="activeFeature.properties.DEC_YEAR">宣布年份：{{ activeFeature.properties.DEC_YEAR }}</span>
            </div>
            <div class="links">
              <a v-if="activeFeature.properties.DETAIL_TC" :href="activeFeature.properties.DETAIL_TC" target="_blank"
                rel="noreferrer">详情（中文）</a>
              <a v-if="activeFeature.properties.DETAIL" :href="activeFeature.properties.DETAIL" target="_blank"
                rel="noreferrer">Detail (EN)</a>
              <a v-if="activeFeature.properties.URL_IMAGE" :href="activeFeature.properties.URL_IMAGE" target="_blank"
                rel="noreferrer">照片</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GoogleMap from '@/components/GoogleMap.vue'
import { fetchMonuments } from '@/api/heritage.js'

const loading = ref(false)
const error = ref('')
const features = ref([]) // GeoJSON Features
const activeFeature = ref(null)
const mapRef = ref(null)

const mapCenter = ref({ lat: 22.3027, lng: 114.1772 }) // 香港中心

function onMapReady(ctx) {
  mapRef.value = ctx?.map || null
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchMonuments()
    const list = Array.isArray(data?.features) ? data.features : []
    // 给每个 feature 附一个唯一 id
    features.value = list.map((f, idx) => ({
      ...f,
      id: f.id || f.properties?.GmlID || `f-${idx}`
    }))
  } catch (e) {
    error.value = e?.message || '获取数据失败'
  } finally {
    loading.value = false
  }
}

function reload() {
  load()
}

// GeoJSON MultiPolygon/Polygon -> GoogleMap 多边形数据结构
function featureToPolygonItems(f) {
  const geom = f?.geometry
  if (!geom || !geom.coordinates) return []

  const commonStyle = {
    strokeColor: '#0EA5E9', // sky-500
    fillColor: '#0EA5E9',
    strokeWeight: 2,
    strokeOpacity: 0.9,
    fillOpacity: 0.18,
    clickable: true,
    zIndex: 2
  }

  // 坐标为 [lng, lat]，需转为 {lat, lng}
  const toLatLng = (pair) => ({ lat: Number(pair[1]), lng: Number(pair[0]) })

  if (geom.type === 'MultiPolygon') {
    // coordinates: Array<Polygon>; Polygon: Array<Ring>; Ring: Array<[lng,lat]>
    return geom.coordinates.map((poly, idx) => ({
      id: `${f.id}-mp-${idx}`,
      data: f,
      paths: poly.map(ring => ring.map(toLatLng)),
      ...commonStyle
    }))
  }
  if (geom.type === 'Polygon') {
    return [{
      id: `${f.id}-p-0`,
      data: f,
      paths: geom.coordinates.map(ring => ring.map(toLatLng)),
      ...commonStyle
    }]
  }
  return []
}

const polygonItems = computed(() => {
  const items = []
  for (const f of features.value) {
    items.push(...featureToPolygonItems(f))
  }
  return items
})

function onPolygonClick({ data }) {
  if (data) {
    activeFeature.value = data
  }
}

function focusFeature(f) {
  activeFeature.value = f
  // 将视野聚焦到该 feature 的范围
  if (!mapRef.value) return
  const google = window.google
  if (!google?.maps) return

  const bounds = new google.maps.LatLngBounds()
  const items = featureToPolygonItems(f)
  for (const item of items) {
    for (const ring of item.paths) {
      for (const pt of ring) bounds.extend(pt)
    }
  }
  if (!bounds.isEmpty()) {
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      mapRef.value.setCenter(bounds.getCenter())
      mapRef.value.setZoom(16)
    } else {
      mapRef.value.fitBounds(bounds, 24)
    }
  }
}

function fitAll() {
  if (!mapRef.value) return
  const google = window.google
  if (!google?.maps || !polygonItems.value.length) return
  const bounds = new google.maps.LatLngBounds()
  for (const it of polygonItems.value) {
    for (const ring of it.paths) {
      for (const pt of ring) bounds.extend(pt)
    }
  }
  if (!bounds.isEmpty()) mapRef.value.fitBounds(bounds, 24)
}

onMounted(load)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.page-body {
  padding-top: 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
}

.title h1 {
  margin: 4px 0 0 0;
}

.subtitle {
  margin: 6px 0 0 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}

.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.content {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
  padding: 0 16px 16px;
}

.map-wrap {
  width: 100%;
}

.sidebar {
  max-height: calc(100vh - 120px);
  overflow: auto;
  border-left: 1px solid #f1f5f9;
  padding-left: 8px;
}

.state {
  padding: 12px;
  color: #64748b;
}

.state.error {
  color: #dc2626;
}

.count {
  padding: 8px 12px;
  color: #334155;
  font-size: 13px;
}

.list {
  display: grid;
  gap: 8px;
  padding: 8px;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: box-shadow .15s ease;
}

.card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, .06);
}

.name {
  font-weight: 600;
  color: #0f172a;
}

.meta {
  margin-top: 4px;
  color: #475569;
  font-size: 12px;
}

.detail {
  margin: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.detail h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.addr {
  margin: 0 0 8px;
  color: #475569;
}

.meta2 {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #334155;
  font-size: 12px;
  margin-bottom: 8px;
}

.links {
  display: flex;
  gap: 12px;
}

.links a {
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-left: none;
    padding-left: 0;
  }
}
</style>
