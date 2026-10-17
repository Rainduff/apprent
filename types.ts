
export enum UserRole {
  OGA = 'OGA',
  APPRENTICE = 'APPRENTICE',
  ADMIN = 'ADMIN'
}

export interface NftAvatar {
  id: string;
  name: string;
  archetype: string;
  rarity: 'Genesis' | 'Legendary' | 'Epic' | 'Rare';
  imageUrl: string;
  trade: string;
  mintNumber: string;
  lore: string;
  perks: string[];
}

export interface UserUsageStats {
  learningHours: number;
  activeDaysStreak: number;
  completedMilestones: number;
  totalVolumeEscrow: number;
  trustPoolContributed: number;
  aiToolsRuns: number;
  chatInteractions: number;
  guildRank: string;
  guildLevel: number;
  currentXp: number;
  nextLevelXp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number; // NGN
  avatar?: string;
  verified: boolean;
  // Enhanced profile fields
  businessName?: string;
  skills?: string[];
  rating?: number;
  hourlyRate?: number;
  location?: string;
  bio?: string;
  portfolioImages?: string[];
  nftAvatarId?: string;
  usageStats?: UserUsageStats;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'evidence_submitted' | 'completed' | 'disputed';

export interface Milestone {
  id: string;
  title: string;
  durationDays: number;
  paymentPercent: number; // 0-100
  description?: string;
}

export interface EnrollmentMilestone {
  milestoneId: string;
  status: MilestoneStatus;
  evidenceUrl?: string; // Mock URL
  paidAt?: string;
  disputeReason?: string;
}

export type DeliveryMode = 'physical' | 'virtual' | 'hybrid';

export interface Course {
  id: string;
  ogaId: string;
  ogaName: string;
  title: string;
  description: string;
  totalFee: number;
  milestones: Milestone[];
  skillTags: string[];
  location: string;
  deliveryMode: DeliveryMode;
  meetingUrl?: string; // For virtual classes
  coverImage?: string;
}

export interface SettlementPackage {
  seedCapital: number;
  equipmentGrant: string;
  masterBlessing: string;
  trustPoolGrant: number;
  settledAt: string;
}

export interface TradeCertificate {
  id: string; // e.g. "CERT-NG-2026-8942"
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  apprenticeId: string;
  apprenticeName: string;
  ogaId: string;
  ogaName: string;
  tradeSkill: string;
  issueDate: string;
  verificationHash: string;
  masterBlessing: string;
  seedCapitalAmount: number;
  equipmentGrant: string;
  status: 'verified' | 'pending';
  grade: 'Distinction with Honors' | 'Mastery' | 'Credit';
  guildSealNumber: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  apprenticeId: string;
  ogaId?: string;
  escrowBalance: number;
  status: 'active' | 'completed';
  progress: EnrollmentMilestone[]; // Tracks status of each milestone for this specific enrollment
  startDate: string;
  settlementPackage?: SettlementPackage;
  certificateId?: string;
}

export interface Transaction {
  id: string;
  userId?: string;
  date: string;
  type: 'deposit' | 'release' | 'trust_pool_fee' | 'withdrawal' | 'payment';
  amount: number;
  description: string;
  hash: string;
  status: 'success' | 'pending' | 'failed';
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  budget: number;
  description: string;
  location: string;
  status: 'open' | 'in_progress' | 'completed';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  title?: string;
}

export interface ChatMessage {
  id: string;
  enrollmentId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

// --- New Features Interfaces ---

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
  lastContact: string;
  value: number;
  notes: string;
}

export interface MarketPrice {
  id: string;
  item: string;
  category: 'material' | 'service' | 'commodity';
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: 'sale' | 'lease';
  bedrooms: number;
  bathrooms: number;
  description: string;
  imageUrl: string;
  agentId: string;
  agentName: string;
  status: 'available' | 'sold' | 'leased';
}
