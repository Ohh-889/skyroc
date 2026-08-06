export interface CacheInfo {
  /** Redis 命令调用统计。 */
  commandStats: Array<{ name: string; value: string }>;

  /** 当前 Redis 数据库中的 key 数量。 */
  dbSize: number;

  /** Redis INFO 返回的运行指标，值保持服务端原始字符串格式。 */
  info: Record<string, string>;
}
