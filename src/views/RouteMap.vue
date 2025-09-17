<template>
  <div class="h-screen bg-white">
    <Navbar />
    <!-- 地图容器 -->
    <GoogleMap :markers="markers" :center="mapCenter" :zoom="mapZoom" :fit-polygons-bounds="false"
      class="w-full mt-16 map-fullscreen" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GoogleMap from '@/components/GoogleMap.vue'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

const markers = ref([])
const mapCenter = ref({ lat: 22.3193, lng: 114.1694 }) // 香港中心
const mapZoom = ref(12)

// 解析URL参数中的位置数据
const parseMarkersFromQuery = () => {
  try {
    // 从URL查询参数中获取位置数据
    const { stops } = route.query

    if (stops) {
      // stops格式: "lat1,lng1,name1|lat2,lng2,name2|..."
      const stopsData = decodeURIComponent(stops).split('|')
      const parsedMarkers = []

      stopsData.forEach((stopStr, index) => {
        const parts = stopStr.split(',')
        if (parts.length >= 2) {
          const lat = parseFloat(parts[0])
          const lng = parseFloat(parts[1])
          const name = parts.slice(2).join(',') || `位置 ${index + 1}`

          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            parsedMarkers.push({
              lat,
              lng,
              title: name
            })
          }
        }
      })

      markers.value = parsedMarkers

      // 如果有标记点，计算中心点
      if (parsedMarkers.length > 0) {
        if (parsedMarkers.length === 1) {
          // 单个点直接使用该点作为中心
          mapCenter.value = { lat: parsedMarkers[0].lat, lng: parsedMarkers[0].lng }
          mapZoom.value = 16
        } else {
          // 多个点取中间位置的点作为中心
          const middleIndex = Math.floor(parsedMarkers.length / 2)
          mapCenter.value = { lat: parsedMarkers[middleIndex].lat, lng: parsedMarkers[middleIndex].lng }

          // 根据标记点数量调整缩放级别
          if (parsedMarkers.length <= 5) {
            mapZoom.value = 15
          } else {
            mapZoom.value = 14
          }
        }
      }
    }
  } catch (error) {
    console.error('解析位置数据失败:', error)
  }
}

onMounted(() => {
  parseMarkersFromQuery()
})
</script>

<style scoped>
.map-fullscreen :deep(.gm-map) {
  height: calc(100vh - 4rem) !important;
}
</style>