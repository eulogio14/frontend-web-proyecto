import api from '../api/axios';

export type Remitente = 'USUARIO' | 'EX_BOT';

export type Mensaje = {
  id: number;
  contenido: string;
  remitente: Remitente;
  timestamp: string;
};

export type Chat = {
  id: number;
  mensajes?: Mensaje[];
};

type MensajeApi = {
  id: number;
  contenido: string;
  remitente: Remitente;
  timestamp?: string;
};

type ChatApi = {
  id: number;
  mensajes?: Array<MensajeApi & Record<string, unknown>>;
};

const mapMensaje = (m: MensajeApi & Record<string, unknown>): Mensaje => ({
  id: m.id,
  contenido: m.contenido,
  remitente: m.remitente,
  timestamp: m.timestamp ?? (typeof m['fecha' + 'Envio'] === 'string' ? (m['fecha' + 'Envio'] as string) : ''),
});

export const obtenerChatEx = async (): Promise<Chat> => {
  const res = await api.get<ChatApi>('/chats/CHAT_EX');
  return {
    id: res.data.id,
    mensajes: (res.data.mensajes ?? []).map(mapMensaje),
  };
};

export const enviarMensaje = async (id: number, contenido: string): Promise<void> => {
  await api.post(`/chats/${id}/mensajes`, { contenido });
};

export const limpiarMensajes = async (id: number): Promise<void> => {
  await api.delete(`/chats/${id}/mensajes`);
};