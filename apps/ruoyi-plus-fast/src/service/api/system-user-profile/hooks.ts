import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchUserProfile, updateUserPassword, updateUserProfile } from './api';
import { SYSTEM_USER_PROFILE_MUTATION_KEYS, SYSTEM_USER_PROFILE_QUERY_KEYS } from './keys';
import type { UserPasswordChangePayload, UserProfilePayload } from './types';

export function useUserProfileQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: fetchUserProfile,
    queryKey: SYSTEM_USER_PROFILE_QUERY_KEYS.DETAIL
  });
}

export function useUpdateUserProfileMutation() {
  return useMutation({
    mutationFn: (data: UserProfilePayload) => updateUserProfile(data),
    mutationKey: SYSTEM_USER_PROFILE_MUTATION_KEYS.UPDATE
  });
}

export function useUpdateUserPasswordMutation() {
  return useMutation({
    mutationFn: (data: UserPasswordChangePayload) => updateUserPassword(data),
    mutationKey: SYSTEM_USER_PROFILE_MUTATION_KEYS.UPDATE_PASSWORD
  });
}
