'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@skyroc/web-ui';
import { CircleDashed } from 'lucide-react';

const Default = () => {
  return (
    <ResizablePanelGroup
      className="max-w-md rounded-lg border"
      id="demo-group-1"
      orientation="horizontal"
    >
      <ResizablePanel
        collapsible
        collapsedSize={10}
        defaultSize={50}
        id="demo-panel-1"
        minSize={20}
      >
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        id="demo-handle-1"
      />

      <ResizablePanel
        defaultSize={50}
        id="demo-panel-2"
        minSize={20}
      >
        <ResizablePanelGroup
          id="demo-group-2"
          orientation="vertical"
        >
          <ResizablePanel
            defaultSize={25}
            id="demo-panel-3"
            minSize={25}
          >
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            id="demo-handle-2"
          >
            <CircleDashed />
          </ResizableHandle>

          <ResizablePanel
            defaultSize={75}
            id="demo-panel-4"
            minSize={25}
          >
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Default;
