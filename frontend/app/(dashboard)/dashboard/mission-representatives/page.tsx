'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import AuthenticatedImage from '@/components/AuthenticatedImage';
import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Target,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  getMissionRepresentatives,
  updateMissionRepresentativeStatus,
  deleteMissionRepresentative,
  isAuthenticated,
  logout,
  getAuthenticatedFileUrl,
  fetchAuthenticatedFile
} from '@/lib/api';

interface MissionRepresentative {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  gender: string;
  dateOfBirth: string;
  province: string;
  district: string;
  constituency: string;
  municipality: string;
  wardNumber: string;
  currentAddress: string;
  educationLevel: string;
  institutionName?: string;
  fieldOfStudy?: string;
  positionInterested: string;
  politicalExperience?: string;
  keyIssues: string[];
  whyJoin?: string;
  photoUrl?: string;
  citizenshipUrl?: string;
  educationCertUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export default function MissionRepresentativesPage() {
  const router = useRouter();
  const [representatives, setRepresentatives] = useState<MissionRepresentative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRep, setSelectedRep] = useState<MissionRepresentative | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    // Get user data
    const storedUserData = localStorage.getItem('mm_user_data');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    fetchRepresentatives();
  }, [currentPage, selectedStatus, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const fetchRepresentatives = async () => {
    setIsLoading(true);
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const response = await getMissionRepresentatives(currentPage, 20, status);
      
      if (response.success && response.data) {
        setRepresentatives(response.data.representatives || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching representatives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await updateMissionRepresentativeStatus(id, newStatus);
      if (response.success) {
        fetchRepresentatives();
        setShowDetail(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const response = await deleteMissionRepresentative(id);
      if (response.success) {
        fetchRepresentatives();
        setShowDetail(false);
      }
    } catch (error) {
      console.error('Error deleting representative:', error);
      alert('Failed to delete application');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRepresentatives = representatives.filter(rep =>
    rep.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showDetail && selectedRep) {
    return (
      <div className="min-h-screen bg-mm-bg/30">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-md hover:bg-mm-bg transition-colors"
                >
                  {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <h1 className="text-xl font-bold text-mm-primary">
                  Madhesh Mahasabha Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-mm-bg transition-colors">
                  <Bell className="w-5 h-5 text-mm-ink" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-mm-accent rounded-full"></span>
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/', '_blank')}
                  className="hidden md:flex"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Site
                </Button>

                {userData && (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-mm-primary text-white font-semibold">
                        {userData.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-mm-ink">{userData.name}</p>
                      <p className="text-xs text-muted-foreground">{userData.role}</p>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30
            transition-transform duration-300 w-64
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <nav className="p-4 space-y-2">
              <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a href="/dashboard/mission-representatives" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-mm-primary/10 text-mm-primary font-semibold">
                <Target className="w-5 h-5" />
                <span>Mission Representatives</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
                <Users className="w-5 h-5" />
                <span>Members</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
                <FileText className="w-5 h-5" />
                <span>Posts</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
                <Calendar className="w-5 h-5" />
                <span>Events</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>

              <div className="pt-4 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </aside>

          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content - Detail View */}
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Button
                onClick={() => setShowDetail(false)}
                variant="outline"
                className="mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedRep.fullName}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Submitted on {new Date(selectedRep.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(selectedRep.status)}
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
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedRep.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedRep.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{selectedRep.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{new Date(selectedRep.dateOfBirth).toLocaleDateString()}</p>
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
                  <div>
                    <p className="text-sm text-muted-foreground">Province</p>
                    <p className="font-medium">{selectedRep.province}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-medium">{selectedRep.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Constituency</p>
                    <p className="font-medium">{selectedRep.constituency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Municipality</p>
                    <p className="font-medium">{selectedRep.municipality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ward Number</p>
                    <p className="font-medium">{selectedRep.wardNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Full Address</p>
                    <p className="font-medium">{selectedRep.currentAddress}</p>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-mm-primary" />
                  Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div>
                    <p className="text-sm text-muted-foreground">Education Level</p>
                    <p className="font-medium">{selectedRep.educationLevel}</p>
                  </div>
                  {selectedRep.institutionName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Institution</p>
                      <p className="font-medium">{selectedRep.institutionName}</p>
                    </div>
                  )}
                  {selectedRep.fieldOfStudy && (
                    <div>
                      <p className="text-sm text-muted-foreground">Field of Study</p>
                      <p className="font-medium">{selectedRep.fieldOfStudy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Political Interest */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-mm-primary" />
                  Political Interest
                </h3>
                <div className="space-y-4 pl-7">
                  <div>
                    <p className="text-sm text-muted-foreground">Position Interested</p>
                    <p className="font-medium">{selectedRep.positionInterested}</p>
                  </div>
                  {selectedRep.politicalExperience && (
                    <div>
                      <p className="text-sm text-muted-foreground">Political Experience</p>
                      <p className="font-medium whitespace-pre-wrap">{selectedRep.politicalExperience}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Key Issues</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRep.keyIssues.map((issue, index) => (
                        <Badge key={index} variant="secondary">{issue}</Badge>
                      ))}
                    </div>
                  </div>
                  {selectedRep.whyJoin && (
                    <div>
                      <p className="text-sm text-muted-foreground">Why Join</p>
                      <p className="font-medium whitespace-pre-wrap">{selectedRep.whyJoin}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-mm-primary" />
                  Uploaded Documents
                </h3>
                {(selectedRep.photoUrl || selectedRep.citizenshipUrl || selectedRep.educationCertUrl) ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                    {selectedRep.photoUrl ? (
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3">📸 Photo</p>
                        <button
                          onClick={async () => {
                            if (!selectedRep.photoUrl) return;
                            const imageUrl = await fetchAuthenticatedFile(selectedRep.photoUrl);
                            if (imageUrl) window.open(imageUrl, '_blank');
                          }}
                          className="block relative group cursor-pointer w-full"
                        >
                          <div className="h-64 w-full overflow-hidden rounded-md border border-gray-200">
                            <AuthenticatedImage
                              filePath={selectedRep.photoUrl}
                              alt="Applicant Photo"
                              className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                              fallbackText="Photo not available"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                            <div className="bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              Click to view
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={async () => {
                            if (!selectedRep.photoUrl) return;
                            const imageUrl = await fetchAuthenticatedFile(selectedRep.photoUrl);
                            if (imageUrl) window.open(imageUrl, '_blank');
                          }}
                          className="inline-flex items-center gap-1 text-sm text-mm-primary hover:text-mm-primary/80 hover:underline font-medium mt-3"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Full Size
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-3">📸 Photo</p>
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md mb-3">
                          <p className="text-gray-400 text-sm">No photo uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedRep.citizenshipUrl ? (
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3">🪪 Citizenship</p>
                        {selectedRep.citizenshipUrl.endsWith('.pdf') ? (
                          <button
                            onClick={async () => {
                              if (!selectedRep.citizenshipUrl) return;
                              const fileUrl = await fetchAuthenticatedFile(selectedRep.citizenshipUrl);
                              if (fileUrl) window.open(fileUrl, '_blank');
                            }}
                            className="block cursor-pointer group w-full"
                          >
                            <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-red-50 to-red-100 rounded-md mb-3 border border-red-200 hover:from-red-100 hover:to-red-200 transition-colors relative">
                              <FileText className="w-16 h-16 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-xs text-red-700 font-medium">PDF Document</span>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1 mt-16">
                                  <Eye className="w-4 h-4" />
                                  Click to view
                                </div>
                              </div>
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              if (!selectedRep.citizenshipUrl) return;
                              const imageUrl = await fetchAuthenticatedFile(selectedRep.citizenshipUrl);
                              if (imageUrl) window.open(imageUrl, '_blank');
                            }}
                            className="block relative group cursor-pointer w-full"
                          >
                            <div className="h-64 w-full overflow-hidden rounded-md border border-gray-200">
                              <AuthenticatedImage
                                filePath={selectedRep.citizenshipUrl}
                                alt="Citizenship Document"
                                className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                                fallbackText="Document not available"
                              />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                              <div className="bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                Click to view
                              </div>
                            </div>
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!selectedRep.citizenshipUrl) return;
                            const fileUrl = await fetchAuthenticatedFile(selectedRep.citizenshipUrl);
                            if (fileUrl) window.open(fileUrl, '_blank');
                          }}
                          className="inline-flex items-center gap-1 text-sm text-mm-primary hover:text-mm-primary/80 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedRep.citizenshipUrl.endsWith('.pdf') ? 'Download PDF' : 'View Full Size'}
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-3">🪪 Citizenship</p>
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md mb-3">
                          <p className="text-gray-400 text-sm">No document uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedRep.educationCertUrl ? (
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3">🎓 Education Certificate</p>
                        {selectedRep.educationCertUrl.endsWith('.pdf') ? (
                          <button
                            onClick={async () => {
                              if (!selectedRep.educationCertUrl) return;
                              const fileUrl = await fetchAuthenticatedFile(selectedRep.educationCertUrl);
                              if (fileUrl) window.open(fileUrl, '_blank');
                            }}
                            className="block cursor-pointer group w-full"
                          >
                            <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-md mb-3 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors relative">
                              <FileText className="w-16 h-16 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-xs text-blue-700 font-medium">PDF Document</span>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1 mt-16">
                                  <Eye className="w-4 h-4" />
                                  Click to view
                                </div>
                              </div>
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              if (!selectedRep.educationCertUrl) return;
                              const imageUrl = await fetchAuthenticatedFile(selectedRep.educationCertUrl);
                              if (imageUrl) window.open(imageUrl, '_blank');
                            }}
                            className="block relative group cursor-pointer w-full"
                          >
                            <div className="h-64 w-full overflow-hidden rounded-md border border-gray-200">
                              <AuthenticatedImage
                                filePath={selectedRep.educationCertUrl}
                                alt="Education Certificate"
                                className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                                fallbackText="Certificate not available"
                              />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                              <div className="bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                Click to view
                              </div>
                            </div>
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!selectedRep.educationCertUrl) return;
                            const fileUrl = await fetchAuthenticatedFile(selectedRep.educationCertUrl);
                            if (fileUrl) window.open(fileUrl, '_blank');
                          }}
                          className="inline-flex items-center gap-1 text-sm text-mm-primary hover:text-mm-primary/80 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedRep.educationCertUrl.endsWith('.pdf') ? 'Download PDF' : 'View Full Size'}
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-3">🎓 Education Certificate</p>
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md mb-3">
                          <p className="text-gray-400 text-sm">No document uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pl-7">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        ⚠️ No documents were uploaded with this application.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t">
                {selectedRep.status !== 'approved' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedRep.id, 'approved')}
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selectedRep.status !== 'rejected' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedRep.id, 'rejected')}
                    variant="primary"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                )}
                {selectedRep.status !== 'pending' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedRep.id, 'pending')}
                    variant="outline"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Mark as Pending
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(selectedRep.id)}
                  variant="outline"
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  Delete Application
                </Button>
              </div>
            </CardContent>
          </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mm-bg/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-mm-bg transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-mm-primary">
                Madhesh Mahasabha Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-mm-bg transition-colors">
                <Bell className="w-5 h-5 text-mm-ink" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-mm-accent rounded-full"></span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
                className="hidden md:flex"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </Button>

              {userData && (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-mm-primary text-white font-semibold">
                      {userData.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-mm-ink">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{userData.role}</p>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30
          transition-transform duration-300 w-64
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="/dashboard/mission-representatives" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-mm-primary/10 text-mm-primary font-semibold">
              <Target className="w-5 h-5" />
              <span>Mission Representatives</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <Users className="w-5 h-5" />
              <span>Members</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <FileText className="w-5 h-5" />
              <span>Posts</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>

            <div className="pt-4 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Representatives</h1>
          <p className="text-muted-foreground">Manage mission representative applications</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setCurrentPage(1);
                    }}
                    variant={selectedStatus === status ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Representatives List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-mm-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : filteredRepresentatives.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No applications have been submitted yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRepresentatives.map((rep) => (
              <Card key={rep.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{rep.fullName}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {rep.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {rep.contactNumber}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {rep.district}, {rep.province}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{rep.positionInterested}</span>
                            <span className="text-muted-foreground">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {new Date(rep.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(rep.status)}
                          <Button
                            onClick={() => {
                              setSelectedRep(rep);
                              setShowDetail(true);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
        </main>
      </div>
    </div>
  );
}
