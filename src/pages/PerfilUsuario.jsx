import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { actualizarFotoPerfil } from '../services/usuarioService';
import { Camera, User, Loader2 } from 'lucide-react';

export default function PerfilUsuario() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const inicial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';

  const abrirSelector = () => {
    setMensaje('');
    setError('');
    fileInputRef.current?.click();
  };

  const handleArchivo = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setMensaje('');
    setError('');

    if (!archivo.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      e.target.value = '';
      return;
    }

    if (archivo.size > 4 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 4 MB');
      e.target.value = '';
      return;
    }

    setCargando(true);
    const lector = new FileReader();
    lector.onload = async () => {
      try {
        const base64 = lector.result;
        const res = await actualizarFotoPerfil(base64);
        const nuevaFoto = res?.fotoPerfil || base64;
        updateUser({ fotoPerfil: nuevaFoto });
        setMensaje('Foto actualizada correctamente');
      } catch (err) {
        setError(err.response?.data?.message || 'Error al actualizar la foto');
      } finally {
        setCargando(false);
        e.target.value = '';
      }
    };
    lector.onerror = () => {
      setError('Error al leer el archivo');
      setCargando(false);
      e.target.value = '';
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-prime-dark">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Administra tu foto de perfil</p>
        </div>

        <div className="p-6 rounded-2xl bg-prime-card border border-prime-border space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {user?.fotoPerfil ? (
                <img
                  src={user.fotoPerfil}
                  alt={user?.nombre || 'Foto de perfil'}
                  className="w-32 h-32 rounded-full object-cover border-2 border-emerald-500/50"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-emerald-600/30 border-2 border-emerald-500/50 flex items-center justify-center text-3xl font-bold text-emerald-400">
                  {inicial}
                </div>
              )}
              <button
                onClick={abrirSelector}
                disabled={cargando}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cambiar foto"
              >
                {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleArchivo}
            />
            <div className="text-center">
              <p className="text-white font-medium">{user?.nombre}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          {mensaje && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center">{mensaje}</div>}
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
}
