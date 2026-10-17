
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { User, UserRole, Course, Job, Transaction, Enrollment, ToastNotification, EnrollmentMilestone, ChatMessage, Property } from './types';
import { MOCK_USERS, MOCK_COURSES, MOCK_JOBS, MOCK_TRANSACTIONS, MOCK_ENROLLMENTS, TRUST_POOL_BALANCE, MOCK_CHATS, MOCK_PROPERTIES } from './services/mockData';
import { Button } from './components/Button';
import { WalletView } from './components/WalletView';
import { CourseManager } from './components/CourseManager';
import { ToastContainer } from './components/Toast';
import { BusinessHub } from './components/BusinessHub';
import { RealEstateView } from './components/RealEstateView';
import { ServiceFinder } from './components/ServiceFinder';
import { UserProfileView } from './components/UserProfileView';
import { 
  CheckCircle, 
  Clock, 
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Shield,
  Search,
  Camera,
  Briefcase,
  FileText,
  MapPin,
  Upload,
  Languages,
  Mic,
  Volume2,
  Wand2,
  RefreshCw,
  Building2,
  Sparkles
} from 'lucide-react';
import { analyzeDocument, editImageBackground, translateText, generateSpeech, playAudioBuffer } from './services/geminiService';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  testFirestoreConnection, 
  seedInitialCoursesIfEmpty 
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  fetchUserProfile, 
  saveUserProfile, 
  updateUserBalance, 
  subscribeToCourses, 
  createCourseInDb, 
  subscribeToEnrollments, 
  createEnrollmentInDb, 
  updateEnrollmentProgressInDb, 
  subscribeToChats, 
  saveChatMessageInDb, 
  subscribeToTransactions, 
  saveTransactionInDb, 
  subscribeToTrustPool, 
  incrementTrustPoolInDb 
} from './services/dbService';

// --- Sub-components for specific views ---

