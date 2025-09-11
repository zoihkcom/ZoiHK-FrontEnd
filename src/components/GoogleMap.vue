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
  disableDefaultUI: { type: Boolean, default: false }
})

const emit = defineEmits(['ready', 'error'])

const mapEl = ref(null)
let map = null
let markerInstances = []
let AdvancedMarkerClass = null

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
      marker = new window.google.maps.Marker({
        map,
        position,
        title: item.title
      })
    }
    if (marker) markerInstances.push(marker)
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

onBeforeUnmount(() => {
  clearMarkers()
  map = null
})
</script>

<style scoped>
.gm-container {
  width: 100%;
}

.gm-map {
  width: 100%;
  height: 60vh;
}
</style>
