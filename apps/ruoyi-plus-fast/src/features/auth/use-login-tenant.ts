import { useState } from 'react';

import { DEFAULT_TENANT_ID, useLoginTenantsQuery } from '@/service/api';
import { localStg } from '@/utils/storage';

/**
 * 登录页要选哪个租户
 *
 * 密码登录和验证码登录都用它：登录要带 tenantId，发短信/邮箱验证码也要带，只在其中一页选 的话另一页会拿着默认租户去查账号，查不到。
 */
export function useLoginTenant() {
  const { data, isFetching } = useLoginTenantsQuery();

  // null 表示"用户还没动过下拉框"，此时取默认值。用状态存"是否选过"而不是在接口回来后用
  // effect 回填，省掉一次多余渲染，也不会在用户已经选了之后被接口的重新请求覆盖掉。
  const [pickedTenantId, setPickedTenantId] = useState<string | null>(null);

  const tenants = data?.voList ?? [];

  // 接口说没开多租户、或一家都没配时不显示下拉框：只有一个不能改的选项，摆出来只是噪音
  const showTenantSelect = Boolean(data?.tenantEnabled) && tenants.length > 0;

  const tenantOptions = tenants.map(tenant => ({ label: tenant.companyName, value: tenant.tenantId }));

  // 上次登录选的那家还在列表里就用它，否则用第一家。存的租户可能已经被删了或换了域名，所以
  // 要在列表里找一遍，不能直接拿来用。
  const lastTenantId = localStg.get('lastLoginTenantId');
  const defaultTenant = tenants.find(tenant => tenant.tenantId === lastTenantId) ?? tenants[0];

  // 下拉框不显示时（没开多租户）后端只认默认租户，接口还没回来时也只能先给它
  const tenantId = pickedTenantId ?? defaultTenant?.tenantId ?? DEFAULT_TENANT_ID;

  function selectTenant(nextTenantId: string) {
    localStg.set('lastLoginTenantId', nextTenantId);
    setPickedTenantId(nextTenantId);
  }

  return {
    /** 租户列表是否在请求中 */
    tenantLoading: isFetching,
    /** 下拉框的选项 */
    tenantOptions,
    /** 提交登录和发码时要带的租户编号 */
    tenantId,
    /** 选中某个租户 */
    selectTenant,
    /** 是否要在登录页显示租户下拉框 */
    showTenantSelect
  };
}
