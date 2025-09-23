<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 pb-4">
      <div class="w-full">
        <!-- Header -->
        <div ref="headerRef" class="text-center space-y-3 mb-6">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Holidays</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">活动假期日历</h1>
          <p class="text-base sm:text-lg text-slate-600">从 1823 接口获取公众假期，支持多选并在日历中高亮显示。同时，还可以查看香港政府举办的各类活动信息。</p>
        </div>

        <!-- Loading / Error -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <n-spin size="large" />
        </div>
        <div v-else-if="error" class="max-w-2xl mx-auto mb-6">
          <n-alert type="error" title="加载失败" closable>
            {{ error }}
          </n-alert>
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-12 gap-6">
          <!-- Holidays List -->
          <div class="col-span-4">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-4 overflow-y-auto" :style="{ height: availableHeight + 'px' }">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-semibold text-slate-900">公众假期</h2>
              </div>
              <!-- 数据源选项：香港公共假期（选择后执行原本逻辑并在日历高亮） -->
              <div
                class="mb-2 flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <n-checkbox
                    :checked="allSelected"
                    :indeterminate="someSelected && !allSelected"
                    @update:checked="onToggleHK"
                  >
                    <span class="inline-flex items-center gap-2">
                      <span class="text-sm text-slate-800">香港公共假期</span>
                    </span>
                  </n-checkbox>
                </div>
                <n-button
                  size="small"
                  quaternary
                  circle
                  @click="showList = !showList"
                  :title="showList ? '收起列表' : '展开列表'"
                >
                  <i :class="['fa', showList ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                </n-button>
              </div>
              <n-collapse-transition :show="showList">
                <div class="mt-2 mb-3">
                  <n-input v-model:value="keyword" clearable placeholder="搜索假期名称..." />
                </div>
                <div class="max-h-[60vh] overflow-y-auto pr-1">
                  <n-checkbox-group v-model:value="selectedUids">
                    <div v-for="h in filteredHolidays" :key="h.uid" class="py-2 px-2 rounded-lg hover:bg-slate-50">
                      <n-checkbox :value="h.uid">
                        <div class="flex flex-col">
                          <span class="text-slate-900">{{ h.summary }}</span>
                          <span class="text-xs text-slate-500">{{ h.dateText }}</span>
                        </div>
                      </n-checkbox>
                    </div>
                  </n-checkbox-group>
                </div>
              </n-collapse-transition>

              <!-- 即将举办活动 -->
              <div
                class="mt-4 mb-2 flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <n-checkbox
                    :checked="upcomingAllSelected"
                    :indeterminate="upcomingSomeSelected && !upcomingAllSelected"
                    @update:checked="onToggleUpcoming"
                  >
                    <span class="inline-flex items-center gap-2">
                      <span class="text-sm text-slate-800">即将举办活动</span>
                    </span>
                  </n-checkbox>
                </div>
                <n-button
                  size="small"
                  quaternary
                  circle
                  @click="toggleUpcomingExpand"
                  :title="upcoming.expanded ? '收起列表' : '展开列表'"
                >
                  <i :class="['fa', upcoming.expanded ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                </n-button>
              </div>
              <n-collapse-transition :show="upcoming.expanded">
                <div class="mt-2">
                  <div v-if="upcoming.loading" class="flex justify-center py-2"><n-spin size="small" /></div>
                  <div v-else-if="upcoming.error" class="text-xs text-red-500 py-2">{{ upcoming.error }}</div>
                  <div v-else>
                    <div v-if="!upcoming.items.length" class="text-xs text-slate-500 py-2">暂无活动</div>
                    <div v-else class="max-h-[40vh] overflow-y-auto pr-1">
                      <n-checkbox-group v-model:value="upcoming.selectedIds">
                        <div v-for="(ev, idx) in upcoming.items" :key="ev.id" class="py-2 px-2 rounded-lg hover:bg-slate-50">
                          <n-checkbox :value="ev.id">
                            <div class="flex flex-col">
                              <span class="text-slate-900">{{ ev.title }}</span>
                              <span class="text-xs text-slate-500">{{ formatEventDateRange(ev.start_date, ev.end_date) }}</span>
                              <span v-if="ev.location" class="text-xs text-slate-400">{{ ev.location }}</span>
                            </div>
                          </n-checkbox>
                        </div>
                      </n-checkbox-group>
                    </div>
                  </div>
                </div>
              </n-collapse-transition>

              <!-- 活动分类 -->
              <div class="mt-4 mb-2">
                <h3 class="text-base font-semibold text-slate-900">活动分类</h3>
              </div>
              <div class="space-y-2">
                <div v-for="cat in categories" :key="cat.id" class="py-2 px-2 rounded-lg hover:bg-slate-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <n-checkbox :checked="catAllSelected(cat)"
                        :indeterminate="catSomeSelected(cat) && !catAllSelected(cat)"
                        @update:checked="(v) => onToggleCategory(cat, v)">
                        <span class="inline-flex items-center gap-2">
                          <span class="text-sm text-slate-800">{{ cat.label }}</span>
                        </span>
                      </n-checkbox>
                    </div>
                    <n-button size="small" quaternary circle @click="toggleCategoryExpand(cat)"
                      :title="cat.expanded ? '收起' : '展开'">
                      <i :class="['fa', cat.expanded ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                    </n-button>
                  </div>

                  <n-collapse-transition :show="cat.expanded">
                    <div class="mt-2">
                      <div v-if="cat.loading" class="flex justify-center py-2"><n-spin size="small" /></div>
                      <div v-else-if="cat.error" class="text-xs text-red-500 py-2">{{ cat.error }}</div>
                      <div v-else>
                        <div v-if="!cat.items.length" class="text-xs text-slate-500 py-2">暂无活动</div>
                        <div v-else class="space-y-2 max-h-48 overflow-y-auto pr-1">
                          <n-checkbox-group v-model:value="cat.selectedIds">
                            <div v-for="ev in cat.items" :key="ev.event_id"
                              class="py-2 px-2 rounded-lg hover:bg-slate-50">
                              <n-checkbox :value="ev.event_id">
                                <div class="flex flex-col">
                                  <span class="text-sm font-medium text-slate-900 leading-snug">{{ ev.event_summary
                                    }}</span>
                                  <span class="text-xs text-slate-500 mt-1">{{ formatEventDateRange(ev.event_start_date,
                                    ev.event_end_date) }}</span>
                                  <span v-if="ev.event_location" class="text-xs text-slate-500 mt-0.5">{{
                                    ev.event_location }}</span>
                                </div>
                              </n-checkbox>
                              <div class="flex items-center gap-3 mt-2">
                                <a v-if="ev.event_url" :href="ev.event_url" target="_blank"
                                  class="text-xs text-blue-600 hover:underline">
                                  <i class="fa fa-external-link mr-1"></i>详情
                                </a>
                                <a v-if="ev.event_ics" :href="ev.event_ics" target="_blank"
                                  class="text-xs text-green-600 hover:underline">
                                  <i class="fa fa-calendar-plus-o mr-1"></i>ICS
                                </a>
                              </div>
                            </div>
                          </n-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </n-collapse-transition>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar (FullCalendar) -->
          <div class="col-span-8">
            <div ref="calendarWrap" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-4" :style="{ height: availableHeight + 'px' }">
              <FullCalendar :options="calendarOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watchEffect, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import request from '@/api/request.js'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import iCalendarPlugin from '@fullcalendar/icalendar'


