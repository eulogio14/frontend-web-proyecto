import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import {
  MessageSquare,
  CircleDashed,
  Radio,
  Users,
  Phone,
  Sparkles,
  Settings,
  User,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import EnConstruccion from './EnConstruccion';
import ChatSimulator from '../pages/ChatSimulator';

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
  const location = useLocation();
  const { user, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState('mensajes');
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [tituloAviso, setTituloAviso] = useState('');
  const [chatLista, setChatLista] = useState([]);
  const [chatActual, setChatActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [inputTexto, setInputTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [escribiendoBot, setEscribiendoBot] = useState(false);
  const [vistaMovil, setVistaMovil] = useState('lista');

  React.useEffect(() => {
    if (seccionActiva === 'mensajes') {
      cargarChat();
    }
  }, [seccionActiva]);

  const cargarChat = async () => {
    try {
      const res = await api.get('/chats/CHAT_EX');
      setChatActual(res.data);
      setChatLista([res.data]);
      setMensajes(res.data.mensajes || []);
    } catch (err) {
      console.error('Error cargando chat', err);
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!inputTexto.trim() || enviando || !chatActual) return;
    const textoUsuario = inputTexto.trim();
    setInputTexto('');
    setEnviando(true);
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
      const res = await api.post(`/chats/${chatActual.id}/mensajes`, { contenido: textoUsuario });
      setMensajes((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error al enviar mensaje', err);
    } finally {
      setEnviando(false);
      setEscribiendoBot(false);
    }
  };

  const formatoHora = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClickNav = (item) => {
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
                {chatLista.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setVistaMovil('chat'); }}
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
                        <span className="text-xs text-[#8696a0]">{mensajes.length > 0 ? formatoHora(mensajes[mensajes.length - 1].fechaEnvio) : ''}</span>
                      </div>
                      <p className="text-xs text-[#8696a0] truncate">{mensajes.length > 0 ? mensajes[mensajes.length - 1].contenido : 'Empieza una conversación'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className={`${vistaMovil === 'lista' ? 'hidden md:flex' : 'flex'} flex-1 h-full flex-col bg-[#0b141a] relative`}>
              <header className="h-16 px-4 flex items-center gap-3 bg-[#1f2c33] border-b border-[#2a3942]">
                <button onClick={() => setVistaMovil('lista')} className="md:hidden text-[#aebac1]">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={user?.fotoPerfilEx || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-white text-sm">{user?.nombreEx || 'Mi Ex'}</p>
                  <p className="text-xs text-[#8696a0]">{escribiendoBot ? 'esperando respuesta...' : (user?.estadoWhatsAppEx || 'en línea')}</p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23182229" fill-opacity="0.4"%3E%3Ccircle cx="50" cy="50" r="2"/%3E%3Ccircle cx="150" cy="100" r="2"/%3E%3Ccircle cx="250" cy="80" r="2"/%3E%3Ccircle cx="350" cy="150" r="2"/%3E%3Ccircle cx="100" cy="200" r="2"/%3E%3Ccircle cx="200" cy="250" r="2"/%3E%3Ccircle cx="300" cy="220" r="2"/%3E%3Ccircle cx="150" cy="320" r="2"/%3E%3Ccircle cx="350" cy="300" r="2"/%3E%3C/g%3E%3C/svg%3E")' }}>
                {mensajes.map((m) => {
                  const esMio = m.remitente === 'USUARIO';
                  return (
                    <div key={m.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-1.5 rounded-lg text-sm ${esMio ? 'bg-[#005c4b]' : 'bg-[#202c33]'} text-white`}>
                        <p className="whitespace-pre-wrap break-words">{m.contenido}</p>
                        <p className="text-[10px] text-[#8696a0] text-right mt-0.5">{formatoHora(m.fechaEnvio)}</p>
                      </div>
                    </div>
                  );
                })}
                {escribiendoBot && (
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] px-4 py-2 rounded-lg flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce"></span>
                      <span className="w-1.5 h-1.tag h-1.5 rounded-full bg-[#8696a0] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleEnviar} className="h-16 px-3 flex items-center gap-2 bg-[#1f2c33]">
                <input
                  type="text"
                  value={inputTexto}
                  onChange={(e) => setInputTexto(e.target.value)}
                  placeholder="Escribe un mensaje"
                  disabled={enviando}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#2a3942] text-sm text-white placeholder-[#8696a0] focus:outline-none"
                />
                <button type="submit" disabled={!inputTexto.trim() || enviando} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00a884] disabled:opacity-50">
                  <MessageSquare className="w-5 h-5 text-black" />
                </button>
              </form>
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
