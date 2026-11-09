import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../api/axios';

   type Usuario = {
     id?: number;
     nombre?: string;
     email?: string;
     nombreEx?: string;
     fotoPerfil?: string | null;
     fotoPerfilEx?: string | null;
     personalidadEx?: string;
     estadoWhatsAppEx?: string;
     [key: string]: unknown;
   };

type RegistroData = {
  nombre: string;
  email: string;
  password: string;
  nombreEx: string;
  fotoPerfilEx: string;
  fotoPerfil: string;
};

type AuthContextType = {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  registro: (data: RegistroData) => Promise<Usuario>;
  logout: () => void;
  updateUser: (newUserData: Partial<Usuario>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('usuario');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser) as Usuario);
      } catch (e) {
        console.error('Error parseando usuario en localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  const guardarSesion = (accessToken: string, refreshToken: string, usuario: Usuario) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setToken(accessToken);
    setUser(usuario);
  };

  const login = async (email: string, password: string): Promise<Usuario> => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, usuario } = res.data;
    guardarSesion(accessToken, refreshToken, usuario);
    return usuario;
  };

  const registro = async (data: RegistroData): Promise<Usuario> => {
    const res = await api.post('/auth/registro', data);
    const { accessToken, refreshToken, usuario } = res.data;
    guardarSesion(accessToken, refreshToken, usuario);
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    setToken(null);
    setUser(null);
  };

  const updateUser = (newUserData: Partial<Usuario>) => {
    setUser((prev) => {
      const updated = { ...(prev ?? {}), ...newUserData };
      localStorage.setItem('usuario', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registro, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};