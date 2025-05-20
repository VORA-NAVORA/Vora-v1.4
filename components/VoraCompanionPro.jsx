
import React, { useState, useEffect, useRef } from 'react'

export default function VoraCompanionPro() {
  const [messages, setMessages] = useState([
    { sender: 'vora', text: 'Hello, I’m VORA. Ask me anything about NAVORA.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messageEndRef = useRef(null)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speak = (text) => {
    if (!voiceEnabled || typeof window === 'undefined') return
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.speak(utterance)
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { sender: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const response = await fetch('/api/ask-vora', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage.text })
    })
    const data = await response.json()
    setMessages(prev => [...prev, { sender: 'vora', text: data.reply }])
    speak(data.reply)
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = 'en-US'
    recognition.start()
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="p-4 text-center font-semibold text-xl border-b border-gray-700">
        <div className="animate-pulse text-cyan-400 font-bold text-2xl">VORA</div>
        <div className="text-sm text-gray-400">NAVORA AI Companion</div>
      </header>
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.sender === 'vora' ? 'text-left' : 'text-right'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'vora' ? 'bg-cyan-900 text-white' : 'bg-gray-700 text-white'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <footer className="p-4 border-t border-gray-700 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything about NAVORA..."
          className="flex-1 p-2 border rounded-md bg-black text-white border-gray-600"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800">Send</button>
        <button onClick={handleVoiceInput} className="px-2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">🎤</button>
        <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="px-2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
          {voiceEnabled ? '🔊' : '🔇'}
        </button>
      </footer>
    </div>
  )
}