const loading = ref(true)
const error = ref('')
const keyword = ref('')
const showList = ref(false)

// 当前年份
const currentYear = new Date().getFullYear()

// All holidays parsed from the API (>= current year only)
const holidays = ref([])
// Selected by uid
const selectedUids = ref([])
// Current calendar selected timestamp
const calendarValue = ref(null)

// Map: 'YYYY-MM-DD' -> [name, ...] for selected holidays
const selectedDateMap = ref(new Map())

// --- Dynamic available height (fill viewport below header) ---
const headerRef = ref(null)
const calendarWrap = ref(null)
const viewportH = ref(typeof window !== 'undefined' ? window.innerHeight : 800)
const updateViewport = () => { viewportH.value = typeof window !== 'undefined' ? window.innerHeight : 800 }
const availableHeight = computed(() => {
  const top = calendarWrap.value?.getBoundingClientRect?.().top ?? 0
  const edgePadding = 16 // 对应页面全局 p-4
  const h = Math.max(460, Math.floor(viewportH.value - top - edgePadding))
  return h
})

const calendarHeight = computed(() => {
  const cardPadding = 32 // wrapper p-4 垂直内边距之和
  return Math.max(420, availableHeight.value - cardPadding)
})

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
  // ensure first layout measured
  nextTick(() => updateViewport())
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
})

