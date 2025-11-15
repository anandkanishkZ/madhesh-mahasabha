'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  File,
  Search,
  Grid,
  List,
  Trash2,
  Eye,
  Download,
  Filter,
  FolderOpen,
  Plus,
  MoreVertical,
  Calendar,
  HardDrive
} from 'lucide-react';
import { 
  getMedia, 
  uploadMultipleMedia, 
  deleteMedia as deleteMediaApi,
  getAuthToken,
  isAuthenticated,
  getApiBaseUrl,
  type Media 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedImage from '@/components/AuthenticatedImage';

interface MediaFile {
  id: string;
  filename: string;
  storedName?: string;
  originalName?: string;
  category: string; // 'image', 'document', 'video', 'audio', 'other'
  url: string;
  size: number;
  type?: 'image' | 'document';
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  width?: number;
  height?: number;
  createdAt: string;
  thumbnailUrl?: string;
}

// Utility functions
function getValidImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const API_BASE_URL = getApiBaseUrl();
  // If URL already has /api/media/file, use it directly
  if (url.includes('/api/media/file/')) {
    return url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
  }
  // Otherwise, assume it's just a filename and construct the full URL
  return `${API_BASE_URL}/api/media/file/${url.replace(/^[\/]+/, '')}`;
}

function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Simple Layout Component
function DashboardLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

