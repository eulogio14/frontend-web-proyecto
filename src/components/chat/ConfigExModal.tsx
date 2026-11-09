import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Save, Terminal, CheckCircle2, AlertCircle, Upload, ImagePlus, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

type Props = { onCerrar: () => void };

type Tab = 'perfil' | 'entrenamiento';

type AnalisisDataset = {
  mensaje?: string;
  tonoDetectado?: string;
  totalLineasProcesadas?: number;
  totalMensajesEx?: number;
  totalMensajesUsuario?: number;
  longitudPromedioMensajeEx?: number;
  emojisFrecuentes?: string[];
  frasesFrecuentesEx?: string[];
};

type ResultadoOcr = {
  mensaje?: string;
  tonoDetectado?: string;
  imagenesProcesadas?: number;
  mensajesNuevos?: number;
  mensajesDuplicados?: number;
  totalMensajesDataset?: number;
  totalMensajesEx?: number;
  longitudPromedioMensajeEx?: number;
  erroresOcr?: string[];
};

export default function ConfigExModal({ onCerrar }: Props) {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>('perfil');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Perfil
  const [nombreEx, setNombreEx] = useState(user?.nombreEx ?? '');
  const [fotoPerfilEx, setFotoPerfilEx] = useState(user?.fotoPerfilEx ?? '');
  const [fotoModo, setFotoModo] = useState<'archivo' | 'url'>('url');
  const [guardando, setGuardando] = useState(false);
  const [msgPerfil, setMsgPerfil] = useState('');

  // Entrenamiento - texto
  const [chatExportado, setChatExportado] = useState('');
  const [aliasTexto, setAliasTexto] = useState('');
  const [procesandoTexto, setProcesandoTexto] = useState(false);
  const [resultadoTexto, setResultadoTexto] = useState<AnalisisDataset | null>(null);
  const [errorTexto, setErrorTexto] = useState('');

  // Entrenamiento - OCR
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [aliasOcr, setAliasOcr] = useState('');
  const [procesandoOcr, setProcesandoOcr] = useState(false);
  const [resultadoOcr, setResultadoOcr] = useState<ResultadoOcr | null>(null);
  const [errorOcr, setErrorOcr] = useState('');
  const inputOcrRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCerrar]);

  useEffect(() => {
    setNombreEx(user?.nombreEx ?? '');
    setFotoPerfilEx(user?.fotoPerfilEx ?? '');
  }, [user?.nombreEx, user?.fotoPerfilEx]);

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onCerrar();
  };

  const handleArchivoFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setFotoPerfilEx(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const guardarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombreEx.trim()) return;
    setGuardando(true);
    setMsgPerfil('');
    try {
      const payload = {
        nombreEx: nombreEx.trim(),
        apodoEx: (user?.apodoEx as string) || '',
        fotoPerfilEx,
        estadoWhatsAppEx: (user?.estadoWhatsAppEx as string) || '',
        personalidadEx: (user?.personalidadEx as string) || '',
        fechaRuptura: (user?.fechaRuptura as string) || '',
      };
      const res = await api.put('/usuarios/config-ex', payload);
      updateUser(res.data);
      setMsgPerfil('Guardado');
      setTimeout(() => setMsgPerfil(''), 2500);
    } catch {
      setMsgPerfil('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const procesarTexto = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatExportado.trim() || procesandoTexto) return;
    setProcesandoTexto(true);
    setErrorTexto('');
    setResultadoTexto(null);
    try {
      const res = await api.post('/usuarios/ex-dataset', {
        contenidoChat: chatExportado,
        nombreRemitenteEx: aliasTexto.trim() || nombreEx.trim() || 'Ex',
      });
      setResultadoTexto(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setErrorTexto(e.response?.data?.message || 'Error al procesar el chat');
    } finally {
      setProcesandoTexto(false);
    }
  };

  const agregarImagenes = (files: FileList | null) => {
    if (!files) return;
    const lista = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setImagenes((prev) => [...prev, ...lista].slice(0, 25));
    setResultadoOcr(null);
    setErrorOcr('');
  };

  const procesarOcr = async (e: FormEvent) => {
    e.preventDefault();
    if (imagenes.length === 0 || procesandoOcr) return;
    setProcesandoOcr(true);
    setErrorOcr('');
    setResultadoOcr(null);
    const formData = new FormData();
    imagenes.forEach((img) => formData.append('imagenes', img));
    if (aliasOcr.trim() || nombreEx.trim()) {
      formData.append('nombreRemitenteEx', aliasOcr.trim() || nombreEx.trim());
    }
    try {
      const res = await api.post('/usuarios/ex-dataset/imagenes', formData);
      setResultadoOcr(res.data);
      try {
        const perfil = await api.get('/usuarios/perfil');
        updateUser(perfil.data);
      } catch {
        /* no crítico */
      }
    } catch (err: unknown) {
      const ex = err as { response?: { status?: number; data?: { message?: string; error?: string } }; message?: string };
      const detalle = ex.response?.data?.message || ex.response?.data?.error || ex.message || 'Error';
      setErrorOcr(`No se pudieron procesar las imágenes: ${detalle}`);
    } finally {
      setProcesandoOcr(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-prime-border bg-prime-dark shadow-xl">
        <div className="flex items-center justify-between border-b border-prime-border px-4 py-3 sticky top-0 bg-prime-dark z-10">
          <h2 className="text-sm font-semibold text-white">Configurar simulador</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700/40 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-prime-border px-4">
          {(['perfil', 'entrenamiento'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'perfil' ? 'Perfil' : 'Entrenamiento'}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'perfil' && (
            <form onSubmit={guardarPerfil} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Nombre mostrado</label>
                <input
                  type="text"
                  required
                  value={nombreEx}
                  onChange={(e) => setNombreEx(e.target.value)}
                  className="w-full rounded-xl border border-prime-border bg-prime-card px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Foto de perfil</label>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={fotoPerfilEx || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Vista previa"
                    className="h-14 w-14 rounded-full border border-emerald-500/40 object-cover"
                  />
                  <div className="flex gap-2 text-xs">
                    <button type="button" onClick={() => setFotoModo('archivo')} className={`px-2 py-1 rounded border ${fotoModo === 'archivo' ? 'border-emerald-500 text-emerald-400' : 'border-prime-border text-slate-400'}`}>Archivo</button>
                    <button type="button" onClick={() => setFotoModo('url')} className={`px-2 py-1 rounded border ${fotoModo === 'url' ? 'border-emerald-500 text-emerald-400' : 'border-prime-border text-slate-400'}`}>URL</button>
                  </div>
                </div>
                {fotoModo === 'archivo' ? (
                  <input type="file" accept="image/*" onChange={handleArchivoFoto} className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-prime-card file:px-3 file:py-1.5 file:text-xs file:text-slate-200" />
                ) : (
                  <input
                    type="url"
                    value={fotoPerfilEx}
                    onChange={(e) => setFotoPerfilEx(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-prime-border bg-prime-card px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                {msgPerfil && <span className={`text-xs ${msgPerfil === 'Guardado' ? 'text-emerald-400' : 'text-red-400'}`}>{msgPerfil}</span>}
                <button
                  type="submit"
                  disabled={guardando || !nombreEx.trim()}
                  className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          )}

          {tab === 'entrenamiento' && (
            <div className="space-y-5">
              <form onSubmit={procesarTexto} className="space-y-3">
                <p className="text-[11px] font-mono uppercase text-slate-400">Chat exportado (texto)</p>
                <input
                  type="text"
                  value={aliasTexto}
                  onChange={(e) => setAliasTexto(e.target.value)}
                  placeholder="Alias del ex en el chat (opcional)"
                  className="w-full rounded-xl border border-prime-border bg-prime-card px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
                <textarea
                  rows={6}
                  required
                  value={chatExportado}
                  onChange={(e) => setChatExportado(e.target.value)}
                  placeholder="Pega aquí la exportación de WhatsApp..."
                  className="w-full rounded-xl border border-prime-border bg-prime-card p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none resize-y"
                />
                {errorTexto && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errorTexto}</p>}
                <button
                  type="submit"
                  disabled={procesandoTexto || !chatExportado.trim()}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
                >
                  <Terminal className="h-4 w-4" />
                  {procesandoTexto ? 'Procesando...' : 'Procesar'}
                </button>
                {resultadoTexto && (
                  <div className="rounded-xl border border-cyan-500/30 bg-prime-card p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />Resultados</span>
                      {resultadoTexto.tonoDetectado && <span className="text-[10px] text-emerald-400">Tono: {resultadoTexto.tonoDetectado}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
                      <span>Líneas: <strong className="text-white">{resultadoTexto.totalLineasProcesadas ?? 0}</strong></span>
                      <span>Msgs ex: <strong className="text-cyan-400">{resultadoTexto.totalMensajesEx ?? 0}</strong></span>
                      <span>Tus msgs: <strong className="text-emerald-400">{resultadoTexto.totalMensajesUsuario ?? 0}</strong></span>
                    </div>
                    {resultadoTexto.emojisFrecuentes && resultadoTexto.emojisFrecuentes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {resultadoTexto.emojisFrecuentes.map((em, i) => (
                          <span key={i} className="rounded bg-slate-800 px-1.5 py-0.5">{em}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </form>

              <div className="border-t border-prime-border pt-4">
                <form onSubmit={procesarOcr} className="space-y-3">
                  <p className="text-[11px] font-mono uppercase text-slate-400">Capturas (OCR)</p>
                  <input
                    type="text"
                    value={aliasOcr}
                    onChange={(e) => setAliasOcr(e.target.value)}
                    placeholder="Nombre del ex en la captura (opcional)"
                    className="w-full rounded-xl border border-prime-border bg-prime-card px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                  <div
                    onClick={() => inputOcrRef.current?.click()}
                    className="cursor-pointer rounded-xl border border-dashed border-prime-border bg-prime-card/50 p-3 text-center hover:border-emerald-500/50"
                  >
                    <input ref={inputOcrRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { agregarImagenes(e.target.files); e.target.value = ''; }} />
                    <ImagePlus className="mx-auto h-5 w-5 text-slate-500 mb-1" />
                    <p className="text-[11px] text-slate-400">{imagenes.length > 0 ? `${imagenes.length} imagen(es) seleccionada(s)` : 'Seleccionar capturas'}</p>
                  </div>
                  {errorOcr && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errorOcr}</p>}
                  <button
                    type="submit"
                    disabled={imagenes.length === 0 || procesandoOcr}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {procesandoOcr ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {procesandoOcr ? 'Procesando...' : 'Subir y entrenar'}
                  </button>
                  {resultadoOcr && (
                    <div className="rounded-xl border border-emerald-500/30 bg-prime-card p-3 text-xs space-y-1.5">
                      <span className="text-emerald-300 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />{resultadoOcr.mensaje || 'Procesado'}</span>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
                        <span>Imágenes: <strong className="text-white">{resultadoOcr.imagenesProcesadas ?? 0}</strong></span>
                        <span>Nuevos: <strong className="text-cyan-400">{resultadoOcr.mensajesNuevos ?? 0}</strong></span>
                        <span>Duplicados: <strong className="text-amber-400">{resultadoOcr.mensajesDuplicados ?? 0}</strong></span>
                        <span>Total: <strong className="text-white">{resultadoOcr.totalMensajesDataset ?? 0}</strong></span>
                        <span>Msgs ex: <strong className="text-white">{resultadoOcr.totalMensajesEx ?? 0}</strong></span>
                      </div>
                      {resultadoOcr.erroresOcr && resultadoOcr.erroresOcr.length > 0 && (
                        <p className="text-amber-300">{resultadoOcr.erroresOcr[0]}</p>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
