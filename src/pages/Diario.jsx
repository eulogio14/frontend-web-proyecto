import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  BookHeart, 
  Plus, 
  Trash2, 
  Smile, 
  Frown, 
  Flame, 
  Zap, 
  X,
  Calendar
} from 'lucide-react';

export default function Diario() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    estadoAnimo: 'EN_PAZ',
  });

  const estadosAnimo = [
    { id: 'EN_PAZ', label: 'En Paz', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Smile },
    { id: 'MOTIVADO', label: 'Motivado', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', icon: Zap },
    { id: 'TRISTE', label: 'Nostálgico', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Frown },
    { id: 'ENOJADO', label: 'Frustrado', color: 'bg-red-500/20 text-red-300 border-red-500/40', icon: Flame },
  ];

  useEffect(() => {
    cargarEntradas();
  }, []);

  const cargarEntradas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/diarios');
      setEntradas(res.data);
    } catch (err) {
      console.error('Error cargando diario', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearEntrada = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim() || guardando) return;

    setGuardando(true);
    try {
      const res = await api.post('/diarios', form);
      setEntradas([res.data, ...entradas]);
      setForm({ titulo: '', contenido: '', estadoAnimo: 'EN_PAZ' });
      setModalAbierto(false);
    } catch (err) {
      console.error('Error creando entrada', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Deseas eliminar permanentemente esta entrada de tu diario?')) return;
    try {
      await api.delete(`/diarios/${id}`);
      setEntradas(entradas.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error eliminando entrada', err);
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
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6 bg-prime-dark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookHeart className="w-6 h-6 text-emerald-400" />
            Diario Emocional Catártico
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Espacio confidencial para vaciar pensamientos y evitar escribirle
          </p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Nueva Entrada
        </button>
      </div>

      {/* Entries Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-500">
          Cargando reflexiones...
        </div>
      ) : entradas.length === 0 ? (
        <div className="py-24 text-center rounded-2xl border border-dashed border-prime-border p-8">
          <BookHeart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Tu diario está en blanco</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Escribir tus emociones reduce la compulsión de romper el contacto cero. Crea tu primera reflexión.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entradas.map((e) => {
            const estado = estadosAnimo.find((a) => a.id === e.estadoAnimo) || estadosAnimo[0];
            return (
              <div
                key={e.id}
                className="rounded-2xl bg-prime-card border border-prime-border p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${estado.color}`}>
                      {estado.label}
                    </span>
                    <button
                      onClick={() => handleEliminar(e.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Eliminar entrada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{e.titulo}</h3>
                  <p className="text-xs text-slate-300 mt-2 whitespace-pre-wrap line-clamp-6 leading-relaxed">
                    {e.contenido}
                  </p>
                </div>

                <div className="pt-3 border-t border-prime-border/60 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>{formatoFecha(e.fechaCreacion)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nueva Entrada */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-prime-card border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <BookHeart className="w-5 h-5 text-emerald-400" />
              Escribir en el Diario
            </h3>

            <form onSubmit={handleCrearEntrada} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Título de la Entrada
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Día 14: Sentí ganas de revisar su perfil..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  ¿Cómo te sientes en este momento?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {estadosAnimo.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setForm({ ...form, estadoAnimo: a.id })}
                      className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                        form.estadoAnimo === a.id
                          ? `${a.color} font-bold shadow-sm`
                          : 'bg-prime-dark border-prime-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Reflexión / Desahogo
                </label>
                <textarea
                  required
                  rows="6"
                  value={form.contenido}
                  onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                  placeholder="Expresa lo que sientes sin filtros. Nadie más verá esto..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all resize-none leading-relaxed"
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
                  disabled={guardando || !form.titulo.trim() || !form.contenido.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {guardando ? 'Guardando...' : 'Guardar Reflexión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
