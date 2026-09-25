import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Flame, 
  BookHeart, 
  Flag, 
  Image as ImageIcon, 
  UserCog, 
  LogOut, 
  Radio, 
  Zap,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/chat', label: 'Simulador WhatsApp', icon: MessageSquare, badge: user?.modoActual },
    { to: '/contacto-cero', label: 'Contacto Cero', icon: Flame, badge: `${user?.diasRachaContactoCero || 0}d` },
    { to: '/diario', label: 'Diario Emocional', icon: BookHeart },
    { to: '/red-flags', label: 'Red Flags', icon: Flag },
    { to: '/recuerdos', label: 'Recuerdos', icon: ImageIcon },
    { to: '/config-ex', label: 'Perfil del Ex', icon: UserCog },
  ];

  return (
    <aside className="w-72 bg-prime-card border-r border-prime-border flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-prime-border/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Zap className="w-5 h-5 text-black font-black" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wider text-white flex items-center gap-2">
            CONTACTO CERO
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PRIME
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            NEON MULTIVERSE OS
          </p>
        </div>
      </div>

      {/* Ex Quick Status Indicator */}
      <div className="mx-4 my-3 p-3 rounded-xl bg-prime-dark/60 border border-prime-border flex items-center gap-3">
        <img 
          src={user?.fotoPerfilEx || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
          alt="Ex Avatar" 
          className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{user?.nombreEx || "Mi Ex"}</p>
          <p className="text-[11px] text-emerald-400 font-mono truncate">
            {user?.modoActual === 'SUPERAR' ? '🛡️ Modo Desapego' : '💔 Modo Recuerdo'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-prime-border bg-prime-dark/40 flex items-center justify-between">
        <div className="truncate">
          <p className="text-xs font-semibold text-white truncate">{user?.nombre || "Usuario"}</p>
          <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
