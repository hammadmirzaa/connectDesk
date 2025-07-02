"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, User, AlertCircle, CheckCircle, Loader2, Copy } from "lucide-react"
import Cookies from "js-cookie";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      // Add welcome message when first opened
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content:
            '👋 Hi! I\'m your ConnectDesk AI assistant. I can help you manage boards, tasks, and columns using natural language.\n\nTry saying something like:\n• "list boards"\n• "create board My Project in workspace ConnectDesk"\n• "add task Review design to column To Do in board My Project"',
          success: true,
        },
      ])
    }
  }

  const sendMessage = async (e) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const token = Cookies.get("access_token");

      const response = await fetch(`${apiUrl}/chatbot/message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
          success: data.command_success,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error(data.response || "Failed to get response")
      }
    } catch (err) {
      setError(err.message)
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `❌ Sorry, I encountered an error: ${err.message}. Please check your connection and try again.`,
        success: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickCommands = [
    "list boards",
    "create board New Project in workspace ConnectDesk",
    "add task Review design to column To Do in board Project X",
    "list tasks in board Project X",
  ]

  const handleQuickCommand = (command) => {
    setInput(command)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-14 z-50">
        <button
          onClick={toggleChat}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 hover:from-purple-600 hover:via-purple-700 hover:to-blue-700 shadow-xl transition-all duration-300 hover:scale-110 border-0 flex items-center justify-center group"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <X className="h-7 w-7 text-white transition-transform group-hover:rotate-90" />
          ) : (
            <Sparkles className="h-7 w-7 text-white transition-transform group-hover:rotate-12" />
          )}
        </button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-14 right-32 z-50 w-96 h-[500px] transition-all duration-300 transform animate-in slide-in-from-bottom-4">
          <div className="h-full shadow-2xl border-0 bg-white rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">ConnectDesk AI</h3>
                    <p className="text-purple-100 text-sm">Your workspace assistant</p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : message.success === false
                          ? "bg-red-50 border border-red-200 text-red-800"
                          : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && message.success === true && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                      {message.role === "assistant" && message.success === false && (
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="whitespace-pre-line flex-1">{message.content}</div>
                    </div>

                    {/* Copy button */}
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                      title="Copy message"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span>Processing your request...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Commands */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Try these commands:</p>
                <div className="flex flex-wrap gap-1">
                  {quickCommands.map((command, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickCommand(command)}
                      className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                      title={`Click to use: ${command}`}
                    >
                      {command.length > 25 ? command.substring(0, 25) + "..." : command}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your command..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
