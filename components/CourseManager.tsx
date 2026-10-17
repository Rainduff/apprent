import React, { useState } from 'react';
import { Course, Enrollment, User, UserRole, Milestone, DeliveryMode, ChatMessage, TradeCertificate } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';
import { ChatSystem } from './ChatSystem';
import { SettlementCeremonyView } from './SettlementCeremonyView';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  ShieldCheck,
  Sprout,
  PlayCircle,
  Video,
  MapPin,
  Laptop,
  MessageSquare,
  Plus,
  Trash,
  ArrowLeft,
  DollarSign,
  Search,
  Filter,
  X,
  Award,
  Sparkles
} from 'lucide-react';

interface CourseManagerProps {
  user: User;
  courses: Course[];
  enrollments: Enrollment[];
  chats: ChatMessage[];
  certificates: TradeCertificate[];
  onUploadEvidence: (enrollmentId: string, milestoneId: string) => void;
  onApproveMilestone: (enrollmentId: string, milestoneId: string, amount: number, ogaId: string) => void;
  onDisputeMilestone: (enrollmentId: string, milestoneId: string, reason: string) => void;
  onEnroll: (courseId: string, fee: number) => void;
  onCreateCourse: (course: Course) => void;
  onSendMessage: (enrollmentId: string, text: string) => void;
  onAuthorizeSettlement: (
    enrollmentId: string, 
    seedCapital: number, 
    equipment: string, 
    blessing: string
  ) => void;
  onClaimSettlement: (enrollmentId: string) => void;
  onFastTrackMilestones?: (enrollmentId: string) => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({ 
  user, 
  courses, 
  enrollments,
  chats,
  certificates,
  onUploadEvidence,
  onApproveMilestone,
  onDisputeMilestone,
  onEnroll,
  onCreateCourse,
  onSendMessage,
  onAuthorizeSettlement,
  onClaimSettlement,
  onFastTrackMilestones
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All Skills');
  const [selectedOga, setSelectedOga] = useState<string>('All Masters');
  const [selectedMode, setSelectedMode] = useState<string>('All Modes');

  // Filter logic
  const myEnrollments = enrollments.filter(e => e.apprenticeId === user.id);
  const myCourses = courses.filter(c => c.ogaId === user.id);
  
  // Catalog filtering logic
  const availableCourses = courses.filter(c => !myEnrollments.some(e => e.courseId === c.id));
  
  // Get unique filter options
  const allSkills = Array.from(new Set(availableCourses.flatMap(c => c.skillTags))).sort();
  const allOgas = Array.from(new Set(availableCourses.map(c => c.ogaName))).sort();
  const allModes = Array.from(new Set(availableCourses.map(c => c.deliveryMode))).sort() as DeliveryMode[];

  const filteredCatalog = availableCourses.filter(course => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      course.title.toLowerCase().includes(term) || 
      course.description.toLowerCase().includes(term) ||
      course.ogaName.toLowerCase().includes(term) ||
      course.location.toLowerCase().includes(term) ||
      course.skillTags.some(t => t.toLowerCase().includes(term));
    const matchesSkill = selectedSkill === 'All Skills' || course.skillTags.includes(selectedSkill);
    const matchesOga = selectedOga === 'All Masters' || course.ogaName === selectedOga;
    const matchesMode = selectedMode === 'All Modes' || course.deliveryMode === selectedMode;
    
    return matchesSearch && matchesSkill && matchesOga && matchesMode;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkill('All Skills');
    setSelectedOga('All Masters');
    setSelectedMode('All Modes');
  };

  const handleBack = () => setSelectedCourseId(null);

  if (selectedCourseId) {
    const course = courses.find(c => c.id === selectedCourseId);
    
    // Find relevant enrollment logic
    let relevantEnrollments = enrollments.filter(e => e.courseId === selectedCourseId);
    
    // For Apprentice, only show their own. For Oga, show all for that course.
    if (user.role === UserRole.APPRENTICE) {
       relevantEnrollments = relevantEnrollments.filter(e => e.apprenticeId === user.id);
    }
    
    // If no enrollment found for apprentice, it's a preview before joining.
    const isEnrolled = relevantEnrollments.length > 0;
    
    if (!course) return <div>Course not found</div>;

    return (
      <CourseDetailView 
        course={course} 
        enrollments={relevantEnrollments} 
        user={user} 
        chats={chats}
        certificates={certificates}
        onBack={handleBack}
        onUploadEvidence={onUploadEvidence}
        onApproveMilestone={onApproveMilestone}
        onDisputeMilestone={onDisputeMilestone}
        onEnroll={onEnroll}
        onSendMessage={onSendMessage}
        onAuthorizeSettlement={onAuthorizeSettlement}
        onClaimSettlement={onClaimSettlement}
        onFastTrackMilestones={onFastTrackMilestones}
      />
    );
  }

  // --- Main List View ---

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user.role === UserRole.OGA ? 'My Teaching Studio' : 'Apprenticeship Catalog'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === UserRole.OGA 
              ? "Nurture your apprentices to harvest success." 
              : "Find a master, learn a trade, secure your future."}
          </p>
        </div>
        {user.role === UserRole.OGA && (
           <Button icon={<Plus size={16}/>} onClick={() => setIsCreateModalOpen(true)}>Register New Course</Button>
        )}
      </div>

      {user.role === UserRole.APPRENTICE && (
        <div className="space-y-8">
          
          {/* My Active Courses Section */}
          {myEnrollments.length > 0 && (
             <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Sprout className="mr-2 text-emerald-500"/> My Active Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEnrollments.map(enrollment => {
                    const course = courses.find(c => c.id === enrollment.courseId);
                    if (!course) return null;
                    const completedCount = enrollment.progress.filter(p => p.status === 'completed').length;
                    const progressPercent = Math.round((completedCount / course.milestones.length) * 100);

                    return (
                      <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCourseId(course.id)}>
                        <div className="h-32 bg-sky-100 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-sky-200 to-sky-100 opacity-50"></div>
                          {course.deliveryMode !== 'physical' && (
                             <div className="absolute top-2 left-2">
                               <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                                  {course.deliveryMode === 'virtual' ? <Laptop size={12} className="mr-1"/> : <Video size={12} className="mr-1"/>}
                                  {course.deliveryMode === 'virtual' ? 'Virtual' : 'Hybrid'}
                               </span>
                             </div>
                          )}
                          <div className="absolute bottom-2 right-4 text-emerald-600 transition-all duration-700 transform hover:scale-110">
                              {progressPercent < 30 ? <Sprout size={48} /> : progressPercent < 80 ? <div className="text-5xl">🌿</div> : <div className="text-5xl">🌳</div>}
                          </div>
                          <div className="p-4 relative z-10">
                            <span className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-sky-800 uppercase shadow-sm">In Progress</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{course.title}</h3>
                          <p className="text-sm text-gray-500 mb-4 flex items-center"><ShieldCheck size={14} className="mr-1 text-emerald-500"/> Master: {course.ogaName}</p>
                          
                          <div className="mb-2 flex justify-between text-xs text-gray-600">
                              <span>Growth</span>
                              <span>{progressPercent}% to Harvest</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center text-sm border-t pt-3">
                              <span className="text-gray-500">Next Milestone</span>
                              <span className="text-sky-600 font-medium hover:text-sky-800 flex items-center">Continue <PlayCircle size={14} className="ml-1"/></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          )}

          {/* Catalog Section */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center"><FileText className="mr-2 text-sky-500"/> Available Courses</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <Filter size={14} className="text-gray-400" />
                  <select 
                    className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    <option>All Skills</option>
                    {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <select 
                    className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                    value={selectedOga}
                    onChange={(e) => setSelectedOga(e.target.value)}
                  >
                    <option>All Masters</option>
                    {allOgas.map(oga => <option key={oga} value={oga}>{oga}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <select 
                    className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    <option>All Modes</option>
                    {allModes.map(mode => <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>)}
                  </select>
                </div>

                {(searchTerm || selectedSkill !== 'All Skills' || selectedOga !== 'All Masters' || selectedMode !== 'All Modes') && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
            </div>

            {filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedCourseId(course.id)}>
                    <div className="h-40 bg-gray-200 relative">
                       <img src={course.coverImage || `https://picsum.photos/seed/${course.id}/400/200`} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer"/>
                       <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">
                         ₦{course.totalFee.toLocaleString()}
                       </div>
                       {course.deliveryMode !== 'physical' && (
                         <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center shadow-sm">
                            {course.deliveryMode === 'virtual' ? <Laptop size={12} className="mr-1"/> : <Video size={12} className="mr-1"/>}
                            {course.deliveryMode === 'virtual' ? 'Virtual Class' : 'Hybrid'}
                         </div>
                       )}
                    </div>
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 leading-tight group-hover:text-sky-700">{course.title}</h3>
                       </div>
                       <p className="text-xs text-gray-500 mb-1 flex items-center">
                         <ShieldCheck size={12} className="mr-1 text-emerald-500"/>
                         Master: 
                         <button 
                           type="button"
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedOga(course.ogaName);
                           }} 
                           className="ml-1 text-gray-700 hover:text-sky-600 font-medium hover:underline text-left"
                         >
                           {course.ogaName}
                         </button>
                       </p>
                       <p className="text-xs text-gray-500 mb-3 flex items-center"><MapPin size={12} className="mr-1"/> {course.location}</p>
                       <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                       <div className="flex flex-wrap gap-2">
                          {course.skillTags.slice(0, 3).map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSkill(tag);
                              }}
                              className={`px-2 py-1 text-xs rounded-md transition-colors ${selectedSkill === tag ? 'bg-sky-100 text-sky-800 font-semibold ring-1 ring-sky-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {tag}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">No courses found</h4>
                <p className="text-gray-500">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-sky-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {user.role === UserRole.OGA && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apprentices</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue (Escrow)</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {myCourses.map(course => (
                 <tr key={course.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedCourseId(course.id)}>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                          <img src={`https://picsum.photos/seed/${course.id}/100/100`} alt="" className="object-cover w-full h-full" />
                       </div>
                       <div className="ml-4">
                         <div className="text-sm font-medium text-gray-900">{course.title}</div>
                         <div className="text-sm text-gray-500">{course.skillTags[0]}</div>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                      {course.deliveryMode === 'physical' ? (
                        <span className="text-xs flex items-center text-gray-500"><MapPin size={12} className="mr-1"/> In-Person</span>
                      ) : (
                        <span className="text-xs flex items-center text-purple-600 font-medium"><Laptop size={12} className="mr-1"/> {course.deliveryMode === 'virtual' ? 'Online' : 'Hybrid'}</span>
                      )}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Mock Student count */}
                      {enrollments.filter(e => e.courseId === course.id).length} Active
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                     ₦{course.totalFee.toLocaleString()}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                       Active
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <span className="text-sky-600 hover:text-sky-900">Manage</span>
                   </td>
                 </tr>
               ))}
               {myCourses.length === 0 && (
                 <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                     No courses created yet. Click "Register New Course" to start teaching.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal 
         isOpen={isCreateModalOpen} 
         onClose={() => setIsCreateModalOpen(false)}
         onSave={(course) => {
           onCreateCourse({ ...course, ogaId: user.id, ogaName: user.name });
           setIsCreateModalOpen(false);
         }}
      />
    </div>
  );
};

// --- Helper Components ---

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onSave }) => {
  // Simple form state
  const [title, setTitle] = useState('');
  const [fee, setFee] = useState(50000);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('physical');
  const [skillTags, setSkillTags] = useState('');

  const handleSave = () => {
    // Basic validation
    if (!title || !description) return;

    const newCourse: Course = {
      id: `c_${Date.now()}`,
      ogaId: '', // Filled by parent
      ogaName: '', // Filled by parent
      title,
      description,
      totalFee: fee,
      location,
      deliveryMode,
      skillTags: skillTags.split(',').map(s => s.trim()),
      milestones: [
        // Default milestones for simplicity
        { id: `m1_${Date.now()}`, title: 'Foundation & Safety', durationDays: 14, paymentPercent: 20, description: 'Basic introduction and safety protocols' },
        { id: `m2_${Date.now()}`, title: 'Core Skills', durationDays: 30, paymentPercent: 40, description: 'Learning the main trade skills' },
        { id: `m3_${Date.now()}`, title: 'Advanced & Project', durationDays: 30, paymentPercent: 40, description: 'Final project execution' }
      ]
    };
    onSave(newCourse);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Course">
       <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
                   value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master Carpentry" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fee (NGN)</label>
            <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
                   value={fee} onChange={e => setFee(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
                   value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Location</label>
               <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
                      value={location} onChange={e => setLocation(e.target.value)} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700">Mode</label>
               <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                  value={deliveryMode} onChange={e => setDeliveryMode(e.target.value as DeliveryMode)}>
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
               </select>
             </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
            <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
                   value={skillTags} onChange={e => setSkillTags(e.target.value)} placeholder="e.g. Woodwork, Polishing" />
          </div>
          <div className="pt-4">
             <Button className="w-full" onClick={handleSave}>Create Course</Button>
          </div>
       </div>
    </Modal>
  );
};

interface CourseDetailProps {
  course: Course;
  enrollments: Enrollment[]; // For Oga this is list of students, For Apprentice it's just theirs
  user: User;
  chats: ChatMessage[];
  certificates: TradeCertificate[];
  onBack: () => void;
  onUploadEvidence: (enrollmentId: string, milestoneId: string) => void;
  onApproveMilestone: (enrollmentId: string, milestoneId: string, amount: number, ogaId: string) => void;
  onDisputeMilestone: (enrollmentId: string, milestoneId: string, reason: string) => void;
  onEnroll: (courseId: string, fee: number) => void;
  onSendMessage: (enrollmentId: string, text: string) => void;
  onAuthorizeSettlement: (
    enrollmentId: string, 
    seedCapital: number, 
    equipment: string, 
    blessing: string
  ) => void;
  onClaimSettlement: (enrollmentId: string) => void;
  onFastTrackMilestones?: (enrollmentId: string) => void;
}

const CourseDetailView: React.FC<CourseDetailProps> = ({ 
  course, 
  enrollments, 
  user, 
  chats, 
  certificates,
  onBack, 
  onUploadEvidence, 
  onApproveMilestone, 
  onDisputeMilestone, 
  onEnroll, 
  onSendMessage,
  onAuthorizeSettlement,
  onClaimSettlement,
  onFastTrackMilestones
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'classroom' | 'settlement'>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // If Apprentice, they have one enrollment
  const myEnrollment = user.role === UserRole.APPRENTICE ? enrollments[0] : null;
  // If Oga, they might select a student to manage
  const studentEnrollment = user.role === UserRole.OGA && selectedStudentId 
    ? enrollments.find(e => e.apprenticeId === selectedStudentId) 
    : (user.role === UserRole.OGA && enrollments.length > 0 ? enrollments[0] : null);

  // The active enrollment being viewed (either mine or the selected student's)
  const activeEnrollment = myEnrollment || studentEnrollment;

  const isEnrolled = !!myEnrollment;

  // Settlement & Graduation Metrics
  const completedMilestonesCount = activeEnrollment 
    ? activeEnrollment.progress.filter(p => p.status === 'completed').length 
    : 0;
  const isAllMilestonesCompleted = activeEnrollment 
    ? completedMilestonesCount === course.milestones.length 
    : false;
  const isSettled = activeEnrollment 
    ? activeEnrollment.status === 'completed' || !!activeEnrollment.settlementPackage || !!activeEnrollment.certificateId
    : false;
  
  const activeCertificate = certificates.find(c => 
    c.enrollmentId === activeEnrollment?.id || 
    (activeEnrollment?.certificateId && c.id === activeEnrollment.certificateId)
  ) || null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 bg-gray-800">
           <img src={course.coverImage || `https://picsum.photos/seed/${course.id}/800/400`} alt={course.title} className="w-full h-full object-cover opacity-60"/>
           <div className="absolute top-4 left-4">
             <button onClick={onBack} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
               <ArrowLeft size={20} />
             </button>
           </div>
           <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-between items-end">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                    <div className="flex items-center text-gray-200 text-sm space-x-4">
                       <span className="flex items-center"><MapPin size={14} className="mr-1"/> {course.location}</span>
                       <span className="flex items-center"><Clock size={14} className="mr-1"/> 3 - 6 Months</span>
                       {course.deliveryMode !== 'physical' && (
                         <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded flex items-center">
                            {course.deliveryMode === 'virtual' ? 'Virtual' : 'Hybrid'}
                         </span>
                       )}
                    </div>
                 </div>
                 {!isEnrolled && user.role === UserRole.APPRENTICE && (
                   <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400 mb-2">₦{course.totalFee.toLocaleString()}</div>
                      <Button onClick={() => onEnroll(course.id, course.totalFee)}>Enroll Now</Button>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex px-6 space-x-6 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`${activeTab === 'overview' ? 'border-sky-500 text-sky-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('curriculum')} 
              className={`${activeTab === 'curriculum' ? 'border-sky-500 text-sky-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-1.5`}
            >
              Curriculum & Milestones
              {activeEnrollment && (
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {completedMilestonesCount}/{course.milestones.length}
                </span>
              )}
            </button>
            {(isEnrolled || user.role === UserRole.OGA) && (
              <button 
                onClick={() => setActiveTab('classroom')} 
                className={`${activeTab === 'classroom' ? 'border-sky-500 text-sky-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                {user.role === UserRole.OGA ? 'My Students' : 'Classroom & Chat'}
                {(course.deliveryMode === 'virtual' || course.deliveryMode === 'hybrid') && <Video size={14} className="ml-2 text-purple-500"/>}
              </button>
            )}
            {(isEnrolled || user.role === UserRole.OGA) && (
              <button 
                onClick={() => setActiveTab('settlement')} 
                className={`${activeTab === 'settlement' ? 'border-amber-500 text-amber-700 font-bold bg-amber-50/40' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center gap-1.5 rounded-t-lg transition-colors`}
              >
                <Award size={16} className="text-amber-500" />
                <span>Settlement & Honors</span>
                {isSettled ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-full">Certified</span>
                ) : isAllMilestonesCompleted ? (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">Ready!</span>
                ) : null}
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
           {activeTab === 'overview' && (
             <div className="prose max-w-none text-gray-600">
               <h3 className="text-lg font-medium text-gray-900 mb-2">About this Apprenticeship</h3>
               <p>{course.description}</p>
               
               <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Skills You Will Gain</h3>
               <div className="flex flex-wrap gap-2">
                 {course.skillTags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{tag}</span>
                 ))}
               </div>

               {course.deliveryMode !== 'physical' && (
                 <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-start">
                    <Laptop className="text-purple-600 mt-1 mr-3" size={24}/>
                    <div>
                      <h4 className="font-bold text-purple-900">Digital Learning Enabled</h4>
                      <p className="text-sm text-purple-800">This course includes virtual sessions. You will get access to Zoom/Google Meet links upon enrollment.</p>
                    </div>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'curriculum' && (
             <div className="space-y-6">
                {isAllMilestonesCompleted && !isSettled && (
                  <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-sky-500/10 border-2 border-amber-400 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
                     <div className="flex items-center gap-3">
                       <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xl">🎓</span>
                       <div>
                         <h4 className="font-bold text-slate-900 text-sm">All Training Milestones Completed!</h4>
                         <p className="text-xs text-slate-600">This apprenticeship is primed for the traditional Settlement (Igba Boy / Imwa Oru) Ceremony.</p>
                       </div>
                     </div>
                     <button 
                       type="button" 
                       onClick={() => setActiveTab('settlement')}
                       className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                     >
                       Enter Settlement Ceremony →
                     </button>
                  </div>
                )}

                {!isAllMilestonesCompleted && activeEnrollment && onFastTrackMilestones && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs gap-2">
                     <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                       <Sparkles size={14} className="text-amber-500" />
                       Evaluating Phase B? Fast-track and complete all milestones to unlock the ceremony:
                     </span>
                     <button
                       type="button"
                       onClick={() => onFastTrackMilestones(activeEnrollment.id)}
                       className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm self-start sm:self-auto"
                     >
                       ⚡ Fast-Track All (Demo)
                     </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-medium text-gray-900">Milestone Payment Schedule</h3>
                   <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Funds are held in Escrow</span>
                </div>
                <div className="space-y-4">
                   {course.milestones.map((milestone, idx) => {
                      // Get status from active enrollment if exists
                      const status = activeEnrollment?.progress.find(p => p.milestoneId === milestone.id)?.status || 'pending';
                      const amount = (milestone.paymentPercent / 100) * course.totalFee;

                      return (
                        <div key={milestone.id} className={`border rounded-lg p-4 transition-all ${status === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                           <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex items-start space-x-3">
                                 <div className={`mt-1 rounded-full p-1 ${status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {status === 'completed' ? <CheckCircle size={20}/> : <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">{idx + 1}</span>}
                                 </div>
                                 <div>
                                    <h4 className={`font-bold ${status === 'completed' ? 'text-green-900' : 'text-gray-900'}`}>{milestone.title}</h4>
                                    <p className="text-sm text-gray-500">{milestone.description}</p>
                                    <div className="mt-1 flex items-center text-xs text-gray-500 space-x-3">
                                       <span className="flex items-center"><Clock size={12} className="mr-1"/> {milestone.durationDays} Days</span>
                                       <span className="flex items-center"><DollarSign size={12} className="mr-1"/> {milestone.paymentPercent}% Release (₦{amount.toLocaleString()})</span>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                                 {/* Logic for buttons based on role and status */}
                                 {activeEnrollment && (
                                   <>
                                     <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full 
                                       ${status === 'completed' ? 'bg-green-100 text-green-800' : 
                                         status === 'evidence_submitted' ? 'bg-amber-100 text-amber-800' :
                                         status === 'disputed' ? 'bg-red-100 text-red-800' : 
                                         status === 'in_progress' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-500'}`}>
                                       {status.replace('_', ' ')}
                                     </span>
                                     
                                     {user.role === UserRole.APPRENTICE && status === 'in_progress' && (
                                        <Button size="sm" variant="outline" onClick={() => onUploadEvidence(activeEnrollment.id, milestone.id)}>
                                          <Upload size={14} className="mr-1"/> Upload Evidence
                                        </Button>
                                     )}
                                     
                                     {user.role === UserRole.OGA && status === 'evidence_submitted' && (
                                        <div className="flex space-x-2">
                                           <Button size="sm" variant="danger" onClick={() => onDisputeMilestone(activeEnrollment.id, milestone.id, "Work unsatisfactory")}>Dispute</Button>
                                           <Button size="sm" variant="primary" onClick={() => onApproveMilestone(activeEnrollment.id, milestone.id, amount, course.ogaId)}>Release Fund</Button>
                                        </div>
                                     )}
                                   </>
                                 )}
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>
           )}

           {activeTab === 'classroom' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Student List (Oga) OR Class Info (Apprentice) */}
                <div className="lg:col-span-1 border-r border-gray-200 pr-4">
                   {user.role === UserRole.OGA ? (
                     <div>
                        <h4 className="font-bold text-gray-700 mb-4">Enrolled Apprentices</h4>
                        <ul className="space-y-2">
                           {enrollments.map(enrol => (
                             <li 
                                key={enrol.id} 
                                onClick={() => setSelectedStudentId(enrol.apprenticeId)}
                                className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${selectedStudentId === enrol.apprenticeId ? 'bg-sky-50 border border-sky-200' : 'hover:bg-gray-50 border border-transparent'}`}
                             >
                                <span className="text-sm font-medium">Student #{enrol.apprenticeId.slice(0,4)}</span>
                                <span className="text-xs text-gray-500">
                                   {enrol.progress.filter(p => p.status === 'completed').length}/{course.milestones.length} Done
                                </span>
                             </li>
                           ))}
                           {enrollments.length === 0 && <p className="text-sm text-gray-500 italic">No students enrolled yet.</p>}
                        </ul>
                     </div>
                   ) : (
                     <div>
                       <h4 className="font-bold text-gray-700 mb-4">Class Details</h4>
                       {course.meetingUrl && (
                          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                             <h5 className="text-purple-900 font-bold text-sm mb-2">Virtual Classroom</h5>
                             <p className="text-xs text-purple-700 mb-3">Live sessions are held every Saturday at 10 AM.</p>
                             <a href={course.meetingUrl} target="_blank" rel="noreferrer" className="block w-full text-center bg-purple-600 text-white text-sm py-2 rounded hover:bg-purple-700 transition-colors">
                               Join Zoom Class
                             </a>
                          </div>
                       )}
                       <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h5 className="text-gray-900 font-bold text-sm mb-2">Resources</h5>
                          <ul className="text-xs text-sky-600 space-y-1">
                             <li><a href="#" className="hover:underline">Course Syllabus.pdf</a></li>
                             <li><a href="#" className="hover:underline">Safety Handbook.pdf</a></li>
                          </ul>
                       </div>
                     </div>
                   )}
                </div>

                {/* Right Panel: Chat */}
                <div className="lg:col-span-2">
                   {activeEnrollment ? (
                      <ChatSystem 
                        enrollmentId={activeEnrollment.id}
                        currentUser={user}
                        messages={chats}
                        recipientName={user.role === UserRole.OGA ? "Apprentice" : "Master Oga"}
                        onSendMessage={(text) => onSendMessage(activeEnrollment.id, text)}
                      />
                   ) : (
                      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                         {user.role === UserRole.OGA 
                            ? "Select a student to view chat and progress." 
                            : "Enroll to access the classroom."}
                      </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};