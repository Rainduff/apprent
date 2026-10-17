
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Wallet, 
  BrainCircuit, 
  LogOut, 
  Menu,
  X,
  Scale,
  Users,
  Home,
  Building2,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentView, 
  onChangeView 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return <div className="min-h-screen bg-slate-50">{children}</div>;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: 'Guild Profile & NFT', icon: <Sparkles size={20} className="text-amber-400" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'jobs', label: 'Job Marketplace', icon: <Briefcase size={20} /> },
    { id: 'service-finder', label: 'Find Artisans', icon: <Users size={20} /> },
    { id: 'real-estate', label: 'Real Estate', icon: <Home size={20} /> },
    { id: 'business-hub', label: 'Business Hub', icon: <Building2 size={20} /> },
    { id: 'wallet', label: 'AquaFlow Wallet', icon: <Wallet size={20} /> },
    { id: 'ai-tools', label: 'AI Utilities', icon: <BrainCircuit size={20} /> },
  ];

  if (user.role === UserRole.ADMIN) {
     navItems.push({ id: 'trust-pool', label: 'Trust Pool', icon: <Scale size={20} /> });
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 border-b border-sky-800 bg-sky-900">
        <span className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
           <span className="text-emerald-400 text-2xl">🌱</span> Apprent.ng
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4 bg-sky-900">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                currentView === item.id 
                  ? 'bg-sky-800 text-white border-l-4 border-emerald-400' 
                  : 'text-sky-100 hover:bg-sky-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 bg-sky-950 border-t border-sky-800">
        <button
          onClick={() => {
            onChangeView('profile');
            setMobileMenuOpen(false);
          }}
          className="w-full flex items-center mb-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
        >
          <div className="relative">
            <img 
              src={user.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Adekunle"} 
              alt="User" 
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-amber-400/80 bg-slate-800 shadow-md" 
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[9px] font-black px-1 rounded text-slate-950">
              NFT
            </span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">{user.name}</p>
            <p className="text-xs text-sky-300 capitalize">{user.role.toLowerCase()} • Edit Profile</p>
          </div>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-300 hover:text-red-100 hover:bg-red-900/30 rounded-md transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col shadow-xl z-10">
        <NavContent />
      </div>

      {/* Mobile Header & Sidebar */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-sky-900 text-white flex justify-between items-center p-4 shadow-md">
           <span className="font-bold text-lg">Apprent.ng</span>
           <button 
            type="button" 
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-sky-200 hover:text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
           >
             <span className="sr-only">Open sidebar</span>
             <Menu size={24} />
           </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-sky-900">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="text-white" size={24} />
                </button>
              </div>
              <NavContent />
            </div>
          </div>
        )}

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-slate-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
