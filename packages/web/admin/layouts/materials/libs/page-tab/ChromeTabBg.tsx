import { memo } from 'react';

// eslint-disable-next-line react/display-name
const ChromeTabBg = memo(() => {
  return (
    <svg className="size-full">
      <defs>
        <symbol
          id="geometry-left"
          viewBox="0 0 214 36"
        >
          <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
        </symbol>
        <symbol
          id="geometry-right"
          viewBox="0 0 214 36"
        >
          <use xlinkHref="#geometry-left" />
        </symbol>
        <clipPath>
          <rect
            height="100%"
            width="100%"
            x="0"
          />
        </clipPath>
      </defs>
      <svg
        height="100%"
        width="51%"
      >
        <use
          fill="currentColor"
          height="36"
          width="214"
          xlinkHref="#geometry-left"
        />
      </svg>
      <g transform="scale(-1, 1)">
        <svg
          height="100%"
          width="51%"
          x="-100%"
          y="0"
        >
          <use
            fill="currentColor"
            height="36"
            width="214"
            xlinkHref="#geometry-right"
          />
        </svg>
      </g>
    </svg>
  );
});

export default ChromeTabBg;
