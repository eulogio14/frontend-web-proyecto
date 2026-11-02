import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutWhatsApp from './components/LayoutWhatsApp';
import PerfilUsuario from './pages/PerfilUsuario';
import Login from './pages/Login';
import Registro from './components/Registro.tsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Protected Routes */}
          <Route
            path="/mensajes"
            element={
              <ProtectedRoute>
                <LayoutWhatsApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <div className="h-screen w-screen flex bg-[#0b141a]">
                  <div className="w-[60px] h-full bg-[#1f2c33] border-r border-[#2a3942] flex items-center justify-center">
                    <button onClick={() => window.history.back()} className="text-[#aebac1] hover:text-white">←</button>
                  </div>
                  <div className="flex-1 h-full overflow-y-auto">
                    <PerfilUsuario />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/chat" element={<Navigate to="/mensajes" replace />} />
          <Route path="/contacto-cero" element={<Navigate to="/mensajes" replace />} />
          <Route path="/diario" element={<Navigate to="/mensajes" replace />} />
          <Route path="/red-flags" element={<Navigate to="/mensajes" replace />} />
          <Route path="/recuerdos" element={<Navigate to="/mensajes" replace />} />
          <Route path="/config-ex" element={<Navigate to="/mensajes" replace />} />
          <Route path="/entrenar-ex" element={<Navigate to="/mensajes" replace />} />
          <Route path="/" element={<Navigate to="/mensajes" replace />} />
          <Route path="*" element={<Navigate to="/mensajes" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
