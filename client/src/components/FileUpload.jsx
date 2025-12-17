import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function FileUpload({ onUploadSuccess, onUploadError, token }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);
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

    const files = Array.from(e.dataTransfer.files);
    handleFilesSelect(files);
  };

  const handleFilesSelect = (fileList) => {
    const files = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push({ file: file.name, error });
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setResults({
        uploaded: [],
        failed: errors.map((e) => ({ filename: e.file, error: e.error })),
      });
    } else {
      setResults(null);
    }

    setSelectedFiles(validFiles);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setResults(null);
    setUploadProgress(0);

    try {
      const { uploadFormFile } = await import('../utils/api');
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append('formFile', file);
      });

      const response = await uploadFormFile(
        formData,
        token,
        (progress) => setUploadProgress(progress)
      );

      setResults(response.data);
      setSelectedFiles([]);
      setUploadProgress(0);

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      setResults({
        uploaded: [],
        failed: [{ filename: 'Upload', error: error.userMessage || 'Upload fehlgeschlagen' }],
      });

      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    setResults(null);
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

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-textPrimary mb-4">
        Formulare hochladen
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
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {selectedFiles.length === 0 && !isUploading && (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-textPrimary mb-2">
              Markdown-Dateien hier ablegen oder klicken
            </p>
            <p className="text-sm text-gray-500">
              Nur .md Dateien, maximal 1MB pro Datei
            </p>
          </div>
        )}

        {selectedFiles.length > 0 && !isUploading && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between gap-4 p-2 bg-gray-50 rounded">
                <div className="flex-1 text-left">
                  <p className="text-textPrimary font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <div className="text-sm text-gray-600 pt-2 border-t">
              {selectedFiles.length} Datei(en) • {formatFileSize(getTotalSize())} gesamt
            </div>
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

      {selectedFiles.length > 0 && !isUploading && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg"
          >
            {selectedFiles.length === 1 ? 'Hochladen' : `${selectedFiles.length} Dateien hochladen`}
          </button>
          <button
            onClick={handleRemoveAll}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-default"
          >
            Alle entfernen
          </button>
        </div>
      )}

      {results && (
        <div className="mt-4 space-y-2">
          {results.uploaded && results.uploaded.length > 0 && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">
                    {results.uploaded.length} Datei(en) erfolgreich hochgeladen
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-green-700">
                    {results.uploaded.map((item, index) => (
                      <li key={index}>
                        {item.filename} - {item.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {results.failed && results.failed.length > 0 && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">
                    {results.failed.length} Datei(en) fehlgeschlagen
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-red-700">
                    {results.failed.map((item, index) => (
                      <li key={index}>
                        {item.filename}: {item.error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
