import apiClient from './api-client';

export interface UploadResult {
  url: string;
  key: string;
}

export async function getPresignedUrl(
  fileName: string,
  contentType: string,
  documentType: string
): Promise<{ url: string; key: string; fields?: Record<string, string> }> {
  const response = await apiClient.post('/upload/presigned-url', {
    file_name: fileName,
    content_type: contentType,
    document_type: documentType,
  });
  return response.data;
}

export async function uploadDocument(
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Upload failed due to network error'));
    };

    xhr.send(file);
  });
}

export async function uploadKYCDocument(
  file: File,
  documentType: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const { url, key } = await getPresignedUrl(file.name, file.type, documentType);
  await uploadDocument(file, url, onProgress);
  return { url, key };
}
