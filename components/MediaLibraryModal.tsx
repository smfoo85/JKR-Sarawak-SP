import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Copy, Search, Image as ImageIcon, AlertCircle, Edit, Save, CheckCircle, FileUp, MousePointerClick } from 'lucide-react';
import { getImages, addImage, deleteImage, updateImageName } from '../utils/mediaLibrary';
import type { MediaItem } from '../types';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setImages(getImages());
      setError('');
      setSearchQuery('');
      dragCounter.current = 0; // Reset drag counter on open
    }
  }, [isOpen]);
  
  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('File size exceeds 2MB limit. Please upload images under 2MB.');
      return;
    }
     if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload a valid image (PNG, JPG, GIF, SVG).');
        return;
    }

    setIsUploading(true);
    setError('');
    try {
      const updatedImages = await addImage(file);
      setImages(updatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        handleFile(event.target.files[0]);
    }
    // Reset file input to allow uploading the same file again
    if (event.target) {
        event.target.value = '';
    }
  };
  
  const handleDragEvents = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
      handleDragEvents(e);
      dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
          setIsDragging(true);
      }
  };

  const handleDragLeave = (e: React.DragEvent) => {
      handleDragEvents(e);
      dragCounter.current--;
      if (dragCounter.current === 0) {
          setIsDragging(false);
      }
  };

  const handleDrop = (e: React.DragEvent) => {
      handleDragEvents(e);
      setIsDragging(false);
      dragCounter.current = 0; // Reset counter on drop
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
          e.dataTransfer.clearData();
      }
  };

  if (!isOpen) return null;

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      const updatedImages = deleteImage(id);
      setImages(updatedImages);
    }
  };
  
  const handleCopy = (data: string, id: string) => {
    navigator.clipboard.writeText(data);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditName = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };
  
  const handleSaveName = (id: string) => {
    if (editingName.trim()) {
      const updatedImages = updateImageName(id, editingName.trim());
      setImages(updatedImages);
    }
    setEditingId(null);
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a,b) => b.id.localeCompare(a.id));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Media Library</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search images by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-700 border-transparent rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
              {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{isUploading ? 'Uploading...' : 'Upload New Image'}</span>
            </button>
            <input type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          </div>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
        </div>

        <div 
          className="flex-grow p-4 overflow-y-auto relative"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEvents}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
              <div className="absolute inset-0 bg-red-500/20 border-4 border-dashed border-red-500 rounded-xl m-2 z-20 flex items-center justify-center pointer-events-none">
                  <div className="text-center font-bold text-red-600 dark:text-red-300">
                      <FileUp className="w-16 h-16 mx-auto" />
                      <p>Drop image to upload</p>
                  </div>
              </div>
          )}
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map(image => (
                <div key={image.id} className="group relative border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm flex flex-col">
                  <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <button onClick={() => handleDelete(image.id, image.name)} className="p-1.5 bg-white/80 dark:bg-black/70 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Image"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => handleCopy(image.data, image.id)} className="p-1.5 bg-white/80 dark:bg-black/70 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="Copy Data URL">
                        {copiedId === image.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                  </div>
                  <div className="w-full h-32 bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center p-2 relative">
                      <img src={image.data} alt={image.name} className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => onSelectImage(image.data)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transform hover:scale-105 transition-transform">
                             <MousePointerClick className="w-4 h-4" /> Select Image
                          </button>
                      </div>
                  </div>
                  <div className="p-2 text-xs bg-white dark:bg-slate-800 flex-grow flex flex-col justify-between">
                      <div>
                        {editingId === image.id ? (
                          <div className="flex items-center gap-1">
                            <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)} className="w-full text-xs bg-gray-100 dark:bg-slate-700 p-1 rounded" autoFocus onKeyDown={e => e.key === 'Enter' && handleSaveName(image.id)} />
                            <button onClick={() => handleSaveName(image.id)} className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-800 rounded-full" title="Save Name"><Save className="w-3 h-3"/></button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" title="Cancel Edit"><X className="w-3 h-3"/></button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-1">
                              <p className="font-semibold text-gray-800 dark:text-slate-200 break-all leading-snug cursor-default" title={image.name}>{image.name}</p>
                              <button onClick={() => handleEditName(image.id, image.name)} className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" title="Edit Name"><Edit className="w-3 h-3"/></button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mt-1">
                        <span>{formatBytes(image.size)}</span>
                        <span className="font-mono uppercase bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-sm">{image.type.split('/')[1]}</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
                className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-slate-400 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mb-4" />
              <h4 className="font-semibold text-lg">Your Media Library is Empty</h4>
              <p className="text-sm">Drag & drop an image here, or click to browse.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};