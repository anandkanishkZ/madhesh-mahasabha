'use client';

import { useState, useEffect } from 'react';
import {
  getMedia,
  getMediaStats,
  deleteMedia,
  restoreMedia,
  bulkDeleteMedia,
  updateMedia,
  uploadMedia,
  uploadMultipleMedia,
  getAuthenticatedUrl,
  Media,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  Search,
  Grid3x3,
  List,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Trash2,
  Edit,
  Download,
  Eye,
  Check,
  X,
  Loader2,
  RefreshCw,
  HardDrive,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedImage from '@/components/AuthenticatedImage';

export default function MediaPage() {
  const { toast } = useToast();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  // View and filter state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Edit dialog state
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    altText: '',
    caption: '',
    description: '',
    tags: '',
  });
  
  // Delete dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    mediaId?: string;
    permanent?: boolean;
  }>({ show: false });

  useEffect(() => {
    fetchMedia();
    fetchStats();
  }, [categoryFilter, showDeleted]);

  const fetchMedia = async () => {
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

      if (showDeleted) {
        params.includeDeleted = true;
      }

      const response = await getMedia(params);

      if (response.success && response.data) {
        setMedia(response.data.media || []);
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
  };

  const fetchStats = async () => {
    try {
      const response = await getMediaStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    try {
      setUploading(true);
      const fileArray = Array.from(files);

      if (fileArray.length === 1) {
        const response = await uploadMedia(fileArray[0]);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'File uploaded successfully',
          });
          fetchMedia();
          fetchStats();
        } else {
          throw new Error(response.error);
        }
      } else {
        const response = await uploadMultipleMedia(fileArray);
        if (response.success) {
          toast({
            title: 'Success',
            description: `${fileArray.length} files uploaded successfully`,
          });
          fetchMedia();
          fetchStats();
        } else {
          throw new Error(response.error);
        }
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(media.map(m => m.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setSelectMode(false);
  };

  const openEditDialog = (item: Media) => {
    setEditingMedia(item);
    setEditForm({
      title: item.title || '',
      altText: item.altText || '',
      caption: item.caption || '',
      description: item.description || '',
      tags: item.tags.join(', '),
    });
  };

  const handleEditSave = async () => {
    if (!editingMedia) return;

    try {
      const response = await updateMedia(editingMedia.id, {
        title: editForm.title,
        altText: editForm.altText,
        caption: editForm.caption,
        description: editForm.description,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Media updated successfully',
        });
        setEditingMedia(null);
        fetchMedia();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update media',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, permanent: boolean = false) => {
    try {
      const response = await deleteMedia(id, permanent);
      if (response.success) {
        toast({
          title: 'Success',
          description: permanent ? 'Media permanently deleted' : 'Media moved to trash',
        });
        fetchMedia();
        fetchStats();
        setDeleteConfirm({ show: false });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete media',
        variant: 'destructive',
      });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await restoreMedia(id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Media restored successfully',
        });
        fetchMedia();
        fetchStats();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to restore media',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      const response = await bulkDeleteMedia(selectedItems);
      if (response.success) {
        toast({
          title: 'Success',
          description: `${selectedItems.length} items moved to trash`,
        });
        clearSelection();
        fetchMedia();
        fetchStats();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete items',
        variant: 'destructive',
      });
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Modern Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-mm-primary to-mm-primary/70 bg-clip-text text-transparent mb-2">
              Media Library
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Manage your digital assets with ease
            </p>
          </div>
          
          {/* Primary Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDeleted(!showDeleted)}
              className="hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {showDeleted ? 'Hide' : 'Show'} Trash
              {stats && stats.deletedCount > 0 && (
                <Badge variant="destructive" className="ml-2 bg-red-600 hover:bg-red-700 text-white">
                  {stats.deletedCount}
                </Badge>
              )}
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-mm-primary to-mm-primary/90 hover:from-mm-primary/90 hover:to-mm-primary shadow-lg shadow-mm-primary/20"
              onClick={() => document.getElementById('media-upload-primary')?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
            <Input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="media-upload-primary"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Modern Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: 'Total Files', 
                value: stats.totalMedia, 
                icon: FolderOpen, 
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600'
              },
              { 
                title: 'Images', 
                value: stats.totalImages, 
                icon: ImageIcon, 
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600'
              },
              { 
                title: 'Documents', 
                value: stats.totalDocuments, 
                icon: FileText, 
                color: 'from-orange-500 to-orange-600',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-600'
              },
              { 
                title: 'Storage', 
                value: formatBytes(stats.totalSize), 
                icon: HardDrive, 
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-600'
              }
            ].map((stat, idx) => (
              <Card key={idx} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modern Upload Zone */}
        <Card
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed transition-all duration-300 overflow-hidden ${
            dragActive 
              ? 'border-mm-primary bg-gradient-to-br from-mm-primary/5 to-mm-primary/10 shadow-lg scale-[1.02]' 
              : 'border-gray-300 hover:border-mm-primary/50 hover:shadow-md'
          }`}
        >
          <CardContent className="p-12">
            <div className="text-center">
              <div className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                dragActive ? 'bg-gradient-to-br from-mm-primary to-mm-primary/80 scale-110' : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}>
                <Upload className={`w-10 h-10 transition-colors ${dragActive ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {dragActive ? 'Drop files here!' : 'Upload Your Media'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Drag and drop your files here, or click the button below to browse.<br/>
                <span className="text-sm text-gray-500">Supports images, documents, videos (max 10MB)</span>
              </p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={uploading}
                className="shadow-lg hover:shadow-xl transition-all"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Browse Files
                  </>
                )}
              </Button>
              <Input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="media-upload"
                disabled={uploading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modern Toolbar */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, tag, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:ring-2 focus:ring-mm-primary/20"
                />
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 h-12">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">📸 Images</SelectItem>
                    <SelectItem value="document">📄 Documents</SelectItem>
                    <SelectItem value="video">🎥 Videos</SelectItem>
                    <SelectItem value="audio">🎵 Audio</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'shadow-md' : ''}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'shadow-md' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Refresh */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchMedia}
                  className="h-12 px-4"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selection & Bulk Actions */}
            {(selectMode || selectedItems.length > 0) && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectMode(!selectMode);
                    setSelectedItems([]);
                  }}
                >
                  {selectMode ? 'Cancel Selection' : 'Select Multiple'}
                </Button>

                {selectMode && (
                  <>
                    <Button variant="outline" size="sm" onClick={selectAll}>
                      Select All ({media.length})
                    </Button>
                    {selectedItems.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        Clear
                      </Button>
                    )}
                  </>
                )}

                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-3 ml-auto">
                    <Badge variant="default" className="bg-mm-primary text-white px-3 py-1">
                      {selectedItems.length} selected
                    </Badge>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleBulkDelete}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-mm-primary" />
          </div>
        ) : media.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-16">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">No media files yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Upload your first files to get started with the media library
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-mm-primary to-mm-primary/90 shadow-lg"
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {media.map((item) => (
              <div
                key={item.id}
                className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedItems.includes(item.id)
                    ? 'ring-2 ring-mm-primary shadow-2xl scale-105'
                    : 'shadow-lg hover:shadow-2xl hover:scale-105'
                } ${item.isDeleted ? 'opacity-60' : ''}`}
              >
                {/* Image Container - Fixed Aspect Ratio */}
                <div className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200" style={{ paddingBottom: '100%' }}>
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => selectMode && toggleSelectItem(item.id)}
                  >
                    {item.category === 'image' ? (
                      <AuthenticatedImage
                        filePath={`/api/media/file/${item.storedName}`}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        fallbackText="Failed to load"
                      />
                    ) : (
                      <div className="text-gray-400 text-5xl">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}
                  </div>

                  {/* Selection Checkbox */}
                  {selectMode && (
                    <div className={`absolute top-3 right-3 rounded-full p-2 shadow-lg z-20 transition-all ${
                      selectedItems.includes(item.id)
                        ? 'bg-mm-primary text-white scale-110'
                        : 'bg-white/90 text-gray-400'
                    }`}>
                      <Check className="w-5 h-5" />
                    </div>
                  )}

                  {/* Trash Badge */}
                  {item.isDeleted && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Trashed
                      </Badge>
                    </div>
                  )}

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-10">
                    {!item.isDeleted ? (
                      <>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-white hover:bg-gray-100 text-gray-900 shadow-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(getAuthenticatedUrl(item.url), '_blank');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-mm-primary hover:bg-mm-primary/90 text-white shadow-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(item);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="accent"
                          className="bg-red-600 hover:bg-red-700 text-white shadow-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ show: true, mediaId: item.id, permanent: false });
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white shadow-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(item.id);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="accent"
                          className="bg-red-600 hover:bg-red-700 text-white shadow-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ show: true, mediaId: item.id, permanent: true });
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Permanent Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* File Info - Enhanced */}
                <div className="p-4 bg-white flex-shrink-0">
                  <p className="text-sm font-semibold truncate mb-1.5 text-gray-900 leading-tight" title={item.title || item.filename}>
                    {item.title || item.filename}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{formatBytes(item.size)}</span>
                    <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {media.map((item) => (
              <Card
                key={item.id}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  selectedItems.includes(item.id)
                    ? 'ring-2 ring-mm-primary shadow-xl'
                    : ''
                } ${item.isDeleted ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-6">
                  <div
                    className="flex items-center gap-6 cursor-pointer"
                    onClick={() => selectMode && toggleSelectItem(item.id)}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      {item.category === 'image' ? (
                        <AuthenticatedImage
                          filePath={`/api/media/file/${item.storedName}`}
                          alt={item.altText || item.filename}
                          className="w-full h-full object-cover"
                          fallbackText="N/A"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                          {getCategoryIcon(item.category)}
                        </div>
                      )}
                      {selectMode && (
                        <div className={`absolute top-2 right-2 rounded-full p-1.5 shadow-lg ${
                          selectedItems.includes(item.id)
                            ? 'bg-mm-primary text-white'
                            : 'bg-white/90 text-gray-400'
                        }`}>
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg truncate text-gray-900">{item.title || item.filename}</h3>
                        {item.isDeleted && (
                          <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Trashed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{formatBytes(item.size)}</span>
                        <Badge variant="secondary" className="font-medium">
                          {item.category}
                        </Badge>
                        {item.width && item.height && (
                          <span className="text-gray-500">{item.width}×{item.height}px</span>
                        )}
                      </div>
                      {item.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-3">
                          {item.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-mm-primary/30 text-mm-primary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!item.isDeleted ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-gray-100 shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(getAuthenticatedUrl(item.url), '_blank');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-mm-primary hover:bg-mm-primary/90 text-white shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(item);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="accent"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm({ show: true, mediaId: item.id, permanent: false });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(item.id);
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="accent"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm({ show: true, mediaId: item.id, permanent: true });
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Delete Forever
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Media</DialogTitle>
            <DialogDescription>Update media information and metadata</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {editingMedia?.category === 'image' && (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner">
                <AuthenticatedImage
                  filePath={`/api/media/file/${editingMedia.storedName}`}
                  alt={editingMedia.filename}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Enter title"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="altText" className="text-sm font-semibold">Alt Text</Label>
                <Input
                  id="altText"
                  value={editForm.altText}
                  onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                  placeholder="Alternative text for accessibility"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="caption" className="text-sm font-semibold">Caption</Label>
              <Input
                id="caption"
                value={editForm.caption}
                onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                placeholder="Brief caption"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Detailed description"
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-semibold">Tags <span className="text-gray-500 font-normal">(comma separated)</span></Label>
              <Input
                id="tags"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setEditingMedia(null)} className="shadow-md">
              Cancel
            </Button>
            <Button onClick={handleEditSave} className="bg-gradient-to-r from-mm-primary to-mm-primary/90 shadow-lg">
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modern Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirm.show}
        onOpenChange={(open) => setDeleteConfirm({ show: open })}
      >
        <AlertDialogContent className="border-0 shadow-2xl">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="text-2xl text-center">
              {deleteConfirm.permanent ? 'Delete Permanently?' : 'Move to Trash?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              {deleteConfirm.permanent
                ? 'This action cannot be undone. The media file will be permanently deleted from the server.'
                : 'The media will be moved to trash. You can restore it later if needed.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-3">
            <AlertDialogCancel className="shadow-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirm.mediaId &&
                handleDelete(deleteConfirm.mediaId, deleteConfirm.permanent)
              }
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteConfirm.permanent ? 'Delete Forever' : 'Move to Trash'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
