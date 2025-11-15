'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPressRelease, PressReleaseData } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Save, Eye, Megaphone, AlertCircle, ImagePlus, X } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MediaPicker } from '@/components/MediaPicker';
import AuthenticatedImage from '@/components/AuthenticatedImage';
import type { Media } from '@/lib/api';

export default function CreatePressReleasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<PressReleaseData>>({
    slug: '',
    title: '',
    titleNp: '', // Same as title, using Ek Mukta font
    content: '',
    contentNp: '', // Same as content, using Ek Mukta font
    excerpt: '',
    excerptNp: '', // Same as excerpt, using Ek Mukta font
    category: 'announcement',
    tags: [],
    priority: 'normal',
    author: '',
    contactEmail: '',
    contactPhone: '',
    imageUrl: '',
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      titleNp: value, // Same value for both
      slug: generateSlug(value),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.title || !formData.content || !formData.author) {
      setError('Please fill in all required fields (Title, Content, and Author)');
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit: any = {
        slug: formData.slug || generateSlug(formData.title),
        title: formData.title,
        titleNp: formData.title, // Same as title
        content: formData.content,
        contentNp: formData.content, // Same as content
        category: formData.category,
        tags: formData.tags || [],
        priority: formData.priority,
        author: formData.author,
        isPublished: publish,
      };

      // Only add optional fields if they have values
      if (formData.excerpt?.trim()) {
        dataToSubmit.excerpt = formData.excerpt.trim();
        dataToSubmit.excerptNp = formData.excerpt.trim(); // Same as excerpt
      }
      if (formData.imageUrl?.trim()) dataToSubmit.imageUrl = formData.imageUrl.trim();
      if (formData.contactEmail?.trim()) dataToSubmit.contactEmail = formData.contactEmail.trim();
      if (formData.contactPhone?.trim()) dataToSubmit.contactPhone = formData.contactPhone.trim();

      const response = await createPressRelease(dataToSubmit);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/press-releases');
        }, 1500);
      } else {
        setError(response.error || 'Failed to create press release');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the press release');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/press-releases">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-mm-ink flex items-center gap-3 nepali-heading">
              <Megaphone className="w-8 h-8 text-mm-primary" />
              Create Press Release
            </h1>
            <p className="text-muted-foreground mt-1 nepali-text">
              नयाँ प्रेस विज्ञप्ति सिर्जना गर्नुहोस्
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-900 border-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Press release created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="nepali-heading">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter press release title / शीर्षक लेख्नुहोस्"
                  required
                  className="mt-1.5 nepali-text"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                  className="mt-1.5 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from title. Edit if needed.
                </p>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement (घोषणा)</SelectItem>
                      <SelectItem value="statement">Statement (वक्तव्य)</SelectItem>
                      <SelectItem value="event">Event (कार्यक्रम)</SelectItem>
                      <SelectItem value="achievement">Achievement (उपलब्धि)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (अति जरुरी)</SelectItem>
                      <SelectItem value="high">High (उच्च)</SelectItem>
                      <SelectItem value="normal">Normal (सामान्य)</SelectItem>
                      <SelectItem value="low">Low (कम)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="nepali-heading">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary / संक्षिप्त विवरण (optional)"
                  rows={3}
                  className="mt-1.5 nepali-text"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full press release content / पूर्ण प्रेस विज्ञप्ति सामग्री"
                  rows={12}
                  required
                  className="mt-1.5 nepali-text"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media & Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="nepali-heading">Media & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Featured Image */}
              <div>
                <Label>Featured Image</Label>
                <div className="mt-1.5 space-y-3">
                  {formData.imageUrl ? (
                    <div className="relative group">
                      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border-2 border-gray-200">
                        {/* Using AuthenticatedImage for consistent image loading */}
                        <AuthenticatedImage
                          filePath={formData.imageUrl}
                          alt="Featured image"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video w-full max-w-md flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="text-center">
                        <ImagePlus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No image selected</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMediaPicker(true)}
                      className="flex-1 max-w-xs"
                    >
                      <ImagePlus className="w-4 h-4 mr-2" />
                      {formData.imageUrl ? 'Change Image' : 'Select Image'}
                    </Button>
                  </div>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or paste image URL directly"
                    className="max-w-md"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Enter"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="nepali-heading">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author */}
              <div>
                <Label htmlFor="author">
                  Author <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  required
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Email */}
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contact@example.com"
                    className="mt-1.5"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+977 9800000000"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 pb-8">
            <Link href="/dashboard/press-releases">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="outline"
                disabled={loading}
                onClick={(e) => handleSubmit(e, false)}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save as Draft'}
              </Button>

              <Button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {loading ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPicker
        open={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(media) => {
          const selectedMedia = Array.isArray(media) ? media[0] : media;
          if (selectedMedia) {
            setFormData({ ...formData, imageUrl: selectedMedia.url });
          }
          setShowMediaPicker(false);
        }}
        multiple={false}
        allowedTypes={['image']}
        title="Select Featured Image"
        description="Choose an image from your media library"
      />
    </div>
  );
}
