import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Trophy, 
  History, 
  AlertOctagon, 
  Sparkles, 
  ShieldAlert, 
  Calendar,
  RefreshCw,
  PlusCircle,
  X
} from 'lucide-react';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recaidas, setRecaidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [motivoRecaida, setMotivoRecaida] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resStats, resRecaidas] = await Promise.all([
        api.get('/contacto-cero/estadisticas'),
        api.get('/contacto-cero/recaidas'),
      ]);
      setStats(resStats.data);
      setRecaidas(resRecaidas.data);

      if (resStats.data.diasRachaActual > 0 && resStats.data.diasRachaActual % 5 === 0) {
        dispararConfeti();
      }
    } catch (err) {
      console.error('Error cargando métricas de contacto cero', err);
    } finally {
      setLoading(false);
    }
  };

  const dispararConfeti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleRegistrarRecaida = async (e) => {
    e.preventDefault();
    if (!motivoRecaida.trim() || guardando) return;

    setGuardando(true);
    try {
      await api.post('/contacto-cero/recaidas', { motivo: motivoRecaida.trim() });
      setMotivoRecaida('');
      setModalAbierto(false);
      cargarDatos();
      if (user) {
        updateUser({ diasRachaContactoCero: 0 });
      }
    } catch (err) {
      console.error('Error registrando recaída', err);
    } finally {
      setGuardando(false);
    }
  };

  const formatoFecha = (fechaStr) => {
    if (!fechaStr) return '';
    return new Date(fechaStr).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-8 bg-prime-dark">
      {/* Hero Streak Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-prime-card to-slate-900 border border-prime-border p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> PROTOCOLO DE DESAPEGO RADICAL
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Racha de Contacto Cero
            </h1>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Cada segundo sin escribirle ni revisar sus redes es una victoria para tu cerebro. Mantén el firewall emocional activo.
            </p>
          </div>

          {/* Flame Counter Badge */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/40 flex items-center justify-center glow-neon animate-pulse">
                <div className="text-center">
                  <span className="block text-5xl font-black text-white tracking-tighter">
                    {stats?.diasRachaActual ?? 0}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                    DÍAS LIMPIO
                  </span>
                </div>
              </div>
              <Flame className="w-8 h-8 text-emerald-400 absolute -top-2 right-2 animate-bounce" />
            </div>

            <button
              onClick={() => setModalAbierto(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" /> Registrar Recaída
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-prime-card border border-prime-border flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Racha Máxima</p>
            <p className="text-2xl font-bold text-white">{stats?.rachaMaxima ?? 0} días</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-prime-card border border-prime-border flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Total Recaídas</p>
            <p className="text-2xl font-bold text-white">{stats?.totalRecaidas ?? 0}</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-prime-card border border-prime-border flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Inicio de Conteo</p>
            <p className="text-xs font-semibold text-white truncate max-w-[160px]">
              {formatoFecha(stats?.fechaInicioContactoCero) || 'Hoy'}
            </p>
          </div>
        </div>
      </div>

      {/* Relapses History Table */}
      <div className="rounded-2xl bg-prime-card border border-prime-border p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-prime-border pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Historial de Incidentes y Recaídas</span>
          </div>
          <button
            onClick={cargarDatos}
            title="Recargar datos"
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {recaidas.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 py-6 text-center">
            Ninguna recaída registrada hasta ahora. ¡Impecable autocontrol!
          </p>
        ) : (
          <div className="space-y-3">
            {recaidas.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-prime-dark/70 border border-prime-border/80 flex flex-col md:flex-row md:items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm text-slate-200 font-medium">"{r.motivo}"</p>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatoFecha(r.fechaRecaida)}
                  </span>
                </div>
                <span className="self-start md:self-auto text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  Racha reiniciada
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Registrar Recaída */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-prime-card border border-red-500/40 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400 mb-4">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-lg text-white">Registrar Recaída</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Un tropiezo no es una derrota, solo un reinicio estadístico. Sé honesto contigo mismo: ¿qué detonó el impulso de buscar a tu ex?
            </p>

            <form onSubmit={handleRegistrarRecaida} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Motivo o Disparador
                </label>
                <textarea
                  required
                  rows="3"
                  value={motivoRecaida}
                  onChange={(e) => setMotivoRecaida(e.target.value)}
                  placeholder="Ej: Vi una foto suya en una fiesta, escuché nuestra canción, le mandé un mensaje por la noche..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando || !motivoRecaida.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {guardando ? 'Registrando...' : 'Confirmar y Reiniciar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
