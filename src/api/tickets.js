import request from './request.js'

export function formatYmd(dateLike) {
  const base = dateLike ?? Date.now()
  const d = typeof base === 'number' ? new Date(base) : new Date(base)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function ensureArray(x) {
  if (Array.isArray(x)) return x
  if (x == null) return []
  return [x]
}

function parseEvent(e) {
  const category = {
    main: {
      eg: e?.CATEGORY?.MAIN_CAT?.EG || '',
      tc: e?.CATEGORY?.MAIN_CAT?.TC || '',
    },
    sub: {
      eg: e?.CATEGORY?.SUB_CAT?.EG || '',
      tc: e?.CATEGORY?.SUB_CAT?.TC || '',
    },
  }

  const location = {
    venueCode: e?.LOCATION?.VENUE_CODE || '',
    venueEg: e?.LOCATION?.VENUE_EG || '',
    venueTc: e?.LOCATION?.VENUE_TC || '',
    cityEg: e?.LOCATION?.CITY_EG || '',
    cityTc: e?.LOCATION?.CITY_TC || '',
    regionEg: e?.LOCATION?.REGION_EG || '',
    regionTc: e?.LOCATION?.REGION_TC || '',
  }

  const performances = ensureArray(e?.PERFORMANCES?.PERFORMANCE).map((p) => ({
    refNo: p?.REF_NO || '',
    datetime: p?.PERFORMANCE_DATETIME || '',
    titleEg: p?.TITLE_EG || '',
    titleTc: p?.TITLE_TC || '',
    remarkEg: p?.REMARK_EG || '',
    remarkTc: p?.REMARK_TC || '',
    link: p?.REFERENCE_LINK || '',
  }))

  return {
    stDate: e?.ST_DATE || '',
    edDate: e?.ED_DATE || '',
    code: e?.EVENT_CODE || '',
    titleEg: e?.EVENT_EG || '',
    titleTc: e?.EVENT_TC || '',
    link: e?.REFERENCE_LINK || '',
    category,
    location,
    performances,
  }
}

export async function getTicketsBatch(dateLike) {
  const ymd = formatYmd(dateLike)
  const { data } = await request.get('/tickets/events', { params: { date: ymd } })
  const items = ensureArray(data?.EVENTS?.EVENT).map(parseEvent)
  return {
    batch: {
      sendDate: data?.SEND_DATE || ymd,
      system: data?.SYSTEM || 'URBTIX',
      total: Number(data?.TOTAL || items.length || 0),
    },
    events: items,
  }
}

