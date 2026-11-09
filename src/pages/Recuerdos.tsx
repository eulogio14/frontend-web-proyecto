import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Heart, 
  Calendar, 
  Sparkles, 
  X,
  Flame
} from 'lucide-react';

export default function Recuerdos() {
  const [recuerdos, setRecuerdos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    urlFoto: '',
    fechaRecuerdo: '',
    nivelNostalgia: 3,
    tipo: 'FOTO'
  });

  useEffect(() => {
    cargarRecuerdos();
  }, []);

  const cargarRecuerdos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recuerdos');
      setRecuerdos(res.data);
    } catch (err) {
      console.error('Error cargando recuerdos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearRecuerdo = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || guardando) return;

    setGuardando(true);
    try {
      const res = await api.post('/recuerdos', form);
      setRecuerdos([res.data, ...recuerdos]);
      setForm({
        titulo: '',
        descripcion: '',
        urlFoto: '',
        fechaRecuerdo: '',
        nivelNostalgia: 3,
        tipo: 'FOTO'
      });
      setModalAbierto(false);
    } catch (err) {
      console.error('Error creando recuerdo', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Deseas archivar/eliminar este recuerdo?')) return;
    try {
      await api.delete(`/recuerdos/${id}`);
      setRecuerdos(recuerdos.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error eliminando recuerdo', err);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6 bg-prime-dark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-purple-400" />
            Galería de Recuerdos & Memorabilia
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Espacio de exposición controlada para procesar el pasado sin idealizarlo
          </p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Añadir Recuerdo
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-500">
          Cargando archivos del pasado...
        </div>
      ) : recuerdos.length === 0 ? (
        <div className="py-24 text-center rounded-2xl border border-dashed border-prime-border p-8">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Galería limpia de nostalgia</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Si tienes fotos o recuerdos que aún te duelen, puedes encapsularlos aquí con su nivel de nostalgia para medir tu progreso de desapego.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recuerdos.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-prime-card border border-prime-border overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-md group"
            >
              {r.urlFoto && (
                <div className="h-48 w-full bg-slate-950 overflow-hidden relative">
                  <img
                    src={r.urlFoto}
                    alt={r.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-purple-300 border border-purple-500/40 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                    <span>Nostalgia: {r.nivelNostalgia}/5</span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {r.tipo}
                    </span>
                    <button
                      onClick={() => handleEliminar(r.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Eliminar recuerdo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{r.titulo}</h3>
                  {r.descripcion && (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {r.descripcion}
                    </p>
                  )}
                </div>

                {r.fechaRecuerdo && (
                  <div className="pt-3 border-t border-prime-border/60 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>Ocurrió: {r.fechaRecuerdo}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-prime-card border border-purple-500/40 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Guardar Recuerdo
            </h3>

            <form onSubmit={handleCrearRecuerdo} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Título del Recuerdo
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Viaje a Cieneguilla, Aniversario..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  URL de la Fotografía
                </label>
                <input
                  type="url"
                  value={form.urlFoto}
                  onChange={(e) => setForm({ ...form, urlFoto: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Fecha aproximada
                  </label>
                  <input
                    type="date"
                    value={form.fechaRecuerdo}
                    onChange={(e) => setForm({ ...form, fechaRecuerdo: e.target.value })}
                    className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Nivel Nostalgia (1-5)
                  </label>
                  <select
                    value={form.nivelNostalgia}
                    onChange={(e) => setForm({ ...form, nivelNostalgia: Number(e.target.value) })}
                    className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value={1}>1 - Casi superado</option>
                    <option value={2}>2 - Leve melancolía</option>
                    <option value={3}>3 - Nostalgia media</option>
                    <option value={4}>4 - Aún duele</option>
                    <option value={5}>5 - Golpe crítico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Notas sobre el Recuerdo (Opcional)
                </label>
                <textarea
                  rows="3"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="¿Qué significó para ti en ese entonces?..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all resize-none leading-relaxed"
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {guardando ? 'Guardando...' : 'Guardar Recuerdo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
