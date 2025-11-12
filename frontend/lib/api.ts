/**
 * API Client for Backend Communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLogin: string | null;
  };
}

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mm_auth_token');
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mm_auth_token', token);
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('mm_auth_token');
  localStorage.removeItem('mm_user_data');
}

/**
 * Make API request with error handling
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    
    console.log('🔐 API Request:', { 
      endpoint, 
      method: options.method || 'GET',
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN'
    });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    console.log('📥 API Response:', {
      endpoint,
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'An error occurred',
      };
    }

    // Backend returns { success, data, message }
    // We return the data directly in our ApiResponse
    return {
      success: data.success !== false,
      data: data.data || data, // Handle both nested and flat responses
      message: data.message,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Login with username and password
 */
export async function login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Logout current user
 */
export async function logout(): Promise<ApiResponse> {
  const response = await apiRequest('/api/auth/logout', {
    method: 'POST',
  });
  
  // Remove token regardless of response
  removeAuthToken();
  
  return response;
}

/**
 * Get current admin profile
 */
export async function getCurrentAdmin(): Promise<ApiResponse<AdminProfile>> {
  return apiRequest<AdminProfile>('/api/auth/me', {
    method: 'GET',
  });
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse> {
  return apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Validate token by making a request to /api/auth/me
 */
export async function validateToken(): Promise<boolean> {
  const response = await getCurrentAdmin();
  return response.success;
}

/**
 * Mission Representative APIs
 */

interface MissionRepresentativeData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
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
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export async function submitMissionRepresentative(data: MissionRepresentativeData): Promise<ApiResponse> {
  return apiRequest('/api/mission-representatives', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMissionRepresentatives(page = 1, limit = 20, status?: string): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append('status', status);
  
  return apiRequest(`/api/mission-representatives?${params.toString()}`, {
    method: 'GET',
  });
}

export async function getMissionRepresentativeById(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/mission-representatives/${id}`, {
    method: 'GET',
  });
}

export async function updateMissionRepresentativeStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<ApiResponse> {
  return apiRequest(`/api/mission-representatives/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
}

/**
 * Update mission representative details
 */
export async function updateMissionRepresentative(
  id: string,
  data: Partial<{
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
    notes?: string;
  }>
): Promise<ApiResponse> {
  return apiRequest(`/api/mission-representatives/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Soft delete (move to trash) mission representative
 */
export async function deleteMissionRepresentative(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/mission-representatives/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Restore mission representative from trash
 */
export async function restoreMissionRepresentative(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/mission-representatives/${id}/restore`, {
    method: 'POST',
  });
}

/**
 * Permanently delete mission representative (superadmin only)
 */
export async function permanentlyDeleteMissionRepresentative(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/mission-representatives/${id}/permanent`, {
    method: 'DELETE',
  });
}

// Upload files for mission representative
export async function uploadMissionRepresentativeFiles(files: {
  photo?: File;
  citizenship?: File;
  educationCert?: File;
}): Promise<ApiResponse> {
  const formData = new FormData();
  
  if (files.photo) {
    formData.append('photo', files.photo);
  }
  if (files.citizenship) {
    formData.append('citizenship', files.citizenship);
  }
  if (files.educationCert) {
    formData.append('educationCert', files.educationCert);
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${API_URL}/api/upload/mission-representative`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header, browser will set it automatically with boundary
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Failed to upload files'
    };
  }
}

/**
 * Get authenticated file URL with token
 * This constructs a URL that includes the auth token for secure file access
 */
export function getAuthenticatedFileUrl(filePath: string | undefined | null): string | null {
  if (!filePath) return null;
  
  const token = getAuthToken();
  if (!token) return null;

  // Extract just the filename from the path
  const filename = filePath.split('/').pop();
  if (!filename) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${API_URL}/api/upload/mission-representatives/${filename}`;
}

/**
 * Fetch file blob with authentication for image preview
 */
export async function fetchAuthenticatedFile(filePath: string): Promise<string | null> {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const filename = filePath.split('/').pop();
    if (!filename) return null;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/upload/mission-representatives/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching authenticated file:', error);
    return null;
  }
}

/**
 * Contact Message APIs
 */

interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  organization?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  organization?: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
  respondedAt?: string;
  response?: string;
}

interface ContactStats {
  total: number;
  unread: number;
  read: number;
  responded: number;
}

/**
 * Submit contact message (public endpoint)
 */
export async function submitContactMessage(data: ContactMessageData): Promise<ApiResponse> {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get all contact messages with pagination (authenticated)
 */
export async function getContactMessages(page = 1, limit = 20, status?: string): Promise<ApiResponse<{
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append('status', status);
  
  return apiRequest(`/api/contact?${params.toString()}`, {
    method: 'GET',
  });
}

/**
 * Get contact message statistics (authenticated)
 */
export async function getContactStats(): Promise<ApiResponse<ContactStats>> {
  return apiRequest('/api/contact/stats', {
    method: 'GET',
  });
}

/**
 * Get contact message by ID (authenticated)
 */
export async function getContactMessageById(id: string): Promise<ApiResponse<ContactMessage>> {
  return apiRequest(`/api/contact/${id}`, {
    method: 'GET',
  });
}

/**
 * Update contact message status (authenticated)
 */
export async function updateContactMessageStatus(
  id: string,
  status: 'unread' | 'read' | 'responded',
  response?: string
): Promise<ApiResponse> {
  return apiRequest(`/api/contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, response }),
  });
}

/**
 * Delete contact message (admin only)
 */
export async function deleteContactMessage(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/contact/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Membership APIs
 */

interface MembershipData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  education?: string;
  birthDate?: string;
  gender?: string;
  motivations?: string[];
  skills?: string[];
  availability?: string;
  additionalInfo?: string;
}

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
  ipAddress?: string;
  userAgent?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

interface MembershipStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

/**
 * Submit membership application (public endpoint)
 */
export async function submitMembership(data: MembershipData): Promise<ApiResponse> {
  return apiRequest('/api/memberships', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get all memberships with pagination (authenticated)
 */
export async function getMemberships(
  page = 1, 
  limit = 20, 
  status?: string,
  search?: string
): Promise<ApiResponse<{
  memberships: Membership[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  
  return apiRequest(`/api/memberships?${params.toString()}`, {
    method: 'GET',
  });
}

/**
 * Get membership statistics (authenticated)
 */
export async function getMembershipStats(): Promise<ApiResponse<MembershipStats>> {
  return apiRequest('/api/memberships/stats', {
    method: 'GET',
  });
}

/**
 * Get membership by ID (authenticated)
 */
export async function getMembershipById(id: string): Promise<ApiResponse<Membership>> {
  return apiRequest(`/api/memberships/${id}`, {
    method: 'GET',
  });
}

/**
 * Update membership status (admin only)
 */
export async function updateMembershipStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<ApiResponse> {
  return apiRequest(`/api/memberships/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
}

/**
 * Update membership details (admin only)
 */
export async function updateMembership(
  id: string,
  data: Partial<MembershipData>
): Promise<ApiResponse> {
  return apiRequest(`/api/memberships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete membership (admin only)
 */
export async function deleteMembership(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/memberships/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Restore membership from trash (admin only)
 */
export async function restoreMembership(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/memberships/${id}/restore`, {
    method: 'POST',
  });
}

/**
 * Permanently delete membership (superadmin only)
 */
export async function permanentlyDeleteMembership(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/memberships/${id}/permanent`, {
    method: 'DELETE',
  });
}
