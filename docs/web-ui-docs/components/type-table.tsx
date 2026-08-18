import { toTypeAnchorId, typeToReactNode } from './type-anchor';

interface TypeFieldDef {
  /** 说明 */
  description?: string;
  /** 字段名 */
  name: string;
  /** 是否必填 */
  required?: boolean;
  /** 类型 */
  type: string;
}

interface TypeDataDef {
  /** 说明 */
  description?: string;
  /** 字段列表 */
  fields: TypeFieldDef[];
  /** 类型名 */
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
    <div className="skyroc-api-table not-prose mb-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card/30 shadow-sm">
      <div className="border-b border-fd-border px-4 py-3">
        <h4
          id={anchorId}
          className="scroll-mt-24 text-sm font-semibold text-fd-foreground"
        >
          {name}
        </h4>
        {description ? <p className="mt-1 text-xs text-fd-muted-foreground">{description}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-160 w-full table-fixed border-collapse text-[13px] leading-[1.65]">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[40%]" />
            <col className="w-[40%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/35">
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                字段
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                类型
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-fd-muted-foreground uppercase">
                说明
              </th>
            </tr>
          </thead>
          <tbody className="text-fd-foreground/90">
            {fields.map(field => (
              <tr
                key={field.name}
                className="border-b border-fd-border/55 transition-colors duration-150 last:border-b-0 hover:bg-fd-accent/6"
              >
                <td className="break-all border-r border-fd-border/45 px-4 py-3.5 align-top font-mono text-[12px] font-semibold text-fd-primary">
                  {field.name}
                  {field.required ? (
                    <span
                      className="ml-1 text-[11px] text-red-500"
                      aria-label="必填"
                      title="必填"
                    >
                      *
                    </span>
                  ) : null}
                </td>
                <td className="break-all border-r border-fd-border/45 px-4 py-3.5 align-top font-mono text-[12px] text-fd-foreground/65">
                  {typeToReactNode(field.type)}
                </td>
                <td className="px-4 py-3.5 align-top text-fd-foreground/75">{field.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TypeTable = (props: TypeTableProps) => {
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
  /** 说明 */
  description?: string;
  /** 类型名 */
  name: string;
  /** 联合类型字符串 */
  type: string;
}

const UnionType = (props: UnionTypeProps) => {
  const { description, name, type } = props;

  const anchorId = toTypeAnchorId(name);

  return (
    <div className="not-prose mb-6 rounded-xl border border-fd-border bg-fd-card/30 p-4">
      <h4
        id={anchorId}
        className="scroll-mt-24 text-sm font-semibold text-fd-foreground"
      >
        {name}
      </h4>
      {description ? <p className="mt-1 text-xs text-fd-muted-foreground">{description}</p> : null}
      <div className="pt-3">
        <span className="inline rounded-md border border-fd-accent-foreground/15 bg-fd-muted/35 px-2 py-1 font-mono text-[12px] text-fd-accent-foreground">
          {typeToReactNode(type)}
        </span>
      </div>
    </div>
  );
};

export { TypeTable, UnionType };
export type { TypeDataDef, TypeFieldDef, TypeTableProps, UnionTypeProps };
