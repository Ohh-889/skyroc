import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchCaptcha, fetchEmailCode, fetchLogin, fetchLoginTenants, fetchSmsCode } from './api';
import { AUTH_MUTATION_KEYS, AUTH_QUERY_KEYS } from './keys';

/**
 * 登录页的租户下拉框
 *
 * 密码登录页和验证码登录页都要它，走同一个 queryKey，来回切页不会重复请求。租户表变动不 频繁，staleTime 给足，省掉每次进登录页的那次往返。
 */
export function useLoginTenantsQuery() {
  return useQuery({
    queryFn: fetchLoginTenants,
    queryKey: AUTH_QUERY_KEYS.TENANT_LIST,
    // 没开多租户的部署这个接口回的是空列表，重试只是白等
    retry: false,
    staleTime: 5 * 60 * 1000
  });
}

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
