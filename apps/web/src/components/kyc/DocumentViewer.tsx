'use client';

import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, FileText } from 'lucide-react';

interface DocumentViewerProps {
  url: string;
  fileName: string;
  fileType: string;
  onClose: () => void;
}

export function DocumentViewer({ url, fileName, fileType, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);

  const isImage = fileType.startsWith('image/');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-gray-500 shrink-0" />
          <h3 className="text-sm font-medium text-gray-900 truncate">{fileName}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isImage && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-xs text-gray-500 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 ml-2">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        {isImage ? (
          <img
            src={url}
            alt={fileName}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
          />
        ) : (
          <iframe src={url} className="w-full h-full rounded-lg" title={fileName} />
        )}
      </div>
    </div>
  );
}
