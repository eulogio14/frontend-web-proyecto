import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Registro from './pages/Registro';
import ChatSimulator from './pages/ChatSimulator';
import Dashboard from './pages/Dashboard';
import Diario from './pages/Diario';
import RedFlags from './pages/RedFlags';
import Recuerdos from './pages/Recuerdos';
import ConfigEx from './pages/ConfigEx';

function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-prime-dark">
      <Sidebar />
      <main className="flex-1 h-full overflow-hidden bg-prime-dark">
        {children}
      </main>
    </div>
  );
}

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
            path="/chat"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ChatSimulator />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacto-cero"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/diario"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Diario />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/red-flags"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RedFlags />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recuerdos"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Recuerdos />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/config-ex"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ConfigEx />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
