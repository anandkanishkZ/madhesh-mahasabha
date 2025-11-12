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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Membership Details</DialogTitle>
            <DialogDescription>Complete information about the membership application</DialogDescription>
          </DialogHeader>
          {selectedMembership && (
            <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 sm:p-4 lg:p-6 pb-4 sm:pb-6 flex-shrink-0" style={{ minHeight: '100px' }}>
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 opacity-10">
                  <Users className="w-full h-full" />
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold break-words leading-tight">{selectedMembership.fullName}</h2>
                    </div>
                    <div className="flex items-start sm:items-center gap-3 flex-shrink-0">
                      {getStatusBadge(selectedMembership.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Submitted {formatDate(selectedMembership.submittedAt)}</span>
                    </div>
                    {selectedMembership.reviewedAt && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Reviewed {formatDate(selectedMembership.reviewedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-scroll overflow-x-hidden p-3 sm:p-4 lg:p-6 bg-gray-50">
                <div className="max-w-full w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 pb-6">
                  
                    {/* Left Column - Personal & Contact */}
                    <div className="space-y-4 min-w-0 overflow-hidden">
                    
                      {/* Personal Information Card */}
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden">
                        <div className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                          </div>
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Personal Information</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</p>
                            <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 break-words" title={selectedMembership.fullName}>{selectedMembership.fullName}</p>
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</p>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700">{selectedMembership.gender || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Birth Date</p>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700">{selectedMembership.birthDate || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Availability</p>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700 break-words">{selectedMembership.availability || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                      {/* Professional Information Card */}
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden">
                        <div className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                          <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                          </div>
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Professional Background</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Occupation</p>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700 break-words">{selectedMembership.occupation || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Education</p>
                            <div className="flex items-start gap-2">
                              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-1 flex-shrink-0" />
                              <p className="text-sm sm:text-base lg:text-lg text-gray-700 break-words min-w-0">{selectedMembership.education || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                      {/* Contact Information Card */}
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden">
                        <div className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                          </div>
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Contact Information</h3>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                              <p className="text-sm sm:text-base text-gray-800 truncate" title={selectedMembership.email}>{selectedMembership.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                              <p className="text-sm sm:text-base text-gray-800 truncate" title={selectedMembership.phone}>{selectedMembership.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-gray-500">Address</p>
                              <p className="text-sm sm:text-base text-gray-800 break-words">{selectedMembership.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                    {/* Right Column - Skills & Motivation */}
                    <div className="space-y-4 min-w-0 overflow-hidden">
                    
                    {/* Skills Card */}
                    {selectedMembership.skills && selectedMembership.skills.length > 0 && (
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <div className="p-3 sm:p-4 lg:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Skills & Expertise</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {selectedMembership.skills.map((skill, idx) => (
                              <Badge key={idx} className="bg-blue-50 text-blue-700 border-blue-200 px-2 sm:px-3 py-1 text-xs sm:text-sm break-words">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Motivations Card */}
                    {selectedMembership.motivations && selectedMembership.motivations.length > 0 && (
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <div className="p-3 sm:p-4 lg:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                            <div className="p-1.5 sm:p-2 bg-pink-100 rounded-lg flex-shrink-0">
                              <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-pink-600" />
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Motivations</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {selectedMembership.motivations.map((motivation, idx) => (
                              <Badge key={idx} className="bg-pink-50 text-pink-700 border-pink-200 px-2 sm:px-3 py-1 text-xs sm:text-sm break-words">
                                {motivation}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Additional Info Card */}
                    {selectedMembership.additionalInfo && (
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <div className="p-3 sm:p-4 lg:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                              <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Additional Information</h3>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                              {selectedMembership.additionalInfo}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Admin Notes */}
                    {selectedMembership.notes && (
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                        <div className="p-3 sm:p-4 lg:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                              <Settings className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 min-w-0">Admin Notes</h3>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
                            <p className="text-sm sm:text-base text-gray-700 mb-3 break-words">{selectedMembership.notes}</p>
                            {selectedMembership.reviewedBy && (
                              <div className="text-xs sm:text-sm text-gray-600 border-t border-yellow-200 pt-3">
                                <span className="font-medium">Reviewed by:</span> <span className="break-words">{selectedMembership.reviewedBy}</span>
                                {selectedMembership.reviewedAt && (
                                  <span className="ml-2 block sm:inline">on {formatDate(selectedMembership.reviewedAt)}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t bg-white p-4 flex-shrink-0 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetailDialog(false)} 
                    className="px-6 py-2 order-2 sm:order-1"
                  >
                    Close
                  </Button>
                  <div className="flex gap-3 order-1 sm:order-2">
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
              </div>
            </div>
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
