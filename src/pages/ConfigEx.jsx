import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserCog, 
  Save, 
  Sparkles, 
  Bot, 
  Smile, 
  Check, 
  AlertCircle,
  Cpu,
  FileText,
  Terminal,
  CheckCircle2
} from 'lucide-react';

export default function ConfigEx() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    nombreEx: '',
    apodoEx: '',
    fotoPerfilEx: '',
    estadoWhatsAppEx: 'en línea',
    personalidadEx: 'NOSTALGICA_DISTANTE',
    fechaRuptura: '',
  });

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Estado para el Dataset de Chat (Inspirado en JustZando)
  const [chatExportado, setChatExportado] = useState('');
  const [nombreRemitente, setNombreRemitente] = useState('');
  const [entrenando, setEntrenando] = useState(false);
  const [analisisResultado, setAnalisisResultado] = useState(null);
  const [errorDataset, setErrorDataset] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        nombreEx: user.nombreEx || '',
        apodoEx: user.apodoEx || '',
        fotoPerfilEx: user.fotoPerfilEx || '',
        estadoWhatsAppEx: user.estadoWhatsAppEx || 'en línea',
        personalidadEx: user.personalidadEx || 'NOSTALGICA_DISTANTE',
        fechaRuptura: user.fechaRuptura || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensajeExito(false);

    try {
      const res = await api.put('/usuarios/config-ex', form);
      updateUser(res.data);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
    } catch (err) {
      console.error('Error actualizando perfil del ex', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEntrenarDataset = async (e) => {
    e.preventDefault();
    if (!chatExportado.trim() || entrenando) return;

    setEntrenando(true);
    setErrorDataset('');
    setAnalisisResultado(null);

    try {
      const res = await api.post('/usuarios/ex-dataset', {
        contenidoChat: chatExportado,
        nombreRemitenteEx: nombreRemitente.trim() || form.nombreEx || 'Ex'
      });
      setAnalisisResultado(res.data);
    } catch (err) {
      console.error('Error entrenando dataset', err);
      setErrorDataset(err.response?.data?.message || 'Error al procesar el dataset de chat');
    } finally {
      setEntrenando(false);
    }
  };

  const personalidades = [
    {
      id: 'NOSTALGICA_DISTANTE',
      titulo: 'Nostálgica pero Distante',
      desc: 'Respuestas cortas, recuerda momentos pero marca distancia fría.',
    },
    {
      id: 'FRIA',
      titulo: 'Fría / Tajante',
      desc: 'Monosílabos, desinterés radical ("ok", "estoy ocupada", "no me busques").',
    },
    {
      id: 'TOXICA',
      titulo: 'Tóxica / Gaslighting',
      desc: 'Invierte culpas, manipula y genera dudas sobre tu cordura.',
    },
    {
      id: 'CARIÑOSA',
      titulo: 'Cariñosa Confusa (Peligro)',
      desc: 'Mantiene la ilusión de afecto para no soltarte pero sin comprometerse.',
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6 bg-prime-dark max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <UserCog className="w-6 h-6 text-emerald-400" />
          Ajustes del Simulador de la Expareja
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configura cómo luce el clon de WhatsApp y el comportamiento del modelo de IA
        </p>
      </div>

      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>Configuración actualizada. El simulador de chat reflejará estos cambios de inmediato.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visual appearance */}
        <div className="p-6 rounded-2xl bg-prime-card border border-prime-border space-y-4">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Smile className="w-4 h-4 text-emerald-400" />
            Apariencia en WhatsApp Web
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
            <img
              src={form.fotoPerfilEx || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt="Preview Ex"
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/50 shadow-md"
            />
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  URL de la Foto de Perfil
                </label>
                <input
                  type="url"
                  value={form.fotoPerfilEx}
                  onChange={(e) => setForm({ ...form, fotoPerfilEx: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Nombre Mostrado
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombreEx}
                    onChange={(e) => setForm({ ...form, nombreEx: e.target.value })}
                    placeholder="Ej: Camila, Mi Ex..."
                    className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Estado de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={form.estadoWhatsAppEx}
                    onChange={(e) => setForm({ ...form, estadoWhatsAppEx: e.target.value })}
                    placeholder="en línea, disponible, escribiendo..."
                    className="w-full bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Personality Selector */}
        <div className="p-6 rounded-2xl bg-prime-card border border-prime-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              Modelo de Personalidad IA
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              PYTORCH / HEURÍSTICA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {personalidades.map((p) => (
              <div
                key={p.id}
                onClick={() => setForm({ ...form, personalidadEx: p.id })}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  form.personalidadEx === p.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm glow-neon'
                    : 'bg-prime-dark/70 border-prime-border text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{p.titulo}</span>
                    {form.personalidadEx === p.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {guardando ? 'Guardando ajustes...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>

      {/* Dataset Training Section (Inspirado en JustZando) */}
      <div className="p-6 rounded-2xl bg-prime-card border border-cyan-500/30 space-y-5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-prime-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                ENTRENAR CLON CON EXPORTACIÓN DE CHAT
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  NLP JUSTZANDO
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pega el historial exportado de WhatsApp o Instagram para clonar su estilo, modismos y emojis
              </p>
            </div>
          </div>
        </div>

        {errorDataset && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorDataset}</span>
          </div>
        )}

        <form onSubmit={handleEntrenarDataset} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Nombre o alias del Ex en el chat exportado (Opcional)
            </label>
            <input
              type="text"
              value={nombreRemitente}
              onChange={(e) => setNombreRemitente(e.target.value)}
              placeholder="Ej: Camila, Mi Niña, 51987654321..."
              className="w-full max-w-sm bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
              <span>Contenido del Chat (Exportación de WhatsApp sin archivos)</span>
              <span className="text-[10px] text-slate-500">Mínimo unas pocas líneas</span>
            </label>
            <textarea
              rows={6}
              required
              value={chatExportado}
              onChange={(e) => setChatExportado(e.target.value)}
              placeholder="[12/03/24, 10:15:30] Camila: hola que haces?&#10;[12/03/24, 10:16:01] Yo: nada y tu?&#10;[12/03/24, 10:16:45] Camila: nada jaja aburrida 🙄..."
              className="w-full bg-prime-dark border border-prime-border rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-y"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={entrenando || !chatExportado.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              {entrenando ? 'Analizando modismos y emojis...' : 'Procesar y Sintonizar Clon'}
            </button>
          </div>
        </form>

        {/* Dataset NLP Results */}
        {analisisResultado && (
          <div className="mt-5 p-5 rounded-2xl bg-prime-dark/90 border border-cyan-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {analisisResultado.mensaje || 'Dataset procesado con éxito'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TONO: {analisisResultado.tonoDetectado || 'CALIBRADO'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-prime-card border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Líneas</p>
                <p className="text-lg font-bold text-white font-mono mt-1">{analisisResultado.totalLineasProcesadas}</p>
              </div>
              <div className="p-3 rounded-xl bg-prime-card border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Mensajes Ex</p>
                <p className="text-lg font-bold text-cyan-400 font-mono mt-1">{analisisResultado.totalMensajesEx}</p>
              </div>
              <div className="p-3 rounded-xl bg-prime-card border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Tus Mensajes</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">{analisisResultado.totalMensajesUsuario}</p>
              </div>
              <div className="p-3 rounded-xl bg-prime-card border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Longitud Promedio</p>
                <p className="text-lg font-bold text-purple-400 font-mono mt-1">
                  {typeof analisisResultado.longitudPromedioMensajeEx === 'number' 
                    ? analisisResultado.longitudPromedioMensajeEx.toFixed(1) 
                    : analisisResultado.longitudPromedioMensajeEx} car.
                </p>
              </div>
            </div>

            {analisisResultado.emojisFrecuentes && analisisResultado.emojisFrecuentes.length > 0 && (
              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">Emojis Más Detectados:</p>
                <div className="flex flex-wrap gap-2">
                  {analisisResultado.emojisFrecuentes.map((em, idx) => (
                    <span key={idx} className="text-base px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                      {em}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analisisResultado.frasesFrecuentesEx && analisisResultado.frasesFrecuentesEx.length > 0 && (
              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">Vocabulario y Modismos Asimilados:</p>
                <div className="flex flex-wrap gap-1.5">
                  {analisisResultado.frasesFrecuentesEx.map((frase, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                      "{frase}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
