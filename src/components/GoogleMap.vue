<template>
  <div class="gm-container">
    <div ref="mapEl" class="gm-map"></div>
  </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const props = defineProps({
  apiKey: { type: String, default: '' },
  center: { type: Object, default: () => ({ lat: 22.3027, lng: 114.1772 }) },
  zoom: { type: Number, default: 12 },
  markers: { type: Array, default: () => [] }, // [{ lat, lng, title }]
  mapId: { type: String, default: 'hk' },
  disableDefaultUI: { type: Boolean, default: false },
  // 多边形支持：
  // [ { id, paths: [ [ {lat,lng}, ... ] /* outer */, [ ... ] /* holes */ ], strokeColor, fillColor, fillOpacity, strokeWeight, strokeOpacity, zIndex, clickable, data } ]
  polygons: { type: Array, default: () => [] },
  // 若为 true，更新多边形时自动适配视野
  fitPolygonsBounds: { type: Boolean, default: true }
})

const emit = defineEmits(['ready', 'error', 'polygon-click'])

const mapEl = ref(null)
let map = null
let markerInstances = []
let AdvancedMarkerClass = null
let polygonInstances = []

async function initMap() {
  try {
    const key = props.apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) throw new Error('Missing Google Maps API key: provide apiKey prop or VITE_GOOGLE_MAPS_API_KEY')

    const loader = new Loader({
      apiKey: key,
      version: 'weekly'
    })

    const { Map } = await loader.importLibrary('maps')
    try {
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')
      AdvancedMarkerClass = AdvancedMarkerElement
    } catch (_) {
      AdvancedMarkerClass = null
    }

    map = new Map(mapEl.value, {
      center: props.center,
      zoom: props.zoom,
      disableDefaultUI: props.disableDefaultUI,
      mapId: props.mapId || undefined
    })

    updateMarkers()
    updatePolygons()
    emit('ready', { map })
  } catch (err) {
    console.error(err)
    emit('error', err)
  }
}

function clearMarkers() {
  for (const m of markerInstances) {
    if (m?.setMap) m.setMap(null)
  }
  markerInstances = []
}

function updateMarkers() {
  if (!map) return
  clearMarkers()
  if (!props.markers?.length) return

  for (const item of props.markers) {
    const position = item.position || { lat: item.lat, lng: item.lng }
    if (
      !position ||
      typeof position.lat !== 'number' ||
      typeof position.lng !== 'number'
    ) continue

    let marker
    if (AdvancedMarkerClass) {
      marker = new AdvancedMarkerClass({
        map,
        position,
        title: item.title
      })
    } else if (window.google?.maps?.Marker) {
      const markerOptions = {
        map,
        position,
        title: item.title
      }

      // 如果有自定义图标，添加图标配置
      if (item.icon) {
        markerOptions.icon = {
          url: item.icon,
          scaledSize: new window.google.maps.Size(32, 32), // 调整图标大小
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(16, 32) // 图标锚点
        }
      }

      marker = new window.google.maps.Marker(markerOptions)
    }
    if (marker) markerInstances.push(marker)
  }
}

function clearPolygons() {
  for (const p of polygonInstances) {
    if (p?.setMap) p.setMap(null)
  }
  polygonInstances = []
}

function updatePolygons() {
  if (!map) return
  clearPolygons()
  const polys = props.polygons || []
  if (!polys.length) return

  const bounds = new window.google.maps.LatLngBounds()

  for (const item of polys) {
    // paths: Array<Array<{lat,lng}>>，第一条为外环，其它为洞
    const paths = Array.isArray(item.paths) ? item.paths.map(ring => (ring || []).map(pt => ({ lat: pt.lat, lng: pt.lng }))) : []
    if (!paths.length) continue

    // 扩展 bounds
    for (const ring of paths) {
      for (const pt of ring) bounds.extend(pt)
    }

    const polygon = new window.google.maps.Polygon({
      paths,
      strokeColor: item.strokeColor || '#DB2777', // pink-600
      strokeOpacity: typeof item.strokeOpacity === 'number' ? item.strokeOpacity : 0.9,
      strokeWeight: typeof item.strokeWeight === 'number' ? item.strokeWeight : 2,
      fillColor: item.fillColor || '#DB2777',
      fillOpacity: typeof item.fillOpacity === 'number' ? item.fillOpacity : 0.15,
      zIndex: item.zIndex ?? 1,
      clickable: item.clickable !== false
    })

    polygon.setMap(map)
    polygon.__payload = item

    // 交互事件
    if (polygon.get('clickable')) {
      polygon.addListener('click', (ev) => {
        emit('polygon-click', { event: ev, data: item.data || null, polygon })
      })
    }

    polygonInstances.push(polygon)
  }

  if (props.fitPolygonsBounds && !bounds.isEmpty()) {
    // 若只有一个点，避免 setCenter 抛错
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      map.setCenter(bounds.getCenter())
      if (typeof props.zoom === 'number') map.setZoom(props.zoom)
    } else {
      map.fitBounds(bounds, 24)
    }
  }
}

onMounted(() => {
  initMap()
})

watch(() => props.center, (val) => {
  if (map && val) map.panTo(val)
}, { deep: true })

watch(() => props.zoom, (z) => {
  if (map && typeof z === 'number') map.setZoom(z)
})

watch(() => props.markers, () => {
  updateMarkers()
}, { deep: true })

watch(() => props.polygons, () => {
  if (window.google?.maps && map) updatePolygons()
}, { deep: true })

onBeforeUnmount(() => {
  clearMarkers()
  clearPolygons()
  map = null
})
</script>

<style scoped>
.gm-container {
  width: 100%;
}

.gm-map {
  width: 100%;
  height: 70vh;
}
</style>
