'use client';

import React, { useState, useEffect } from 'react';
import { 
  getMemberships, 
  getMembershipStats, 
  updateMembershipStatus,
  deleteMembership,
  getMembershipById 
} from '@/lib/api';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Download,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Briefcase,
  GraduationCap,
  Heart,
  RefreshCw,
  Settings,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Membership {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  education?: string;
  birthDate?: string;
  gender?: string;
  motivations: string[];
  skills: string[];
  availability?: string;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function MembersPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const limit = 20;

  useEffect(() => {
    loadData();
  }, [currentPage, statusFilter, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load stats
      const statsResponse = await getMembershipStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Load memberships
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const membershipsResponse = await getMemberships(
        currentPage, 
        limit, 
        filter,
        searchTerm || undefined
      );

      if (membershipsResponse.success && membershipsResponse.data) {
        setMemberships(membershipsResponse.data.memberships);
        setTotalPages(membershipsResponse.data.pagination.totalPages);
      } else {
        setError(membershipsResponse.error || 'Failed to load memberships');
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (membership: Membership) => {
    setSelectedMembership(membership);
    setShowDetailDialog(true);
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateMembershipStatus(id, newStatus);
      if (response.success) {
        setSuccess(`Membership ${newStatus} successfully!`);
        await loadData();
        setShowDetailDialog(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to update status');
      }
    } catch (err) {
      setError('An error occurred while updating status');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMembership) return;

    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await deleteMembership(selectedMembership.id);
      if (response.success) {
        setSuccess('Membership deleted successfully!');
        await loadData();
        setShowDeleteDialog(false);
        setShowDetailDialog(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to delete membership');
      }
    } catch (err) {
      setError('An error occurred while deleting membership');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-600 mt-1">Manage membership applications</p>
        </div>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading memberships...</span>
                    </div>
                  </td>
                </tr>
              ) : memberships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No memberships found
                  </td>
                </tr>
              ) : (
                memberships.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{membership.fullName}</p>
                        <p className="text-sm text-gray-500">{membership.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {membership.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {membership.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(membership.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(membership.submittedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(membership)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {membership.status !== 'approved' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(membership.id, 'approved')}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {membership.status !== 'rejected' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(membership.id, 'rejected')}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedMembership(membership);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Membership Details</DialogTitle>
            <DialogDescription>Complete information about the membership application</DialogDescription>
          </DialogHeader>
          {selectedMembership && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedMembership.fullName}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Submitted on {formatDate(selectedMembership.submittedAt)}
                    </p>
                  </div>
                  {getStatusBadge(selectedMembership.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-mm-primary" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedMembership.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedMembership.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedMembership.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{selectedMembership.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Date</p>
                      <p className="font-medium">{selectedMembership.birthDate || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Availability</p>
                      <p className="font-medium">{selectedMembership.availability || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-mm-primary" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Full Address</p>
                      <p className="font-medium">{selectedMembership.address}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-mm-primary" />
                    Professional Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                    <div>
                      <p className="text-sm text-muted-foreground">Occupation</p>
                      <p className="font-medium">{selectedMembership.occupation || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Education</p>
                      <p className="font-medium">{selectedMembership.education || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Information */}
                {selectedMembership.skills && selectedMembership.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-mm-primary" />
                      Skills & Expertise
                    </h3>
                    <div className="pl-7">
                      <div className="flex flex-wrap gap-2">
                        {selectedMembership.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Motivations */}
                {selectedMembership.motivations && selectedMembership.motivations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-mm-primary" />
                      Motivations
                    </h3>
                    <div className="pl-7">
                      <div className="flex flex-wrap gap-2">
                        {selectedMembership.motivations.map((motivation, idx) => (
                          <Badge key={idx} variant="secondary">{motivation}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {selectedMembership.additionalInfo && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-mm-primary" />
                      Additional Information
                    </h3>
                    <div className="pl-7">
                      <p className="font-medium whitespace-pre-wrap">{selectedMembership.additionalInfo}</p>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedMembership.notes && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-mm-primary" />
                      Admin Notes
                    </h3>
                    <div className="pl-7">
                      <p className="font-medium mb-3">{selectedMembership.notes}</p>
                      {selectedMembership.reviewedBy && (
                        <div className="text-sm text-muted-foreground border-t pt-3">
                          <span className="font-medium">Reviewed by:</span> {selectedMembership.reviewedBy}
                          {selectedMembership.reviewedAt && (
                            <span className="ml-2">on {formatDate(selectedMembership.reviewedAt)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetailDialog(false)}
                    className="px-6 py-2"
                  >
                    Close
                  </Button>
                  <div className="flex gap-3">
                    {selectedMembership.status !== 'approved' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedMembership.id, 'approved')}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Member
                      </Button>
                    )}
                    {selectedMembership.status !== 'rejected' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedMembership.id, 'rejected')}
                        disabled={actionLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-medium"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this membership application? This will move it to trash.
            </DialogDescription>
          </DialogHeader>
          {selectedMembership && (
            <div className="py-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Applicant:</span> {selectedMembership.fullName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {selectedMembership.email}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
