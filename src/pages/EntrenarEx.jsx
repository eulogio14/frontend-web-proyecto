import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import {
  BrainCircuit,
  ImagePlus,
  Images,
  UploadCloud,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileText,
} from 'lucide-react';

const MAX_IMAGENES = 25;

export default function EntrenarEx() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [imagenes, setImagenes] = useState([]);
  const [nombreRemitente, setNombreRemitente] = useState(user?.nombreEx || '');
  const [arrastrando, setArrastrando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [subidaCompletada, setSubidaCompletada] = useState(false);

  const imagenesRef = useRef(imagenes);
  imagenesRef.current = imagenes;

  useEffect(() => {
    if (user?.nombreEx && !nombreRemitente) {
      setNombreRemitente(user.nombreEx);
    }
    // Solo queremos precargar el nombre una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Liberar las URLs temporales al salir de la página.
  useEffect(() => {
    return () => {
      imagenesRef.current.forEach((imagen) => URL.revokeObjectURL(imagen.url));
    };
  }, []);

  const formatoBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const agregarArchivos = (archivos) => {
    const lista = Array.from(archivos || []);
    const soloImagenes = lista.filter((archivo) => archivo.type.startsWith('image/'));

    if (soloImagenes.length === 0) {
      setError('Selecciona archivos de imagen (JPG, PNG, WEBP...).');
      return;
    }
    if (soloImagenes.length !== lista.length) {
      setError('Algunos archivos no eran imágenes y se ignoraron.');
    } else {
      setError('');
    }

    setImagenes((previas) => {
      const claves = new Set(
        previas.map((i) => `${i.file.name}-${i.file.size}-${i.file.lastModified}`)
      );
      const nuevas = [];

      for (const archivo of soloImagenes) {
        const clave = `${archivo.name}-${archivo.size}-${archivo.lastModified}`;
        if (claves.has(clave)) continue;
        claves.add(clave);
        nuevas.push({
          id: `${archivo.name}-${archivo.size}-${archivo.lastModified}-${Math.random()}`,
          file: archivo,
          url: URL.createObjectURL(archivo),
        });
      }

      const combinadas = [...previas, ...nuevas];
      if (combinadas.length > MAX_IMAGENES) {
        setError(`Puedes subir como máximo ${MAX_IMAGENES} imágenes por vez.`);
        combinadas.slice(MAX_IMAGENES).forEach((i) => URL.revokeObjectURL(i.url));
        return combinadas.slice(0, MAX_IMAGENES);
      }
      return combinadas;
    });

    setSubidaCompletada(false);
    setResultado(null);
  };

  const quitarImagen = (id) => {
    setImagenes((previas) => {
      const imagen = previas.find((i) => i.id === id);
      if (imagen) URL.revokeObjectURL(imagen.url);
      return previas.filter((i) => i.id !== id);
    });
    setSubidaCompletada(false);
    setResultado(null);
  };

  const handleDrop = (evento) => {
    evento.preventDefault();
    setArrastrando(false);
    agregarArchivos(evento.dataTransfer.files);
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    if (imagenes.length === 0 || subiendo) return;

    setSubiendo(true);
    setError('');
    setResultado(null);

    const formData = new FormData();
    imagenes.forEach((imagen) => formData.append('imagenes', imagen.file));
    if (nombreRemitente.trim()) {
      formData.append('nombreRemitenteEx', nombreRemitente.trim());
    }

    try {
      const res = await api.post('/usuarios/ex-dataset/imagenes', formData);
      setResultado(res.data);
      setSubidaCompletada(true);

      // Refrescamos el perfil para que el chat muestre el nombre actualizado.
      try {
        const perfil = await api.get('/usuarios/perfil');
        updateUser(perfil.data);
      } catch {
        // No es crítico: el entrenamiento ya se guardó.
      }
    } catch (err) {
      console.error('Error entrenando al ex con imágenes', err);
      const status = err.response?.status;
      const detalle =
        err.response?.data?.message || err.response?.data?.error || err.message;

      if (status === 401 || status === 403) {
        setError(
          'Tu sesión expiró o no es válida. Cierra sesión y vuelve a iniciar sesión para subir las capturas.'
        );
      } else if (status === 502 || status === 503 || !err.response) {
        setError(
          `No se pudo conectar con el servicio OCR${
            status ? ` (HTTP ${status})` : ''
          }. Verifica que proyect-script/server.py esté corriendo en el puerto 8001.`
        );
      } else {
        setError(
          `No se pudieron procesar las imágenes (HTTP ${status}): ${detalle}`
        );
      }
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-prime-dark">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <BrainCircuit className="w-7 h-7 text-cyan-400" />
              Entrenar Ex
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Sube capturas de WhatsApp. El OCR extrae los mensajes, elimina los
              repetidos y los ordena de más antiguo a más reciente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-prime-card border border-prime-border text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Ir al chat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre del contacto */}
          <div className="p-5 rounded-2xl bg-prime-card border border-prime-border">
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
              Nombre del Ex tal como aparece en la captura
            </label>
            <input
              type="text"
              value={nombreRemitente}
              onChange={(e) => setNombreRemitente(e.target.value)}
              placeholder="Ej: ❤️alfajorcito, Camila, Mi Niña..."
              className="w-full max-w-md bg-prime-dark border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
            <p className="text-[10px] text-slate-500 mt-1.5">
              Sirve para distinguir sus mensajes de los tuyos. Los mensajes
              marcados como “Tú” se toman como tuyos automáticamente.
            </p>
          </div>

          {/* Dropzone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={handleDrop}
            className={`relative p-8 md:p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              arrastrando
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-prime-border bg-prime-card hover:border-cyan-500/50 hover:bg-prime-card/80'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                agregarArchivos(e.target.files);
                e.target.value = '';
              }}
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-white">
              Arrastra tus capturas aquí o haz clic para seleccionarlas
            </p>
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG o WEBP · hasta {MAX_IMAGENES} imágenes · máx. 15 MB cada una
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Galería */}
          <div className="p-5 rounded-2xl bg-prime-card border border-prime-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Images className="w-4 h-4 text-emerald-400" />
                Imágenes {subidaCompletada ? 'procesadas' : 'seleccionadas'} ({imagenes.length})
              </h2>
              {imagenes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    imagenes.forEach((i) => URL.revokeObjectURL(i.url));
                    setImagenes([]);
                    setSubidaCompletada(false);
                    setResultado(null);
                  }}
                  className="text-[11px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Quitar todas
                </button>
              )}
            </div>

            {imagenes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 border border-dashed border-prime-border rounded-xl">
                <ImagePlus className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Todavía no has agregado capturas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagenes.map((imagen) => (
                  <div
                    key={imagen.id}
                    className="group relative rounded-xl overflow-hidden border border-prime-border bg-prime-dark"
                  >
                    <img
                      src={imagen.url}
                      alt={imagen.file.name}
                      className="w-full h-32 object-cover"
                    />
                    {subidaCompletada && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-black text-[9px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        PROCESADA
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => quitarImagen(imagen.id)}
                      title="Quitar imagen"
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-slate-300 hover:text-red-400 hover:bg-black/90 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-2">
                      <p className="text-[10px] text-slate-300 truncate" title={imagen.file.name}>
                        {imagen.file.name}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        {formatoBytes(imagen.file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              El TXT se guarda en tu dataset y se usa para imitar su estilo en el chat.
            </p>
            <button
              type="submit"
              disabled={imagenes.length === 0 || subiendo}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {subiendo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando capturas con OCR...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Subir y entrenar
                </>
              )}
            </button>
          </div>
        </form>

        {/* Resultado */}
        {resultado && (
          <div className="p-5 rounded-2xl bg-prime-card border border-emerald-500/30 space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {resultado.mensaje || 'Dataset procesado correctamente'}
              </span>
              {resultado.tonoDetectado && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  TONO: {resultado.tonoDetectado}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-prime-dark border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Imágenes</p>
                <p className="text-lg font-bold text-white font-mono mt-1">
                  {resultado.imagenesProcesadas ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-prime-dark border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Nuevos</p>
                <p className="text-lg font-bold text-cyan-400 font-mono mt-1">
                  {resultado.mensajesNuevos ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-prime-dark border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Duplicados</p>
                <p className="text-lg font-bold text-amber-400 font-mono mt-1">
                  {resultado.mensajesDuplicados ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-prime-dark border border-prime-border">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Total dataset</p>
                <p className="text-lg font-bold text-purple-400 font-mono mt-1">
                  {resultado.totalMensajesDataset ?? 0}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>
                Mensajes del Ex: <strong className="text-white">{resultado.totalMensajesEx ?? 0}</strong>
              </span>
              <span>
                Longitud promedio:{' '}
                <strong className="text-white">
                  {typeof resultado.longitudPromedioMensajeEx === 'number'
                    ? resultado.longitudPromedioMensajeEx.toFixed(1)
                    : resultado.longitudPromedioMensajeEx ?? 0}{' '}
                  car.
                </strong>
              </span>
            </div>

            {resultado.erroresOcr?.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
                {resultado.erroresOcr.map((err, indice) => (
                  <p key={indice}>⚠️ {err}</p>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                Hablar con {nombreRemitente.trim() || user?.nombreEx || 'tu Ex'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
