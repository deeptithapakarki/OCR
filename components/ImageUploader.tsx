
// components/ImageUploader.tsx
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized drag and drop handlers to prevent unnecessary re-renders.
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isLoading) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isLoading) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleClick = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white flex justify-center items-center">
            <img src={imageUrl} alt="Uploaded Contact List" className="max-w-full max-h-96 object-contain rounded-md shadow-md" />
        </div>
      ) : (
        <div
          className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'}
            ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center space-y-4 text-slate-500">
            <UploadIcon className="w-12 h-12" />
            <p className="font-semibold text-slate-700">Drag & drop an image here</p>
            <p className="text-sm">or click to select a file</p>
          </div>
        </div>
      )}
    </div>
  );
};
