<template>
  <div
    class="flex flex-col h-[80vh] w-[80vw] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60">
    <!-- Header -->
    <div class="relative bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900">香港TripGenie AI助手</h2>
            <p class="text-xs text-slate-500">专业香港旅游规划</p>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-slate-50/30 to-white space-y-6"
      ref="messagesContainer">
      <div v-for="message in messages" :key="message.id"
        :class="['flex', message.type === 'user' ? 'justify-end' : 'justify-start']">

        <!-- AI Message -->
        <div v-if="message.type === 'ai'" class="flex items-start space-x-3 max-w-lg animate-fade-in-up">
          <div
            class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-semibold shadow-sm">
            AI
          </div>
          <div class="flex flex-col">
            <div
              class="bg-gradient-to-r from-slate-100/80 to-slate-50/80 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200/50">
              <!-- 如果是流式消息且没有内容，显示加载状态 -->
              <div v-if="message.isStreaming && !message.content" class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-xs text-slate-500">正在思考中...</span>
              </div>
              <!-- 正常消息内容 -->
              <div v-else class="text-sm text-slate-700 leading-relaxed markdown-content"
                v-html="renderMarkdown(message.content)"></div>
            </div>
            <div class="text-xs text-slate-400 mt-1 ml-1">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- User Message -->
        <div v-else class="flex items-start space-x-3 max-w-lg animate-fade-in-up">
          <div class="flex flex-col items-end">
            <div
              class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg border border-blue-600/20">
              <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</div>
            </div>
            <div class="text-xs text-slate-400 mt-1 mr-1">{{ formatTime(message.timestamp) }}</div>
          </div>
          <div
            class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-sm">
            你
          </div>
        </div>
      </div>

      <!-- Loading State - 只在没有流式消息时显示 -->
      <div v-if="isLoading && !currentMessage" class="flex justify-start animate-fade-in-up">
        <div class="flex items-start space-x-3 max-w-lg">
          <div
            class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-semibold shadow-sm">
            AI
          </div>
          <div
            class="bg-gradient-to-r from-slate-100/80 to-slate-50/80 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200/50">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span class="text-xs text-slate-500">正在思考中...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-slate-200/60 bg-white p-6">
      <div class="flex items-end space-x-4">
        <div class="flex-1 relative">
          <textarea v-model="inputText" @keyup.enter.exact="handleSend" @keyup.shift.enter="addNewLine"
            placeholder="描述你的香港旅游需求，比如：我想去香港旅行3天..." rows="1" ref="textareaRef" :disabled="isLoading"
            class="w-full bg-slate-50/80 border border-slate-300/60 rounded-2xl px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all duration-200 text-sm placeholder:text-slate-400 min-h-[48px] max-h-32"
            style="line-height: 1.5;"></textarea>
        </div>

        <button @click="handleSend" :disabled="!inputText.trim() || isLoading" :class="[
          'flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 shadow-lg flex-shrink-0',
          !inputText.trim() || isLoading
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl active:scale-95'
        ]">

          <svg v-if="!isLoading" class="w-5 h-5 text-white transform rotate-45" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>

          <div v-else class="flex space-x-0.5">
            <div class="w-1 h-1 bg-white rounded-full animate-bounce"></div>
            <div class="w-1 h-1 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-1 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </button>
      </div>

      <!-- Quick Suggestions -->
      <div v-if="messages.length <= 1" class="flex flex-wrap gap-2 mt-4">
        <button v-for="suggestion in quickSuggestions" :key="suggestion" @click="handleQuickSuggestion(suggestion)"
          class="px-3 py-1.5 text-xs bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 rounded-lg transition-all duration-200 hover:shadow-sm">
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { chatApi } from '../api/chat.js'
import MarkdownIt from 'markdown-it'

// 初始化 markdown-it
const md = new MarkdownIt({
  breaks: true,  // 将换行符转换为 <br>
  linkify: true,  // 自动识别链接
})


const messages = reactive([])
const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const textareaRef = ref(null)
const sessionId = ref(`session-${Date.now()}`)

