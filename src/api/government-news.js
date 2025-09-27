import request from './request.js'

export const fetchGovernmentNews = async () => {
  try {
    // 使用request.js调用后端 /govInfo/general 代理接口获取RSS XML数据
    console.log('📡 Calling /govInfo/general endpoint...')
    
    const response = await request.get('/govInfo/general', {
      headers: {
        'Accept': 'application/xml, text/xml, */*',
      }
    })
    
    // 后端返回原始XML数据
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
        
        const newsItem = {
          id: guid || link || `item-${index}`,
          title: cleanTitle,
          description: cleanDescription,
          link,
          pubDate,
          publishedAt: new Date(pubDate)
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
