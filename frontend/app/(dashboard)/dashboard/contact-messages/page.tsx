'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Phone,
  Building2,
  Calendar,
  X,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MailOpen,
  Inbox,
  Globe,
  Monitor,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  getContactMessages,
  getContactStats,
  updateContactMessageStatus,
  deleteContactMessage,
  isAuthenticated
} from '@/lib/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  organization?: string;
  ipAddress?: string;
  userAgent?: string;
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

export default function ContactMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    fetchMessages();
    fetchStats();
  }, [router, currentPage, selectedStatus]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const statusFilter = selectedStatus === 'all' ? undefined : selectedStatus;
      const result = await getContactMessages(currentPage, 20, statusFilter);
      
      if (result.success && result.data) {
        setMessages(result.data.messages);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getContactStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetail(true);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await updateContactMessageStatus(id, 'read');
      if (result.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, status: 'read' } : msg
        ));
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: 'read' } : null);
        }
        fetchStats();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('के तपाईं यो सन्देश मेटाउन निश्चित हुनुहुन्छ?')) return;

    try {
      const result = await deleteContactMessage(id);
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        setShowDetail(false);
        setSelectedMessage(null);
        fetchStats();
        alert('सन्देश सफलतापूर्वक मेटाइयो!');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('सन्देश मेटाउनमा समस्या भयो।');
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-yellow-500 text-white">Unread</Badge>;
      case 'read':
        return <Badge className="bg-blue-500 text-white">Read</Badge>;
      case 'responded':
        return <Badge className="bg-green-500 text-white">Responded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mm-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with improved styling */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-mm-ink flex items-center gap-3">
              <div className="w-12 h-12 bg-mm-primary/10 rounded-xl flex items-center justify-center">
                <Inbox className="w-6 h-6 text-mm-primary" />
              </div>
              Contact Messages
            </h1>
            <p className="text-gray-600 mt-2 ml-15">Manage and respond to inquiries from your contact form</p>
          </div>
        </div>

        {/* Enhanced Stats Cards with gradient backgrounds */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Messages</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700 mb-1">Unread</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.unread}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Read</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.read}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MailOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Responded</p>
                      <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search - Enhanced */}
          <Card className="border-none shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 border-gray-200 focus:border-mm-primary focus:ring-mm-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedStatus === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('all')}
                    className="h-11 px-4"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    All
                  </Button>
                  <Button
                    variant={selectedStatus === 'unread' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('unread')}
                    className="h-11 px-4"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Unread
                  </Button>
                  <Button
                    variant={selectedStatus === 'read' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('read')}
                    className="h-11 px-4"
                  >
                    <MailOpen className="w-4 h-4 mr-2" />
                    Read
                  </Button>
                  <Button
                    variant={selectedStatus === 'responded' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('responded')}
                    className="h-11 px-4"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Responded
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List - Professional Table-like Design */}
          <Card className="border-none shadow-md">
            <CardContent className="p-0">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No messages found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredMessages.map((message) => {
                    const isExpanded = expandedMessages.has(message.id);
                    return (
                      <div
                        key={message.id}
                        className={`transition-all hover:bg-gray-50 ${
                          message.status === 'unread' ? 'bg-yellow-50/30' : ''
                        }`}
                      >
                        {/* Main Row */}
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Status Indicator */}
                            <div className="flex-shrink-0 mt-1">
                              {message.status === 'unread' ? (
                                <div className="w-3 h-3 bg-yellow-500 rounded-full ring-4 ring-yellow-100"></div>
                              ) : message.status === 'read' ? (
                                <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-100"></div>
                              ) : (
                                <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-semibold text-gray-900">{message.name}</h3>
                                    {getStatusBadge(message.status)}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    <span className="flex items-center gap-1.5">
                                      <Mail className="w-3.5 h-3.5" />
                                      {message.email}
                                    </span>
                                    {message.phone && (
                                      <span className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        {message.phone}
                                      </span>
                                    )}
                                    {message.organization && (
                                      <span className="flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {message.organization}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Date */}
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(message.createdAt).toLocaleDateString('ne-NP', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>

                              {/* Subject */}
                              <div className="mb-2">
                                <span className="text-sm font-semibold text-mm-primary">
                                  {message.subject}
                                </span>
                              </div>

                              {/* Message Preview */}
                              <div className="text-sm text-gray-700 leading-relaxed">
                                {isExpanded ? (
                                  <p className="whitespace-pre-wrap">{message.message}</p>
                                ) : (
                                  <p className="line-clamp-2">{message.message}</p>
                                )}
                              </div>

                              {/* Actions Row */}
                              <div className="flex items-center gap-2 mt-3">
                                {message.message.length > 100 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleMessageExpansion(message.id)}
                                    className="text-mm-primary hover:text-mm-primary/80 hover:bg-mm-primary/5 h-8"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="w-4 h-4 mr-1" />
                                        Show Less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4 mr-1" />
                                        Read More
                                      </>
                                    )}
                                  </Button>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewMessage(message)}
                                  className="h-8 border-mm-primary/30 text-mm-primary hover:bg-mm-primary hover:text-white"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                                  View Details
                                </Button>

                                {message.status === 'unread' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(message.id)}
                                    className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Mark Read
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(message.id)}
                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                पृष्ठ {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

      {/* Professional 2-Column Message Details Modal */}
      {showDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-[96vh] sm:h-[92vh] max-w-[98vw] sm:max-w-6xl lg:max-w-7xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-mm-primary via-mm-primary/95 to-mm-primary/90 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ring-2 ring-white/40 shadow-lg flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Message Details</h2>
                  <p className="text-white/95 text-xs sm:text-sm flex items-center gap-2 truncate mt-0.5">
                    <User className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate font-medium">{selectedMessage.name}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge(selectedMessage.status)}
                <button
                  onClick={() => setShowDetail(false)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-xl transition-all duration-200 group flex-shrink-0 border border-white/20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>

            {/* 2-Column Content Layout */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 bg-gradient-to-br from-gray-50 to-gray-100/50">
              <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                
                {/* Status & Date Banner */}
                <div className="flex items-center justify-between gap-3 bg-white rounded-xl p-3 sm:p-3.5 border border-gray-200 shadow-sm mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-700">Received:</span>
                    <span className="text-gray-600">{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  
                  {/* LEFT COLUMN - Contact Information */}
                  <div className="space-y-3 sm:space-y-4">
                    
                    {/* Personal Details Card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                        <div className="w-8 h-8 bg-mm-primary/10 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-mm-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">Personal Details</h3>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Name */}
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                          <p className="text-gray-900 font-semibold text-sm sm:text-base">{selectedMessage.name}</p>
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                          <a 
                            href={`mailto:${selectedMessage.email}`} 
                            className="text-mm-primary hover:text-mm-primary/80 font-semibold text-sm sm:text-base hover:underline transition-colors inline-flex items-center gap-2 break-all"
                          >
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="break-all">{selectedMessage.email}</span>
                          </a>
                        </div>
                        
                        {/* Phone */}
                        {selectedMessage.phone && (
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">Phone Number</label>
                            <p className="text-gray-900 font-semibold text-sm sm:text-base inline-flex items-center gap-2">
                              <Phone className="w-4 h-4 text-mm-primary" />
                              {selectedMessage.phone}
                            </p>
                          </div>
                        )}
                        
                        {/* Organization */}
                        {selectedMessage.organization && (
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">Organization</label>
                            <p className="text-gray-900 font-semibold text-sm sm:text-base inline-flex items-start gap-2 break-words">
                              <Building2 className="w-4 h-4 text-mm-primary flex-shrink-0 mt-0.5" />
                              <span className="break-words">{selectedMessage.organization}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technical Details Card */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                        <div className="w-8 h-8 bg-slate-600/10 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-slate-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">Technical Info</h3>
                      </div>
                      
                      <div className="space-y-3">
                        {/* IP Address */}
                        {selectedMessage.ipAddress && (
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Globe className="w-3 h-3" />
                              IP Address
                            </label>
                            <p className="text-gray-900 font-bold text-sm sm:text-base font-mono">{selectedMessage.ipAddress}</p>
                          </div>
                        )}
                        
                        {/* User Agent */}
                        {selectedMessage.userAgent && (
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <label className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Monitor className="w-3 h-3" />
                              Device / Browser
                            </label>
                            <p className="text-gray-700 font-medium text-xs break-all leading-relaxed">{selectedMessage.userAgent}</p>
                          </div>
                        )}
                        
                        {/* Info Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                          <p className="text-[10px] text-blue-700 flex items-start gap-1.5">
                            <span className="text-blue-500 mt-0.5">ℹ️</span>
                            <span>This information is collected for security and spam prevention purposes.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Message Content */}
                  <div className="space-y-3 sm:space-y-4">
                    
                    {/* Subject Card */}
                    <div className="bg-gradient-to-br from-mm-primary/5 via-mm-primary/10 to-mm-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-l-4 border-mm-primary shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-mm-primary/20 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-mm-primary" />
                        </div>
                        <label className="text-[10px] font-extrabold text-mm-primary uppercase tracking-wider">Subject</label>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-mm-primary leading-tight break-words">
                        {selectedMessage.subject}
                      </h3>
                    </div>
                    
                    {/* Message Card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex-1">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">Message Content</h3>
                      </div>
                      
                      <div className="prose prose-sm sm:prose max-w-none">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-800 leading-relaxed sm:leading-loose whitespace-pre-wrap text-sm sm:text-base break-words m-0">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-t-2 border-gray-200 flex-shrink-0 shadow-lg">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {selectedMessage.status === 'unread' ? (
                  <Button
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md h-10 sm:h-11 px-5 sm:px-6 text-sm sm:text-base font-semibold w-full sm:w-auto transition-all"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-green-700 bg-green-50 rounded-lg border-2 border-green-200 px-4 py-2.5 w-full sm:w-auto">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Message Read</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedMessage.id)}
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold h-10 sm:h-11 px-5 sm:px-6 text-sm sm:text-base w-full sm:w-auto transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
