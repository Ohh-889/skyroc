import type { ReactNode } from 'react';

interface PropItem {
  /** 默认值，缺省渲染为 "-" */
  default?: string;
  /** 属性说明 */
  description: ReactNode;
  /** 属性名 */
  name: string;
  /** 是否必填，必填时名字后带红色星号 */
  required?: boolean;
  /** 类型签名 */
  type: ReactNode;
}

interface PropsTableProps {
  /** 表格数据 */
  data: PropItem[];
}

export const PropsTable = (props: PropsTableProps) => {
  const { data } = props;

  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full min-w-[640px] table-fixed border-collapse text-[14px] leading-[1.7]">
        <colgroup>
          <col className="w-[18%]" />
          <col className="w-[34%]" />
          <col className="w-[33%]" />
          <col className="w-[15%]" />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-fd-border">
            <th className="py-3 pr-4 text-left font-semibold text-fd-foreground">属性</th>
            <th className="py-3 pr-4 text-left font-semibold text-fd-foreground">说明</th>
            <th className="py-3 pr-4 text-left font-semibold text-fd-foreground">类型</th>
            <th className="py-3 text-left font-semibold text-fd-foreground">默认值</th>
          </tr>
        </thead>
        <tbody className="text-fd-foreground/90">
          {data.map(item => (
            <tr
              key={item.name}
              className="border-b border-fd-border/50 transition-colors duration-150 hover:bg-fd-accent/5"
            >
              <td className="break-all border-r py-3 pr-4 pl-3 align-top font-mono text-[13px] text-fd-primary">
                {item.name}
                {item.required ? (
                  <span
                    aria-label="必填"
                    className="ml-1 text-[11px] text-red-500"
                    title="必填"
                  >
                    *
                  </span>
                ) : null}
              </td>
              <td className="border-r py-3 pr-4 pl-3 align-top text-fd-foreground/75">{item.description}</td>
              <td className="break-all border-r py-3 pr-4 pl-3 align-top font-mono text-[13px] text-fd-foreground/65">
                {item.type}
              </td>
              <td className="py-3 pl-3 align-top font-mono text-[13px] text-fd-foreground/55">{item.default ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export type { PropItem, PropsTableProps };
