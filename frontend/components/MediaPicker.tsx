'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  Search,
  Grid3x3,
  List,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { getMedia, uploadMedia, uploadMultipleMedia, Media } from '@/lib/api';
import { formatBytes } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media | Media[]) => void;
  multiple?: boolean;
  allowedTypes?: string[]; // ['image', 'document', 'video', 'audio']
  title?: string;
  description?: string;
}

export function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
  allowedTypes = ['image', 'document'],
  title = 'Select Media',
  description = 'Choose from your media library or upload new files',
}: MediaPickerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Library state
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  
  // Upload state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch media
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getMedia(params);

      if (response.success && response.data) {
        let filteredMedia = response.data.media || [];
        
        // Filter by allowed types
        if (allowedTypes.length > 0) {
          filteredMedia = filteredMedia.filter(m => allowedTypes.includes(m.category));
        }
        
        setMedia(filteredMedia);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to load media',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery, allowedTypes, toast]);

  useEffect(() => {
    if (open && activeTab === 'library') {
      fetchMedia();
    }
  }, [open, activeTab, fetchMedia]);

  // Handle media selection
  const toggleMediaSelection = (item: Media) => {
    if (multiple) {
      setSelectedMedia(prev =>
        prev.find(m => m.id === item.id)
          ? prev.filter(m => m.id !== item.id)
          : [...prev, item]
      );
    } else {
      setSelectedMedia([item]);
    }
  };

  const isSelected = (item: Media) => selectedMedia.some(m => m.id === item.id);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    try {
      setUploading(true);

      if (uploadFiles.length === 1) {
        const response = await uploadMedia(uploadFiles[0]);
        if (response.success && response.data) {
          toast({
            title: 'Success',
            description: 'File uploaded successfully',
          });
          setUploadFiles([]);
          setActiveTab('library');
          fetchMedia();
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      } else {
        const response = await uploadMultipleMedia(uploadFiles);
        if (response.success && response.data) {
          toast({
            title: 'Success',
            description: `${uploadFiles.length} files uploaded successfully`,
          });
          setUploadFiles([]);
          setActiveTab('library');
          fetchMedia();
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSelectMedia = () => {
    if (selectedMedia.length > 0) {
      onSelect(multiple ? selectedMedia : selectedMedia[0]);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedMedia([]);
    setUploadFiles([]);
    setSearchQuery('');
    setCategoryFilter('all');
    setActiveTab('library');
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Film className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Filters and Search */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allowedTypes.includes('image') && <SelectItem value="image">Images</SelectItem>}
                  {allowedTypes.includes('document') && <SelectItem value="document">Documents</SelectItem>}
                  {allowedTypes.includes('video') && <SelectItem value="video">Videos</SelectItem>}
                  {allowedTypes.includes('audio') && <SelectItem value="audio">Audio</SelectItem>}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Media Grid/List */}
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 min-h-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-mm-primary" />
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-semibold">No media found</p>
                  <p className="text-sm">Upload files to get started</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleMediaSelection(item)}
                      className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        isSelected(item)
                          ? 'border-mm-primary ring-2 ring-mm-primary'
                          : 'border-gray-200 hover:border-mm-primary'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {item.category === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.altText || item.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getCategoryIcon(item.category)}
                          </div>
                        )}
                      </div>
                      
                      {isSelected(item) && (
                        <div className="absolute top-2 right-2 bg-mm-primary text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium truncate" title={item.title || item.filename}>
                          {item.title || item.filename}
                        </p>
                        <p className="text-xs text-gray-500">{formatBytes(item.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleMediaSelection(item)}
                      className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected(item)
                          ? 'border-mm-primary bg-mm-primary/5'
                          : 'border-gray-200 hover:border-mm-primary'
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {item.category === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.altText || item.filename}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getCategoryIcon(item.category)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title || item.filename}</p>
                        <p className="text-sm text-gray-500">
                          {formatBytes(item.size)} • {item.category}
                          {item.width && item.height && ` • ${item.width}×${item.height}`}
                        </p>
                        {item.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {isSelected(item) && (
                        <Check className="w-5 h-5 text-mm-primary flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Info */}
            {selectedMedia.length > 0 && (
              <div className="bg-mm-primary/10 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium text-mm-primary">
                  {selectedMedia.length} {selectedMedia.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-mm-primary bg-mm-primary/5'
                  : 'border-gray-300 hover:border-mm-primary'
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
              <p className="text-sm text-gray-500 mb-4">
                Supports: Images, PDFs, Documents (Max 10MB per file)
              </p>
              <Input
                type="file"
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept={allowedTypes.includes('image') ? 'image/*,application/pdf,.doc,.docx' : '*/*'}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
            </div>

            {/* Upload Queue */}
            {uploadFiles.length > 0 && (
              <div className="flex-1 overflow-y-auto border rounded-lg p-4 min-h-0">
                <h4 className="font-semibold mb-3">Files to Upload ({uploadFiles.length})</h4>
                <div className="space-y-2">
                  {uploadFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUploadFile(index)}
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          
          {activeTab === 'upload' ? (
            <Button
              onClick={handleUpload}
              disabled={uploadFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${uploadFiles.length} ${uploadFiles.length === 1 ? 'File' : 'Files'}`
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSelectMedia}
              disabled={selectedMedia.length === 0}
            >
              Select {selectedMedia.length > 0 && `(${selectedMedia.length})`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