// ---------- FullCalendar: events & options ----------
const holidayFcEvents = computed(() => {
  const events = []
  for (const uid of selectedUids.value) {
    const item = holidays.value.find(h => h.uid === uid)
    if (!item) continue
    for (const d of item.dates) {
      events.push({
        id: `hkph-${uid}-${d}`,
        start: d,
        allDay: true,
        display: 'background',
        backgroundColor: '#bfdbfe', // blue-200
        classNames: ['hkph-bg']
      })
    }
  }
  return events
})

// Categories (LCSD events)
const categoryDefs = [
  { id: '1', label: '节庆及嘉年华', color: '#ef4444' },
  { id: '2', label: '表演及娱乐', color: '#f59e0b' },
  { id: '3', label: '康乐及体育', color: '#10b981' },
  { id: '4', label: '图书馆及博物馆', color: '#8b5cf6' },
  { id: '5', label: '社区活动', color: '#14b8a6' },
  { id: '6', label: '展览及参观', color: '#3b82f6' },
  { id: '7', label: '研讨会及工作坊', color: '#ec4899' },
  { id: '8', label: '其他', color: '#6b7280' },
  { id: '10', label: '慈善筹款', color: '#f97316' }
]

const categories = ref(categoryDefs.map(c => ({
  ...c,
  expanded: false,
  loading: false,
  error: '',
  items: [], // API 数据
  selectedIds: [] // 勾选的活动ID
})))

// Upcoming events (InvestHK)
const upcoming = ref({
  expanded: false,
  loading: false,
  error: '',
  items: [],
  selectedIds: []
})

const genUpcomingId = (it, idx) => {
  const base = `${it?.link || ''}|${it?.title || ''}|${it?.start_date || ''}`
  return base || `up-${idx}`
}

const loadUpcoming = async () => {
  if (upcoming.value.loading || upcoming.value.items.length) return
  upcoming.value.loading = true
  upcoming.value.error = ''
  try {
    const res = await request.get('https://www1.investhk.gov.hk/api/upcoming-events')
    const raw = Array.isArray(res?.data?._item) ? res.data._item : []
    upcoming.value.items = raw.map((it, idx) => ({
      id: genUpcomingId(it, idx),
      title: it.title,
      image: it.image,
      image_alt: it.image_alt,
      link: it.link,
      start_date: it.start_date,
      end_date: it.end_date && String(it.end_date).trim() !== '' ? it.end_date : undefined,
      display_date: it.display_date,
      display_time: it.display_time,
      location: it.location,
      summary: it.summary
    }))
  } catch (e) {
    console.error('loadUpcoming error', e)
    upcoming.value.error = '加载即将举办活动失败，请稍后重试'
  } finally {
    upcoming.value.loading = false
  }
}

const toggleUpcomingExpand = async () => {
  upcoming.value.expanded = !upcoming.value.expanded
  if (upcoming.value.expanded && upcoming.value.items.length === 0 && !upcoming.value.loading) {
    await loadUpcoming()
  }
}

const onToggleUpcoming = async (checked) => {
  if (checked) {
    if (upcoming.value.items.length === 0 && !upcoming.value.loading) {
      await loadUpcoming()
    }
    upcoming.value.selectedIds = upcoming.value.items.map(it => it.id)
  } else {
    upcoming.value.selectedIds = []
  }
}

const upcomingAllSelected = computed(() => upcoming.value.items.length > 0 && upcoming.value.selectedIds && upcoming.value.selectedIds.length === upcoming.value.items.length)
const upcomingSomeSelected = computed(() => (upcoming.value.selectedIds && upcoming.value.selectedIds.length > 0))

const loadCategory = async (cat) => {
  if (!cat || cat.loading) return
  cat.loading = true
  cat.error = ''
  try {
    const res = await request.get('/events', {
      params: { category: cat.id, lang: 'sc' }
    })
    cat.items = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('loadCategory error', e)
    cat.error = '加载活动失败，请稍后重试'
  } finally {
    cat.loading = false
  }
}

// 并行加载所有分类数据
const loadAllCategories = async () => {
  const tasks = categories.value.map(cat => {
    if (cat.items.length === 0 && !cat.loading) {
      return loadCategory(cat)
    }
    return Promise.resolve()
  })
  await Promise.allSettled(tasks)
}

const toggleCategoryExpand = async (cat) => {
  cat.expanded = !cat.expanded
  if (cat.expanded && cat.items.length === 0 && !cat.loading) {
    await loadCategory(cat)
  }
}

const onToggleCategory = async (cat, checked) => {
  if (checked) {
    if (cat.items.length === 0 && !cat.loading) {
      await loadCategory(cat)
    }
    cat.selectedIds = cat.items.map(ev => ev.event_id)
  } else {
    cat.selectedIds = []
  }
}

