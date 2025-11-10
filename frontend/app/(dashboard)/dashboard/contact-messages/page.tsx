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
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  Trash2,
  Reply,
  X
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
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetail(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      handleMarkAsRead(message.id);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await updateContactMessageStatus(id, 'read');
      if (result.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, status: 'read' } : msg
        ));
        fetchStats();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleRespond = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await updateContactMessageStatus(
        selectedMessage.id,
        'responded',
        responseText.trim()
      );

      if (result.success) {
        setMessages(prev => prev.map(msg =>
          msg.id === selectedMessage.id
            ? { ...msg, status: 'responded', response: responseText.trim(), respondedAt: new Date().toISOString() }
            : msg
        ));
        setSelectedMessage(prev => prev ? { ...prev, status: 'responded', response: responseText.trim() } : null);
        setResponseText('');
        fetchStats();
        alert('प्रतिक्रिया सफलतापूर्वक रेकर्ड गरियो!');
      }
    } catch (error) {
      console.error('Error responding to message:', error);
      alert('प्रतिक्रिया रेकर्ड गर्नमा समस्या भयो।');
    } finally {
      setIsSubmitting(false);
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
        <div>
          <h1 className="text-3xl font-bold text-mm-ink">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">Manage messages received from the contact form</p>
        </div>

        {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Messages</p>
                      <p className="text-2xl font-bold text-mm-ink">{stats.total}</p>
                    </div>
                    <Mail className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Unread</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Read</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Responded</p>
                      <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedStatus === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedStatus === 'unread' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('unread')}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={selectedStatus === 'read' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('read')}
                  >
                    Read
                  </Button>
                  <Button
                    variant={selectedStatus === 'responded' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter('responded')}
                  >
                    Responded
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <div className="grid gap-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No messages found</p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card key={message.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-mm-ink">{message.name}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                        {message.phone && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <Phone className="w-4 h-4" /> {message.phone}
                          </p>
                        )}
                        {message.organization && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <Building2 className="w-4 h-4" /> {message.organization}
                          </p>
                        )}
                        <p className="font-medium text-mm-primary mb-2">{message.subject}</p>
                        <p className="text-gray-700 line-clamp-2 mb-3">{message.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          हेर्नुहोस्
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

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

      {/* Detail Modal */}
      {showDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl my-6 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-mm-primary text-white px-8 py-5 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Message Details</h2>
                <p className="text-white/90 text-sm mt-1">Contact form submission</p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-mm-primary" />
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge(selectedMessage.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">{selectedMessage.name}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900 break-all">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-900">{selectedMessage.phone}</p>
                    </div>
                  )}
                  {selectedMessage.organization && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Organization</p>
                      <p className="font-semibold text-gray-900">{selectedMessage.organization}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Content Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Message Content</h3>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Subject</p>
                    <p className="font-semibold text-lg text-mm-primary">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Message</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
                {selectedMessage.status === 'unread' && (
                  <Button
                    variant="outline"
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 ml-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
