import apiClient from '@/api/apiClient';
import type { AuthResponse } from '../models/auth.response';
import type { CreateUserDto } from '../models/create-user.dto';
import type { UpdateUserDto } from '../models/update-user.dto';
import type { LoginUserDto } from '../models/login-user.dto';
import type { User } from '../models/user.model';

function mapAuthResponseToUser(data: AuthResponse): User {
  return {
    id: data.userId,
    email: data.email,
    name: data.name ?? '',
    isActive: data.isActive ?? true,
  };
}

export async function loginUser(payload: LoginUserDto) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);

  if (!data?.access_token) {
    throw new Error('Login OK pero no se recibió token');
  }

  return {
    token: data.access_token,
    user: mapAuthResponseToUser(data),
  };
}

export async function registerUser(payload: CreateUserDto) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);

  if (!data?.access_token) {
    throw new Error('Registro OK pero no se recibió token');
  }

  return {
    token: data.access_token,
    user: mapAuthResponseToUser(data),
  };
}

export async function getInfoUser() {
  const response = await apiClient.get<AuthResponse>('/users/me');

  if (response.status !== 200) {
    throw new Error('Error al obtener los datos del usuario');
  }

  return {
    user: mapAuthResponseToUser(response.data),
  };
}

export async function updateUserProfile(payload: UpdateUserDto) {
  const response = await apiClient.patch('/users/me', payload);

  if (response.status !== 200) {
    throw new Error('Error al actualizar los datos del usuario');
  }

  return {
    user: mapAuthResponseToUser(response.data),
  };
}

export async function seedUser() {
  const response = await apiClient.post<AuthResponse>('/users/me/seed');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error en la simulacion de datos del usuario');
  }
}

export async function resetUser() {
  const response = await apiClient.delete<AuthResponse>('/users/me/reset');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error al resetear el usuario');
  }
}
