import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  ShieldAlert,
  Phone,
  User,
  BrainCircuit
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/chat', label: 'Chats', icon: MessageSquare },
    { to: '/entrenar-ex', label: 'Entrenar Ex', icon: BrainCircuit },
    { to: '/llamada', label: 'Llamadas', icon: Phone },
  ];

  return (
    <aside className="w-20 bg-zinc-900 border-r border-prime-border flex flex-col h-screen select-none">
     
      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
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
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className='flex flex-col mx-auto gap-2 items-center'>
        <div>
          {user?.fotoPerfil ? (
            <img 
              src={user.fotoPerfil} 
              alt={user?.nombre || "Foto de Perfil"}
              className='w-12 h-12 rounded-full object-cover border border-slate-200'
            />
          ) : (
            <div className='w-8 h-8 rounded-full bg-green-700 flex items-center justify-center border border-slate-200 '>
              <User className='w-4 h-4 text-slate-400' />
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          title='Cerrar sesion'
          className=''
        >
          <LogOut className='' />
        </button>
      </div>

    </aside>
  );
}
