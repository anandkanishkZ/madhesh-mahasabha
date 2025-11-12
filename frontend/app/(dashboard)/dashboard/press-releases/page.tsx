'use client';

import { useState, useEffect } from 'react';
import {
  getPressReleases,
  deletePressRelease,
  PressRelease,
} from '@/lib/api';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
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

const getCategoryInfo = (category: string) => {
  const categories: { [key: string]: { labelNp: string; color: string } } = {
    announcement: { labelNp: 'घोषणा', color: 'bg-blue-500' },
    statement: { labelNp: 'वक्तव्य', color: 'bg-purple-500' },
    event: { labelNp: 'कार्यक्रम', color: 'bg-green-500' },
    achievement: { labelNp: 'उपलब्धि', color: 'bg-orange-500' },
  };
  return categories[category] || { labelNp: category, color: 'bg-gray-500' };
};

const getPriorityBadge = (priority: string) => {
  const priorities: {
    [key: string]: {
      labelNp: string;
      variant: 'default' | 'destructive' | 'outline' | 'secondary';
    };
  } = {
    urgent: { labelNp: 'अति जरुरी', variant: 'destructive' },
    high: { labelNp: 'उच्च', variant: 'default' },
    normal: { labelNp: 'सामान्य', variant: 'secondary' },
    low: { labelNp: 'कम', variant: 'outline' },
  };
  return priorities[priority] || priorities['normal'];
};

export default function PressReleasesPage() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPressReleases();
  }, [categoryFilter]);

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const params: any = {
        includeUnpublished: true,
        limit: 100,
      };

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      const response = await getPressReleases(params);

      if (response.success && response.data) {
        setPressReleases(response.data.pressReleases || []);
      } else {
        setError(response.error || 'Failed to fetch press releases');
      }
    } catch (err) {
      setError('An error occurred while fetching press releases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const response = await deletePressRelease(deleteId);

      if (response.success) {
        // Remove from list
        setPressReleases((prev) => prev.filter((pr) => pr.id !== deleteId));
        setDeleteId(null);
      } else {
        alert(response.error || 'Failed to delete press release');
      }
    } catch (err) {
      alert('An error occurred while deleting');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredPressReleases = pressReleases.filter((pr) => {
    const matchesSearch =
      pr.titleNp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: pressReleases.length,
    published: pressReleases.filter((pr) => pr.isPublished).length,
    draft: pressReleases.filter((pr) => !pr.isPublished).length,
    urgent: pressReleases.filter((pr) => pr.priority === 'urgent').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-mm-primary rounded-lg flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-mm-ink">Press Releases</h1>
            <p className="text-gray-600 nepali-text">प्रेस विज्ञप्ति व्यवस्थापन</p>
          </div>
        </div>

        <Link href="/dashboard/press-releases/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-mm-ink">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search press releases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mm-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mm-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="announcement">Announcement</option>
              <option value="statement">Statement</option>
              <option value="event">Event</option>
              <option value="achievement">Achievement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="animate-spin w-12 h-12 border-4 border-mm-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading press releases...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-6 h-6" />
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Press Releases List */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Published
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPressReleases.map((pr) => {
                  const catInfo = getCategoryInfo(pr.category);
                  const priorityInfo = getPriorityBadge(pr.priority || 'normal');

                  return (
                    <tr key={pr.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 nepali-text">
                            {pr.titleNp}
                          </p>
                          <p className="text-sm text-gray-500">{pr.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className="nepali-text"
                          style={{ backgroundColor: catInfo.color }}
                        >
                          {catInfo.labelNp}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={priorityInfo.variant} className="nepali-text">
                          {priorityInfo.labelNp}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {pr.isPublished ? (
                          <Badge variant="default" className="bg-green-500">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          {pr.viewCount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(pr.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/press-releases/${pr.slug}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/dashboard/press-releases/edit/${pr.id}`}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(pr.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPressReleases.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No press releases found</p>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first press release to get started'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Press Release?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will move the press release to trash. You can restore it later from
              the trash section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
