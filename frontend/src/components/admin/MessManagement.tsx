import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Building2, MapPin, Users, IndianRupee, CheckCircle, XCircle, Eye, Ban, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { adminService, type Mess } from '../../services/admin.service';

interface MessManagementProps {
  currentScreen: string;
}

export function MessManagement({ currentScreen }: MessManagementProps) {
  const [messes, setMesses] = useState<Mess[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null);

  useEffect(() => {
    loadMesses();
  }, []);

  const loadMesses = async () => {
    try {
      const data = await adminService.getMesses();
      setMesses(data);
    } catch (error) {
      console.error('Failed to load messes:', error);
      toast.error('Failed to load messes');
    }
  };

  const handleSuspendMess = async (messId: string) => {
    try {
      await adminService.suspendMess(messId);
      setMesses(messes.map(mess =>
        mess.id === messId ? { ...mess, status: 'suspended' as const } : mess
      ));
      toast.success('Mess suspended successfully');
      setSelectedMess(null);
    } catch (error) {
      console.error('Failed to suspend mess:', error);
      toast.error('Failed to suspend mess');
    }
  };

  const handleActivateMess = async (messId: string) => {
    try {
      await adminService.activateMess(messId);
      setMesses(messes.map(mess =>
        mess.id === messId ? { ...mess, status: 'active' as const } : mess
      ));
      toast.success('Mess activated successfully');
      setSelectedMess(null);
    } catch (error) {
      console.error('Failed to activate mess:', error);
      toast.error('Failed to activate mess');
    }
  };

  const handleApproveMess = async (messId: string) => {
    try {
      await adminService.approveMess(messId);
      setMesses(messes.map(mess =>
        mess.id === messId ? { ...mess, status: 'active' as const } : mess
      ));
      toast.success('Mess approved successfully');
      setSelectedMess(null);
    } catch (error) {
      console.error('Failed to approve mess:', error);
      toast.error('Failed to approve mess');
    }
  };

  const filteredMesses = messes
    .filter(mess => filterStatus === 'all' || mess.status === filterStatus)
    .filter(mess =>
      mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status: Mess['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status: Mess['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Eye className="w-4 h-4" />;
    }
  };

  if (currentScreen !== 'messes') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-2xl font-bold mb-2">Mess Management</h1>
          <p className="text-indigo-100">View and manage all registered messes</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, manager, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {(['all', 'active', 'suspended', 'pending'] as const).map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messes List */}
        <div className="space-y-3">
          {filteredMesses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messes found</p>
              </CardContent>
            </Card>
          ) : (
            filteredMesses.map((mess, index) => (
              <motion.div
                key={mess.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{mess.name}</h3>
                        <p className="text-sm text-gray-600">{mess.ownerName}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mess.status)}`}>
                        {getStatusIcon(mess.status)}
                        <span className="capitalize">{mess.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{mess.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{mess.currentMembers} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IndianRupee className="w-4 h-4" />
                        <span>₹{mess.monthlyFee}/month</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Revenue: ₹{(mess.monthlyFee / 1000).toFixed(0)}K
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedMess(mess)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {mess.status === 'active' && (
                        <Button
                          onClick={() => handleSuspendMess(mess.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      {mess.status === 'suspended' && (
                        <Button
                          onClick={() => handleActivateMess(mess.id)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      {mess.status === 'pending' && (
                        <Button
                          onClick={() => handleApproveMess(mess.id)}
                          variant="default"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedMess && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
          onClick={() => setSelectedMess(null)}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMess.name}</h2>
                  <p className="text-gray-600">{selectedMess.ownerName}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMess.status)}`}>
                  {getStatusIcon(selectedMess.status)}
                  <span className="capitalize">{selectedMess.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">address</p>
                    <p className="font-medium">{selectedMess.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Members</p>
                    <p className="font-medium">{selectedMess.currentMembers}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Monthly Fee</p>
                    <p className="font-medium">₹{selectedMess.monthlyFee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="font-medium">₹{selectedMess.monthlyFee.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Joined Date</p>
                  <p className="font-medium">{new Date(selectedMess.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <Button
                onClick={() => setSelectedMess(null)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
