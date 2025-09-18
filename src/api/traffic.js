// 交通信息API服务
import request from './request.js'

export const fetchTrafficInfo = async () => {
  try {
    const response = await request.get('/traffic/info')
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return parseTrafficXML(response.data)
  } catch (error) {
    console.error('获取交通信息失败:', error)
    throw error
  }
}

const fetchTrafficNotices = async (endpoint, errorPrefix) => {
  try {
    const response = await request.get(endpoint, {
      responseType: 'text'
    })

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return parseTrafficNoticesXML(response.data)
  } catch (error) {
    console.error(`${errorPrefix}:`, error)
    throw error
  }
}

export const fetchProhibitedZoneNotices = () =>
  fetchTrafficNotices('/traffic/prohibited-zone', '获取禁区通告失败')

export const fetchSpeedLimitsNotices = () =>
  fetchTrafficNotices('/traffic/speed-limits', '获取临时车速限制通告失败')

export const fetchRoadClosureNotices = () =>
  fetchTrafficNotices('/traffic/road-closure', '获取临时封路通告失败')

export const fetchClearwaysNotices = () =>
  fetchTrafficNotices('/traffic/clearways', '获取禁止上落客货区通告失败')

export const fetchPublicTransportNotices = () =>
  fetchTrafficNotices('/traffic/public-transport', '获取公共交通服务通告失败')

export const fetchSpecialArrangementNotices = () =>
  fetchTrafficNotices('/traffic/special-arrangement', '获取特别交通安排通告失败')

export const fetchExpresswaysNotices = () =>
  fetchTrafficNotices('/traffic/expressways', '获取快速公路通告失败')

export const fetchOtherNotices = () =>
  fetchTrafficNotices('/traffic/other-notices', '获取其他通告失败')

const parseTrafficXML = (xmlText) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    const messages = xmlDoc.querySelectorAll('message')
    const trafficData = []

    messages.forEach(message => {
      const incident = {
        id: getElementText(message, 'ID'),
        incidentNumber: getElementText(message, 'INCIDENT_NUMBER'),
        headingCn: getElementText(message, 'INCIDENT_HEADING_CN'),
        headingEn: getElementText(message, 'INCIDENT_HEADING_EN'),
        detailCn: getElementText(message, 'INCIDENT_DETAIL_CN'),
        detailEn: getElementText(message, 'INCIDENT_DETAIL_EN'),
        locationCn: getElementText(message, 'LOCATION_CN'),
        locationEn: getElementText(message, 'LOCATION_EN'),
        districtCn: getElementText(message, 'DISTRICT_CN'),
        districtEn: getElementText(message, 'DISTRICT_EN'),
        directionCn: getElementText(message, 'DIRECTION_CN'),
        directionEn: getElementText(message, 'DIRECTION_EN'),
        announcementDate: getElementText(message, 'ANNOUNCEMENT_DATE'),
        statusCn: getElementText(message, 'INCIDENT_STATUS_CN'),
        statusEn: getElementText(message, 'INCIDENT_STATUS_EN'),
        nearLandmarkCn: getElementText(message, 'NEAR_LANDMARK_CN'),
        nearLandmarkEn: getElementText(message, 'NEAR_LANDMARK_EN'),
        betweenLandmarkCn: getElementText(message, 'BETWEEN_LANDMARK_CN'),
        betweenLandmarkEn: getElementText(message, 'BETWEEN_LANDMARK_EN'),
        contentCn: getElementText(message, 'CONTENT_CN'),
        contentEn: getElementText(message, 'CONTENT_EN'),
        latitude: getElementText(message, 'LATITUDE'),
        longitude: getElementText(message, 'LONGITUDE')
      }
      
      trafficData.push(incident)
    })

    return trafficData
  } catch (error) {
    console.error('解析交通信息XML失败:', error)
    throw new Error('交通信息数据格式错误')
  }
}

