import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { RegisterFormData } from '@features/auth/AuthPage';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

interface RegisterResponse {
  token: string;
}

const registerUser = async (data: RegisterFormData): Promise<RegisterResponse> => {
  const payload = {
    email: data.email,
    password: data.password,
  };
  const response = await axios.post(API_ENDPOINTS.REGISTER, payload);
  return response.data;
};

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}
