import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, User, Mail, Lock, HeartHandshake, AlertCircle, ArrowRight } from 'lucide-react';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    nombreEx: '',
    fotoPerfilEx: '',
    fotoPerfil: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value, type, files} = e.target;
    
    if (type === 'file'){
      const file = files[0];

      if (file){
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevData) => ({
            ...prevData,
            [name] : reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    }else{
      setFormData((prevData) => ({
        ...prevData,
        [name] : value
      }));
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registro(formData);
      navigate('/contacto-cero');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Error al crear la cuenta. Verifica que el correo no esté ya registrado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-prime-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-prime-card border border-prime-border rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <Zap className="w-6 h-6 text-black font-black" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Registrate</h2>
          
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Como te llamaba A TI, tu ex?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Camilo "
                  className="w-full bg-prime-dark/80 border border-prime-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Tu Correo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-prime-dark/80 border border-prime-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-prime-dark/80 border border-prime-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-prime-border/60">
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Nombre de tu Ex
                </label>
                <input
                  type="text"
                  name="nombreEx"
                  value={formData.nombreEx}
                  onChange={handleChange}
                  placeholder="Ej: Camila❤️ , Sarita🤍"
                  className="w-full bg-prime-dark/80 border border-prime-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              
              <div>
                <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Foto de perfil de WhatsApp tuya
                </span>
                
                {/* El label ahora actúa como tu botón visual */}
                <label className="w-full flex items-center justify-center bg-emerald-500/20 border border-prime-border rounded-xl px-3 py-2 text-xs transition-all cursor-pointer  text-emerald-400 hover:bg-emerald-500/30 border-dashed border-emerald-500/50 hover:border-emerald-500">
                  
                  {/* Texto dinámico: Cambia si ya hay una imagen cargada en tu estado */}
                  <span className="font-semibold">
                    {formData.fotoPerfil ? '✅ Imagen lista para subir' : '📁 Subir foto de tu PC'}
                  </span>

                  {/* El input real está aquí, pero es invisible (clase 'hidden') */}
                  <input
                    type="file"
                    name="fotoPerfil"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden" 
                  />
                </label>
              </div>


              <div>
                <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Foto de perfil de WhatsApp de tu ex
                </span>
                
                {/* El label ahora actúa como tu botón visual */}
                <label className="w-full flex items-center justify-center bg-emerald-500/20 border border-prime-border rounded-xl px-3 py-2 text-xs transition-all cursor-pointer  text-emerald-400 hover:bg-emerald-500/30 border-dashed border-emerald-500/50 hover:border-emerald-500">
                  
                  {/* Texto dinámico: Cambia si ya hay una imagen cargada en tu estado */}
                  <span className="font-semibold">
                    {formData.fotoPerfilEx ? '✅ Imagen lista para subir' : '📁 Subir foto de tu PC'}
                  </span>

                  {/* El input real está aquí, pero es invisible (clase 'hidden') */}
                  <input
                    type="file"
                    name="fotoPerfilEx"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden" 
                  />
                </label>
              </div>
            
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Inicializar Protocolo de Contacto Cero <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          ¿Ya tienes cuenta activa?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
