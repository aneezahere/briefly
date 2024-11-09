'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Inter } from 'next/font/google'
import { Send, Image as ImageIcon, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const inter = Inter({ subsets: ['latin'] })

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
  timestamp?: number
}

// Add a new function to convert markdown to HTML
const markdownToHtml = (content: string) => {
  // For now, we'll just handle basic line breaks. You can expand this as needed.
  return content.replace(/\n/g, '<br />')
}

export default function EnhancedChatbot() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatMessages')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // If storage is full, try compressing or chunking the data
        try {
          // Split messages into multiple storage keys
          const chunkSize = Math.floor(messages.length / 2)
          const chunks = []
          
          for (let i = 0; i < messages.length; i += chunkSize) {
            chunks.push(messages.slice(i, i + chunkSize))
          }
          
          chunks.forEach((chunk, index) => {
            localStorage.setItem(`chatMessages_${index}`, JSON.stringify(chunk))
          })
          
          // Store the number of chunks
          localStorage.setItem('chatMessages_chunks', String(chunks.length))
        } catch (e) {
          console.error('Failed to store messages in localStorage:', e)
        }
      }
    }
  }, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const chunksCount = localStorage.getItem('chatMessages_chunks')
      if (chunksCount) {
        try {
          let allMessages: Message[] = []
          for (let i = 0; i < parseInt(chunksCount); i++) {
            const chunk = localStorage.getItem(`chatMessages_${i}`)
            if (chunk) {
              allMessages = [...allMessages, ...JSON.parse(chunk)]
            }
          }
          setMessages(allMessages)
        } catch (e) {
          console.error('Failed to load chunked messages:', e)
        }
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputText.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: Date.now()
    }
    if (imagePreview) {
      userMessage.image = imagePreview
    }

    setInputText('')
    setIsLoading(true)
    setError('')
    
    setMessages((prev) => [...prev, userMessage])
    removeImage()

    try {
      const recentMessages = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          image: imagePreview,
          chatHistory: recentMessages
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.result,
        timestamp: Date.now()
      }])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
    // Clear all chunks
    const chunksCount = localStorage.getItem('chatMessages_chunks')
    if (chunksCount) {
      for (let i = 0; i < parseInt(chunksCount); i++) {
        localStorage.removeItem(`chatMessages_${i}`)
      }
    }
    localStorage.removeItem('chatMessages')
    localStorage.removeItem('chatMessages_chunks')
  }

  const exportHistory = () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat-history.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedMessages = JSON.parse(e.target?.result as string)
          setMessages(importedMessages)
        } catch (error) {
          setError('Failed to import chat history')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className={`min-h-screen bg-white flex flex-col ${inter.className}`}>
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col p-4">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.image && (
                  <img src={message.image} alt="User uploaded" className="max-w-full h-auto rounded-lg mb-2" />
                )}
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <label
              htmlFor="image-upload"
              className="absolute left-4 p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
              <ImageIcon className="h-5 w-5" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            
            <textarea
              className="w-full pl-14 pr-14 py-4 text-gray-900 bg-white rounded-xl border border-gray-300
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none 
                       transition-all resize-none min-h-[60px] max-h-[200px]"
              placeholder="Ask a question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              rows={1}
            />

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="absolute right-4 p-1 text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:hover:text-blue-500"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {imagePreview && (
            <div className="absolute -top-16 left-0 right-0 flex items-center justify-between p-2 bg-gray-100 rounded-lg">
              <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
              <button
                type="button"
                onClick={removeImage}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}