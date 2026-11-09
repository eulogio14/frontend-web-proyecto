import { CheckCheck } from 'lucide-react';
import type { Mensaje } from '../../services/chatService';

type Props = {
  mensaje: Mensaje;
};

const formatearHora = (fecha: string) =>
  new Date(fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function MessageBubble({ mensaje }: Props) {
  const esMio = mensaje.remitente === 'USUARIO';

  return (
    <div className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md md:max-w-[70%] ${
          esMio
            ? 'rounded-tr-none bg-whatsapp-bubbleOut text-white'
            : 'rounded-tl-none border border-slate-700/40 bg-whatsapp-bubbleIn text-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{mensaje.contenido}</p>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
          <span>{formatearHora(mensaje.timestamp)}</span>
          {esMio && <CheckCheck className="h-3.5 w-3.5 text-cyan-400" />}
        </div>
      </div>
    </div>
  );
}