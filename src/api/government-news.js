import request from './request.js'

export const newsCategories = [
  { key: 'general', label: '綜合總覽', subLabel: 'General' },
  { key: 'topStories', label: '主要新聞', subLabel: 'Top Stories' },
  { key: 'ticker', label: '新聞速遞', subLabel: 'Ticker' },
  { key: 'features', label: '特寫', subLabel: 'Features' },
  { key: 'adminCivicAffairs', label: '行政與公民', subLabel: 'Admin & Civic Affairs' },
  { key: 'schoolWork', label: '教育與就業', subLabel: 'At School, At Work' },
  { key: 'businessFinance', label: '財經', subLabel: 'Business & Finance' },
  { key: 'cityLife', label: '都會生活', subLabel: 'City Life' },
  { key: 'environment', label: '環境', subLabel: 'Environment' },
  { key: 'healthCommunity', label: '社區與健康', subLabel: 'Health & Community' },
  { key: 'infrastructureLogistics', label: '基建與物流', subLabel: 'Infrastructure & Logistics' },
  { key: 'lawOrder', label: '治安', subLabel: 'Law & Order' },
  { key: 'onTheRecord', label: '官員暢談', subLabel: 'On The Record' }
]

const categoryEndpointMap = {
  topStories: '/govInfo/topStories',
  ticker: '/govInfo/ticker',
  features: '/govInfo/features',
  adminCivicAffairs: '/govInfo/adminCivicAffairs',
  schoolWork: '/govInfo/schoolWork',
  businessFinance: '/govInfo/businessFinance',
  cityLife: '/govInfo/cityLife',
  environment: '/govInfo/environment',
  healthCommunity: '/govInfo/healthCommunity',
  infrastructureLogistics: '/govInfo/infrastructureLogistics',
  lawOrder: '/govInfo/lawOrder',
  onTheRecord: '/govInfo/onTheRecord',
  general: '/govInfo/general'
}

export const fetchGovernmentNews = async (categoryKey = 'general') => {
  try {
    const endpoint = categoryEndpointMap[categoryKey] || categoryEndpointMap.general
    console.log(`📡 Calling ${endpoint} endpoint...`)

    const response = await request.get(endpoint, {
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      }
    })

    const xmlData = response.data
    console.log('✅ Received XML data from backend, length:', xmlData?.length)

    if (!xmlData || xmlData.length === 0) {
      throw new Error('Empty XML data received from backend')
    }

    return xmlData
  } catch (error) {
    console.error('❌ Error fetching RSS XML from backend:', error)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    throw error
  }
}

const cleanHtmlText = (input = '') => {
  const withoutCdata = input.replace(/<!\[CDATA\[(.*?)\]\]>/gis, '$1')

  const withoutTags = withoutCdata
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<[^>]*>/g, '')

  const decoded = withoutTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&emsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, '\'')

  return decoded
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const extractImageUrls = (item, rawDescription = '') => {
  const urls = new Set()

  const pushUrl = (url) => {
    if (!url) return
    const trimmed = url.trim()
    if (trimmed) urls.add(trimmed)
  }

  item.querySelectorAll('media\\:content, media\\:thumbnail').forEach((node) => {
    pushUrl(node.getAttribute('url'))
  })

  item.querySelectorAll('enclosure').forEach((node) => {
    const enclosureUrl = node.getAttribute('url')
    const type = (node.getAttribute('type') || '').toLowerCase()
    if (!type || type.includes('image')) {
      pushUrl(enclosureUrl)
    }
  })

  const collectFromHtml = (html) => {
    if (!html) return
    const regex = /<img[^>]+src=["']([^"']+)["']/gi
    let match
    while ((match = regex.exec(html))) {
      pushUrl(match[1])
    }
  }

  collectFromHtml(rawDescription)
  collectFromHtml(item.querySelector('content\\:encoded')?.textContent || '')

  return Array.from(urls)
}

export const parseRSSData = (rssString) => {
  try {
    console.log('🔍 Starting RSS parsing...')
    console.log('RSS string length:', rssString.length)
    
    if (!rssString || rssString.length === 0) {
      throw new Error('Empty RSS string provided')
    }
    
    // 简单的RSS解析函数
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(rssString, 'text/xml')
    
    // 检查解析错误
    const parseError = xmlDoc.querySelector('parsererror')
    if (parseError) {
      console.error('XML Parse Error:', parseError.textContent)
      throw new Error('XML parsing failed')
    }
    
    const items = xmlDoc.querySelectorAll('item')
    console.log('Found items:', items.length)
    
    if (items.length === 0) {
      console.warn('No items found in RSS')
      return []
    }
    
    const newsItems = []
    
    items.forEach((item, index) => {
      try {
        const title = item.querySelector('title')?.textContent || ''
        const description = item.querySelector('description')?.textContent || ''
        const link = item.querySelector('link')?.textContent || ''
        const pubDate = item.querySelector('pubDate')?.textContent || ''
        const guid = item.querySelector('guid')?.textContent || ''

        // 清理HTML标签和CDATA标记
        const cleanTitle = cleanHtmlText(title)
        const cleanDescription = cleanHtmlText(description)
        const imageUrls = extractImageUrls(item, description)

        const newsItem = {
          id: guid || link || `item-${index}`,
          title: cleanTitle,
          description: cleanDescription,
          link,
          pubDate,
          publishedAt: new Date(pubDate),
          image: imageUrls[0] || '',
          images: imageUrls
        }
        
        // 检查日期是否有效
        if (isNaN(newsItem.publishedAt.getTime())) {
          console.warn('Invalid date for item:', newsItem.title)
          newsItem.publishedAt = new Date() // 使用当前时间作为备用
        }
        
        newsItems.push(newsItem)
      } catch (itemError) {
        console.error('Error parsing item:', index, itemError)
      }
    })
    
    console.log('✅ Successfully parsed items:', newsItems.length)
    return newsItems
  } catch (error) {
    console.error('❌ Error parsing RSS data:', error)
    console.error('RSS string sample:', rssString.substring(0, 500))
    throw error
  }
}
