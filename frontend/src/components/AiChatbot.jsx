import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../utils/api.js'
import './AiChatbot.css'

const STORAGE_PREFIX = 'fa_chat_history'

function buildWelcomeMessage(userName) {
  return {
    id: 'welcome',
    role: 'bot',
    text: `Hi${userName ? ` ${userName}` : ''}, I can help with budgeting, savings, and ITR basics. Ask me anything about your finances.`,
    timestamp: new Date().toISOString(),
  }
}

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}:${userId || 'guest'}`
}

function readStoredMessages(userId, userName) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    if (!raw) return [buildWelcomeMessage(userName)]

    const parsed = JSON.parse(raw)
    return parsed.length ? parsed : [buildWelcomeMessage(userName)]
  } catch {
    return [buildWelcomeMessage(userName)]
  }
}

function TypingIndicator() {
  return (
    <div className="chatbot__bubble chatbot__bubble--bot chatbot__bubble--typing">
      <span className="chatbot__dot" />
      <span className="chatbot__dot" />
      <span className="chatbot__dot" />
    </div>
  )
}

export function AiChatbot() {
  const { user, token } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [messages, setMessages] = useState(() =>
    readStoredMessages(user?.id, user?.name),
  )
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  const storageKey = useMemo(() => getStorageKey(user?.id), [user?.id])

  useEffect(() => {
    setMessages(readStoredMessages(user?.id, user?.name))
    setUnreadCount(0)
  }, [user?.id, user?.name])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages, storageKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  function buildHistoryPayload(existingMessages) {
    return existingMessages
      .filter((item) => item.id !== 'welcome')
      .slice(-8)
      .map((item) => ({
        role: item.role,
        text: item.text,
      }))
  }

  async function handleSend(e) {
    e.preventDefault()

    const message = input.trim()
    if (!message || isTyping) return

    setError('')
    setInput('')

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    }

    // Push the user's message immediately for a real-time chat feel.
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const history = buildHistoryPayload([...messages, userMessage])
      const data = await apiRequest('/chat', {
        method: 'POST',
        token,
        body: { message, history },
      })

      const botMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: data.reply,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
      if (!isOpen) {
        setUnreadCount((count) => count + 1)
      }
    } catch (err) {
      setError(err.message || 'Unable to reach the assistant right now.')
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: 'I could not answer just now. Please try again in a moment.',
          timestamp: new Date().toISOString(),
        },
      ])
      if (!isOpen) {
        setUnreadCount((count) => count + 1)
      }
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
      <div
        className={`chatbot__panel ${isOpen ? 'chatbot__panel--open' : ''}`}
        aria-hidden={!isOpen}
      >
        <header className="chatbot__header">
          <div>
            <p className="chatbot__eyebrow">AI Finance Assistant</p>
            <h2 className="chatbot__title">Smart money help</h2>
          </div>
          <button
            type="button"
            className="chatbot__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
          >
            ×
          </button>
        </header>

        <div className="chatbot__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chatbot__row chatbot__row--${message.role}`}
            >
              <div
                className={`chatbot__bubble chatbot__bubble--${message.role}`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isTyping ? (
            <div className="chatbot__row chatbot__row--bot">
              <TypingIndicator />
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot__composer" onSubmit={handleSend}>
          {error ? <p className="chatbot__error">{error}</p> : null}
          <div className="chatbot__inputRow">
            <input
              className="chatbot__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budget, savings, tax..."
              maxLength={400}
            />
            <button
              type="submit"
              className="chatbot__send"
              disabled={!input.trim() || isTyping}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="chatbot__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Hide finance assistant' : 'Open finance assistant'}
      >
        <span className="chatbot__logo">₹</span>
        {unreadCount > 0 ? (
          <span className="chatbot__badge" aria-label={`${unreadCount} unread messages`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>
    </div>
  )
}
