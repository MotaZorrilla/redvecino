import { useState } from 'react';

export default function ChatAuditLogs({
    selectedAuditChat,
    setSelectedAuditChat,
    auditedMessagesState = [],
    setAuditedMessagesState,
    chatAuditReply,
    setChatAuditReply
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    💬 Auditoría de Comunicaciones (Historial)
                </h4>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-mono">Modo: Comité Fiscalizador</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[420px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm">
                {/* Inbox list */}
                <div className="border-r border-gray-200 dark:border-slate-800 divide-y divide-gray-150 dark:divide-slate-800 overflow-y-auto bg-gray-50/50 dark:bg-slate-900/40">
                    {[
                        { name: 'Residente Demo', lastMsg: 'Hola, llegó mi paquete?', depto: 'Depto 202', count: 1 },
                        { name: 'Propietario Demo', lastMsg: 'Pago conciliado correctamente', depto: 'Depto 101', count: 0 }
                    ].map((ch) => (
                        <button
                            key={ch.name}
                            type="button"
                            onClick={() => setSelectedAuditChat(ch.name)}
                            className={`w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all ${
                                selectedAuditChat === ch.name ? 'bg-white dark:bg-slate-800 shadow-sm border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                            }`}
                        >
                            <div>
                                <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200">{ch.name}</h5>
                                <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 truncate max-w-[140px]">{ch.lastMsg}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block">{ch.depto}</span>
                                {ch.count > 0 && <span className="inline-block px-1.5 py-0.5 bg-indigo-500 text-white text-[8px] font-black rounded-full mt-1.5">NUEVO</span>}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Conversation log */}
                <div className="lg:col-span-2 flex flex-col justify-between h-full bg-white dark:bg-slate-900/40 p-4">
                    <div className="space-y-4 overflow-y-auto max-h-[300px] flex-1 pb-4 text-left">
                        {auditedMessagesState
                            .filter(m => m.sender_name === selectedAuditChat || m.receiver_name === selectedAuditChat || (selectedAuditChat === 'Residente Demo' && m.sender_name === 'Residente Demo') || (selectedAuditChat === 'Propietario Demo' && m.sender_name === 'Propietario Demo'))
                            .map((m) => {
                                const isMe = m.sender_name === 'Conserje Principal' || m.sender_name === 'Soporte TI' || m.sender_name === 'Administración';
                                return (
                                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3 rounded-2xl max-w-[70%] text-xs ${
                                            isMe
                                                ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-br-none'
                                                : 'bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-bl-none'
                                        }`}>
                                            <p className="font-bold text-[9px] text-slate-400 dark:text-slate-500 mb-1">{m.sender_name}</p>
                                            <p>{m.content}</p>
                                        </div>
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">{m.time}</span>
                                    </div>
                                );
                            })
                        }
                    </div>

                    {/* Send direct message */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatAuditReply.trim()) return;
                        const newMsg = {
                            id: auditedMessagesState.length + 1,
                            sender_id: 1,
                            sender_name: 'Administración',
                            receiver_id: 3,
                            receiver_name: selectedAuditChat,
                            content: chatAuditReply,
                            time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
                            date: new Date().toLocaleDateString('es-CL'),
                            is_read: true
                        };
                        setAuditedMessagesState(prev => [...prev, newMsg]);
                        setChatAuditReply('');
                    }} className="flex gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                        <input
                            type="text"
                            value={chatAuditReply}
                            onChange={(e) => setChatAuditReply(e.target.value)}
                            placeholder={`Responder oficialmente a ${selectedAuditChat}...`}
                            className="flex-1 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-4 py-2 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow transition-all shrink-0"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
