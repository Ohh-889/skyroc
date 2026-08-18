import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="skyroc-nav-brand">
          <span className="skyroc-nav-brand-icon">
            <Image
              alt=""
              height={30}
              priority
              src="/favicon.svg"
              width={30}
            />
          </span>
          <strong>{appName}</strong>
          <span className="skyroc-nav-brand-badge">Docs</span>
        </span>
      ),
      transparentMode: 'always'
    },
    links: [
      {
        text: '组件',
        url: '/components/button',
        active: 'nested-url'
      },
      {
        text: '概览',
        url: '/overview/introduction',
        active: 'nested-url'
      },
      {
        external: true,
        icon: (
          <ExternalLink
            aria-hidden="true"
            size={14}
          />
        ),
        text: 'Admin Docs',
        type: 'button',
        url: 'https://admin-docs.skyroc.me/docs/web/ui'
      }
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`
  };
}
