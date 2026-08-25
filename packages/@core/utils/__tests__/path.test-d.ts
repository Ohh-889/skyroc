import { describe, expectTypeOf, it } from 'vitest';
import type {
  AllPaths,
  AllPathsKeys,
  AllPathsShape,
  ArrayElementValue,
  ArrayKeys,
  Join,
  LeafPaths,
  PathToDeepType,
  PathToType,
  PathValue,
  ShapeFromPaths
} from '../src/type';

interface FormValues {
  age: number;
  info: { city: string; pl: { deep: string } };
  list: { id: number; tag: string }[];
}

interface TreeNode {
  children: TreeNode[];
  name: string;
}

describe('Join', () => {
  it('空前缀直接返回段名', () => {
    expectTypeOf<Join<'', 'user'>>().toEqualTypeOf<'user'>();
    expectTypeOf<Join<'user', 'name'>>().toEqualTypeOf<'user.name'>();
    expectTypeOf<Join<'list', number>>().toEqualTypeOf<`list.${number}`>();
  });
});

describe('LeafPaths', () => {
  it('只枚举叶子路径', () => {
    expectTypeOf<LeafPaths<FormValues>>().toEqualTypeOf<
      'age' | 'info.city' | 'info.pl.deep' | `list.${number}.id` | `list.${number}.tag`
    >();
  });

  // 回归：LeafPaths 曾没有深度守卫，递归类型直接 TS2589
  it('递归类型有深度守卫，不会无限展开', () => {
    expectTypeOf<LeafPaths<TreeNode>>().toExtend<string>();
  });

  it('可选字段不会带出 undefined', () => {
    expectTypeOf<LeafPaths<{ a?: { b: string } }>>().toEqualTypeOf<'a.b'>();
  });

  it('停在 Atomic，不下探 Date 的方法', () => {
    expectTypeOf<LeafPaths<{ when: Date }>>().toEqualTypeOf<'when'>();
  });
});

describe('AllPaths / AllPathsKeys', () => {
  it('同时包含中间节点与叶子', () => {
    expectTypeOf<AllPaths<FormValues>>().toEqualTypeOf<
      | 'age'
      | 'info'
      | 'info.city'
      | 'info.pl'
      | 'info.pl.deep'
      | 'list'
      | `list.${number}`
      | `list.${number}.id`
      | `list.${number}.tag`
    >();
  });

  it('AllPathsKeys 与 AllPaths 等价', () => {
    expectTypeOf<AllPathsKeys<FormValues>>().toEqualTypeOf<AllPaths<FormValues>>();
  });

  it('可选字段不会带出 undefined', () => {
    expectTypeOf<AllPathsKeys<{ a?: { b: string } }>>().toEqualTypeOf<'a' | 'a.b'>();
  });

  it('递归类型有深度守卫', () => {
    expectTypeOf<AllPathsKeys<TreeNode>>().toExtend<string>();
  });

  // filed-form 的泛型默认值是 any，必须保持宽松，否则所有 name 都会报错
  it('T 为 any 时退化成 string', () => {
    expectTypeOf<AllPathsKeys<any>>().toEqualTypeOf<string>();
  });
});

describe('AllPathsShape', () => {
  it('把所有路径摊成 Record<path, true>', () => {
    expectTypeOf<AllPathsShape<{ a: { b: string } }>>().toEqualTypeOf<{ a: true; 'a.b': true }>();
  });
});

describe('PathValue', () => {
  it('按点分路径取值', () => {
    expectTypeOf<PathValue<FormValues, 'age'>>().toEqualTypeOf<number>();
    expectTypeOf<PathValue<FormValues, 'info.city'>>().toEqualTypeOf<string>();
    expectTypeOf<PathValue<FormValues, 'info.pl.deep'>>().toEqualTypeOf<string>();
    expectTypeOf<PathValue<FormValues, 'list'>>().toEqualTypeOf<{ id: number; tag: string }[]>();
  });

  it('数组下标支持具体数字与 number 通配', () => {
    expectTypeOf<PathValue<FormValues, 'list.0.id'>>().toEqualTypeOf<number>();
    expectTypeOf<PathValue<FormValues, 'list.number.id'>>().toEqualTypeOf<number>();
    expectTypeOf<PathValue<FormValues, `list.${number}`>>().toEqualTypeOf<{ id: number; tag: string }>();
  });

  // 回归：所有兜底分支曾返回 any，写错路径静默通过
  it('路径无效时是 never 而不是 any', () => {
    expectTypeOf<PathValue<FormValues, 'infoo'>>().toBeNever();
    expectTypeOf<PathValue<FormValues, 'info.cityy'>>().toBeNever();
    expectTypeOf<PathValue<FormValues, 'age.nope'>>().toBeNever();
    expectTypeOf<PathValue<FormValues, 'list.0.nope'>>().toBeNever();
  });

  // 回归：'number' 段曾无条件当作数组下标，同名真实字段被吞掉
  it('真实字段优先于下标通配', () => {
    expectTypeOf<PathValue<{ number: { x: string } }, 'number'>>().toEqualTypeOf<{ x: string }>();
    expectTypeOf<PathValue<{ number: { x: string } }, 'number.x'>>().toEqualTypeOf<string>();
  });

  it('T 为 any 时整体返回 any', () => {
    expectTypeOf<PathValue<any, 'a.b.c'>>().toBeAny();
  });

  it('可选中间节点不会退化成 any', () => {
    expectTypeOf<PathValue<{ a?: { b: string } }, 'a.b'>>().toEqualTypeOf<string>();
  });
});

