import type { CardInfo } from './shared';

const HeaderDescription = (item: CardInfo) => {
  return (
    <ACard
      className="card-wrapper"
      key={item.title}
      size="small"
      title={item.title}
      variant="borderless"
    >
      <ADescriptions
        bordered
        column={{ lg: 2, md: 2, sm: 2, xl: 2, xs: 1, xxl: 2 }}
        size="small"
      >
        {item.content.map(pkgInfo => (
          <ADescriptions.Item
            key={pkgInfo.label}
            label={pkgInfo.label}
          >
            {pkgInfo.render ? pkgInfo.render(pkgInfo) : pkgInfo.nameOrHref}
          </ADescriptions.Item>
        ))}
      </ADescriptions>
    </ACard>
  );
};

export default HeaderDescription;
