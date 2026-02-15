import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Systems online. I am **Signet-Alpha**. \n\nAre you stuck in the logic flow, or do you require a technical deep-dive into the **VPR protocol**?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Gemini Chat Session
  const initChat = () => {
    if (!chatSession) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Signet-Alpha, the official Technical Support AI for Signet Protocol Labs. 
          Your goal is to help users understand the Verifiable Proof of Reasoning (VPR) framework.
          
          STYLE GUIDELINES:
          - Use **Markdown** formatting for all responses.
          - Use **Bold text** for key protocol terms like **VPR**, **JUMBF**, and **Neural Lens**.
          - Use bulleted lists for technical steps or feature breakdowns.
          - Use backticks for \`Trace IDs\` or code snippets.
          - Maintain a professional, industrial, and slightly technical tone.

          KEY PROTOCOL POINTS:
          - VPR is a C2PA-native extension for AI reasoning.
          - Trace IDs are unique fingerprints of logical nodes.
          - The "Forever Loop" is Continuous Attestation; it stops when a manifest is Finalized.
          - We scale via Probabilistic Sampling (checking random branches of a Merkle Tree).
          - We are ISO/TC 290 compliant.`,
        },
      });
      setChatSession(newChat);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      if (!chatSession) initChat();
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const session = chatSession || ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: "Signet Assistant Persona" }
      });
      if (!chatSession) setChatSession(session);

      const responseStream = await session.sendMessageStream({ message: userText });
      
      let assistantText = "";
      setMessages(prev => [...prev, { role: 'assistant', text: "" }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text;
        if (textChunk) {
          assistantText += textChunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = assistantText;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Error in **Neural Link**. Please re-attest the session." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      {!isOpen ? (
        <button 
          onClick={() => { setIsOpen(true); initChat(); }}
          className="group relative flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--trust-blue)] animate-ping opacity-20"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        <div className="w-80 md:w-96 h-[550px] bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Assistant Header */}
          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-header)]">Signet-Alpha</p>
                <p className="text-[8px] opacity-40 uppercase font-mono">Protocol Interface v0.2</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[var(--text-body)] opacity-40 hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--code-bg)]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-lg text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[var(--trust-blue)] text-white' 
                    : 'bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] shadow-sm'
                }`}>
                  {m.role === 'assistant' ? (
                    <div className="prose-signet">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                      {isLoading && i === messages.length - 1 && !m.text && (
                        <span className="animate-pulse">...</span>
                      )}
                    </div>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--border-light)] bg-[var(--bg-standard)] flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about VPR..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-serif italic text-[var(--text-body)]"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--trust-blue)] text-white hover:brightness-110 disabled:opacity-20 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};