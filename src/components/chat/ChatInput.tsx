import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

type Props = {
  deshabilitado: boolean;
  onEnviar: (texto: string) => void;
};

export default function ChatInput({ deshabilitado, onEnviar }: Props) {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio || deshabilitado) return;
    setTexto('');
    onEnviar(limpio);
  };

  return (
    <footer className="shrink-0 border-t border-slate-800/80 bg-whatsapp-header p-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Desahógate aquí en lugar de escribirle en la vida real..."
          disabled={deshabilitado}
          className="flex-1 rounded-xl border border-slate-700/60 bg-whatsapp-chatbg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={deshabilitado || !texto.trim()}
          aria-label="Enviar mensaje"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-whatsapp-accent text-black shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-500 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </footer>
  );
}