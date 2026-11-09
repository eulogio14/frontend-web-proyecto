import { Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ChatBanner() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between border-b border-prime-border/40 bg-prime-dark/90 px-4 py-1.5 font-mono text-[11px] text-slate-400">
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
        <span>
          Personalidad: <strong className="text-white">{user?.personalidadEx ?? '—'}</strong>.
          Este chat es un muro de contención antes de cometer un error real.
        </span>
      </div>
      <span className="hidden text-emerald-400/80 md:inline">PROTECCIÓN ACTIVA</span>
    </div>
  );
}