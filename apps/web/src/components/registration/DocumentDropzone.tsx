'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface DocumentDropzoneProps {
  onUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  label?: string;
}

export function DocumentDropzone({
  onUpload,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  },
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  label = 'Upload documents',
}: DocumentDropzoneProps) {
  const [files, setFiles] = useState<{ file: File; preview?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: { file: File; errors: { message: string }[] }[]) => {
      setError(null);
      if (rejected.length > 0) {
        setError(rejected[0].errors[0].message);
        return;
      }
      const newFiles = accepted.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      const combined = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(combined);
      onUpload(combined.map((f) => f.file));
    },
    [files, maxFiles, onUpload]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onUpload(updated.map((f) => f.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
        {isDragActive ? (
          <p className="text-sm text-brand-600 font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 font-medium">
              Drag & drop or <span className="text-brand-600 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, PNG, JPG up to {formatSize(maxSize)}
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
            >
              {f.preview ? (
                <img src={f.preview} alt="" className="w-10 h-10 rounded object-cover" />
              ) : (
                <FileText className="w-5 h-5 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{f.file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(f.file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
