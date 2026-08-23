/**
 * 通用 API 响应 / 请求类型
 *
 * 走 `service/request` 的接口拿到的已经是拆过信封的 data，不用关心外层包装；
 * 只有绕开它自己发请求时（见 `api/auth/refresh.ts`）才会用到这里的类型。
 */
declare namespace Api {
  namespace Service {
    /** 后端响应信封 */
    interface Response<T = unknown> {
      /** 业务状态码。有的后端给数字，有的给字符串，比较前一律 String() */
      code: number | string;
      /** 业务数据 */
      data: T;
      /** 提示信息 */
      msg: string;
    }

    /** 分页请求参数 */
    interface PaginationParams {
      /** 页码，从 1 开始 */
      pageNum: number;
      /** 每页条数 */
      pageSize: number;
    }

    /** 分页响应数据 */
    interface PaginatedData<T = unknown> {
      /** 数据列表 */
      items: T[];
      /** 当前页码 */
      pageNum: number;
      /** 总页数 */
      pages: number;
      /** 总条数 */
      total: number;
    }
  }
}