// 1. Dashboard View
const Dashboard = ({ 
  user, 
  trustPool, 
  transactions,
  onNavigateToProfile
}: { 
  user: User; 
  trustPool: number; 
  transactions: Transaction[];
  onNavigateToProfile?: () => void;
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="md:flex md:items-center md:justify-between bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg border border-sky-800/40">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onNavigateToProfile}
            className="cursor-pointer relative group flex-shrink-0 text-left focus:outline-none"
            title="Click to view and customize your NFT avatar"
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl p-1 bg-gradient-to-tr from-amber-400 via-sky-400 to-purple-500 shadow-xl">
              <img 
                src={user.avatar || "/src/assets/images/lagos_cyber_oga_1792184235959.jpg"} 
                alt={user.name} 
                className="h-full w-full object-cover rounded-xl bg-slate-900 group-hover:scale-105 transition-transform" 
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-[10px] text-slate-950 font-black px-1.5 py-0.5 rounded shadow border border-amber-300">
              NFT
            </span>
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                Welcome back, {user.name}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified Guild
              </span>
            </div>
            <p className="mt-1 text-xs text-sky-200/80">
              {user.role === UserRole.OGA 
                ? "Sow wisdom into your Apprentices • Lead the Nigerian Trade Guild." 
                : "Plant the seed of knowledge today • Master your trade."}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
           <button 
             type="button"
             onClick={onNavigateToProfile}
             className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-sky-100 transition-colors shadow-sm"
           >
             <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
             NFT Wardrobe & Usage Tracker →
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Wallet Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg relative group transition-transform hover:-translate-y-1 duration-300">
          <div className="absolute inset-0 water-flow opacity-10"></div>
          <div className="p-5 relative">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-sky-500 p-3 shadow-lg">
                   <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AquaFlow Balance</dt>
                  <dd className="text-lg font-bold text-gray-900">₦{user.balance.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-sky-50 px-5 py-3 relative z-10 border-t border-sky-100">
            <div className="text-sm">
              <span className="font-medium text-sky-700">View wallet details →</span>
            </div>
          </div>
        </div>

        {/* Trust Pool Widget */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden shadow rounded-lg text-white transform hover:scale-105 transition-transform duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-indigo-200" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-indigo-100 truncate">Community Trust Pool</dt>
                  <dd className="text-2xl font-bold">₦{trustPool.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
            <p className="mt-2 text-xs text-indigo-200 opacity-80">
              "A storehouse built by many, benefiting all." - Malachi 3:10
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {user.role === UserRole.OGA ? 'Active Apprentices' : 'Active Courses'}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {user.role === UserRole.OGA ? '12' : '1'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {transactions.slice(0, 5).map((t) => (
            <li key={t.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-sky-600 truncate">{t.description}</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.type === 'deposit' || t.type === 'release' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {t.type === 'deposit' || t.type === 'release' ? '+' : '-'}₦{t.amount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500 uppercase tracking-wide text-xs">
                    {t.type.replace('_', ' ')}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <p>{t.date}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 3. AI Tools View
const AIToolsView = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'bg-remove' | 'ocr' | 'translate' | 'bg-change'>('bg-change');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  
  // New State for features
  const [bgPrompt, setBgPrompt] = useState('');
  const [textToTranslate, setTextToTranslate] = useState('');
  const [targetLang, setTargetLang] = useState('Yoruba');
  const [translatedText, setTranslatedText] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mime = file.type;
      setSelectedMimeType(mime);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setOcrText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage && activeTab !== 'translate') return;
    setProcessing(true);
    
    try {
      if (activeTab === 'ocr') {
        const base64Data = selectedImage!.split(',')[1];
        const text = await analyzeDocument(base64Data, selectedMimeType);
        setOcrText(text);
      } else if (activeTab === 'bg-change') {
        const base64Data = selectedImage!.split(',')[1];
        // If prompt is empty, default
        const p = bgPrompt || "white studio background";
        const newImage = await editImageBackground(base64Data, p);
        if (newImage) setResult(newImage);
        else alert("Could not generate image. Try again.");
      } else if (activeTab === 'bg-remove') {
        // Mock for now, or could use Gemini masking if implemented
        setTimeout(() => {
          setResult(selectedImage); 
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      alert("AI Processing Failed. Check API Key.");
    }
    setProcessing(false);
  };

  const handleTranslate = async () => {
    if (!textToTranslate) return;
    setProcessing(true);
    const translated = await translateText(textToTranslate, targetLang);
    setTranslatedText(translated);
    setProcessing(false);
  };

  const handleSpeak = async () => {
    if (!translatedText) return;
    setProcessing(true);
    const audioData = await generateSpeech(translatedText);
    if (audioData) {
      await playAudioBuffer(audioData);
    } else {
      alert("Could not generate audio.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b border-gray-200 pb-5">
           <h3 className="text-lg font-medium leading-6 text-gray-900">AI Artisan Tools</h3>
           <p className="mt-2 text-sm text-gray-500">"Wield tools as sharp as ancient wisdom."</p>
        </div>
        
        <div className="mt-6">
          <div className="sm:hidden">
            <select 
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
            >
              <option value="bg-change">Background Magic</option>
              <option value="translate">Language Bridge</option>
              <option value="bg-remove">Background Removal</option>
              <option value="ocr">Document Scanner</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('bg-change')} className={`${activeTab === 'bg-change' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                  <Wand2 className="mr-2 h-4 w-4" /> Background Magic
                </button>
                <button onClick={() => setActiveTab('translate')} className={`${activeTab === 'translate' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                  <Languages className="mr-2 h-4 w-4" /> Language Bridge
                </button>
                <button onClick={() => setActiveTab('ocr')} className={`${activeTab === 'ocr' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                  <FileText className="mr-2 h-4 w-4" /> Document Scanner (PDF/Img)
                </button>
                <button onClick={() => setActiveTab('bg-remove')} className={`${activeTab === 'bg-remove' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Remove BG
                </button>
              </nav>
            </div>
          </div>
        </div>

        {activeTab === 'translate' ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <label className="block text-sm font-medium text-gray-700">English Text</label>
               <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 h-40"
                  placeholder="Enter text to translate..."
                  value={textToTranslate}
                  onChange={(e) => setTextToTranslate(e.target.value)}
               ></textarea>
               <div className="flex items-center justify-between">
                  <select 
                    value={targetLang} 
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none sm:text-sm border"
                  >
                    <option value="Yoruba">Yoruba</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Pidgin English">Pidgin</option>
                  </select>
                  <Button onClick={handleTranslate} isLoading={processing} icon={<RefreshCw size={16}/>}>
                    Translate
                  </Button>
               </div>
             </div>
             
             <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col justify-between">
                <div>
                   <label className="block text-sm font-medium text-gray-500 mb-2">{targetLang} Translation</label>
                   {translatedText ? (
                     <p className="text-xl font-medium text-gray-800 leading-relaxed font-serif">"{translatedText}"</p>
                   ) : (
                     <p className="text-gray-400 italic">Translation will appear here...</p>
                   )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                   <Button 
                    variant="secondary" 
                    disabled={!translatedText} 
                    onClick={handleSpeak} 
                    isLoading={processing && !!translatedText}
                    icon={<Volume2 size={18}/>}
                    className="w-full"
                   >
                      Play Audio
                   </Button>
                   <p className="text-xs text-center text-gray-400 mt-2">Powered by Gemini Text-to-Speech</p>
                </div>
             </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-sky-500 transition-colors bg-gray-50/50 relative">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept={activeTab === 'ocr' ? "image/*,application/pdf" : "image/*"} 
                  onChange={handleImageUpload} 
                />
                <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                  {selectedImage ? (
                    selectedMimeType === 'application/pdf' ? (
                       <div className="space-y-1 text-center py-8">
                         <FileText className="mx-auto h-12 w-12 text-red-500" />
                         <p className="text-sm font-medium text-gray-700">PDF Document Selected</p>
                       </div>
                    ) : (
                      <img src={selectedImage} alt="Preview" className="mx-auto h-48 object-contain" />
                    )
                  ) : (
                    <div className="space-y-1 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="relative rounded-md bg-white font-medium text-sky-600 hover:text-sky-500">Upload a file</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {activeTab === 'ocr' ? 'PNG, JPG, PDF up to 10MB' : 'PNG, JPG up to 10MB'}
                      </p>
                    </div>
                  )}
                </label>
                {selectedImage && (
                  <button onClick={() => {setSelectedImage(null); setResult(null)}} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:text-red-500"><Wand2 size={16}/></button>
                )}
              </div>

              {activeTab === 'bg-change' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                      placeholder="e.g. A busy Lagos market, A high-end boutique"
                      value={bgPrompt}
                      onChange={(e) => setBgPrompt(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center min-h-[300px]">
              {processing ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">AI is working its magic...</p>
                </div>
              ) : result ? (
                <div className="text-center animate-fade-in w-full">
                  <p className="mb-2 text-green-600 font-medium flex items-center justify-center"><CheckCircle className="h-4 w-4 mr-1"/> Success</p>
                  <img src={result} className="h-48 object-contain mx-auto border rounded shadow-sm" alt="Result" />
                  <Button className="mt-4" variant="outline" onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'edited-image.png';
                    link.href = result;
                    link.click();
                  }}>Download</Button>
                </div>
              ) : activeTab === 'ocr' && ocrText ? (
                  <div className="w-full h-full flex flex-col animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-700">Extracted Text</h4>
                    </div>
                    <textarea readOnly className="flex-1 w-full p-2 text-sm border rounded bg-white font-mono shadow-inner" value={ocrText} rows={10}/>
                  </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p>Result will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab !== 'translate' && (
          <div className="mt-6 flex justify-end">
            <Button 
              disabled={!selectedImage || processing} 
              onClick={processImage}
              className="w-full sm:w-auto"
            >
              {processing ? 'Processing...' : activeTab === 'bg-change' ? 'Generate New Background' : 'Analyze Document'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Job Board View (Marketplace)
const JobBoardView = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Job Marketplace</h2>
       </div>

       <div className="grid grid-cols-1 gap-6">
         {jobs.map(job => (
           <div key={job.id} className="bg-white shadow rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start">
                 <div>
                   <h3 className="text-lg font-medium text-sky-900 group-hover:text-sky-700">{job.title}</h3>
                   <p className="text-sm text-gray-500 mt-1">{job.clientName} • <span className="inline-flex items-center"><MapPin className="h-3 w-3 mr-1"/>{job.location}</span></p>
                 </div>
                 <div className="text-right">
                    <span className="block text-xl font-bold text-emerald-600">₦{job.budget.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">Fixed Price</span>
                 </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">{job.description}</p>
              <div className="mt-6 flex items-center justify-between">
                 <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Welding</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Industrial</span>
                 </div>
                 <Button size="sm">Apply Now</Button>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};


// 5. Authentication View
const AuthView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [role, setRole] = useState<UserRole>(UserRole.APPRENTICE);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      const fbUser = await loginWithGoogle();
      if (fbUser) {
        let profile = await fetchUserProfile(fbUser.uid);
        if (!profile) {
          profile = {
            id: fbUser.uid,
            name: fbUser.displayName || (role === UserRole.OGA ? 'Master Craftsman' : 'Apprentice Scholar'),
            email: fbUser.email || '',
            role: role,
            balance: 100000, // ₦100,000 initial test allowance
            verified: true,
            avatar: fbUser.photoURL || `https://picsum.photos/seed/${fbUser.uid}/200/200`,
            location: 'Lagos, Nigeria',
            businessName: role === UserRole.OGA ? 'Master Crafts Studio' : undefined,
            skills: role === UserRole.OGA ? ['Mastery', 'Crafting'] : ['Learner']
          };
          await saveUserProfile(profile);
        }
        onLogin(profile);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google sign-in could not complete. You can also use quick demo access.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = (selectedRole: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      const demo = MOCK_USERS.find(u => u.role === selectedRole) || MOCK_USERS[1];
      onLogin(demo);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
           <span className="text-5xl inline-block animate-bounce">🌱</span>
           <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Apprent.ng</h2>
           <p className="mt-2 text-sm text-gray-600">
             Nigerian Digital Apprenticeship & Trade Escrow Platform
           </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-emerald-500">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select your profile mode:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.APPRENTICE)}
                  className={`flex items-center justify-center py-2 px-3 border rounded-md shadow-sm text-sm font-medium transition-all ${role === UserRole.APPRENTICE ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="mr-1.5">🎓</span> Apprentice
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.OGA)}
                  className={`flex items-center justify-center py-2 px-3 border rounded-md shadow-sm text-sm font-medium transition-all ${role === UserRole.OGA ? 'bg-sky-50 border-sky-500 text-sky-700 ring-1 ring-sky-500' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="mr-1.5">👑</span> Oga (Master)
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800">
                {errorMsg}
              </div>
            )}

            {/* Google Authentication Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
              >
                {googleLoading ? (
                  <RefreshCw className="animate-spin mr-2 h-4 w-4 text-gray-500" />
                ) : (
                  <svg className="h-5 w-5 mr-2.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                Continue with Google ({role === UserRole.OGA ? 'Oga Master' : 'Apprentice'})
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 uppercase tracking-wider">Quick Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleDemoLogin(UserRole.APPRENTICE)} 
                disabled={loading}
                className="w-full inline-flex items-center justify-center py-2 px-3 border border-emerald-300 rounded-md shadow-sm bg-emerald-50 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
              >
                Demo Apprentice (Chidi)
              </button>
              <button 
                type="button"
                onClick={() => handleDemoLogin(UserRole.OGA)} 
                disabled={loading}
                className="w-full inline-flex items-center justify-center py-2 px-3 border border-sky-300 rounded-md shadow-sm bg-sky-50 text-xs font-medium text-sky-800 hover:bg-sky-100"
              >
                Demo Master (Ada)
              </button>
            </div>

            <button 
              type="button"
              onClick={() => handleDemoLogin(UserRole.ADMIN)} 
              disabled={loading}
              className="w-full inline-flex items-center justify-center py-1.5 px-3 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Platform Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  // State for data
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(MOCK_ENROLLMENTS);
  const [trustPool, setTrustPool] = useState<number>(TRUST_POOL_BALANCE);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [chats, setChats] = useState<ChatMessage[]>(MOCK_CHATS);

  // UI State
  const [view, setView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  useEffect(() => {
    // 1. Connection check and seed initial courses if DB is empty
    testFirestoreConnection();
    seedInitialCoursesIfEmpty();

    // 2. Auth state listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await fetchUserProfile(fbUser.uid);
          if (profile) {
            setUser(profile);
            localStorage.setItem('app_user', JSON.stringify(profile));
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }
      } else {
        const storedUser = localStorage.getItem('app_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('app_user');
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore subscriptions for public catalog and trust pool
  useEffect(() => {
    const unsubCourses = subscribeToCourses((remoteCourses) => {
      if (remoteCourses && remoteCourses.length > 0) {
        setCourses(remoteCourses);
      }
    });

    const unsubTrustPool = subscribeToTrustPool((remoteBalance) => {
      if (remoteBalance !== undefined && remoteBalance > 0) {
        setTrustPool(remoteBalance);
      }
    });

    return () => {
      unsubCourses();
      unsubTrustPool();
    };
  }, []);

  // User-dependent subscriptions (enrollments, chats & transactions)
  useEffect(() => {
    if (!user) return;

    const unsubEnrollments = subscribeToEnrollments(user.id, user.role, (remoteEnrollments) => {
      if (remoteEnrollments && remoteEnrollments.length > 0) {
        setEnrollments(remoteEnrollments);
      }
    });

    const unsubChats = subscribeToChats((remoteChats) => {
      if (remoteChats && remoteChats.length > 0) {
        setChats(remoteChats);
      }
    });

    const unsubTx = subscribeToTransactions(user.id, (remoteTx) => {
      if (remoteTx && remoteTx.length > 0) {
        setTransactions(remoteTx);
      }
    });

    return () => {
      unsubEnrollments();
      unsubChats();
      unsubTx();
    };
  }, [user?.id, user?.role]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, title }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('app_user', JSON.stringify(loggedInUser));
    addNotification('success', `Welcome, ${loggedInUser.name}!`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser(null);
    localStorage.removeItem('app_user');
    setView('dashboard');
  };

  // --- Actions ---

  const handleDeposit = async (amount: number) => {
    if (!user) return;
    
    const newBalance = user.balance + amount;
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('app_user', JSON.stringify(updatedUser));

    try {
      await updateUserBalance(user.id, newBalance);
    } catch (e) {
      console.warn("Balance update fallback:", e);
    }

    const newTx: Transaction = {
      id: `t${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      type: 'deposit',
      amount,
      description: 'AquaFlow Wallet Funding',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
      status: 'success'
    };
    setTransactions(prev => [newTx, ...prev]);
    try {
      await saveTransactionInDb(newTx);
    } catch (e) {
      console.warn("Transaction log error:", e);
    }

    addNotification('success', `₦${amount.toLocaleString()} added to your wallet.`, 'Deposit Successful');
  };

  const handleUploadEvidence = async (enrollmentId: string, milestoneId: string) => {
    let targetProgress: EnrollmentMilestone[] = [];
    setEnrollments(prev => prev.map(enrollment => {
      if (enrollment.id !== enrollmentId) return enrollment;
      
      const updatedProgress = enrollment.progress.map(p => {
        if (p.milestoneId !== milestoneId) return p;
        return { ...p, status: 'evidence_submitted', evidenceUrl: 'https://picsum.photos/seed/evidence/200/300' } as EnrollmentMilestone;
      });
      targetProgress = updatedProgress;
      return { ...enrollment, progress: updatedProgress };
    }));

    if (targetProgress.length > 0) {
      try {
        await updateEnrollmentProgressInDb(enrollmentId, targetProgress);
      } catch (e) {
        console.warn("Firestore evidence error:", e);
      }
    }
    addNotification('success', 'Evidence uploaded successfully. Master notified.');
  };

  const handleApproveMilestone = async (enrollmentId: string, milestoneId: string, amount: number, ogaId: string) => {
    if (!user) return;

    const trustFee = amount * 0.01;
    const ogaPayment = amount * 0.99;
    let targetProgress: EnrollmentMilestone[] = [];
    let newEscrow = 0;

    setEnrollments(prev => prev.map(e => {
      if (e.id !== enrollmentId) return e;
      const updatedProgress = e.progress.map(p => {
        if (p.milestoneId !== milestoneId) return p;
        return { ...p, status: 'completed', paidAt: new Date().toISOString() } as EnrollmentMilestone;
      });
      newEscrow = Math.max(0, e.escrowBalance - amount);
      targetProgress = updatedProgress;
      return { 
        ...e, 
        escrowBalance: newEscrow,
        progress: updatedProgress
      };
    }));

    setTrustPool(prev => prev + trustFee);
    try {
      await incrementTrustPoolInDb(trustFee);
      if (targetProgress.length > 0) {
        await updateEnrollmentProgressInDb(enrollmentId, targetProgress, newEscrow);
      }
    } catch (e) {
      console.warn("Firestore milestone approval error:", e);
    }

    const releaseTx: Transaction = {
       id: `tx-rel-${Date.now()}`,
       userId: user.id,
       date: new Date().toISOString().split('T')[0],
       type: 'release',
       amount: amount,
       description: `Milestone Release to Oga (Net: ₦${ogaPayment.toLocaleString()})`,
       hash: `0x${Math.random().toString(16).slice(2, 12)}`,
       status: 'success'
    };
    
    const feeTx: Transaction = {
       id: `tx-fee-${Date.now()}`,
       userId: user.id,
       date: new Date().toISOString().split('T')[0],
       type: 'trust_pool_fee',
       amount: trustFee,
       description: '1% Community Trust Fee',
       hash: `0x${Math.random().toString(16).slice(2, 12)}`,
       status: 'success'
    };

    setTransactions(prev => [releaseTx, feeTx, ...prev]);
    try {
      await saveTransactionInDb(releaseTx);
      await saveTransactionInDb(feeTx);
    } catch (e) {
      console.warn("Tx log error:", e);
    }
    
    addNotification('success', `Funds released! ₦${ogaPayment.toLocaleString()} sent to Master.`, 'Payment Successful');
  };

  const handleDisputeMilestone = async (enrollmentId: string, milestoneId: string, reason: string) => {
    let targetProgress: EnrollmentMilestone[] = [];
    setEnrollments(prev => prev.map(e => {
      if (e.id !== enrollmentId) return e;
      const updatedProgress = e.progress.map(p => {
         if (p.milestoneId !== milestoneId) return p;
         return { ...p, status: 'disputed', disputeReason: reason } as EnrollmentMilestone;
      });
      targetProgress = updatedProgress;
      return { ...e, progress: updatedProgress };
    }));

    if (targetProgress.length > 0) {
      try {
        await updateEnrollmentProgressInDb(enrollmentId, targetProgress);
      } catch (e) {
        console.warn("Firestore dispute update error:", e);
      }
    }
    addNotification('info', 'Dispute raised. Funds are frozen pending Admin review.', 'Dispute Submitted');
  };

  const handleEnroll = async (courseId: string, fee: number) => {
    if (!user) return;
    if (user.balance < fee) {
      addNotification('error', 'Insufficient balance. Please deposit funds to your AquaFlow wallet first.');
      setView('wallet');
      return;
    }

    const newBalance = user.balance - fee;
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('app_user', JSON.stringify(updatedUser));
    try {
      await updateUserBalance(user.id, newBalance);
    } catch (e) {
      console.warn("Balance update fallback:", e);
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newEnrollment: Enrollment = {
       id: `e-${Date.now()}`,
       courseId,
       apprenticeId: user.id,
       escrowBalance: fee,
       status: 'active',
       startDate: new Date().toISOString(),
       progress: course.milestones.map((m, idx) => ({
          milestoneId: m.id,
          status: idx === 0 ? 'in_progress' : 'pending'
       }))
    };
    setEnrollments(prev => [...prev, newEnrollment]);
    try {
      await createEnrollmentInDb(newEnrollment);
    } catch (e) {
      console.warn("Enrollment create error:", e);
    }

    addNotification('success', `Successfully enrolled in ${course.title}! Funds moved to Escrow.`, 'Enrollment Complete');
    setView('courses');
  };

  const handleCreateCourse = async (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    try {
      await createCourseInDb(newCourse);
    } catch (e) {
      console.warn("Course create error:", e);
    }
    addNotification('success', 'Your course has been created and listed in the catalog.', 'Course Created');
  };

  const handleSendMessage = async (enrollmentId: string, text: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      enrollmentId,
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: new Date().toISOString()
    };
    setChats(prev => [...prev, newMessage]);
    try {
      await saveChatMessageInDb(newMessage);
    } catch (e) {
      console.warn("Chat save error:", e);
    }
  };

  const handleBuyProperty = (property: Property) => {
    if (!user) return;
    if (user.balance < property.price) {
      addNotification('error', 'Insufficient balance for this property. Please fund your wallet.');
      setView('wallet');
      return;
    }

    // Deduct from User Balance
    const updatedUser = { ...user, balance: user.balance - property.price };
    setUser(updatedUser);
    localStorage.setItem('app_user', JSON.stringify(updatedUser));

    // Add transaction
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      amount: property.price,
      description: `Payment for Property: ${property.title}`,
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
      status: 'success'
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('success', 'Property payment successful! Funds held in escrow pending inspection.', 'Payment Confirmed');
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('app_user', JSON.stringify(updatedUser));
    try {
      await saveUserProfile(updatedUser);
    } catch (e) {
      console.warn("Could not save profile to Firestore:", e);
    }
    addNotification('success', 'Profile and NFT avatar equipped successfully!', 'Profile Updated');
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-emerald-600"><div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full"></div></div>;
  }

  if (!user) {
    return (
      <>
        <ToastContainer notifications={notifications} onDismiss={removeNotification} />
        <AuthView onLogin={handleLogin} />
      </>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            trustPool={trustPool} 
            transactions={transactions} 
            onNavigateToProfile={() => setView('profile')}
          />
        );
      case 'profile':
        return (
          <UserProfileView 
            user={user} 
            transactions={transactions} 
            enrollments={enrollments} 
            trustPoolBalance={trustPool} 
            onUpdateProfile={handleUpdateProfile} 
            onBackToDashboard={() => setView('dashboard')}
          />
        );
      case 'courses':
        return (
          <CourseManager 
            user={user} 
            courses={courses} 
            enrollments={enrollments}
            chats={chats}
            onUploadEvidence={handleUploadEvidence}
            onApproveMilestone={handleApproveMilestone}
            onDisputeMilestone={handleDisputeMilestone}
            onEnroll={handleEnroll}
            onCreateCourse={handleCreateCourse}
            onSendMessage={handleSendMessage}
          />
        );
      case 'jobs':
        return <JobBoardView jobs={MOCK_JOBS} />;
      case 'ai-tools':
        return <AIToolsView user={user} />;
      case 'wallet':
        return (
          <WalletView 
            user={user} 
            transactions={transactions} 
            trustPoolBalance={trustPool} 
            onDeposit={handleDeposit}
          />
        );
      case 'service-finder':
        return <ServiceFinder />;
      case 'real-estate':
        return <RealEstateView properties={MOCK_PROPERTIES} onBuy={handleBuyProperty} />;
      case 'business-hub':
        return <BusinessHub />;
      default:
        return (
          <Dashboard 
            user={user} 
            trustPool={trustPool} 
            transactions={transactions} 
            onNavigateToProfile={() => setView('profile')}
          />
        );
    }
  };

  return (
    <>
      <ToastContainer notifications={notifications} onDismiss={removeNotification} />
      <Layout user={user} onLogout={handleLogout} currentView={view} onChangeView={setView}>
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
