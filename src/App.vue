<script setup>
import { RouterView } from 'vue-router'
import { NConfigProvider, NGlobalStyle, zhCN, dateZhCN } from 'naive-ui'

const themeOverrides = {
  common: {
    // Tailwind blue-600 and variants
    primaryColor: '#2563eb',
    primaryColorHover: '#3b82f6',
    primaryColorPressed: '#1d4ed8',
    primaryColorSuppl: '#60a5fa'
  },
  Input: {
    borderRadius: '10px'
  },
  Select: {
    borderRadius: '12px'
  }
}
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <NGlobalStyle />
    <RouterView />
  </NConfigProvider>

</template>

<style scoped></style>
