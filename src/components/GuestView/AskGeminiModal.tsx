import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Compass, HelpCircle } from 'lucide-react';
import { Room } from '../../types';

interface AskGeminiModalProps {
  rooms: Room[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSelectRoom?: (room: Room) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
}

export const AskGeminiModal: React.FC<AskGeminiModalProps> = ({
  rooms,
  isOpen,
  onClose,
  onOpen,
  onSelectRoom,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'gemini',
      text: 'Hello! I am your AI concierge for Diversion Vigan Transient. How can I help you today? You can ask about our rooms, group sizes, custom rates, or directions to Calle Crisologo!',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'Which room is best for a family of 6?',
    'What are your check-in and check-out times?',
    'Do you have weekend rates or holiday surcharges?',
    'How far is Diversion Road from Calle Crisologo?',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // 1. Try calling the secure PHP backend proxy (backend.php)
      const res = await fetch('/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ask_gemini', prompt: q }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'gemini',
              text: data.reply,
            },
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // If backend.php is not reached (e.g. static dev environment), fall back to built-in concierge responses
    }

    // 2. Intelligent local fallback knowledge base
    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('family') || lower.includes('6') || lower.includes('group') || lower.includes('8') || lower.includes('20') || lower.includes('villa')) {
        reply = 'For large groups or families, we offer:\n• **Room 17 - Private Villa** (up to 20 pax with private pool & BBQ pavilion, starting at ₱7,000–₱8,000)\n• **Room 14, 15, & 16 - Family Rooms** (up to 5 pax starting at ₱1,000–₱1,800)\n• **Room 0 & 1 - Big Family Rooms** (up to 8 pax).';
      } else if (lower.includes('check-in') || lower.includes('check in') || lower.includes('time') || lower.includes('hours')) {
        reply = 'Standard check-in starts at **2:00 PM** and check-out is by **12:00 PM (Noon)**. Front desk is staffed 24/7 on Diversion Road, and late check-in is readily accommodated upon request!';
      } else if (lower.includes('calle crisologo') || lower.includes('location') || lower.includes('attraction') || lower.includes('far') || lower.includes('where')) {
        reply = 'Diversion Vigan Transient is situated along Diversion Road in Vigan City, just **5 to 8 minutes** by tricycle or car from Calle Crisologo, Plaza Salcedo, and the Bantay Bell Tower. It provides quiet relaxation away from cobblestone traffic!';
      } else if (lower.includes('rate') || lower.includes('price') || lower.includes('pax') || lower.includes('weekend')) {
        reply = 'Our rates are standardized in Philippine Pesos (₱):\n• **Family Rooms (14, 15, 16)**: Mon-Thu ₱1,000–₱1,500 | Fri-Sun ₱1,200–₱1,800\n• **Private Villa (17)**: Mon-Thu ₱7,000 (+₱400/extra pax) | Fri-Sun ₱8,000 (+₱500/extra pax)\n• **Standard Rooms**: Starting at ₱1,500/night.';
      } else {
        reply = `Welcome to Diversion Vigan Transient! We offer 8 well-appointed studio rooms, family suites, and modern lofts with high-speed Wi-Fi, cold air conditioning, and secure parking along Diversion Road in Vigan City. How can I help you plan your stay?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'gemini',
          text: reply,
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Pill Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700/80 dark:border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ask Gemini</span>
        </button>
      )}

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Ask Gemini Concierge</h3>
                  <p className="text-[11px] text-slate-400">Diversion Vigan Transient Virtual Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[260px] max-h-[400px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'gemini' && (
                    <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 text-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-rose-500 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      DV
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 items-center text-slate-400 text-xs py-2">
                  <Bot className="w-4 h-4 text-rose-500 animate-spin" />
                  <span>Gemini is generating recommendations...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
              {suggestedQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(sq)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 hover:border-rose-400 whitespace-nowrap transition-colors shrink-0"
                >
                  {sq}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about rooms, rates, policies, or Vigan..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white transition-colors"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
