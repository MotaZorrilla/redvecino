import { useState } from 'react';

export default function CommunityChat({
    chatInput,
    setChatInput,
    chatMessages,
    isTyping,
    sendChatMessage,
    setMobileTab
}) {
    return (
        <div className="space-y-4 flex flex-col h-[520px] justify-between pb-2 animate-scale-up text-left">
            <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800 shrink-0">
                <button 
                    onClick={() => setMobileTab('home')} 
                    className="text-slate-400 hover:text-slate-650 transition-colors"
                    type="button"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#EC7A08]/15 border border-[#EC7A08]/30 flex items-center justify-center text-xs">👥</div>
                    <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Conserjería y Soporte Vecinal</h4>
                        <span className="text-[8px] text-emerald-500 font-bold block">● En línea</span>
                    </div>
                </div>
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3 font-sans text-xs">
                {chatMessages.map((msg, i) => (
                    <div 
                        key={i} 
                        className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-2.5 relative shadow-sm ${
                            msg.sender === 'system' 
                                ? 'mx-auto bg-slate-100 border border-slate-200/50 text-slate-500 text-[10px] text-center max-w-[90%] dark:bg-slate-950 dark:border-slate-800'
                                : msg.sender === 'me'
                                ? 'ml-auto bg-[#72B043] text-white rounded-br-none'
                                : 'bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-bl-none'
                        }`}
                    >
                        <p className="leading-relaxed font-medium">{msg.text}</p>
                        {msg.time && (
                            <span className={`text-[7px] block text-right mt-1 ${msg.sender === 'me' ? 'text-white/60' : 'text-slate-400'}`}>{msg.time}</span>
                        )}
                    </div>
                ))}
                
                {isTyping && (
                    <div className="bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-500 px-4 py-2 rounded-2xl rounded-bl-none max-w-[120px] flex items-center gap-1 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}
            </div>

            {/* Input form */}
            <form onSubmit={sendChatMessage} className="flex gap-2 pt-2 border-t dark:border-slate-800 shrink-0">
                <input 
                    type="text"
                    placeholder="Escribe tu mensaje aquí..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl focus:outline-none focus:border-[#72B043] dark:text-slate-200"
                />
                <button 
                    type="submit"
                    className="px-4 py-2 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
