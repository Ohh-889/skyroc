import { redirect } from 'next/navigation';

const OVERVIEW_SLUGS = new Set([
  'design-system',
  'examples',
  'getting-started',
  'migration',
  'theming',
  'usage-guides'
]);

const LegacyDocsPage = async (props: PageProps<'/docs/[[...slug]]'>) => {
  const params = await props.params;
  const slug = params.slug ?? [];

  if (slug.length === 0) {
    redirect('/overview/introduction');
  }

  const [section, ...rest] = slug;

  if (section === 'components') {
    redirect(rest.length > 0 ? `/components/${rest.join('/')}` : '/components/button');
  }

  if (section && OVERVIEW_SLUGS.has(section)) {
    redirect(`/overview/${[section, ...rest].join('/')}`);
  }

  redirect('/overview/introduction');
};

export default LegacyDocsPage;