const catAllSelected = (cat) => cat.items.length > 0 && cat.selectedIds && cat.selectedIds.length === cat.items.length
const catSomeSelected = (cat) => (cat.selectedIds && cat.selectedIds.length > 0)

const categoryFcEvents = computed(() => {
  const arr = []
  for (const cat of categories.value) {
    if (!cat.selectedIds || cat.selectedIds.length === 0) continue
    for (const ev of cat.items) {
      if (!cat.selectedIds.includes(ev.event_id)) continue
      const start = ev.event_start_date || null
      // 若没有结束日期，则 FullCalendar 视为单日
      const end = ev.event_end_date && ev.event_end_date.trim() !== '' ? ev.event_end_date : undefined
      if (!start) continue
      arr.push({
        id: `cat-${cat.id}-${ev.event_id}`,
        title: ev.event_summary,
        start,
        end,
        allDay: true,
        url: ev.event_url || undefined,
        color: cat.color
      })
    }
  }
  return arr
})

const upcomingFcEvents = computed(() => {
  const arr = []
  const up = upcoming.value
  if (!up.selectedIds || up.selectedIds.length === 0) return arr
  for (const it of up.items) {
    if (!up.selectedIds.includes(it.id)) continue
    const start = it.start_date || null
    const end = it.end_date && it.end_date.trim() !== '' ? it.end_date : undefined
    if (!start) continue
    arr.push({
      id: `up-${it.id}`,
      title: it.title,
      start,
      end,
      allDay: true,
      url: it.link || undefined,
      color: '#0ea5e9' // sky-500
    })
  }
  return arr
})

const fcEvents = computed(() => [
  ...holidayFcEvents.value,
  ...categoryFcEvents.value,
  ...upcomingFcEvents.value
])

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, iCalendarPlugin],
  initialView: 'dayGridMonth',
  height: calendarHeight.value,
  expandRows: true,
  stickyHeaderDates: true,
  firstDay: 1,
  locale: 'zh-cn',
  buttonText: { today: '今天', month: '月', week: '周', day: '日' },
  dayMaxEventRows: 3,
  moreLinkText: '更多',
  displayEventTime: false,
  headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek,dayGridDay' },
  events: fcEvents.value,
  eventClick: (info) => {
    if (info.event.url) {
      window.open(info.event.url, '_blank')
      info.jsEvent.preventDefault()
    }
  }
}))

const filteredHolidays = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return holidays.value
  return holidays.value.filter(h => h.summary.toLowerCase().includes(k))
})

onMounted(async () => {
  loading.value = true
  error.value = ''

  const holidaysTask = (async () => {
    try {
      const res = await request.get('/holidays', { params: { lang: 'sc' } })
      const all = parse1823Calendar(res.data)
      holidays.value = clipToYearFrom(all, currentYear)
    } catch (e) {
      console.error(e)
      error.value = '无法获取公众假期数据，请稍后重试'
    }
  })()

  const categoriesTask = loadAllCategories()

  await Promise.allSettled([holidaysTask, categoriesTask])
  loading.value = false
})

// Watch selection and rebuild date map
const rebuildSelectedDateMap = () => {
  const map = new Map()
  for (const uid of selectedUids.value) {
    const item = holidays.value.find(h => h.uid === uid)
    if (!item) continue
    for (const d of item.dates) {
      if (!map.has(d)) map.set(d, [])
      map.get(d).push(item.summary)
    }
  }
  selectedDateMap.value = map
}

// naive but effective watcher pattern
watchEffect(() => {
  // depend on selectedUids & holidays
  void selectedUids.value.length
  void holidays.value.length
  rebuildSelectedDateMap()
})

// When selection changes, set calendar's selected day to the last added holiday's start date
watch(selectedUids, (next, prev) => {
  const added = (next || []).find(uid => !(prev || []).includes(uid))
  const targetUid = added || (next && next[0]) || null
  if (!targetUid) {
    calendarValue.value = null
    return
  }
  const item = holidays.value.find(h => h.uid === targetUid)
  if (item) {
    calendarValue.value = item.start.getTime()
  }
}, { deep: true })


// "香港公共假期" 选项行为（整体开关）
const allSelected = computed(() => holidays.value.length > 0 && selectedUids.value.length === holidays.value.length)
const someSelected = computed(() => selectedUids.value.length > 0)
const onToggleHK = (checked) => {
  if (checked) {
    selectedUids.value = holidays.value.map(h => h.uid)
  } else {
    selectedUids.value = []
  }
}

