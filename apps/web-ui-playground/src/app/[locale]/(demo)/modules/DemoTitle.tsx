'use client';
import { usePathname } from 'next/navigation';

const DemoTitle = () => {
  const pathname = usePathname();

  const currentTab = pathname.split('/').pop();

  if (!currentTab) return null;

  const title = currentTab.charAt(0).toUpperCase() + currentTab.slice(1);

  return <h3 className="text-base font-semibold tracking-tight">{title} Demo</h3>;
};

export default DemoTitle;
