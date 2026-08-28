import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { NextRequest, NextResponse } from 'next/server';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(`${docsRoute}{/*path}`, `${docsContentRoute}{/*path}/content.md`);
const { rewrite: rewriteSuffix } = rewritePath(`${docsRoute}{/*path}.mdx`, `${docsContentRoute}{/*path}/content.md`);

export default function middleware(request: NextRequest) {
  const suffixPath = rewriteSuffix(request.nextUrl.pathname);
  if (suffixPath) {
    return NextResponse.rewrite(new URL(suffixPath, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const docsPath = rewriteDocs(request.nextUrl.pathname);

    if (docsPath) {
      return NextResponse.rewrite(new URL(docsPath, request.nextUrl));
    }
  }

  return NextResponse.next();
}
