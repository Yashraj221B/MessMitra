import { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, UserCheck, UserX, Search, Barcode, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTranslation } from '../../../utils/translations';
import { BilingualText } from '../../BilingualText';
import { messService, userService, attendanceService } from '../../../services';
import { QRScanner } from '../../QRScanner';

interface AttendanceProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Student {
  id: string;
  name: string;
  room: string;
  present: boolean;
}

export function Attendance({ currentScreen, onNavigate, onBack }: AttendanceProps) {
  const { language } = useLanguage();
  const [scanMode, setScanMode] = useState<'manual' | 'qr' | 'barcode'>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [messId, setMessId] = useState<string>('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const profile = await userService.getProfile();
      
      if (!profile.messId) {
        toast.error('पहले mess बनाएं!');
        onBack();
        return;
      }

      setMessId(profile.messId);
      
      const members = await messService.getMessMembers(profile.messId);
      const activeMembers = members.filter(m => m.status === 'active');
      
      // Get today's attendance
      const todayAttendance = await attendanceService.getTodayAttendance(profile.messId);
      
      const studentsData: Student[] = activeMembers.map(member => ({
        id: member.userId,
        name: member.user.name || member.user.phone,
        room: 'N/A', // TODO: Add room field to user profile
        present: todayAttendance.some(a => a.memberId === member.userId && a.status === 'present')
      }));
      
      setStudents(studentsData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load members');
      console.error('Error loading members:', error);
    }
  };

  const toggleAttendance = (id: string) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, present: !s.present } : s)
    );
  };

  const handleQRScanSuccess = async (decodedText: string) => {
    setShowQRScanner(false);
    
    try {
      // Parse QR code data - expected format: {"userId": "...", "name": "...", "phone": "..."}
      const userData = JSON.parse(decodedText);
      
      if (!userData.userId) {
        toast.error('Invalid QR code');
        return;
      }

      // Find student in list
      const student = students.find(s => s.id === userData.userId);
      
      if (!student) {
        toast.error('Student not found in mess');
        return;
      }

      // Mark attendance via API
      const today = new Date().toISOString().split('T')[0];
      await attendanceService.markAttendance({
        messId,
        memberId: userData.userId,
        date: today,
        mealType: 'lunch',
        scanMethod: 'qr',
        status: 'present'
      });

      // Update UI
      toggleAttendance(userData.userId);
      
      // Removed success toast - attendance checkbox already shows the change
    } catch (error: any) {
      console.error('Error processing QR code:', error);
      toast.error('Invalid QR code or failed to mark attendance');
    }
  };

  const handleQRScanClose = () => {
    setShowQRScanner(false);
  };

  const saveAttendance = async () => {
    if (!messId) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Mark attendance for all present students
      const attendancePromises = students
        .filter(s => s.present)
        .map(s => 
          attendanceService.markAttendance({
            messId,
            memberId: s.id,
            date: today,
            mealType: 'lunch', // Default to lunch, can be made dynamic
            scanMethod: 'manual',
            status: 'present'
          })
        );
      
      await Promise.all(attendancePromises);
      
      const presentCount = students.filter(s => s.present).length;
      // Removed success toast - attendance checkmarks are visible in UI
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
      console.error('Error saving attendance:', error);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          onClose={handleQRScanClose}
          title="Scan Student QR Code"
          description="विद्यार्थी का QR code स्कैन करें"
        />
      )}

      {/* Modern Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(11, 128, 67, 0.2)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white mb-0.5" style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              <BilingualText text={getTranslation(language, 'markAttendance')} />
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white mb-1">
              <UserCheck className="w-4 h-4" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{getTranslation(language, 'present')}</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{presentCount}</div>
          </div>
          <div className="flex-1 p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white mb-1">
              <UserX className="w-4 h-4" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>अनुपस्थित</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Scan Mode Selector */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl" style={{ 
          background: 'white',
          border: '1.5px solid #E8F5E9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <button
            onClick={() => setScanMode('manual')}
            className="py-2.5 px-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            style={{ 
              background: scanMode === 'manual' ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' : 'transparent',
              color: scanMode === 'manual' ? 'white' : '#666',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Check className="w-4 h-4" />
            मैन्युअल
          </button>
          <button
            onClick={() => {
              setScanMode('qr');
              setShowQRScanner(true);
            }}
            className="py-2.5 px-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            style={{ 
              background: scanMode === 'qr' ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' : 'transparent',
              color: scanMode === 'qr' ? 'white' : '#666',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
          <button
            onClick={() => setScanMode('barcode')}
            className="py-2.5 px-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            style={{ 
              background: scanMode === 'barcode' ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' : 'transparent',
              color: scanMode === 'barcode' ? 'white' : '#666',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Barcode className="w-4 h-4" />
            बारकोड
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {scanMode === 'qr' ? (
          <motion.div 
            key="qr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-sm">
              <div className="aspect-square rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'white',
                boxShadow: '0 8px 32px rgba(11, 128, 67, 0.15)',
                border: '3px solid #E8F5E9'
              }}>
                <div className="w-3/4 aspect-square rounded-xl flex items-center justify-center relative" style={{ 
                  border: '3px dashed #0B8043'
                }}>
                  <QrCode className="w-24 h-24" style={{ color: '#0B8043' }} />
                  {/* Scanning corners animation */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                </div>
              </div>
              <div className="text-center px-4">
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1C4532', marginBottom: '0.5rem' }}>
                  QR Code स्कैन करें
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
                  विद्यार्थी का QR code कैमरे के सामने रखें
                </p>
                
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="w-full py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
                  style={{ 
                    background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                    color: 'white',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(11, 128, 67, 0.3)'
                  }}
                >
                  <QrCode className="w-5 h-5" />
                  Start Camera Scanner
                </button>

                <div className="mt-2 p-4 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
                  border: '1.5px solid #FFE082'
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#F57C00', fontWeight: '600' }}>
                    💡 टिप: QR code को frame के अंदर रखें
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : scanMode === 'barcode' ? (
          <motion.div 
            key="barcode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-sm">
              <div className="p-8 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'white',
                boxShadow: '0 8px 32px rgba(11, 128, 67, 0.15)',
                border: '3px solid #E8F5E9',
                minHeight: '200px'
              }}>
                <div className="flex flex-col items-center justify-center relative">
                  <Barcode className="w-32 h-32 mb-4" style={{ color: '#0B8043' }} />
                  <div className="w-full h-1 bg-red-500 absolute top-1/2 left-0 animate-pulse" style={{ 
                    boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
                  }} />
                </div>
              </div>
              <div className="text-center px-4">
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1C4532', marginBottom: '0.5rem' }}>
                  बारकोड स्कैन करें
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                  विद्यार्थी की ID card का बारकोड स्कैन करें
                </p>
                <div className="mt-6 p-4 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
                  border: '1.5px solid #FFE082'
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#F57C00', fontWeight: '600' }}>
                    💡 टिप: बारकोड को लाल लाइन के बीच में रखें
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="manual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto p-4 pb-32"
          >
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#999' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="नाम या रूम नंबर खोजें..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                  style={{ 
                    borderColor: searchQuery ? '#0B8043' : '#E8F5E9',
                    fontSize: '1rem',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                />
              </div>
            </div>

            {/* Student List */}
            <div className="flex flex-col gap-2">
              {filteredStudents.map((student, index) => (
                <motion.button
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleAttendance(student.id)}
                  className="flex items-center gap-3 p-4 rounded-xl active:scale-[0.98] transition-all"
                  style={{ 
                    background: 'white',
                    border: student.present ? '2px solid #C8E6C9' : '2px solid #E0E0E0',
                    boxShadow: student.present ? '0 4px 12px rgba(11, 128, 67, 0.1)' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ 
                      background: student.present 
                        ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' 
                        : 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
                      boxShadow: student.present ? '0 4px 12px rgba(11, 128, 67, 0.3)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>
                      {student.present ? '✓' : '👤'}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: student.present ? '#1C4532' : '#666',
                      marginBottom: '2px'
                    }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#999' }}>Room: {student.room}</div>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ 
                      background: student.present ? '#E8F5E9' : '#FFEBEE'
                    }}
                  >
                    {student.present ? (
                      <UserCheck className="w-5 h-5" style={{ color: '#0B8043' }} />
                    ) : (
                      <UserX className="w-5 h-5" style={{ color: '#D32F2F' }} />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p style={{ fontSize: '1rem', color: '#999' }}>कोई विद्यार्थी नहीं मिला</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button - Only in manual mode */}
      {scanMode === 'manual' && (
        <div className="fixed bottom-20 left-0 right-0 p-4 pointer-events-none">
          <div className="max-w-[430px] mx-auto pointer-events-auto">
            <button
              onClick={saveAttendance}
              className="w-full py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            >
              <Check className="w-5 h-5" />
              हाज़िरी सेव करें • Save Attendance
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
