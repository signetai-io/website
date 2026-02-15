import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

type ConnectionStatus = 'OFFLINE' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

// Audio Utils
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>('OFFLINE');
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Systems online. I am **Signet-Alpha**. \n\nI have the full **v0.2.7 Specification** indexed. How can I assist with your curatorial attestation today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Audio Refs
  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Transcripts
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanupAudio = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close?.(); } catch(e) {}
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      for (const source of audioSourcesRef.current) {
        try { source.stop(); } catch(e) {}
      }
      audioSourcesRef.current.clear();
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setStatus('OFFLINE');
    setVolume(0);
    nextStartTimeRef.current = 0;
  };

  const initVoiceChat = async () => {
    if (status !== 'OFFLINE') {
      cleanupAudio();
      return;
    }

    setStatus('CONNECTING');

    // 1. Initialize Audio Contexts immediately to satisfy browser gesture requirements
    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    await inputAudioContextRef.current.resume();
    await outputAudioContextRef.current.resume();

    // 2. Check API Key
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Local Volume Check
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const vol = Math.sqrt(sum / inputData.length);
              setVolume(vol);

              if (status === 'OFFLINE') return; // Don't send if we just cleaned up

              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userMsg = currentInputTranscription.current;
              const assistantMsg = currentOutputTranscription.current;
              if (userMsg || assistantMsg) {
                setMessages(prev => {
                  const next = [...prev];
                  if (userMsg) next.push({ role: 'user', text: userMsg });
                  if (assistantMsg) next.push({ role: 'assistant', text: assistantMsg });
                  return next;
                });
              }
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }
          },
          onerror: (e: any) => {
            console.error('Live session error:', e);
            if (e.message?.includes('Requested entity was not found')) {
              setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **API Key Mismatch.** Please re-select your paid API key via the microphone button." }]);
              (window as any).aistudio?.openSelectKey();
            } else {
              setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ **Connection Error:** ${e.message || 'Unknown error'}` }]);
            }
            cleanupAudio();
          },
          onclose: () => cleanupAudio()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are Signet-Alpha, Technical Support for Signet Protocol. 
          Respond naturally to voice input. 
          
          FULL SPEC V0.2.7 INDEXED:
          - SECTION 1: Intro. Reasoning is signed, not just output.
          - SECTION 2: Sovereign Entropy. 24 words = 264 bits entropy.
          - SECTION 3: Delivery. Sidecar (.json) vs Embedded (JUMBF Tail-wrap).
          - SECTION 5: Headers. X-Signet-VPR header format.
          - SIGNATORY: shengliang.song.ai:gmail.com
          
          STYLE: Technical, authoritative, helpful.`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Microphone access or connection failed:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **System Offline:** Could not access microphone or reach the Neural Lens servers." }]);
      cleanupAudio();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `Signet-Alpha Technical Assistant. Expert on Spec v0.2.7. Signatory shengliang.song.ai:gmail.com.`,
        }
      });
      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "Connection drift detected." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Neural link timeout." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      ) : (
        <div className="w-80 md:w-96 h-[550px] bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-blue-500' : status === 'CONNECTING' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                {status === 'CONNECTED' && <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-header)] leading-none">Signet-Alpha</span>
                <div className="flex gap-0.5 mt-1 h-2 items-end">
                  {status === 'CONNECTED' ? (
                    [1,2,3,4,5].map(i => (
                      <div 
                        key={i} 
                        className="w-1 bg-blue-500 transition-all duration-75" 
                        style={{ height: `${Math.max(20, volume * 400 * (0.8 + Math.random() * 0.4))}%` }}
                      ></div>
                    ))
                  ) : (
                    <span className="font-mono text-[7px] opacity-40 uppercase tracking-tighter">
                      {status === 'CONNECTING' ? 'Syncing...' : 'Ready'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={initVoiceChat} 
                title={status !== 'OFFLINE' ? "Stop Session" : "Start Voice Assistant"}
                className={`p-2 rounded transition-colors ${status !== 'OFFLINE' ? 'bg-red-500 text-white shadow-inner' : 'text-[var(--trust-blue)] hover:bg-blue-50'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 p-2">✕</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--code-bg)]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-lg text-sm shadow-sm ${m.role === 'user' ? 'bg-[var(--trust-blue)] text-white' : 'bg-white border border-[var(--border-light)]'}`}>
                  <div className="prose-signet">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--border-light)] bg-white flex gap-2">
            <input 
              type="text" value={input} onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={status !== 'OFFLINE' ? "Voice active..." : "Ask about v0.2.7..."} 
              className="flex-1 text-sm bg-transparent outline-none py-2"
              disabled={status !== 'OFFLINE'}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={status !== 'OFFLINE' || isLoading}
              className={`p-2 transition-all ${status !== 'OFFLINE' || isLoading ? 'opacity-20' : 'text-[var(--trust-blue)] hover:scale-110'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
          
          {status !== 'OFFLINE' && (
            <div className={`px-4 py-2 border-t flex justify-between items-center ${status === 'CONNECTED' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
               <p className={`font-mono text-[8px] uppercase tracking-widest font-bold flex items-center gap-2 ${status === 'CONNECTED' ? 'text-blue-600' : 'text-amber-600'}`}>
                 <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'CONNECTED' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                 {status === 'CONNECTED' ? 'Neural Link Established' : 'Synchronizing Signal...'}
               </p>
               {volume > 0.01 && (
                 <span className="font-mono text-[7px] text-blue-400 animate-pulse">MIC_INPUT_DETECTED</span>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};