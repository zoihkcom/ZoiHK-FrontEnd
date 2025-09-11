export const chatApi = {
  async streamChat(sessionId, query, onMessage, onComplete, onError) {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/chat/completion?sessionId=${encodeURIComponent(sessionId)}&query=${encodeURIComponent(query)}`
      const eventSource = new EventSource(url)

      eventSource.onmessage = (event) => {
        if (event.data && event.data !== 'Stream finished') {
          onMessage && onMessage(event.data)
        }
      }

      eventSource.addEventListener('COMPLETE', (event) => {
        eventSource.close()
        onComplete && onComplete()
      })

      eventSource.addEventListener('ERROR', (event) => {
        eventSource.close()
        onError && onError(event.data)
      })

      eventSource.onerror = (error) => {
        eventSource.close()
        onError && onError('连接错误')
      }

      return eventSource
    } catch (error) {
      onError && onError(error.message)
      throw error
    }
  }
}