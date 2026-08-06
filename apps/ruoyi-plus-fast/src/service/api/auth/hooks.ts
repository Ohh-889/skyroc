import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchCaptcha, fetchEmailCode, fetchLogin, fetchSmsCode } from './api';
import { AUTH_MUTATION_KEYS, AUTH_QUERY_KEYS } from './keys';

export function useCaptchaQuery(enabled: boolean) {
  return useQuery({
    enabled,
    gcTime: 0,
    queryFn: fetchCaptcha,
    queryKey: AUTH_QUERY_KEYS.CAPTCHA,
    retry: false,
    staleTime: Infinity
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (params: Api.Auth.LoginParams) => fetchLogin(params),
    mutationKey: AUTH_MUTATION_KEYS.LOGIN,
    retry: false
  });
}

export function useSmsCodeMutation() {
  return useMutation({
    mutationFn: (params: Api.Auth.SmsCodeParams) => fetchSmsCode(params),
    mutationKey: AUTH_MUTATION_KEYS.SMS_CODE,
    retry: false
  });
}

export function useEmailCodeMutation() {
  return useMutation({
    mutationFn: (params: Api.Auth.EmailCodeParams) => fetchEmailCode(params),
    mutationKey: AUTH_MUTATION_KEYS.EMAIL_CODE,
    retry: false
  });
}
