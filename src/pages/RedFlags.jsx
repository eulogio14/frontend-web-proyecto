import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Flag, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Skull, 
  ShieldAlert, 
  X,
  Flame
} from 'lucide-react';

export default function RedFlags() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    gravedad: 3,
  });

  useEffect(() => {
    cargarFlags();
  }, []);

  const cargarFlags = async () => {
    setLoading(true);
    try {
      const res = await api.get('/red-flags');
      setFlags(res.data);
    } catch (err) {
      console.error('Error cargando red flags', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearFlag = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || guardando) return;

    setGuardando(true);
    try {
      const res = await api.post('/red-flags', form);
      setFlags([res.data, ...flags]);
      setForm({ titulo: '', descripcion: '', gravedad: 3 });
      setModalAbierto(false);
    } catch (err) {
      console.error('Error creando red flag', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta Red Flag?')) return;
    try {
      await api.delete(`/red-flags/${id}`);
      setFlags(flags.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Error eliminando red flag', err);
    }
  };

  const getGravedadBadge = (gravedad) => {
    if (gravedad >= 5) {
      return {
        label: 'Nivel 5: Toxicidad Nuclear',
        classes: 'bg-red-500/20 text-red-400 border-red-500/50 glow-crimson',
        icon: Skull,
      };
    }
    if (gravedad >= 3) {
      return {
        label: `Nivel ${gravedad}: Falta de Respeto`,
        classes: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
        icon: AlertTriangle,
      };
    }
    return {
      label: `Nivel ${gravedad}: Fricción Menor`,
      classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      icon: Flag,
    };
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6 bg-prime-dark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Flag className="w-6 h-6 text-red-500" />
            Muro de Red Flags
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Lista de conductas tóxicas para desarmar la idealización romántica
          </p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Registrar Red Flag
        </button>
      </div>

      {/* Advisory */}
      <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Regla de supervivencia:</strong> El cerebro humano tiende a recordar selectivamente los momentos felices y olvidar las humillaciones. Consulta esta lista cada vez que sientas tentación de llamar a tu ex.
        </p>
      </div>

      {/* Flags List */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-500">
          Cargando advertencias...
        </div>
      ) : flags.length === 0 ? (
        <div className="py-24 text-center rounded-2xl border border-dashed border-prime-border p-8">
          <Flag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No tienes Red Flags registradas</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            ¿Por qué terminaron? Anota las actitudes hirientes antes de que la nostalgia te haga creer que todo era perfecto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flags.map((f) => {
            const badge = getGravedadBadge(f.gravedad);
            const Icon = badge.icon;
            return (
              <div
                key={f.id}
                className="rounded-2xl bg-prime-card border border-prime-border p-5 flex flex-col justify-between space-y-3 hover:border-red-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${badge.classes}`}>
                      <Icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <button
                      onClick={() => handleEliminar(f.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Eliminar Red Flag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{f.titulo}</h3>
                  {f.descripcion && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {f.descripcion}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 pt-2 border-t border-prime-border/50">
                  <span>Gravedad asignada:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= f.gravedad ? 'bg-red-500' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nueva Red Flag */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-prime-card border border-red-500/40 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-500" />
              Registrar Red Flag
            </h3>

            <form onSubmit={handleCrearFlag} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Actitud o Suceso Tóxico
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Gaslighting, celos injustificados, mentiras..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Nivel de Gravedad (1 al 5)
                </label>
                <div className="flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setForm({ ...form, gravedad: num })}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        form.gravedad === num
                          ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20'
                          : 'bg-prime-dark border-prime-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1 text-center">
                  1 = Molestia leve | 5 = Toxicidad destructiva
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Descripción o Anécdota (Opcional)
                </label>
                <textarea
                  rows="3"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Recuerda exactamente qué pasó para no repetirlo..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all resize-none leading-relaxed"
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
                  disabled={guardando || !form.titulo.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {guardando ? 'Guardando...' : 'Guardar Red Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
