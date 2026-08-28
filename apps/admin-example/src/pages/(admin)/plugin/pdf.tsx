// oxlint-disable import/no-unassigned-import
import { createFileRoute } from '@tanstack/react-router';
import { Button, Checkbox, Pagination, Skeleton, Space, message } from 'antd';
import { saveAs } from 'file-saver';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import printJS from 'print-js';
import { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';

import { ExamplePanel, PluginPageHeader } from './modules/shared';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const pdfSource = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
const rotations = [0, 90, 180, 270] as const;
const pdfFileName = 'react-plugin-demo.pdf';
const pdfMimeType = 'application/pdf';

const PdfDemo = () => {
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [showAllPages, setShowAllPages] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);

  function handleDocumentLoadSuccess(document: PDFDocumentProxy) {
    setPageCount(document.numPages);
    setPdfDocument(document);
  }

  function handleShowAllPagesChange(event: { target: { checked: boolean } }) {
    setShowAllPages(event.target.checked);
    setCurrentPage(1);
  }

  function handleRotate() {
    setRotationIndex(index => (index + 1) % rotations.length);
  }

  async function getPdfBlob() {
    if (!pdfDocument) {
      throw new Error('PDF 文档还没有加载完成');
    }

    const data = await pdfDocument.getData();
    const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;

    return new Blob([buffer], { type: pdfMimeType });
  }

  async function handlePrint() {
    setIsPrinting(true);

    try {
      const blob = await getPdfBlob();
      const blobUrl = URL.createObjectURL(blob);

      printJS({
        documentTitle: pdfFileName,
        fallbackPrintable: pdfSource,
        onError() {
          URL.revokeObjectURL(blobUrl);
          setIsPrinting(false);
          message.error('PDF 打印失败');
        },
        onPrintDialogClose() {
          URL.revokeObjectURL(blobUrl);
          setIsPrinting(false);
        },
        printable: blobUrl,
        type: 'pdf'
      });
    } catch {
      message.error('PDF 文档还没有加载完成');
      setIsPrinting(false);
    }
  }

  async function handleDownload() {
    setIsDownloading(true);

    try {
      const blob = await getPdfBlob();

      saveAs(blob, pdfFileName);
    } catch {
      message.error('PDF 下载失败');
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:file-pdf-box"
        resources={[{ label: 'react-pdf', url: 'https://github.com/wojtekmaj/react-pdf' }]}
        tags={['react-pdf', 'pdf.js worker']}
        title="PDF 预览示例"
      />
      <ExamplePanel
        icon="mdi:file-pdf-box"
        title="PDF 预览"
      >
        <Space
          className="mb-4 w-full justify-end"
          wrap
        >
          <Checkbox
            checked={showAllPages}
            onChange={handleShowAllPagesChange}
          >
            显示全部页面
          </Checkbox>
          <Button onClick={handleRotate}>旋转 90°</Button>
          <Button
            disabled={!pdfDocument}
            loading={isPrinting}
            onClick={handlePrint}
          >
            打印
          </Button>
          <Button
            disabled={!pdfDocument}
            loading={isDownloading}
            type="primary"
            onClick={handleDownload}
          >
            下载
          </Button>
        </Space>
        <div className="max-h-720px overflow-auto rounded-lg bg-layout p-4">
          <Document
            file={pdfSource}
            loading={
              <Skeleton
                active
                paragraph={{ rows: 8 }}
              />
            }
            onLoadSuccess={handleDocumentLoadSuccess}
          >
            {showAllPages ? (
              Array.from({ length: pageCount }, (_, index) => (
                <div
                  className="mb-4 flex justify-center"
                  key={index}
                >
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    rotate={rotations[rotationIndex]}
                    width={760}
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center">
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={false}
                  rotate={rotations[rotationIndex]}
                  width={760}
                />
              </div>
            )}
          </Document>
        </div>
        {!showAllPages && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={1}
              total={pageCount}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/pdf')({
  component: PdfDemo,
  staticData: {
    i18nKey: 'route.plugin_pdf',
    menu: {
      icon: 'mdi:file-pdf-box',
      order: 70
    },
    title: 'plugin_pdf'
  }
});
