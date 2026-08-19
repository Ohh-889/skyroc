import { toTypeAnchorId, typeToReactNode } from './type-anchor';

interface TypeFieldDef {
  /** 字段说明 */
  description?: string;
  /** 字段名 */
  name: string;
  /** 是否必填，必填时名字后带红色星号 */
  required?: boolean;
  /** 类型签名 */
  type: string;
}

interface TypeDataDef {
  /** 类型说明 */
  description?: string;
  /** 字段列表 */
  fields: TypeFieldDef[];
  /** 类型名，同时决定锚点 id */
  name: string;
}

interface TypeTableProps {
  /** 类型定义数据 */
  data: TypeDataDef[];
}

const TypeData = (props: TypeDataDef) => {
  const { description, fields, name } = props;

  const anchorId = toTypeAnchorId(name);

  return (
    <div className="not-prose my-8">
      <h4
        className="scroll-mt-24 font-mono text-[14px] font-semibold text-fd-foreground"
        id={anchorId}
      >
        {name}
      </h4>
      {description ? <p className="mt-1 text-[13px] text-fd-muted-foreground">{description}</p> : null}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-[14px] leading-[1.7]">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[40%]" />
            <col className="w-[40%]" />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-fd-border">
              <th className="py-3 pr-4 text-left font-semibold text-fd-foreground">字段</th>
              <th className="py-3 pr-4 text-left font-semibold text-fd-foreground">类型</th>
              <th className="py-3 text-left font-semibold text-fd-foreground">说明</th>
            </tr>
          </thead>
          <tbody className="text-fd-foreground/90">
            {fields.map(field => (
              <tr
                key={field.name}
                className="border-b border-fd-border/50 transition-colors duration-150 hover:bg-fd-accent/5"
              >
                <td className="break-all border-r py-3 pr-4 pl-3 align-top font-mono text-[13px] text-fd-primary">
                  {field.name}
                  {field.required ? (
                    <span
                      aria-label="必填"
                      className="ml-1 text-[11px] text-red-500"
                      title="必填"
                    >
                      *
                    </span>
                  ) : null}
                </td>
                <td className="break-all border-r py-3 pr-4 pl-3 align-top font-mono text-[13px] text-fd-foreground/65">
                  {typeToReactNode(field.type)}
                </td>
                <td className="py-3 pl-3 align-top text-fd-foreground/75">{field.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TypeTable = (props: TypeTableProps) => {
  const { data } = props;

  return (
    <div>
      {data.map(item => (
        <TypeData
          key={item.name}
          {...item}
        />
      ))}
    </div>
  );
};

interface UnionTypeProps {
  /** 类型说明 */
  description?: string;
  /** 类型名，同时决定锚点 id */
  name: string;
  /** 联合类型字符串 */
  type: string;
}

export const UnionType = (props: UnionTypeProps) => {
  const { description, name, type } = props;

  const anchorId = toTypeAnchorId(name);

  return (
    <div className="not-prose my-6 border-l-2 border-fd-border pl-4">
      <h4
        className="scroll-mt-24 font-mono text-[14px] font-semibold text-fd-foreground"
        id={anchorId}
      >
        {name}
      </h4>
      {description ? <p className="mt-1 text-[13px] text-fd-muted-foreground">{description}</p> : null}
      <div className="pt-2 font-mono text-[13px] break-all text-fd-foreground/65">{typeToReactNode(type)}</div>
    </div>
  );
};

export type { TypeDataDef, TypeFieldDef, TypeTableProps, UnionTypeProps };
