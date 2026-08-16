import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Shield, Building2, Users, Paperclip, CheckCheck } from 'lucide-react';

export default function AdminMessagesPanel({ adminCondoId = 1, user, propertiesList = [] }) {
    const [channelType, setChannelType] = useState('administracion_oficial');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState({
        subject: '',
        content: '',
        property_id: '',
        receiver_id: ''
    });
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/messages?condominium_id=${adminCondoId || 1}&channel_type=${channelType}`);
            const data = res.data.data || res.data;
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error cargando mensajes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [adminCondoId, channelType]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.content.trim()) return;
        setIsSending(true);
        try {
            const formData = new FormData();
            formData.append('condominium_id', adminCondoId || 1);
            formData.append('channel_type', channelType);
            formData.append('content', newMessage.content);
            if (newMessage.subject) formData.append('subject', newMessage.subject);
            if (newMessage.property_id) formData.append('property_id', newMessage.property_id);
            if (attachmentFile) formData.append('attachment', attachmentFile);

            await axios.post('/api/messages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setNewMessage({ subject: '', content: '', property_id: '', receiver_id: '' });
            setAttachmentFile(null);
            setSuccessMsg('¡Mensaje enviado con éxito!');
            setTimeout(() => setSuccessMsg(''), 2500);
            fetchMessages();
        } catch (err) {
            console.error('Error enviando mensaje:', err);
        } finally {
            setIsSending(false);
        }
    };

    const channels = [
        { id: 'administracion_oficial', label: 'Canal Oficial Administración', icon: Shield, desc: 'Comunicados y avisos' },
        { id: 'conserjeria_unidad', label: 'Conserjería ↔ Unidades', icon: Building2, desc: 'Avisos directos por depto' },
        { id: 'comite_privado', label: 'Comité de Copropietarios', icon: Users, desc: 'Deliberaciones internas' },
        { id: 'directo', label: 'Mensajes Directos', icon: MessageSquare, desc: 'Bandeja privada' }
    ];

    return (
        <div className="space-y-6 animate-fade-in text-left font-sans">
            {/* Header del Módulo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>💬 Mensajería y Canales de Comunicación</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Canal institucional seguro y alternativo a WhatsApp con privacidad de teléfonos.
                    </p>
                </div>
                {successMsg && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        {successMsg}
                    </span>
                )}
            </div>

            {/* Selector de Canales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {channels.map((ch) => {
                    const Icon = ch.icon;
                    const isActive = channelType === ch.id;
                    return (
                        <button
                            key={ch.id}
                            type="button"
                            onClick={() => setChannelType(ch.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-white shadow-xs ring-2 ring-indigo-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <h5 className="text-xs font-black truncate">{ch.label}</h5>
                                    <p className="text-[10px] text-slate-400 truncate">{ch.desc}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Panel Principal: Conversaciones + Enviar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
                {/* Historial de Mensajes */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold">
                            Cargando mensajes del canal...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                            <span className="text-4xl mb-2">📬</span>
                            <p className="text-xs font-bold">No hay mensajes registrados en este canal</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Envía el primer comunicado oficial para iniciar la bitácora.</p>
                        </div>
                    ) : (
                        messages.map((m) => {
                            const isMine = m.sender_id === user?.id;
                            return (
                                <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3.5 rounded-2xl max-w-[75%] text-xs shadow-xs ${
                                        isMine
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                                    }`}>
                                        <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-80">
                                            <span className="font-extrabold">{m.sender?.name || 'Administración'}</span>
                                            {m.property && (
                                                <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">
                                                    Depto {m.property.number || m.property.unit_number}
                                                </span>
                                            )}
                                        </div>
                                        {m.subject && <p className="font-black text-[11px] mb-1">{m.subject}</p>}
                                        <p className="whitespace-pre-line leading-relaxed">{m.content}</p>
                                        {m.attachment_path && (
                                            <a
                                                href={`/storage/${m.attachment_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold underline ${isMine ? 'text-indigo-100' : 'text-indigo-500'}`}
                                            >
                                                <Paperclip className="w-3 h-3" /> Ver Adjunto
                                            </a>
                                        )}
                                    </div>
                                    <span className="text-[9px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                                        {new Date(m.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                        {isMine && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Formulario de Envío de Mensajes */}
                <form onSubmit={handleSendMessage} className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {channelType === 'conserjeria_unidad' && (
                            <select
                                value={newMessage.property_id}
                                onChange={(e) => setNewMessage(p => ({ ...p, property_id: e.target.value }))}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white font-bold"
                            >
                                <option value="">Seleccionar Unidad / Depto...</option>
                                {propertiesList.map(p => (
                                    <option key={p.id} value={p.id}>Depto {p.number || p.unit_number} (Torre {p.block || '1'})</option>
                                ))}
                            </select>
                        )}
                        <input
                            type="text"
                            placeholder="Asunto (opcional)..."
                            value={newMessage.subject}
                            onChange={(e) => setNewMessage(p => ({ ...p, subject: e.target.value }))}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-3.5 py-2 text-slate-800 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            required
                            placeholder={`Escribe un mensaje en ${channelType.replace('_', ' ')}...`}
                            value={newMessage.content}
                            onChange={(e) => setNewMessage(p => ({ ...p, content: e.target.value }))}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-4 py-2.5 text-slate-800 dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={isSending}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSending ? 'Enviando...' : 'Enviar'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
