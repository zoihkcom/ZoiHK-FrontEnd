<template>
  <div class="map-display-container">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content with proper spacing for navbar -->
    <div class="content-with-navbar">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在获取您的位置...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-message">
          <h3>无法获取位置</h3>
          <p>{{ error }}</p>
          <button @click="getCurrentLocation" class="retry-button">重试</button>
          <button @click="useDefaultLocation" class="default-button">使用默认位置</button>
        </div>
      </div>

      <!-- 地图iframe -->
      <iframe v-else src="/openstreetmap.html" class="map-iframe" frameborder="0" title="OpenStreetMap显示">
      </iframe>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.map-display-container {
  height: 100vh;
  overflow: hidden;
}

.content-with-navbar {
  padding-top: 64px;
  height: 100vh;
}

.map-iframe {
  width: 100%;
  height: calc(100vh - 64px);
  border: none;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
  background-color: #f8f9fa;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3e3e3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 错误状态样式 */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
  background-color: #f8f9fa;
  padding: 20px;
}

.error-message {
  text-align: center;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-message h3 {
  color: #dc3545;
  margin: 0 0 16px 0;
  font-size: 20px;
}

.error-message p {
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.retry-button,
.default-button {
  padding: 10px 20px;
  margin: 0 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.retry-button {
  background-color: #007bff;
  color: white;
}

.retry-button:hover {
  background-color: #0056b3;
}

.default-button {
  background-color: #6c757d;
  color: white;
}

.default-button:hover {
  background-color: #545b62;
}

@media (max-width: 768px) {
  .content-with-navbar {
    padding-top: 56px;
  }

  .map-iframe {
    height: calc(100vh - 56px);
  }

  .loading-container {
    height: calc(100vh - 56px);
  }

  .error-container {
    height: calc(100vh - 56px);
  }

  .error-message {
    margin: 0 16px;
    padding: 20px;
  }

  .retry-button,
  .default-button {
    display: block;
    width: 100%;
    margin: 8px 0;
  }
}
</style>