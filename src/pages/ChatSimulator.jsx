import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Send, 
  Trash2, 
  MoreVertical, 
  ShieldCheck, 
  HeartCrack, 
  Sparkles, 
  CheckCheck,
  Zap,
  Info
} from 'lucide-react';

export default function ChatSimulator() {
  const { user, updateUser } = useAuth();
  const [chat, setChat] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [inputTexto, setInputTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [escribiendoBot, setEscribiendoBot] = useState(false);
  const [cambiandoModo, setCambiandoModo] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    cargarChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, escribiendoBot]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cargarChat = async () => {
    try {
      const res = await api.get('/chats/CHAT_EX');
      setChat(res.data);
      setMensajes(res.data.mensajes || []);
    } catch (err) {
      console.error('Error cargando chat del simulador', err);
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!inputTexto.trim() || enviando || !chat) return;

    const textoUsuario = inputTexto.trim();
    setInputTexto('');
    setEnviando(true);

    // Mensaje optimista temporal en la UI
    const tempMensajeUsuario = {
      id: Date.now(),
      contenido: textoUsuario,
      remitente: 'USUARIO',
      estado: 'LEIDO',
      fechaEnvio: new Date().toISOString()
    };
    setMensajes((prev) => [...prev, tempMensajeUsuario]);
    setEscribiendoBot(true);

    try {
      const res = await api.post(`/chats/${chat.id}/mensajes`, {
        contenido: textoUsuario
      });

      // El backend devuelve el mensaje generado por el bot (SimuladorExIaService)
      setMensajes((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error al enviar mensaje', err);
    } finally {
      setEnviando(false);
      setEscribiendoBot(false);
    }
  };

  const handleToggleModo = async () => {
    setCambiandoModo(true);
    try {
      const res = await api.patch('/usuarios/modo', { modo: 'RECORDAR' });
      updateUser(res.data);
    } catch (err) {
      console.error('Error al cambiar de modo', err);
    } finally {
      setCambiandoModo(false);
    }
  };

  const handleLimpiarHistorial = async () => {
    if (!chat) return;
    if (!window.confirm('¿Seguro que deseas purgar todo el historial de esta simulación?')) return;

    try {
      await api.delete(`/chats/${chat.id}/mensajes`);
      setMensajes([]);
    } catch (err) {
      console.error('Error purgando historial', err);
    }
  };

  const formatoHora = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-whatsapp-chatbg text-slate-200 select-none relative overflow-hidden">
      {/* WhatsApp Chat Header */}
      <header className="h-16 bg-whatsapp-header border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={user?.fotoPerfilEx || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
              alt="Avatar Ex" 
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/50"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-whatsapp-header absolute bottom-0 right-0"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-wide">{user?.nombreEx || "Mi Ex"}</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                IA SIMULATOR
              </span>
            </div>
            <p className="text-xs text-emerald-400 font-mono">
              {escribiendoBot ? 'escribiendo...' : (user?.estadoWhatsAppEx || 'en línea')}
            </p>
          </div>
        </div>

        
        <div className="flex items-center gap-2.5">

          <button
            onClick={handleLimpiarHistorial}
            title="Purgar historial del chat"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mode Advisory Banner */}
      <div className="bg-prime-dark/90 border-b border-prime-border/40 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            Personalidad: <strong className="text-white">{user?.personalidadEx || 'NOSTALGICA_DISTANTE'}</strong>. 
            Este chat es un muro de contención antes de cometer un error real.
          </span>
        </div>
        <span className="hidden md:inline text-emerald-400/80">PROTECCIÓN ACTIVA</span>
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {/* Subtle WhatsApp-like doodle background opacity */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {mensajes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-3 text-emerald-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Simulador listo para interactuar</p>
            <p className="text-xs max-w-sm mt-1 text-slate-500">
              Escríbele lo que quieras decirle a tu ex. El modelo de Inteligencia Artificial te responderá según su personalidad sin consecuencias en la vida real.
            </p>
          </div>
        )}

        {mensajes.map((m) => {
          const esMio = m.remitente === 'USUARIO';
          return (
            <div
              key={m.id}
              className={`flex ${esMio ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md relative text-sm leading-relaxed ${
                  esMio
                    ? 'bg-whatsapp-bubbleOut text-white rounded-tr-none'
                    : 'bg-whatsapp-bubbleIn text-slate-100 rounded-tl-none border border-slate-700/40'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.contenido}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 select-none">
                  <span>{formatoHora(m.fechaEnvio)}</span>
                  {esMio && <CheckCheck className="w-3.5 h-3.5 text-cyan-400 inline" />}
                </div>
              </div>
            </div>
          );
        })}

        {escribiendoBot && (
          <div className="flex justify-start">
            <div className="bg-whatsapp-bubbleIn border border-slate-700/40 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Bar */}
      <footer className="p-3 bg-whatsapp-header border-t border-slate-800/80 shrink-0 z-10">
        <form onSubmit={handleEnviar} className="flex items-center gap-2">
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Desahógate aquí en lugar de escribirle en la vida real..."
            disabled={enviando}
            className="flex-1 bg-whatsapp-chatbg border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputTexto.trim() || enviando}
            className="w-10 h-10 rounded-xl bg-whatsapp-accent hover:bg-emerald-500 text-black flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
