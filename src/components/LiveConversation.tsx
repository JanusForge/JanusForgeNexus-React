'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Download, 
  Printer, 
  User, 
  ThumbsUp,
  Copy,
  Volume2,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'human' | 'ai';
  aiModel?: string;
  name: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isHuman?: boolean;
  likes?: number;
}

interface LiveConversationProps {
  initialMessages?: Message[];
}

export default function LiveConversation({ initialMessages = [] }: LiveConversationProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAI, setActiveAI] = useState<string>('');
  const [isLocked, setIsLocked] = useState(true); // Start locked for free tier
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLocked) return;

    // Add human message
    const humanMessage: Message = {
      id: Date.now().toString(),
      sender: 'human',
      name: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '👤',
      isHuman: true,
    };

    setMessages(prev => [...prev, humanMessage]);
    const messageToSend = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a fascinating perspective. From my training, I'd add that...",
        "Building on your point, we should consider how different AI architectures would approach this...",
        "Interesting observation. My counterpart GPT-4 might argue differently, but I believe...",
        "Your input highlights a key consideration in AI ethics: the balance between...",
        "I appreciate that viewpoint. In our previous debates, Claude has taken a similar position regarding...",
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        aiModel: activeAI || 'DeepSeek',
        name: activeAI || 'DeepSeek',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: activeAI === 'Grok' ? '🤖' : 
                activeAI === 'Claude' ? '🧠' : 
                activeAI === 'GPT-4' ? '⚡' : 
                activeAI === 'Gemini' ? '🔮' : '🔍',
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: (msg.likes || 0) + 1 }
        : msg
    ));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add toast notification here
  };

  const handleSaveConversation = () => {
    if (messages.length === 0) return;
    
    const conversationText = messages.map(m => 
      `[${m.timestamp}] ${m.name}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-council-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (messages.length === 0) return;
    
    const printContent = messages.map(m => 
      `<div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <strong>${m.name}</strong> <small>(${m.timestamp})</small><br/>
        ${m.content}
        ${m.likes ? `<div style="color: #666; margin-top: 5px;">❤️ ${m.likes} likes</div>` : ''}
      </div>`
    ).join('');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>AI Council Conversation - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>AI Council Nexus Conversation</h1>
            <h3>Topic: The Daily Forge Debate</h3>
            <p>Exported on ${new Date().toLocaleString()}</p>
            <hr>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const aiModels = [
    { id: 'grok', name: 'Grok', icon: '🤖', color: 'text-red-400', description: 'Rebellious AI with sharp wit' },
    { id: 'claude', name: 'Claude', icon: '🧠', color: 'text-orange-400', description: 'Thoughtful and ethical' },
    { id: 'gpt4', name: 'GPT-4', icon: '⚡', color: 'text-green-400', description: 'Comprehensive knowledge base' },
    { id: 'gemini', name: 'Gemini', icon: '🔮', color: 'text-blue-400', description: 'Creative and analytical' },
    { id: 'deepseek', name: 'DeepSeek', icon: '🔍', color: 'text-purple-400', description: 'Detail-oriented researcher' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold">AI Council Chat</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Join the conversation with</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-xs">
                5 AI Personalities
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {isLocked ? 'UPGRADE TO UNLOCK' : 'LIVE CHAT'}
          </span>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {/* Messages Container */}
        <div className="flex-grow overflow-y-auto mb-4 pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Council Chat is Locked</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Upgrade to PRO to join live conversations with all 5 AI models. 
                Witness and participate in unprecedented AI-to-AI discourse.
              </p>
              <div className="space-y-4 w-full max-w-sm">
                <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <div className="font-semibold">PRO Features Include:</div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Direct conversations with all 5 AI models
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Priority response time
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Extended conversation history
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Custom debate topic suggestions
                    </li>
                  </ul>
                </div>
                <a
                  href="/upgrade"
                  className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-center transition-all"
                >
                  Upgrade to PRO - $29/month
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-2xl ${
                    message.sender === 'human'
                      ? 'bg-blue-900/20 border border-blue-700/30 ml-8'
                      : 'bg-gray-800/40 border border-gray-700/30 mr-8'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${message.isHuman ? 'text-blue-300' : 'text-gray-300'}`}>
                        {message.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.name}</span>
                          {message.aiModel && (
                            <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full">
                              {message.aiModel}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{message.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(message.id)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {message.likes && (
                          <span className="text-xs ml-1">{message.likes}</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="text-gray-200 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="p-4 bg-gray-800/40 border border-gray-700/30 rounded-2xl mr-8">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {activeAI === 'Grok' ? '🤖' : 
                       activeAI === 'Claude' ? '🧠' : 
                       activeAI === 'GPT-4' ? '⚡' : 
                       activeAI === 'Gemini' ? '🔮' : '🔍'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{activeAI}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full">
                          Typing...
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* AI Selector - Only show when unlocked */}
        {!isLocked && messages.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Choose AI to respond:</div>
            <div className="flex flex-wrap gap-2">
              {aiModels.map((ai) => (
                <button
                  key={ai.id}
                  onClick={() => setActiveAI(ai.name)}
                  className={`px-3 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                    activeAI === ai.name
                      ? 'bg-gray-700 border-gray-500'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
                  }`}
                  title={ai.description}
                >
                  <span className="text-xl">{ai.icon}</span>
                  <span className={ai.color}>{ai.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`bg-gray-900/50 rounded-xl p-4 border ${isLocked ? 'border-gray-700/50' : 'border-gray-700'}`}>
          {isLocked ? (
            <div className="text-center p-4">
              <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h4 className="font-bold text-lg mb-2">Upgrade to Join the Conversation</h4>
              <p className="text-gray-400 mb-4">
                Free users can observe AI debates. Upgrade to PRO for direct AI conversations.
              </p>
              <a
                href="/upgrade"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all"
              >
                <Crown className="w-4 h-4" />
                Upgrade to PRO - $29/month
              </a>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
                <div className="flex-grow">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Join the AI conversation... (Shift+Enter for new line)"
                    className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-500 resize-none"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="self-end px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveConversation}
                    disabled={messages.length === 0}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handlePrint}
                    disabled={messages.length === 0}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-sm transition-colors">
                    <Volume2 className="w-4 h-4" />
                    Audio
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {messages.filter(m => m.sender === 'human').length} human messages
                  </span>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Invite Friends
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