const quickSuggestions = ref([
  '🌃 香港3日经典游',
  '🎢 香港迪士尼海洋公园',
  '🍽️ 香港茶餐厅美食探索',
  '🛍️ 香港购物血拼之旅',
  '🏝️ 香港离岛跳岛游',
  '🌆 香港维港夜景之旅'
])

let currentEventSource = null
let currentMessage = null

onMounted(() => {
  addMessage('ai', '🇭🇰 您好！我是香港专业旅游规划助手，专门为您规划完美的香港之旅。\n\n请告诉我：\n• 计划在香港停留几天？\n• 大概的预算范围？\n• 您对哪些香港体验感兴趣？\n  - 维多利亚港夜景\n  - 太平山顶观光\n  - 迪士尼乐园/海洋公园\n  - 港式茶餐厅美食\n  - 购物血拼\n  - 传统文化体验\n\n我会为您量身定制专属的香港旅游攻略！🌆')
})

const addMessage = (type, content, isStreaming = false) => {
  const message = {
    id: Date.now() + Math.random(),
    type,
    content,
    timestamp: new Date(),
    isStreaming
  }

  if (isStreaming) {
    currentMessage = message
  }

  messages.push(message)
  scrollToBottom()
  return message
}

const updateStreamingMessage = (content) => {
  console.log('更新流式消息:', content)
  if (currentMessage) {
    console.log('当前消息对象:', currentMessage)
    // 使用Vue的响应式方式更新内容
    const messageIndex = messages.findIndex(msg => msg.id === currentMessage.id)
    if (messageIndex !== -1) {
      messages[messageIndex].content += content
      console.log('更新后的内容:', messages[messageIndex].content)
    }
    scrollToBottom()
  } else {
    console.log('currentMessage为空')
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 渲染 Markdown
const renderMarkdown = (content) => {
  // 预处理：自动修复格式
  let processedContent = content
    // 修复标题格式（在 # 后添加空格）
    .replace(/(^|\n)(#{1,6})([^\s#])/gm, '$1$2 $3')
    // 修复列表格式（在 - 后添加空格）
    .replace(/(^|\n)(-|\*|\+)([^\s])/gm, '$1$2 $3')
    // 修复数字列表格式（在 1. 后添加空格）
    .replace(/(^|\n)(\d+\.)([^\s])/gm, '$1$2 $3')

  return md.render(processedContent)
}

const addNewLine = () => {
  inputText.value += '\n'
}

const handleQuickSuggestion = (suggestion) => {
  inputText.value = suggestion
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const handleSend = () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = inputText.value.trim()
  addMessage('user', userMessage)

  inputText.value = ''
  isLoading.value = true

  currentMessage = addMessage('ai', '', true)

  currentEventSource = chatApi.streamChat(
    sessionId.value,
    userMessage,
    (data) => {
      updateStreamingMessage(data)
    },
    () => {
      isLoading.value = false
      if (currentMessage) {
        currentMessage.isStreaming = false
      }
      currentMessage = null
    },
    (error) => {
      isLoading.value = false
      if (currentMessage) {
        currentMessage.content = currentMessage.content || '抱歉，服务暂时不可用。请检查网络连接或稍后重试。'
        currentMessage.isStreaming = false
      }
      console.error('Chat error:', error)
      currentMessage = null
    }
  )
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 输入框自动调整高度 */
textarea {
  field-sizing: content;
}

/* Markdown 样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  font-weight: 600;
  margin: 0.5rem 0;
}

.markdown-content h1 {
  font-size: 1.25rem;
}

.markdown-content h2 {
  font-size: 1.125rem;
}

.markdown-content h3 {
  font-size: 1rem;
}

.markdown-content p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.markdown-content ul,
.markdown-content ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.markdown-content li {
  margin: 0.25rem 0;
}

.markdown-content code {
  background-color: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, 'DejaVu Sans Mono', monospace;
  font-size: 0.875em;
}

.markdown-content pre {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
  overflow-x: auto;
}

.markdown-content pre code {
  background: none;
  padding: 0;
}

.markdown-content blockquote {
  border-left: 4px solid #e2e8f0;
  margin: 0.5rem 0;
  padding-left: 1rem;
  color: #64748b;
}

.markdown-content strong {
  font-weight: 600;
}

.markdown-content em {
  font-style: italic;
}
</style>