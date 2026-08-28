'use client';

import { Badge, Button, SkeletonContainer } from '@skyroc/web-ui';

const CustomSize = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* SkeletonContainer - User Profile Card */}
      <div className="rounded-lg border p-4">
        <h4 className="text-muted-foreground mb-3 text-sm font-medium">User Profile (Auto Skeletonize)</h4>

        <SkeletonContainer loading>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full" />

            <div>
              <h3 className="text-lg font-semibold">User Name</h3>
              <p className="text-gray-500">User description goes here</p>
            </div>
          </div>
        </SkeletonContainer>
      </div>

      {/* SkeletonContainer - Article Preview */}
      <div className="rounded-lg border p-4">
        <h4 className="text-muted-foreground mb-3 text-sm font-medium">Article Preview (Auto Skeletonize)</h4>

        <SkeletonContainer loading>
          <article className="space-y-3">
            <h2 className="text-xl font-bold">Article Title Here</h2>

            <p className="text-muted-foreground">
              This is a preview of the article content. It shows how the skeleton container can automatically generate
              placeholders for text content.
            </p>

            <div className="flex gap-2">
              <Badge>Technology</Badge>
              <Badge color="secondary">News</Badge>
            </div>
          </article>
        </SkeletonContainer>
      </div>

      {/* SkeletonContainer - Product Card */}
      <div className="rounded-lg border p-4">
        <h4 className="text-muted-foreground mb-3 text-sm font-medium">Product Card (Auto Skeletonize)</h4>

        <SkeletonContainer loading>
          <div className="flex gap-4">
            <div className="h-24 w-24 rounded-lg object-cover" />

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">Product Name</h3>
              <p className="text-muted-foreground text-sm">Short product description here</p>

              <div className="flex items-center justify-between">
                <span className="text-primary text-lg font-bold">$99.99</span>
                <Button size="sm">Add to Cart</Button>
              </div>
            </div>
          </div>
        </SkeletonContainer>
      </div>

      {/* SkeletonContainer - Exclude Elements by Key */}
      <div className="rounded-lg border p-4">
        <h4 className="text-muted-foreground mb-3 text-sm font-medium">Exclude by Key</h4>

        <SkeletonContainer
          loading
          excludeKeys={['action-btn']}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Action Item</h3>
              <p className="text-muted-foreground text-sm">This item needs your attention</p>
            </div>

            <Button
              key="action-btn"
              variant="solid"
            >
              Take Action
            </Button>
          </div>
        </SkeletonContainer>
      </div>
    </div>
  );
};

export default CustomSize;
