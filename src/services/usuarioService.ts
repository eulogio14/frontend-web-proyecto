import api from '../api/axios';

export const actualizarFotoPerfil = async (fotoBase64) => {
  const response = await api.put('/usuarios/perfil/foto', { fotoPerfil: fotoBase64 });
  return response.data;
};
