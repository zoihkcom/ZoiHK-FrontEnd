<template>
  <div class="min-h-screen">
    <Navbar />

    <!-- Map with integrated controls -->
    <div class="pt-16">
      <AmapView :center="defaultCenter" :zoom="13" :show-route-panel="true" :style="{ height: mapHeight }"
        @map-ready="onMapReady" @map-error="onMapError" @route-error="onRouteError" />
    </div>
  </div>
</template>

<script setup>

import Navbar from '@/components/Navbar.vue'
import AmapView from '@/components/AmapView.vue'

const defaultCenter = [114.1694, 22.3193] // 香港中环
const mapHeight = 'calc(100vh - 64px)' // 减去导航栏高度

function onMapReady({ map, AMap }) {
  console.log('高德地图初始化完成', { map, AMap })
}

function onMapError(error) {
  console.error('地图初始化失败:', error)
  alert('地图初始化失败，请检查网络连接')
}

function onRouteError(error) {
  console.error('路径规划失败:', error)
  alert(`路径规划失败: ${error.message || '请检查起点和终点是否正确'}`)
}
</script>

<style scoped>
/* reserve space below fixed navbar */
</style>
