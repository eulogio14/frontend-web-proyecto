import { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ConfigExModal from './ConfigExModal';

type Props = {
  estadoTexto: string;
  onLimpiar: () => void;
};

const FOTO_POR_DEFECTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

export default function ChatHeader({ estadoTexto, onLimpiar }: Props) {
  const { user } = useAuth();
  const [configAbierto, setConfigAbierto] = useState(false);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-whatsapp-header px-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.fotoPerfilEx || FOTO_POR_DEFECTO}
              alt={`Foto de ${user?.nombreEx ?? 'tu ex'}`}
              className="h-10 w-10 rounded-full border border-emerald-500/50 object-cover"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-whatsapp-header bg-emerald-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">{user?.nombreEx ?? 'Mi ex'}</h2>
              <span className="rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] text-slate-400">
                IA SIMULATOR
              </span>
            </div>
            <p className="font-mono text-xs text-emerald-400">{estadoTexto}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setConfigAbierto(true)}
            title="Configurar ex"
            aria-label="Configurar ex"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700/40 hover:text-slate-200"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onLimpiar}
            title="Purgar historial del chat"
            aria-label="Purgar historial del chat"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>
      {configAbierto && <ConfigExModal onCerrar={() => setConfigAbierto(false)} />}
    </>
  );
}