const parseTrafficNoticesXML = (xmlText) => {
  try {
    if (!xmlText) {
      return []
    }

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    const parseError = xmlDoc.querySelector('parsererror')

    if (parseError) {
      throw new Error(parseError.textContent || '交通通告数据格式错误')
    }

    const notices = []

    xmlDoc.querySelectorAll('Notice').forEach(noticeNode => {
      const startEffectiveDate = getElementText(noticeNode, 'StartEffectiveDate')
      const effectiveDate = parseEffectiveDate(startEffectiveDate)

      const contentTc = extractNoticeContent(getElementText(noticeNode, 'Content_TC'))
      const contentEn = extractNoticeContent(getElementText(noticeNode, 'Content_EN'))
      const contentSc = extractNoticeContent(getElementText(noticeNode, 'Content_SC'))

      const attachments = dedupeLinks([
        ...contentTc.links,
        ...contentEn.links,
        ...contentSc.links
      ])

      notices.push({
        id: getElementText(noticeNode, 'TNID'),
        trafficNoticesTypeId: getElementText(noticeNode, 'TrafficNoticesTypeID'),
        trafficNoticesDistrictId: getElementText(noticeNode, 'TrafficNoticesDistrictID'),
        titleEn: getElementText(noticeNode, 'Title_EN'),
        titleTc: getElementText(noticeNode, 'Title_TC'),
        titleSc: getElementText(noticeNode, 'Title_SC'),
        startEffectiveDate,
        effectiveDate,
        summary: contentTc.text || contentEn.text || contentSc.text,
        contents: {
          tc: contentTc,
          en: contentEn,
          sc: contentSc
        },
        attachments
      })
    })

    return notices.sort((a, b) => {
      const timeA = a.effectiveDate ? a.effectiveDate.getTime() : 0
      const timeB = b.effectiveDate ? b.effectiveDate.getTime() : 0
      return timeB - timeA
    })
  } catch (error) {
    console.error('解析交通通告XML失败:', error)
    throw new Error('交通通告数据格式错误')
  }
}

const getElementText = (parent, tagName) => {
  const element = parent.querySelector(tagName)
  return element ? element.textContent.trim() : ''
}

const parseEffectiveDate = (value) => {
  if (!value) {
    return null
  }

  const parts = value.split('.')

  if (parts.length !== 3) {
    return null
  }

  const [day, month, year] = parts
  const normalizedDay = day.padStart(2, '0')
  const normalizedMonth = month.padStart(2, '0')
  const formatted = `${year}-${normalizedMonth}-${normalizedDay}`
  const date = new Date(formatted)

  return Number.isNaN(date.getTime()) ? null : date
}

const extractNoticeContent = (rawHtml) => {
  if (!rawHtml) {
    return {
      html: '',
      text: '',
      paragraphs: [],
      links: []
    }
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${rawHtml}</div>`, 'text/html')

    const rawText = doc.body.innerText || ''
    const paragraphs = rawText
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(Boolean)

    const text = paragraphs.join(' ')

    const links = Array.from(doc.querySelectorAll('a'))
      .map(anchor => {
        const href = normalizeLink(anchor.getAttribute('href'))
        return {
          label: anchor.textContent.trim() || href,
          href
        }
      })
      .filter(link => Boolean(link.href))

    return {
      html: rawHtml,
      text,
      paragraphs,
      links
    }
  } catch (error) {
    console.error('解析交通通告内容失败:', error)
    return {
      html: rawHtml,
      text: rawHtml,
      paragraphs: [rawHtml],
      links: []
    }
  }
}

const normalizeLink = (href) => {
  if (!href) {
    return ''
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href
  }

  if (href.startsWith('//')) {
    return `https:${href}`
  }

  if (href.startsWith('/')) {
    return `https://www.td.gov.hk${href}`
  }

  return `https://www.td.gov.hk/${href}`
}

const dedupeLinks = (links) => {
  const seen = new Set()
  return links.filter(link => {
    if (!link.href) {
      return false
    }

    const key = `${link.href}|${link.label}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export default {
  fetchTrafficInfo,
  fetchProhibitedZoneNotices,
  fetchSpeedLimitsNotices,
  fetchRoadClosureNotices,
  fetchClearwaysNotices,
  fetchPublicTransportNotices,
  fetchSpecialArrangementNotices,
  fetchExpresswaysNotices,
  fetchOtherNotices
}
