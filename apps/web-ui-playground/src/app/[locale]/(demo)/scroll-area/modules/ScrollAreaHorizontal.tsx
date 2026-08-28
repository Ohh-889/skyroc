'use client';

import { ScrollArea } from '@skyroc/web-ui';

const works = [
  {
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
    artist: 'Ornella Binni',
    id: '1'
  },
  {
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
    artist: 'Tom Byrom',
    id: '2'
  },
  {
    art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
    artist: 'Vladimir Malyavko',
    id: '3'
  }
];

const ScrollAreaHorizontal = () => {
  return (
    <ScrollArea
      className="w-96 rounded-md border whitespace-nowrap"
      orientation="horizontal"
    >
      <div className="flex w-max space-x-4 p-4">
        {works.map(work => (
          <figure
            className="shrink-0"
            key={work.id}
          >
            <div className="overflow-hidden rounded-md">
              <img
                alt={`Photo by ${work.artist}`}
                className="aspect-[3/4] h-56 w-36 object-cover"
                src={work.art}
              />
            </div>

            <figcaption className="text-muted-foreground pt-2 text-xs">
              Photo by <span className="text-foreground font-semibold">{work.artist}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ScrollAreaHorizontal;
