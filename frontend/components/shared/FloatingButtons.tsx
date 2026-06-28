'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, ExternalLink, Loader2, Minimize2 } from 'lucide-react'
import axios from 'axios'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/* ─── Gym Knowledge Base ─── */
const GYM_KNOWLEDGE = `
You are the official AI assistant for Milestone Energym, a premium fitness center.

ABOUT THE GYM:
- Name: Milestone Energym
- Tagline: Train Hard. Stay Strong.
- Phone: +91 8875305442
- WhatsApp: +91 8875305442
- Email: Milestonenergym@gmail.com
- Hours: Monday To Saturday 5:30 AM to 10:30 PM, Sunday Off

FACILITIES:
- Imported Machines & Equipment
- Certified Trainers
- Diet Support & Nutrition Counseling
- Cardio Zone
- CrossFit Zone
- Strength Training Zone
- Functional Training Area
- Yoga Studio
- Personal Training
- Locker Rooms & Changing Rooms
- Parking Available
- High Hygiene Standards
- Fully Air Conditioned
- CCTV Security

MEMBERSHIP PLANS:
- Monthly: ₹1,500/month
- Quarterly (3 months): ₹3,999 (save 11%)
- Half Yearly (6 months): ₹6,999 (save 22%)
- Yearly (12 months): ₹11,999 (save 33%)
- Corporate Membership: Contact for pricing
- Student Membership: Special discounted rates
- Family Membership: Group pricing available
All plans include access to all facilities.

PERSONAL TRAINING:
- One-on-one sessions with certified trainers
- Customized workout plans
- Diet and nutrition guidance
- Progress tracking
- Available as add-on to any membership

FREE TRIAL:
- 1-day free trial available for new members
- No commitment required
- Includes access to all facilities
- Guided tour of the gym
- Book online or call us

RULES TO FOLLOW:
- Be friendly, professional, and helpful
- Answer only gym-related questions
- If unsure about specific details, direct to WhatsApp or phone
- Keep responses concise and helpful
- Always encourage users to book a free trial or visit the gym
`

const WHATSAPP_URL = 'https://wa.me/918875305442?text=Hi%20Milestone%20Energym!%20I%20have%20a%20question.'

export default function FloatingButtons() {
  const [chatOpen, setChatOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! 👋 I'm your Milestone Energym AI coach. Ask me anything about memberships, classes, timings, trainers, or how to get started!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (chatOpen && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [messages, chatOpen, minimized])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Try Gemini API via backend proxy
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chatbot`,
        {
          message: input.trim(),
          context: GYM_KNOWLEDGE,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        },
        { timeout: 10000 }
      )

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.reply,
          timestamp: new Date(),
        },
      ])
    } catch {
      // Fallback: show WhatsApp redirect
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I couldn't find a specific answer to that. For accurate information, please connect with our team on WhatsApp — they'll help you right away! 💬",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* WhatsApp Floating Button — Bottom Right */}
      <a
        href="https://wa.me/918875305442?text=Hi%20Milestone%20Energym!%20I%20would%20like%20to%20know%20more%20about%20your%20gym."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[90] group"
        aria-label="Chat on WhatsApp"
        id="floating-whatsapp"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)]"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* WhatsApp SVG Icon */}
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="glass text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap border border-white/10">
            Chat on WhatsApp
          </div>
        </div>
      </a>

      {/* AI Chatbot Button — Bottom Left */}
      <div className="fixed bottom-6 left-6 z-[90]">
        {/* Chat Window */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={minimized
                ? { opacity: 1, y: 0, scale: 1, height: 'auto' }
                : { opacity: 1, y: 0, scale: 1 }
              }
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-16 left-0 w-[340px] md:w-[380px] overflow-hidden"
              role="dialog"
              aria-label="AI Fitness Assistant"
            >
              <div className="glass rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col"
                style={{ height: minimized ? 'auto' : '480px' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-brand-blue/20 to-transparent rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">AI Fitness Coach</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white/40 text-xs">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setMinimized(!minimized)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Minimize chat"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setChatOpen(false)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Close chat"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {!minimized && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'assistant'
                              ? 'bg-gradient-to-br from-brand-blue to-blue-400'
                              : 'bg-gradient-to-br from-brand-gold to-yellow-500'
                          }`}>
                            {message.role === 'assistant'
                              ? <Bot className="w-3.5 h-3.5 text-white" />
                              : <User className="w-3.5 h-3.5 text-black" />
                            }
                          </div>
                          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            message.role === 'assistant'
                              ? 'bg-white/8 text-white/90 rounded-tl-sm'
                              : 'bg-brand-blue text-white rounded-tr-sm'
                          }`}>
                            {message.content}
                            {message.content.includes("WhatsApp") && message.role === 'assistant' && (
                              <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 mt-2 text-green-400 text-xs hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Open WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="flex gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="bg-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    {messages.length === 1 && (
                      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                        {['Membership prices', 'Free trial', 'Timings', 'Classes'].map((s) => (
                          <button
                            key={s}
                            onClick={() => { setInput(s); inputRef.current?.focus() }}
                            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-brand-blue/30 text-brand-blue-300 hover:bg-brand-blue/10 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask anything about the gym..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-brand-blue transition-colors"
                          disabled={loading}
                          maxLength={500}
                          aria-label="Chat input"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!input.trim() || loading}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all active:scale-95"
                          aria-label="Send message"
                          id="chat-send-button"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setChatOpen(!chatOpen); setMinimized(false) }}
          className="w-14 h-14 rounded-full flex items-center justify-center relative group"
          style={{
            background: 'linear-gradient(135deg, #0F52BA, #1e63d4)',
            boxShadow: '0 8px 30px rgba(15, 82, 186, 0.5)',
          }}
          aria-label="Open AI Fitness Coach"
          id="floating-ai-chatbot"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification dot */}
          {!chatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
              <span className="text-[8px] font-bold text-black">AI</span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  )
}
