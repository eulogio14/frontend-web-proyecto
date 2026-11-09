import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { obtenerChatEx, type Mensaje } from '../services/chatService';
import {
  MessageSquare,
  CircleDashed,
  Radio,
  Users,
  Phone,
  Sparkles,
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import EnConstruccion from './EnConstruccion';
import ChatWindow from './chat/ChatWindow';

const NAV_ITEMS = [
  { id: 'mensajes', icon: MessageSquare, label: 'Mensajes', ruta: '/mensajes', activo: true },
  { id: 'estados', icon: CircleDashed, label: 'Estados', ruta: null, activo: false },
  { id: 'canales', icon: Radio, label: 'Canales', ruta: null, activo: false },
  { id: 'comunidades', icon: Users, label: 'Comunidades', ruta: null, activo: false },
  { id: 'llamadas', icon: Phone, label: 'Llamadas', ruta: null, activo: false },
  { id: 'meta-ai', icon: Sparkles, label: 'Meta AI', ruta: null, activo: false },
];

export default function LayoutWhatsApp() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState('mensajes');
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [tituloAviso, setTituloAviso] = useState('');
  const [vistaMovil, setVistaMovil] = useState<'lista' | 'chat'>('lista');
  const [preview, setPreview] = useState<Mensaje | null>(null);

  useEffect(() => {
    if (seccionActiva === 'mensajes') {
      obtenerChatEx()
        .then((data) => {
          const msgs = data.mensajes ?? [];
          setPreview(msgs.length > 0 ? msgs[msgs.length - 1] : null);
        })
        .catch(() => {});
    }
  }, [seccionActiva, vistaMovil]);

  const formatoHora = (valor: string) => {
    if (!valor) return '';
    const fecha = new Date(valor);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClickNav = (item: { id: string; activo: boolean; ruta: string | null; label: string }) => {
    if (item.activo && item.ruta) {
      setSeccionActiva(item.id);
      setMostrarAviso(false);
      setVistaMovil('lista');
      return;
    }
    setSeccionActiva(item.id);
    setMostrarAviso(true);
    setTituloAviso(item.label);
  };

  const handleVolverMensajes = () => {
    setSeccionActiva('mensajes');
    setMostrarAviso(false);
    setVistaMovil('lista');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const inicial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';

  return (
    <div className="h-screen w-screen flex bg-[#0b141a] text-white overflow-hidden">
      {/* Barra lateral iconos */}
      <aside className="w-[60px] h-full bg-[#1f2c33] border-r border-[#2a3942] flex flex-col items-center py-2 justify-between">
        <div className="flex flex-col items-center gap-1 w-full">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const activo = seccionActiva === item.id && item.activo && !mostrarAviso;
            return (
              <button
                key={item.id}
                onClick={() => handleClickNav(item)}
                title={item.label}
                aria-label={item.label}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  activo ? 'bg-[#2a3942] text-[#00a884]' : 'text-[#aebac1] hover:bg-[#2a3942]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-1 mb-2 w-full">
          <button
            onClick={() => { setSeccionActiva('config'); setMostrarAviso(true); setTituloAviso('Configuración'); }}
            title="Configuración"
            aria-label="Configuración"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#aebac1] hover:bg-[#2a3942]"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/perfil')}
            title="Perfil"
            aria-label="Perfil"
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          >
            {user?.fotoPerfil ? (
              <img src={user.fotoPerfil} alt="perfil" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-black font-semibold">
                {inicial}
              </div>
            )}
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#aebac1] hover:bg-[#2a3942]"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Panel principal */}
      <div className="flex-1 flex h-full">
        {seccionActiva === 'mensajes' && !mostrarAviso ? (
          <>
            {/* Lista de chats */}
            <div className={`${vistaMovil === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-[35%] lg:w-[30%] h-full flex-col bg-[#111b21] border-r border-[#2a3942]`}>
              <header className="h-16 px-4 flex items-center justify-between bg-[#1f2c33]">
                <div className="text-white font-medium">Chats</div>
              </header>
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Buscar o empezar un chat"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#2a3942] text-sm text-white placeholder-[#8696a0] focus:outline-none"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                <button
                  onClick={() => setVistaMovil('chat')}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#2a3942]"
                >
                  <img
                    src={user?.fotoPerfilEx || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm truncate">{user?.nombreEx || 'Mi Ex'}</p>
                      <span className="text-xs text-[#8696a0]">{preview ? formatoHora(preview.timestamp) : ''}</span>
                    </div>
                    <p className="text-xs text-[#8696a0] truncate">{preview?.contenido ?? 'Empieza una conversación'}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Chat panel */}
            <div className={`${vistaMovil === 'lista' ? 'hidden md:flex' : 'flex'} flex-1 h-full flex-col`}>
              <div className="md:hidden h-10 px-2 flex items-center bg-[#1f2c33] border-b border-[#2a3942]">
                <button onClick={() => setVistaMovil('lista')} className="text-[#aebac1] p-1" aria-label="Volver a la lista">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ChatWindow />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 h-full">
            <EnConstruccion titulo={tituloAviso || seccionActiva} onVolver={handleVolverMensajes} />
          </div>
        )}
      </div>
    </div>
  );
}