describe('PathToType', () => {
  it('只可选化最外层', () => {
    expectTypeOf<PathToType<FormValues, 'info'>>().toEqualTypeOf<{ city?: string; pl?: { deep: string } }>();
    expectTypeOf<PathToType<FormValues, 'age'>>().toEqualTypeOf<number>();
  });
});

describe('PathToDeepType', () => {
  // 回归：内部映射漏了 `?`，此前完全没有可选化，等价于 PathValue
  it('递归可选化', () => {
    expectTypeOf<PathToDeepType<FormValues, 'info'>>().toEqualTypeOf<{ city?: string; pl?: { deep?: string } }>();
    expectTypeOf<PathToDeepType<FormValues, 'list'>>().toEqualTypeOf<{ id?: number; tag?: string }[]>();
  });

  it('叶子路径原样返回', () => {
    expectTypeOf<PathToDeepType<FormValues, 'info.city'>>().toEqualTypeOf<string>();
  });

  it('T 为 any 时返回 any', () => {
    expectTypeOf<PathToDeepType<any, 'a.b'>>().toBeAny();
  });
});

describe('ShapeFromPaths', () => {
  it('只保留被引用到的字段', () => {
    expectTypeOf<ShapeFromPaths<FormValues, ['age', 'info']>>().toEqualTypeOf<{
      age: number;
      info: { city?: string; pl?: { deep?: string } };
    }>();
  });

  it('数组路径带下标段时收敛到元素形状', () => {
    expectTypeOf<ShapeFromPaths<FormValues, ['list.2.tag']>>().toEqualTypeOf<{ list: { tag: string }[] }>();
  });

  // 回归：`'list.0'` 这类以下标结尾的路径此前会得到 never[]
  it('以下标结尾的路径给出完整元素类型', () => {
    expectTypeOf<ShapeFromPaths<FormValues, ['list.0']>>().toEqualTypeOf<{
      list: { id?: number; tag?: string }[];
    }>();
  });

  it('路径列表为空时返回原类型', () => {
    expectTypeOf<ShapeFromPaths<FormValues, []>>().toEqualTypeOf<FormValues>();
  });
});

describe('ArrayKeys', () => {
  it('取出数组字段的键名', () => {
    expectTypeOf<ArrayKeys<{ name: string; tags: string[] }>>().toEqualTypeOf<'tags'>();
  });

  it('可选数组字段不会带出 undefined', () => {
    expectTypeOf<ArrayKeys<{ users?: { id: number }[] }>>().toEqualTypeOf<'users'>();
  });

  it('readonly 数组同样识别', () => {
    expectTypeOf<ArrayKeys<{ ro: readonly string[] }>>().toEqualTypeOf<'ro'>();
  });

  // 回归：没有数组字段时曾返回 any，把类型洞开到调用方
  it('没有数组字段时为 never', () => {
    expectTypeOf<ArrayKeys<{ a: number; b: string }>>().toBeNever();
  });

  it('T 为 any 时保持宽松', () => {
    expectTypeOf<ArrayKeys<any> & string>().toEqualTypeOf<string>();
  });
});

describe('ArrayElementValue', () => {
  it('取元素类型', () => {
    expectTypeOf<ArrayElementValue<{ users: { id: number }[] }, 'users'>>().toEqualTypeOf<{ id: number }>();
  });

  // 回归：判定用的是 `(infer U)[]`，readonly 数组匹配不上，返回 any
  it('readonly 数组与 ArrayKeys 保持一致', () => {
    expectTypeOf<ArrayElementValue<{ ro: readonly string[] }, 'ro'>>().toEqualTypeOf<string>();
  });

  it('可选数组字段取到去 undefined 的元素类型', () => {
    expectTypeOf<ArrayElementValue<{ tags?: string[] }, 'tags'>>().toEqualTypeOf<string>();
  });

  it('字段不是数组时为 never', () => {
    expectTypeOf<ArrayElementValue<{ a: number }, 'a'>>().toBeNever();
  });
});
