import { useChat } from '../../hooks/useChat';
import ChatHeader from './ChatHeader';
import ChatBanner from './ChatBanner';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatWindow() {
  const { mensajes, enviando, error, esperandoRespuesta, enviar, limpiar } = useChat();

  const estadoTexto = enviando
    ? 'escribiendo...'
    : esperandoRespuesta
      ? 'esperando respuesta...'
      : 'en línea';

  const handleLimpiar = () => {
    if (window.confirm('¿Seguro que deseas purgar todo el historial de esta simulación?')) {
      limpiar();
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-whatsapp-chatbg text-slate-200">
      <ChatHeader estadoTexto={estadoTexto} onLimpiar={handleLimpiar} />
      <ChatBanner />
      <MessageList mensajes={mensajes} mostrarEscribiendo={enviando} />
      {error && <p className="px-4 py-1 text-xs text-red-400">{error}</p>}
      <ChatInput deshabilitado={enviando} onEnviar={enviar} />
    </div>
  );
}