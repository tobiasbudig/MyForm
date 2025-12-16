import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function FileUpload({ onUploadSuccess, onUploadError, token }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  const validateFile = (file) => {
    if (!file.name.endsWith('.md')) {
      return 'Nur .md Dateien sind erlaubt';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Datei ist zu groß. Maximum 1MB';
    }
    return null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      setStatus('error');
      setMessage(error);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setStatus(null);
    setMessage('');
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setStatus(null);
    setMessage('');
    setUploadProgress(0);

    try {
      const { uploadFormFile } = await import('../utils/api');
      const response = await uploadFormFile(
        selectedFile,
        token,
        (progress) => setUploadProgress(progress)
      );

      setStatus('success');
      setMessage(response.data.message || 'Erfolgreich hochgeladen!');
      setSelectedFile(null);
      setUploadProgress(0);

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.userMessage || 'Upload fehlgeschlagen');

      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setStatus(null);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-textPrimary mb-4">
        Formular hochladen
      </h2>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-colors cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {!selectedFile && !isUploading && (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-textPrimary mb-2">
              Markdown-Datei hier ablegen oder klicken
            </p>
            <p className="text-sm text-gray-500">
              Nur .md Dateien, maximal 1MB
            </p>
          </div>
        )}

        {selectedFile && !isUploading && (
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 text-left">
              <p className="text-textPrimary font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-textPrimary">
                Wird hochgeladen... {uploadProgress}%
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedFile && !isUploading && (
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg"
        >
          Hochladen
        </button>
      )}

      {status && (
        <div
          className={`
            mt-4 p-4 rounded-lg flex items-center gap-3
            ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
          `}
        >
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="flex-1">{message}</p>
        </div>
      )}
    </div>
  );
}
