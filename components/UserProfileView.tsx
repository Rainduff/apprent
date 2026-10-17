import React, { useState } from 'react';
import { User, UserRole, NftAvatar, UserUsageStats, Transaction, Enrollment } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Zap, 
  Flame, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Wand2, 
  MessageSquare, 
  MapPin, 
  Briefcase, 
  Save, 
  RotateCw,
  ExternalLink,
  ChevronRight,
  Hexagon
} from 'lucide-react';

import lagosCyberOga from '../src/assets/images/lagos_cyber_oga_1792184235959.jpg';
import cyberApprentice from '../src/assets/images/cyber_apprentice_1792184249815.jpg';
import cyberMechanic from '../src/assets/images/cyber_mechanic_1792184264106.jpg';
import cyberGeleQueen from '../src/assets/images/cyber_gele_queen_1792184278311.jpg';

// Curated NFT Avatars with Nigerian cyber-artisan lore & traits
export const NFT_AVATARS: NftAvatar[] = [
  {
    id: 'nft-042',
    name: 'Aso-Oke Cybernetic Master',
    archetype: 'Grandmaster Tailor',
    rarity: 'Genesis',
    imageUrl: lagosCyberOga,
    trade: 'Fashion & Bespoke Couture',
    mintNumber: '#042 / 500',
    lore: 'Woven with luminescent optic fibers and ancient indigo dye. Honored by the Lagos Artisan Guild for bridging ancestral Yoruba weaves with cybernetic precision.',
    perks: ['+10% Escrow Speed', 'Guild Master Seal', 'Adire Cyber Weave Aura']
  },
  {
    id: 'nft-027',
    name: 'AfroTech Solar Prodigy',
    archetype: 'Apprentice Innovator',
    rarity: 'Legendary',
    imageUrl: cyberApprentice,
    trade: 'Clean Energy & Inverter Systems',
    mintNumber: '#027 / 500',
    lore: 'Pioneering off-grid solar micro-grids across Eastern Nigeria. Equipped with holographic diagnostics goggles and high-energy conductivity braids.',
    perks: ['+15% Growth XP', 'Solar Blueprint Access', 'Fast-Track Milestone Approval']
  },
  {
    id: 'nft-089',
    name: 'Ladipo Cyborg Overhauler',
    archetype: 'Master Heavy Mechanic',
    rarity: 'Legendary',
    imageUrl: cyberMechanic,
    trade: 'Automotive & Engine Diagnostics',
    mintNumber: '#089 / 500',
    lore: 'Legend of Ladipo International Market. His bionic optical scanner detects combustion micro-fractures in Japanese and German engines with 99.9% accuracy.',
    perks: ['Heavy Equipment Pass', 'Hydraulic Synergy', '100% Diagnostic Accuracy']
  },
  {
    id: 'nft-015',
    name: 'Holo-Gele Cyber Empress',
    archetype: 'Culture & Beauty Queen',
    rarity: 'Epic',
    imageUrl: cyberGeleQueen,
    trade: 'Traditional Makeup & Gele Architecture',
    mintNumber: '#015 / 500',
    lore: 'Sculpting high-fashion ceremonial headwraps with self-folding nanotech fabric that shifts color according to celebration vibes.',
    perks: ['Cultural Authenticity +20%', 'VIP Wedding Contracts', 'Aura of Elegance']
  },
  {
    id: 'nft-063',
    name: 'Ife Bronze Foundry Artificer',
    archetype: 'Master Metalsmith',
    rarity: 'Rare',
    imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AdekunleBlacksmith&backgroundColor=b6e3f4,c0aede,d1d4f9',
    trade: 'Metal Fabrication & Welding',
    mintNumber: '#063 / 500',
    lore: 'Forging industrial structural reinforcements and artistic bronze relics using induction-plasma torches and ancient smelting ratios.',
    perks: ['Arc Welding Resistance', 'Forging Multiplier', 'Guild Safety Certified']
  },
  {
    id: 'nft-112',
    name: 'Lekki Automaton Welder',
    archetype: 'High-Tech Industrialist',
    rarity: 'Epic',
    imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoboWelderLekki&backgroundColor=ffd5dc,ffdfbf',
    trade: 'Industrial Fabrication & Robotics',
    mintNumber: '#112 / 500',
    lore: 'Calibrated for maritime refineries and Lekki industrial pipeline contracts with zero heat fatigue and micro-tolerance seams.',
    perks: ['Deep Water Seal', 'Automated TIG Welding', 'Industrial Contract Priority']
  },
  {
    id: 'nft-078',
    name: 'Benin Digital Woodcarver',
    archetype: 'Furniture & Interior Guild',
    rarity: 'Rare',
    imageUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=NkechiCarpenter&backgroundColor=d1d4f9,ffd5dc',
    trade: 'Carpentry & Architectural Joinery',
    mintNumber: '#078 / 500',
    lore: 'Master woodworker turning seasoned African Mahogany and Iroko into smart furniture embedded with wireless charging and acoustic resonance.',
    perks: ['Precision Joinery', 'Termite Shield Coating', 'Sustainable Timber Seal']
  },
  {
    id: 'nft-094',
    name: 'Solar Grid Alchemist',
    archetype: 'Master Electrician',
    rarity: 'Legendary',
    imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ChukwumaSolar&backgroundColor=ffdfbf,ffd5dc',
    trade: 'Renewable Power & Grid Storage',
    mintNumber: '#094 / 500',
    lore: 'Architect of decentralized lithium-ion battery banks that keep small businesses glowing 24/7 across Alaba and Ikeja.',
    perks: ['Zero Inverter Downtime', 'Lithium Balancer Aura', '+12% AquaFlow Yield']
  }
];

