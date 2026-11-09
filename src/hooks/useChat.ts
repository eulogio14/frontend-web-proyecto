import { useCallback, useEffect, useState } from 'react';
import {
  enviarMensaje,
  limpiarMensajes,
  obtenerChatEx,
  type Chat,
  type Mensaje,
} from '../services/chatService';

const INTERVALO_MS = 30_000;

export function useChat() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const data = await obtenerChatEx();
      setChat(data);
      setMensajes(data.mensajes ?? []);
    } catch {
      setError('No se pudo cargar el chat');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Si el último mensaje es del usuario, el ex todavía no respondió:
  // consultamos cada 30 s hasta que llegue su respuesta.
  const ultimo = mensajes[mensajes.length - 1];
  const esperandoRespuesta = ultimo?.remitente === 'USUARIO';

  useEffect(() => {
    if (!esperandoRespuesta) return;
    const id = setInterval(cargar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [esperandoRespuesta, cargar]);

  const enviar = async (contenido: string) => {
    if (!chat) return;
    setEnviando(true);
    setError(null);

    // Mensaje temporal para verlo al instante; id negativo para no chocar con los reales
    const temporal: Mensaje = {
      id: -Date.now(),
      contenido,
      remitente: 'USUARIO',
      timestamp: new Date().toISOString(),
    };
    setMensajes((prev) => [...prev, temporal]);

    try {
      await enviarMensaje(chat.id, contenido);
      await cargar();
    } catch {
      setError('No se pudo enviar el mensaje');
      setMensajes((prev) => prev.filter((m) => m.id !== temporal.id));
    } finally {
      setEnviando(false);
    }
  };

  const limpiar = async () => {
    if (!chat) return;
    try {
      await limpiarMensajes(chat.id);
      setMensajes([]);
    } catch {
      setError('No se pudo limpiar el historial');
    }
  };

  return { chat, mensajes, enviando, error, esperandoRespuesta, enviar, limpiar };
}