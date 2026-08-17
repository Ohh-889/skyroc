/**
 * Query string 解析 / 序列化。
 *
 * 移植自 vue-router 的 `src/query.ts`（MIT License, Copyright (c) 2019 Eduardo San Martin Morote）， 保留了它的编码策略：空格用 `+`、`+`
 * 转义成 `%2B`、`[]{}|^\`` 保持字面量不编码。
 *
 * @see https://github.com/vuejs/router/blob/main/packages/router/src/query.ts
 */

export type LocationQueryValue = string | null;

/**
 * Normalized query object that appears in route locations.
 *
 * @public
 */
export type LocationQuery = Record<string, LocationQueryValue | LocationQueryValue[]>;
export type LocationQueryValueRaw = LocationQueryValue | number | undefined;

export type LocationQueryRaw = Record<string | number, LocationQueryValueRaw | LocationQueryValueRaw[]>;

const PLUS_RE = /\+/g; // %2B

const EQUAL_RE = /[=]/g; // %3D

const ENC_BRACKET_OPEN_RE = /%5B/g; // [
const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
const ENC_CARET_RE = /%5E/g; // ^
const ENC_BACKTICK_RE = /%60/g; // `
const ENC_CURLY_OPEN_RE = /%7B/g; // {
const ENC_PIPE_RE = /%7C/g; // |
const ENC_CURLY_CLOSE_RE = /%7D/g; // }
const ENC_SPACE_RE = /%20/g; // space
const HASH_RE = /#/g; // %23
const AMPERSAND_RE = /&/g; // %26

/**
 * Transforms a query string into a normalized query object.
 *
 * Accepts both forms with or without the leading question mark.
 */
export function parseQuery(search: string): LocationQuery {
  const query = Object.create(null) as LocationQuery;

  if (search === '' || search === '?') return query;
  const hasLeadingQuestionMark = search[0] === '?';
  const searchParams = (hasLeadingQuestionMark ? search.slice(1) : search).split('&');

  for (let i = 0; i < searchParams.length; i += 1) {
    const rawSearchParam = searchParams[i];

    if (rawSearchParam !== '') {
      const searchParam = rawSearchParam.replace(PLUS_RE, ' ');
      const eqPos = searchParam.indexOf('=');
      const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));

      if (Object.hasOwn(query, key)) {
        let currentValue = query[key];
        if (!Array.isArray(currentValue)) {
          currentValue = [currentValue];
          query[key] = currentValue;
        }
        (currentValue as LocationQueryValue[]).push(value);
      } else {
        query[key] = value;
      }
    }
  }
  return query;
}

export function stringifyQuery(query: LocationQueryRaw): string {
  let search = '';

  for (const [originalKey, value] of Object.entries(query)) {
    const key = encodeQueryKey(originalKey);
    if (value === null) {
      search = appendQueryParam(search, key, null);
    } else {
      const values = Array.isArray(value) ? value.map(encodeQueryParamValue) : [encodeQueryParamValue(value)];

      for (const v of values) {
        if (v !== undefined) {
          search = appendQueryParam(search, key, v);
        }
      }
    }
  }

  return search ? `?${search}` : '';
}

export function decode(text: string | number): string {
  try {
    return decodeURIComponent(`${text}`);
  } catch {
    // oxlint-disable-next-line no-console
    console.warn(`Error decoding "${text}". Using original value`);
  }
  return `${text}`;
}

export function encodeQueryKey(text: string | number): string {
  return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
}

export function encodeQueryValue(text: string | number): string {
  return (
    commonEncode(text)
      // Encode the space as +, encode the + to differentiate it from the space
      .replace(PLUS_RE, '%2B')
      .replace(ENC_SPACE_RE, '+')
      .replace(HASH_RE, '%23')
      .replace(AMPERSAND_RE, '%26')
      .replace(ENC_BACKTICK_RE, '`')
      .replace(ENC_CURLY_OPEN_RE, '{')
      .replace(ENC_CURLY_CLOSE_RE, '}')
      .replace(ENC_CARET_RE, '^')
  );
}

function appendQueryParam(search: string, key: string, value: string | null): string {
  const prefix = search.length ? '&' : '';
  const suffix = value === null ? '' : `=${value}`;

  return `${search}${prefix}${key}${suffix}`;
}

function encodeQueryParamValue(value: LocationQueryValueRaw): string | null | undefined {
  if (value === undefined || value === null) return value;

  return encodeQueryValue(value);
}

function commonEncode(text: string | number): string {
  return encodeURI(`${text}`)
    .replace(ENC_PIPE_RE, '|')
    .replace(ENC_BRACKET_OPEN_RE, '[')
    .replace(ENC_BRACKET_CLOSE_RE, ']');
}
