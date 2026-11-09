import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { Mensaje } from '../../services/chatService';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator.tsx';

type Props = {
  mensajes: Mensaje[];
  mostrarEscribiendo: boolean;
};

export default function MessageList({ mensajes, mostrarEscribiendo }: Props) {
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, mostrarEscribiendo]);

  if (mensajes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-slate-500">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/60 text-emerald-400">
          <Sparkles className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-slate-300">Simulador listo para interactuar</p>
        <p className="mt-1 max-w-sm text-xs">
          Escríbele lo que quieras decirle a tu ex. Te responderá según su personalidad, sin consecuencias en la vida real.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {mensajes.map((m) => (
        <MessageBubble key={m.id} mensaje={m} />
      ))}
      {mostrarEscribiendo && <TypingIndicator />}
      <div ref={finRef} />
    </div>
  );
}