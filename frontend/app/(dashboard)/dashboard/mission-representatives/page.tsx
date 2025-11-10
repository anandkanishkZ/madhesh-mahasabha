'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getMissionRepresentatives,
  updateMissionRepresentativeStatus,
  updateMissionRepresentative,
  deleteMissionRepresentative,
  fetchAuthenticatedFile,
  isAuthenticated
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AuthenticatedImage from '@/components/AuthenticatedImage';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Target,
  FileText,
  ExternalLink,
  Edit,
  Save,
  X,
} from 'lucide-react';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<MissionRepresentative>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    fetchRepresentatives();
  }, [currentPage, selectedStatus, router]);

  const fetchRepresentatives = async () => {
    setIsLoading(true);
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      console.log('🔍 Fetching representatives with:', { page: currentPage, status });
      
      const response = await getMissionRepresentatives(currentPage, 20, status);
      
      console.log('📡 API Response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Representatives data:', response.data);
        setRepresentatives(response.data.representatives || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        console.error('❌ API returned error:', response.error || response.message);
      }
    } catch (error) {
      console.error('💥 Error fetching representatives:', error);
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

  const handleEdit = () => {
    if (selectedRep) {
      setEditFormData({ ...selectedRep });
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!selectedRep) return;

    try {
      const response = await updateMissionRepresentative(selectedRep.id, editFormData);
      if (response.success) {
        alert('Application updated successfully!');
        setIsEditMode(false);
        setEditFormData({});
        fetchRepresentatives();
        setShowDetail(false);
      }
    } catch (error) {
      console.error('Error updating representative:', error);
      alert('Failed to update application');
    }
  };

  const handleInputChange = (field: keyof MissionRepresentative, value: any) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
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

  // Detail View
  if (showDetail && selectedRep) {
    return (
      <div className="space-y-6">
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
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.fullName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        type="email"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.contactNumber || ''}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.contactNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    {isEditMode ? (
                      <select
                        value={editFormData.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mm-primary/20"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedRep.gender}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.dateOfBirth?.split('T')[0] || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        type="date"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{new Date(selectedRep.dateOfBirth).toLocaleDateString()}</p>
                    )}
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
                    <p className="text-sm text-muted-foreground">District</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.district || ''}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.district}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Municipality</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.municipality || ''}
                        onChange={(e) => handleInputChange('municipality', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.municipality}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ward Number</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.wardNumber || ''}
                        onChange={(e) => handleInputChange('wardNumber', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.wardNumber}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Full Address</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.currentAddress || ''}
                        onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.currentAddress}</p>
                    )}
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
                    {isEditMode ? (
                      <select
                        value={editFormData.educationLevel || ''}
                        onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mm-primary/20"
                      >
                        <option value="">Select Level</option>
                        <option value="High School">High School</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedRep.educationLevel}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Institution</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.institutionName || ''}
                        onChange={(e) => handleInputChange('institutionName', e.target.value)}
                        placeholder="Institution name"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.institutionName || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Field of Study</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.fieldOfStudy || ''}
                        onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                        placeholder="Field of study"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.fieldOfStudy || 'N/A'}</p>
                    )}
                  </div>
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
                    {isEditMode ? (
                      <Input
                        value={editFormData.positionInterested || ''}
                        onChange={(e) => handleInputChange('positionInterested', e.target.value)}
                        placeholder="e.g., Economic Affairs Representative, Local Representative"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{selectedRep.positionInterested}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Political Experience</p>
                    {isEditMode ? (
                      <textarea
                        value={editFormData.politicalExperience || ''}
                        onChange={(e) => handleInputChange('politicalExperience', e.target.value)}
                        placeholder="Describe your political experience..."
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mm-primary/20 min-h-[100px]"
                      />
                    ) : (
                      <p className="font-medium whitespace-pre-wrap">{selectedRep.politicalExperience || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Key Issues</p>
                    {isEditMode ? (
                      <Input
                        value={editFormData.keyIssues?.join(', ') || ''}
                        onChange={(e) => handleInputChange('keyIssues', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="Enter issues separated by commas"
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRep.keyIssues.map((issue, index) => (
                          <Badge key={index} variant="secondary">{issue}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Why Join</p>
                    {isEditMode ? (
                      <textarea
                        value={editFormData.whyJoin || ''}
                        onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                        placeholder="Why do you want to join..."
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mm-primary/20 min-h-[100px]"
                      />
                    ) : (
                      <p className="font-medium whitespace-pre-wrap">{selectedRep.whyJoin || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-mm-primary" />
                  Uploaded Documents
                  {isEditMode && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">(Document upload functionality will be available soon)</span>
                  )}
                </h3>
                {(selectedRep.photoUrl || selectedRep.citizenshipUrl || selectedRep.educationCertUrl) ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                    {selectedRep.photoUrl ? (
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3"> Photo</p>
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
                              className="w-full h-full object-contain"
                              fallbackText="Photo not available"
                            />
                          </div>
                        </button>
                        <button
                          onClick={async () => {
                            if (!selectedRep.photoUrl) return;
                            const imageUrl = await fetchAuthenticatedFile(selectedRep.photoUrl);
                            if (imageUrl) window.open(imageUrl, '_blank');
                          }}
                          className="inline-flex items-center gap-1 text-sm text-mm-primary hover:underline font-medium mt-3"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Full Size
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-3"> Photo</p>
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md mb-3">
                          <p className="text-gray-400 text-sm">No photo uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedRep.citizenshipUrl ? (
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3"> Citizenship</p>
                        {selectedRep.citizenshipUrl.endsWith('.pdf') ? (
                          <button
                            onClick={async () => {
                              if (!selectedRep.citizenshipUrl) return;
                              const fileUrl = await fetchAuthenticatedFile(selectedRep.citizenshipUrl);
                              if (fileUrl) window.open(fileUrl, '_blank');
                            }}
                            className="block cursor-pointer group w-full"
                          >
                            <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-md mb-3 border border-red-200 relative">
                              <FileText className="w-16 h-16 text-red-500 mb-2" />
                              <span className="text-xs text-red-700 font-medium">PDF Document</span>
                              <span className="text-xs text-gray-500 mt-1">Click to view</span>
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
                                className="w-full h-full object-contain"
                                fallbackText="Document not available"
                              />
                            </div>
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!selectedRep.citizenshipUrl) return;
                            const fileUrl = await fetchAuthenticatedFile(selectedRep.citizenshipUrl);
                            if (fileUrl) window.open(fileUrl, '_blank');
                          }}
                          className="inline-flex items-center gap-1 text-sm text-mm-primary hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedRep.citizenshipUrl.endsWith('.pdf') ? 'Download PDF' : 'View Full Size'}
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-3"> Citizenship</p>
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md mb-3">
                          <p className="text-gray-400 text-sm">No document uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedRep.educationCertUrl ? (
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3"> Education Certificate</p>
                        {selectedRep.educationCertUrl.endsWith('.pdf') ? (
                          <button
                            onClick={async () => {
                              if (!selectedRep.educationCertUrl) return;
                              const fileUrl = await fetchAuthenticatedFile(selectedRep.educationCertUrl);
                              if (fileUrl) window.open(fileUrl, '_blank');
                            }}
                            className="block cursor-pointer group w-full"
                          >
                            <div className="flex flex-col items-center justify-center h-64 bg-blue-50 rounded-md mb-3 border border-blue-200 relative">
                              <FileText className="w-16 h-16 text-blue-500 mb-2" />
                              <span className="text-xs text-blue-700 font-medium">PDF Document</span>
                              <span className="text-xs text-gray-500 mt-1">Click to view</span>
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
                                className="w-full h-full object-contain"
                                fallbackText="Certificate not available"
                              />
                            </div>
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!selectedRep.educationCertUrl) return;
                            const fileUrl = await fetchAuthenticatedFile(selectedRep.educationCertUrl);
                            if (fileUrl) window.open(fileUrl, '_blank');
                          }}
                          className="inline-flex items-center gap-1 text-sm text-mm-primary hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedRep.educationCertUrl.endsWith('.pdf') ? 'Download PDF' : 'View Full Size'}
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-3"> Education Certificate</p>
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
                         No documents were uploaded with this application.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-mm-primary" />
                  Admin Notes
                </h3>
                <div className="pl-7">
                  {isEditMode ? (
                    <textarea
                      value={editFormData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Add internal notes about this application..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mm-primary/20 min-h-[100px]"
                    />
                  ) : (
                    <div className={selectedRep.notes ? "bg-gray-50 border border-gray-200 rounded-lg p-4" : "bg-yellow-50 border border-yellow-200 rounded-lg p-4"}>
                      <p className={selectedRep.notes ? "text-sm text-gray-700 whitespace-pre-wrap" : "text-sm text-yellow-800"}>
                        {selectedRep.notes || 'No admin notes added yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t">
                {isEditMode ? (
                  <>
                    <Button
                      onClick={handleSaveEdit}
                      variant="primary"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Representatives</h1>
          <p className="text-muted-foreground">Manage mission representative applications</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search by name, email, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-mm-primary/20"
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
              <Card key={rep.id} className="transition-shadow hover:shadow-md border-gray-200">
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
    </div>
  );
}