function UploadModal({ open, onClose, onUpload, uploading }: {
  open: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
  uploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      onUpload(droppedFiles);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files);
    }
  };
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-gray-200 animate-fade-in" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-bold" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700 tracking-tight">Upload Files</h2>
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} ${uploading ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center justify-center mb-4">
            <Upload className="w-16 h-16 text-blue-400 drop-shadow" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            {uploading ? 'Uploading files...' : 'Drop files here to upload'}
          </p>
          <p className="text-gray-500 mb-4">or click below to select files</p>
          <label className="block w-full">
            <input type="file" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
            <span className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 cursor-pointer transition-colors">Choose Files</span>
          </label>
          {uploading && (
            <div className="mt-6 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default function MediaGallery() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    images: 0,
    documents: 0,
    totalSize: 0
  });

  // Fetch media files
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (selectedType !== 'all') {
        params.folder = selectedType;
      }

      const response = await getMedia(params);
      if (response.success) {
        let filteredFiles = response.data?.media || [];
        console.log('📸 Fetched media files:', filteredFiles);
        console.log('📸 Sample file:', filteredFiles[0]);
        
        // Log image URLs for debugging
        filteredFiles.forEach((file: any, index: number) => {
          if (file.category === 'image' || file.mimeType?.startsWith('image/')) {
            const imageUrl = getValidImageUrl(file.storedName || file.filename);
            console.log(`🖼️ Image ${index + 1}:`, {
              filename: file.filename,
              storedName: file.storedName,
              category: file.category,
              mimeType: file.mimeType,
              url: imageUrl
            });
          }
        });
        
        // Filter by search term
        if (searchTerm) {
          filteredFiles = filteredFiles.filter((file: any) =>
            (file.originalName || file.filename).toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.filename.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setFiles(filteredFiles);
        
        // Calculate stats
        const images = filteredFiles.filter((f: any) => f.category === 'image' || f.mimeType?.startsWith('image/')).length;
        const documents = filteredFiles.filter((f: any) => f.category === 'document' || (f.category !== 'image' && !f.mimeType?.startsWith('image/'))).length;
        const totalSize = filteredFiles.reduce((sum: number, f: any) => sum + (f.size || 0), 0);
        
        setStats({
          total: filteredFiles.length,
          images,
          documents,
          totalSize
        });
      }
    } catch (error) {
      console.error('Failed to fetch media files:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedType, searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      // Set default categories
      setCategories(['general', 'news', 'events', 'gallery', 'documents']);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push('/admin');
        return;
      }
      setUser({ authenticated: true });
    };
    
    checkAuth();
    fetchFiles();
    fetchCategories();
  }, [router, fetchFiles, fetchCategories]);

  useEffect(() => {
    fetchFiles();
  }, [searchTerm, selectedCategory, selectedType, fetchFiles]);

  // Handle file upload
  const handleFileUpload = async (uploadFiles: FileList) => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    try {
      setUploading(true);
      const category = selectedCategory === 'all' ? 'general' : selectedCategory;
      
      // Validate files
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        
        if (!isValidFileSize(file, 10)) {
          invalidFiles.push(`${file.name} (file too large)`);
        } else if (!isValidImageFile(file)) {
          invalidFiles.push(`${file.name} (unsupported file type)`);
        } else {
          validFiles.push(file);
        }
      }
      
      if (invalidFiles.length > 0) {
        toast({
          title: 'Warning',
          description: `Some files were skipped: ${invalidFiles.join(', ')}`,
          variant: 'destructive',
        });
      }
      
      if (validFiles.length === 0) {
        toast({
          title: 'Error',
          description: 'No valid files to upload',
          variant: 'destructive',
        });
        return;
      }
      
      // Create FileList from valid files  
      const dt = new DataTransfer();
      validFiles.forEach(file => dt.items.add(file));
      const fileList = dt.files;
      
      const response = await uploadMultipleMedia(validFiles, { folder: category });
      
      if (response.success) {
        toast({
          title: 'Success',
          description: `${response.data?.length || validFiles.length} file(s) uploaded successfully!`,
        });
        await fetchFiles();
        setShowUploadModal(false);
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: `Upload failed: ${error.message || 'Please try again'}`,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop now handled in modal

  // Handle file deletion
  const handleDeleteFile = async (file: MediaFile) => {
    try {
      const response = await deleteMediaApi(file.id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });
        await fetchFiles();
      } else {
        throw new Error(response.error || 'Delete failed');
      }
      setShowDeleteConfirm(null);
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast({
        title: 'Error',
        description: `Delete failed: ${error.message || 'Please try again'}`,
        variant: 'destructive',
      });
    }
  };

  // Handle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get media file path for AuthenticatedImage component
  const getMediaFilePath = (file: MediaFile): string => {
    // Return the API path directly
    const filename = file.storedName || file.filename;
    return `/api/media/file/${filename}`;
  };

  return (
    <DashboardLayout title="Media Gallery">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
            <p className="text-gray-600 mt-1">Manage your media files and uploads</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-2xl font-bold text-gray-900">{stats.images}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <File className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <UploadModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={async (files) => {
            await handleFileUpload(files);
            setShowUploadModal(false);
          }}
          uploading={uploading}
        />

        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Files Display */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FolderOpen className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No files found</p>
              <p>Upload some files to get started</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map(file => (
                <div
                  key={file.id}
                  className="relative group border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative aspect-square p-2">
                    {(file.category === 'image' || file.mimeType?.startsWith('image/')) ? (
                      <AuthenticatedImage
                        filePath={getMediaFilePath(file)}
                        alt={file.originalName || file.filename}
                        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover rounded"
                        fallbackText=""
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                        <File className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t">
                    <div className="text-xs font-medium text-gray-900 truncate" title={file.originalName || file.filename}>
                      {file.originalName || file.filename}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatFileSize(file.size)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-1.5 bg-white rounded-md shadow-md hover:bg-gray-50 border border-gray-200"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(file.id)}
                        className="p-1.5 bg-white rounded-md shadow-md hover:bg-gray-50 border border-gray-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {files.map(file => (
                <div key={file.id} className="p-4 hover:bg-gray-50" title={file.originalName || file.filename}>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-50">
                      {(file.category === 'image' || file.mimeType?.startsWith('image/')) ? (
                        <AuthenticatedImage
                          filePath={getMediaFilePath(file)}
                          alt={file.originalName || file.filename}
                          className="absolute inset-0 w-full h-full object-contain"
                          fallbackText=""
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <File className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={file.originalName || file.filename}>
                        {file.originalName || file.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.category}
                        {(file.dimensions?.width || file.width) && ` • ${file.dimensions?.width || file.width}×${file.dimensions?.height || file.height}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(file.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowDeleteConfirm(null)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete File
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this file? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const file = files.find(f => f.id === showDeleteConfirm);
                    if (file) handleDeleteFile(file);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}