interface UserProfileViewProps {
  user: User;
  transactions: Transaction[];
  enrollments: Enrollment[];
  trustPoolBalance: number;
  onUpdateProfile: (updatedUser: User) => void;
  onBackToDashboard: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  transactions,
  enrollments,
  trustPoolBalance,
  onUpdateProfile,
  onBackToDashboard
}) => {
  // Selected NFT avatar state
  const currentNft = NFT_AVATARS.find(a => a.id === user.nftAvatarId) || 
                     NFT_AVATARS.find(a => a.imageUrl === user.avatar) || 
                     NFT_AVATARS[0];
  
  const [selectedNft, setSelectedNft] = useState<NftAvatar>(currentNft);
  const [activeTab, setActiveTab] = useState<'tracker' | 'avatars' | 'settings'>('tracker');
  const [isEquipping, setIsEquipping] = useState(false);
  const [filterRarity, setFilterRarity] = useState<string>('All');

  // Profile Edit State
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || 'Lagos, Nigeria');
  const [skills, setSkills] = useState((user.skills || ['Craftsmanship', 'Artisan']).join(', '));
  const [hourlyRate, setHourlyRate] = useState<number>(user.hourlyRate || 5000);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute live Usage Metrics from transactions & enrollments
  const completedMilestonesCount = enrollments.reduce((acc, curr) => {
    return acc + curr.progress.filter(p => p.status === 'completed').length;
  }, 0);

  const totalEscrowVolume = transactions.reduce((acc, t) => {
    return acc + (t.type === 'deposit' || t.type === 'release' ? t.amount : 0);
  }, 0) || 150000;

  const trustFeesPaid = transactions
    .filter(t => t.type === 'trust_pool_fee')
    .reduce((acc, t) => acc + t.amount, 0) || 1500;

  // Defaults or calculated stats
  const activeStreak = user.usageStats?.activeDaysStreak || 12;
  const learningHours = user.usageStats?.learningHours || (completedMilestonesCount * 18 + 42);
  const aiToolsUsed = user.usageStats?.aiToolsRuns || 18;
  const chatInteractions = user.usageStats?.chatInteractions || 34;
  const currentXp = user.usageStats?.currentXp || 1650;
  const nextLevelXp = user.usageStats?.nextLevelXp || 2500;
  const guildLevel = user.usageStats?.guildLevel || (user.role === UserRole.OGA ? 8 : 4);
  const guildRank = user.usageStats?.guildRank || (user.role === UserRole.OGA ? 'Master Baobab' : 'Senior Sprout Scholar');

  const progressPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  const handleEquipAvatar = (nft: NftAvatar) => {
    setIsEquipping(true);
    setSelectedNft(nft);
    const updated: User = {
      ...user,
      avatar: nft.imageUrl,
      nftAvatarId: nft.id
    };
    setTimeout(() => {
      onUpdateProfile(updated);
      setIsEquipping(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      businessName,
      bio,
      location,
      hourlyRate,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean)
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredAvatars = NFT_AVATARS.filter(a => {
    if (filterRarity === 'All') return true;
    return a.rarity === filterRarity;
  });

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'Genesis': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Legendary': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Epic': return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Rare': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl border border-sky-800/40">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -mb-12 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with NFT Frame */}
          <div className="relative group">
            <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-sky-400 to-purple-500 shadow-2xl">
              <img 
                src={selectedNft.imageUrl} 
                alt={selectedNft.name} 
                className="h-full w-full object-cover rounded-xl bg-slate-950 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-2 py-0.5 rounded-md flex items-center shadow-lg border border-amber-300">
                <Hexagon size={12} className="mr-1 fill-current" />
                NFT {selectedNft.mintNumber.split(' ')[0]}
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('avatars')}
              className="mt-3 w-full text-center text-xs text-sky-300 hover:text-white flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg border border-sky-400/30 transition-all"
            >
              <RotateCw size={12} /> Change Avatar
            </button>
          </div>

          {/* User Info & Ranks */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${getRarityBadgeColor(selectedNft.rarity)}`}>
                {selectedNft.rarity} Collectible
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold flex items-center">
                <ShieldCheck size={12} className="mr-1" /> Verified Guildsman
              </span>
              <span className="text-xs bg-sky-500/20 text-sky-200 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
                {user.role === UserRole.OGA ? 'Oga Master Craftsman' : 'Apprentice Scholar'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              {user.name}
              <span className="text-sm font-normal text-sky-300">({selectedNft.name})</span>
            </h1>

            <p className="text-sm text-sky-200/80 mt-1 max-w-xl">
              {user.bio || `Passionate ${user.role === UserRole.OGA ? 'master teaching' : 'apprentice mastering'} ancestral craft with modern tools.`}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center"><MapPin size={14} className="mr-1 text-sky-400"/> {user.location || 'Lagos, Nigeria'}</span>
              <span className="flex items-center"><Briefcase size={14} className="mr-1 text-emerald-400"/> {user.businessName || 'Trade Collective'}</span>
              <span className="flex items-center text-amber-300 font-semibold"><Flame size={14} className="mr-1 fill-current"/> {activeStreak} Days Streak</span>
            </div>
          </div>

          {/* Trade Level & XP Box */}
          <div className="bg-slate-900/80 backdrop-blur border border-sky-500/30 rounded-xl p-4 w-full md:w-64 text-center md:text-left shadow-lg">
            <div className="flex justify-between items-center text-xs text-sky-300 font-semibold mb-1">
              <span>Guild Tier: {guildRank}</span>
              <span className="text-amber-400 font-bold">Lvl {guildLevel}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden my-2 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>{currentXp} XP</span>
              <span>{nextLevelXp} XP to Level {guildLevel + 1}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-t border-sky-800/60 pt-4 flex gap-4 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`pb-2 px-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'tracker' ? 'border-emerald-400 text-emerald-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <TrendingUp size={16} /> Usage & Reputation Tracker
          </button>
          <button
            onClick={() => setActiveTab('avatars')}
            className={`pb-2 px-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'avatars' ? 'border-amber-400 text-amber-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Sparkles size={16} /> NFT Avatar Gallery ({NFT_AVATARS.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'settings' ? 'border-sky-400 text-sky-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Award size={16} /> Profile Details & Trade Bio
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-800 flex items-center gap-2 text-sm animate-fade-in">
          <CheckCircle className="text-emerald-500" size={18} />
          <span>Profile & Avatar updated successfully across your account!</span>
        </div>
      )}

      {/* TAB 1: USAGE TRACKER & REPUTATION */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Main Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Learning / Teaching Hours */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {user.role === UserRole.OGA ? 'Master Teaching Hours' : 'Apprentice Learning'}
                </span>
                <div className="h-9 w-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Clock size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{learningHours}h</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center text-emerald-600 font-medium">
                <TrendingUp size={12} className="mr-1"/> +14h active this week
              </p>
            </div>

            {/* Completed Milestones */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Milestones Verified</span>
                <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{completedMilestonesCount || 3} Tasks</div>
              <p className="text-xs text-slate-500 mt-1">
                Verified with cryptographic photo evidence
              </p>
            </div>

            {/* Total Escrow Volume */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AquaFlow Escrow Settled</span>
                <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₦{totalEscrowVolume.toLocaleString()}</div>
              <p className="text-xs text-indigo-600 mt-1 font-medium">
                Zero defaults • 100% On-time Release
              </p>
            </div>

            {/* AI Utilities Runs */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Artisan Operations</span>
                <div className="h-9 w-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Wand2 size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{aiToolsUsed} Runs</div>
              <p className="text-xs text-slate-500 mt-1">
                OCR receipts & studio photo edits
              </p>
            </div>
          </div>

          {/* 7-Day Guild Activity & Streak Matrix */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="text-amber-500 fill-current" size={20} />
                  Guild Activity Streak & Daily Tracker
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consistent participation earns higher trade trust and discount rates on the Community Trust Pool.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-amber-800">{activeStreak}-Day Active Streak</span>
                <span className="text-base">🔥</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isCompleted = idx <= 5;
                const isToday = idx === 5;
                return (
                  <div key={day} className="flex flex-col items-center">
                    <span className="text-xs font-medium text-slate-400 mb-2">{day}</span>
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 ${
                      isToday 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100' 
                        : isCompleted 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle size={18} /> : '•'}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {isCompleted ? 'Active' : 'Rest'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Usage Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trust Pool Contribution Meter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                Community Trust Pool Contributions
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                1% tithing from every milestone release feeds into the community storehouse for micro-loans & settlement grants.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Your Lifetime Tithe:</span>
                  <span className="font-bold text-emerald-600">₦{trustFeesPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Community Pool:</span>
                  <span className="font-bold text-slate-900">₦{trustPoolBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-slate-600">Honorary Status:</span>
                  <span className="font-semibold text-purple-600">Guardian Benefactor</span>
                </div>
              </div>
            </div>

            {/* In-Course Engagement */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                <MessageSquare size={18} className="text-sky-500" />
                Apprenticeship Mentorship Activity
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Record of feedback, classroom chats, and trade advisory communications.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Classroom Messages:</span>
                  <span className="font-bold text-sky-600">{chatInteractions} Exchanged</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Dispute Rate:</span>
                  <span className="font-bold text-emerald-600">0.0% (Clean Record)</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-slate-600">Response Speed:</span>
                  <span className="font-semibold text-slate-900">&lt; 30 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NFT AVATARS GALLERY & SELECTOR */}
      {activeTab === 'avatars' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={22} />
                Trade Guild NFT Avatar Wardrobe
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose an NFT-style cyber-artisan avatar to represent your master or apprentice persona across the platform.
              </p>
            </div>

            {/* Filter by Rarity */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Rarity:</span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {['All', 'Genesis', 'Legendary', 'Epic', 'Rare'].map(rarity => (
                  <button
                    key={rarity}
                    onClick={() => setFilterRarity(rarity)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      filterRarity === rarity 
                        ? 'bg-white text-slate-900 shadow-sm font-bold' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of NFT Avatars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAvatars.map((nft) => {
              const isEquipped = selectedNft.id === nft.id;

              return (
                <div 
                  key={nft.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                    isEquipped 
                      ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-lg' 
                      : 'border-slate-200 hover:border-sky-400 hover:shadow-md'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-900">
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Rarity & Token ID Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border backdrop-blur-md shadow-md uppercase ${getRarityBadgeColor(nft.rarity)}`}>
                        {nft.rarity}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/20">
                      {nft.mintNumber}
                    </div>

                    {isEquipped && (
                      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <CheckCircle size={14} /> Currently Equipped
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-1">
                        {nft.trade}
                      </div>
                      <h4 className="font-bold text-slate-900 text-base leading-tight mb-2">
                        {nft.name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                        {nft.lore}
                      </p>

                      {/* Perk Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {nft.perks.map((perk, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            ✦ {perk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEquipAvatar(nft)}
                      disabled={isEquipped || isEquipping}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        isEquipped 
                          ? 'bg-emerald-100 text-emerald-800 cursor-default' 
                          : 'bg-slate-900 hover:bg-sky-700 text-white'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <CheckCircle size={14} /> Active Avatar
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> Equip This Avatar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Guild Profile & Trade Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your contact and workshop details accurate so apprentices and clients can reach you.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business / Workshop Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Ade Couture & Cyber Weaves"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Market Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Balogun Market, Lagos"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trade Skills (comma-separated)</label>
              <input 
                type="text" 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Tailoring, Embroidery, Solar Inverters"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Standard Hourly / Consultation Rate (NGN)</label>
              <input 
                type="number" 
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trade Bio & Master Apprenticeship Heritage</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your craft, years of experience, and your mission..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