// Parsing
function parse1823Calendar(json) {
  const cal = json?.vcalendar?.[0]
  const vevents = cal?.vevent || []
  const list = []
  for (const v of vevents) {
    const startStr = Array.isArray(v.dtstart) ? v.dtstart[0] : v.dtstart
    const endStr = Array.isArray(v.dtend) ? v.dtend[0] : v.dtend
    const summary = v.summary
    const uid = v.uid
    if (!startStr || !endStr) continue
    const start = yyyymmddToDate(startStr)
    const endExclusive = yyyymmddToDate(endStr)
    const dates = expandDates(start, endExclusive)
    const dateText = dates.length === 1
      ? formatDate(start)
      : `${formatDate(start)} 至 ${formatDate(addDays(endExclusive, -1))}`
    list.push({ uid, summary, start, endExclusive, dates, dateText })
  }
  // sort by start date
  list.sort((a, b) => a.start - b.start)
  return list
}

// 过滤掉当前年份之前的假期，并将日期裁剪到当年及之后
function clipToYearFrom(list, year) {
  const Y = (s) => Number(String(s).slice(0, 4))
  const toDate = (s) => yyyymmddToDate(s)
  const result = []
  for (const item of list) {
    // 保留当年及之后的日期
    const keptDates = item.dates.filter(d => Number(d.slice(0, 4)) >= year)
    if (keptDates.length === 0) continue
    const start = toDate(keptDates[0].replace(/-/g, ''))
    const endExclusive = addDays(toDate(keptDates[keptDates.length - 1].replace(/-/g, '')), 1)
    const dateText = keptDates.length === 1
      ? keptDates[0]
      : `${keptDates[0]} 至 ${keptDates[keptDates.length - 1]}`
    result.push({ ...item, start, endExclusive, dates: keptDates, dateText })
  }
  return result
}

function yyyymmddToDate(s) {
  const y = Number(s.slice(0, 4))
  const m = Number(s.slice(4, 6))
  const d = Number(s.slice(6, 8))
  return new Date(y, m - 1, d)
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d }
function toKey(y, m, d) { return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` }
function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function expandDates(start, endExclusive) {
  const arr = []
  const cur = new Date(start)
  while (cur < endExclusive) {
    arr.push(formatDate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return arr
}

// UI helpers
const formatEventDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '时间待定'
  const fmt = (dateStr) => {
    try {
      const d = new Date(dateStr)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return dateStr
    }
  }
  if (!endDate || startDate === endDate) return fmt(startDate)
  return `${fmt(startDate)} - ${fmt(endDate)}`
}
</script>

<style scoped>
.calendar-cell {
  position: relative;
  min-height: 58px;
  padding: 4px 6px;
}

.holiday-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #2563eb;
  /* primary */
  margin-right: 6px;
}

.holiday-name {
  font-size: 12px;
  color: #2563eb;
}

/* FullCalendar theming (scoped, use :deep to reach inner DOM) */
:deep(.fc) {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
}

:deep(.fc .fc-toolbar) {
  margin: 8px 8px 12px;
}

:deep(.fc .fc-toolbar-title) {
  font-size: 1.125rem;
  /* text-lg */
  font-weight: 700;
  color: #0f172a;
  /* slate-900 */
}

:deep(.fc .fc-button) {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  /* slate-200 */
  color: #334155;
  /* slate-700 */
  border-radius: 10px;
  padding: 6px 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

:deep(.fc .fc-button:hover),
:deep(.fc .fc-button.fc-button-active) {
  background: #eef2ff;
  /* indigo-50 */
  border-color: #c7d2fe;
  /* indigo-200 */
  color: #4338ca;
  /* indigo-700 */
}

:deep(.fc .fc-col-header-cell) {
  background: #f8fafc;
  /* slate-50 */
  color: #64748b;
  /* slate-500 */
  font-weight: 600;
}

:deep(.fc .fc-scrollgrid) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.fc .fc-daygrid-day) {
  background: #ffffff;
}

:deep(.fc .fc-daygrid-day.fc-day-today) {
  background: #eef2ff;
  /* indigo-50 */
}

:deep(.fc .fc-daygrid-day-number) {
  color: #1f2937;
  /* gray-800 */
  font-weight: 600;
  margin: 6px 8px 0 8px;
}

:deep(.fc .fc-daygrid-event) {
  border: none;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 12.5px;
  line-height: 1.2;
}

:deep(.fc .fc-more-link) {
  color: #2563eb;
  /* blue-600 */
  font-weight: 500;
}
</style>
