import type { ReactNode } from 'react';
import { typeToReactNode } from './type-anchor';

interface PropItem {
  /** 默认值 */
  default?: string;
  /** 说明 */
  description: ReactNode;
  /** 属性名 */
  name: string;
  /** 是否必填 */
  required?: boolean;
  /** 类型 */
  type: ReactNode;
}

interface PropsTableProps {
  /** 表格数据 */
  data: PropItem[];
}

function renderType(type: ReactNode): ReactNode {
  if (typeof type === 'string') {
    return typeToReactNode(type);
  }
  return type;
}

const PropsTable = (props: PropsTableProps) => {
  const { data } = props;

  return (
    <div className="skyroc-api-table not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card/30 shadow-sm">
      <div className="flex items-center justify-between border-b border-fd-border px-4 py-3">
        <div>
          <strong className="block text-xs font-semibold text-fd-foreground">Props</strong>
          <span className="mt-0.5 block text-[10px] text-fd-muted-foreground">属性、类型与默认值</span>
        </div>
        <span className="rounded-md bg-fd-primary/10 px-2 py-1 font-mono text-[9px] font-semibold text-fd-primary">
          {data.length} properties
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-190 w-full table-fixed border-collapse text-[13px] leading-[1.65]">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[36%]" />
            <col className="w-[33%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/35">
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                属性
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                说明
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                类型
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                默认值
              </th>
            </tr>
          </thead>
          <tbody className="text-fd-foreground/90">
            {data.map(item => (
              <tr
                key={item.name}
                className="border-b border-fd-border/55 transition-colors duration-150 last:border-b-0 hover:bg-fd-accent/6"
              >
                <td className="break-all border-r border-fd-border/45 px-4 py-3.5 align-top font-mono text-[12px] font-semibold text-fd-primary">
                  {item.name}
                  {item.required ? (
                    <span
                      className="ml-1 text-[11px] text-red-500"
                      aria-label="必填"
                      title="必填"
                    >
                      *
                    </span>
                  ) : null}
                </td>
                <td className="border-r border-fd-border/45 px-4 py-3.5 align-top text-fd-foreground/75">
                  {item.description}
                </td>
                <td className="break-all border-r border-fd-border/45 px-4 py-3.5 align-top font-mono text-[12px] text-fd-foreground/65">
                  {renderType(item.type)}
                </td>
                <td className="px-4 py-3.5 align-top font-mono text-[12px] text-fd-foreground/55">
                  {item.default ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PropsTable };
export type { PropItem, PropsTableProps };
