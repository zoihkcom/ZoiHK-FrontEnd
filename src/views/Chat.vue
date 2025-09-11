<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content with proper spacing for navbar -->
    <div class="pt-20 flex items-center justify-center p-4">
      <div class="w-full max-w-7xl h-[90vh] flex items-center justify-center">
        <ChatBox />
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import ChatBox from '@/components/ChatBox.vue'
</script>

<style scoped></style>
