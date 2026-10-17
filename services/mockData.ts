
import { User, UserRole, Course, Job, Transaction, Enrollment, ChatMessage, CRMCustomer, MarketPrice, Property, TradeCertificate } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ada Tailor',
    email: 'ada@example.ng',
    role: UserRole.OGA,
    balance: 150000,
    verified: true,
    avatar: 'https://picsum.photos/id/64/200/200',
    businessName: 'Ada Couture & Designs',
    skills: ['Tailoring', 'Fashion Design', 'Embroidery'],
    rating: 4.8,
    location: 'Lagos',
    bio: 'Award-winning fashion designer with 15 years experience.'
  },
  {
    id: 'u2',
    name: 'Chidi Okonkwo',
    email: 'chidi@example.ng',
    role: UserRole.APPRENTICE,
    balance: 55000,
    verified: true,
    avatar: 'https://picsum.photos/id/91/200/200',
    skills: ['Sewing', 'Sketching'],
    location: 'Enugu'
  },
  {
    id: 'u3',
    name: 'Super Admin',
    email: 'admin@apprentice.ng',
    role: UserRole.ADMIN,
    balance: 0,
    verified: true,
    location: 'Abuja'
  },
  {
    id: 'u_mech',
    name: 'Chief Rahman',
    email: 'rahman@ladipo.ng',
    role: UserRole.OGA,
    balance: 450000,
    verified: true,
    avatar: 'https://picsum.photos/id/103/200/200',
    businessName: 'Rahman Auto Works',
    skills: ['Auto Mechanics', 'Engine Repair', 'Diagnostics'],
    rating: 4.9,
    location: 'Ladipo Market'
  },
  {
    id: 'u_plumb',
    name: 'Moses Pipes',
    email: 'moses@plumbing.ng',
    role: UserRole.OGA,
    balance: 20000,
    verified: true,
    avatar: 'https://picsum.photos/id/338/200/200',
    businessName: 'Moses & Sons Plumbing',
    skills: ['Plumbing', 'Piping', 'Water Treatment'],
    rating: 4.5,
    hourlyRate: 5000,
    location: 'Ikeja',
    bio: 'Professional plumber available for residential and industrial contracts.'
  },
  {
    id: 'u_dev',
    name: 'Sarah Code',
    email: 'sarah@tech.ng',
    role: UserRole.APPRENTICE,
    balance: 12000,
    verified: true,
    avatar: 'https://picsum.photos/id/334/200/200',
    businessName: 'Sarah Web Solutions',
    skills: ['Web Development', 'React', 'Node.js'],
    rating: 4.2,
    hourlyRate: 10000,
    location: 'Remote / Lagos',
    bio: 'Junior Fullstack developer building modern web apps.'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    ogaId: 'u1',
    ogaName: 'Ada Tailor',
    title: 'Tailoring Mastery - Bespoke Designs',
    description: 'Learn traditional Nigerian tailoring from fabric selection to finished garments. A comprehensive guide to becoming a master tailor.',
    totalFee: 50000,
    location: 'Lagos, Nigeria',
    deliveryMode: 'physical',
    skillTags: ['Tailoring', 'Design', 'Fashion'],
    milestones: [
      { id: 'm1', title: 'Measurement Techniques', durationDays: 14, paymentPercent: 20, description: 'Mastering the tape rule and body types.' },
      { id: 'm2', title: 'Pattern Making', durationDays: 21, paymentPercent: 30, description: 'Drafting patterns on brown paper.' },
      { id: 'm3', title: 'Sewing & Finishing', durationDays: 30, paymentPercent: 50, description: 'Cutting fabric and final assembly.' }
    ]
  },
  {
    id: 'c2',
    ogaId: 'u1',
    ogaName: 'Ada Tailor',
    title: 'Advanced Embroidery (Virtual Class)',
    description: 'Master the art of hand and machine embroidery via Zoom classes and recorded tutorials.',
    totalFee: 30000,
    location: 'Online / Zoom',
    deliveryMode: 'virtual',
    meetingUrl: 'https://zoom.us/j/mock-meeting-id',
    skillTags: ['Embroidery', 'Art', 'Virtual'],
    milestones: [
      { id: 'm4', title: 'Basic Stitches', durationDays: 7, paymentPercent: 50, description: 'Chain stitch, running stitch, and knots.' },
      { id: 'm5', title: 'Complex Patterns', durationDays: 14, paymentPercent: 50, description: 'Floral designs and monograms.' }
    ]
  },
  {
    id: 'c3',
    ogaId: 'u_mech',
    ogaName: 'Chief Rahman Mechanics',
    title: 'Ladipo Auto-Mechanic Masterclass',
    description: 'Hands-on training at Ladipo Market. Learn engine overhaul, brake systems, and diagnostics for Japanese and German cars.',
    totalFee: 150000,
    location: 'Ladipo Market, Lagos',
    deliveryMode: 'physical',
    skillTags: ['Automotive', 'Mechanic', 'Engineering'],
    milestones: [
      { id: 'm6', title: 'Tools & Safety', durationDays: 14, paymentPercent: 10, description: 'Workshop safety and tool identification.' },
      { id: 'm7', title: 'Braking Systems', durationDays: 30, paymentPercent: 30, description: 'Replacing pads, discs, and hydraulics.' },
      { id: 'm8', title: 'Engine Overhaul', durationDays: 90, paymentPercent: 60, description: 'Complete engine tear-down and rebuild.' }
    ]
  },
  {
    id: 'c4',
    ogaId: 'u_mech',
    ogaName: 'Chief Rahman Mechanics',
    title: 'Solar Inverter Installation',
    description: 'Learn how to install solar panels and inverters. Hybrid class: Theory online, Practicals on-site.',
    totalFee: 85000,
    location: 'Ikeja (Hybrid)',
    deliveryMode: 'hybrid',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    skillTags: ['Solar', 'Electrical', 'Green Energy'],
    milestones: [
      { id: 'm9', title: 'Solar Theory (Virtual)', durationDays: 7, paymentPercent: 20, description: 'Understanding watts, volts, and sizing.' },
      { id: 'm10', title: 'Roof Mounting', durationDays: 7, paymentPercent: 40, description: 'Practical panel mounting.' },
      { id: 'm11', title: 'Inverter Wiring', durationDays: 14, paymentPercent: 40, description: 'Battery banks and inverter connection.' }
    ]
  },
  {
    id: 'c5',
    ogaId: 'u1',
    ogaName: 'Madam Kemi Gele',
    title: 'Professional Makeup & Gele Tying',
    description: 'Weekend classes for wedding makeup and advanced Gele styles.',
    totalFee: 45000,
    location: 'Yaba, Lagos',
    deliveryMode: 'physical',
    skillTags: ['Beauty', 'Makeup', 'Culture'],
    milestones: [
      { id: 'm12', title: 'Skin Prep & Foundation', durationDays: 5, paymentPercent: 30, description: 'Perfecting the base.' },
      { id: 'm13', title: 'Gele Styling', durationDays: 5, paymentPercent: 70, description: 'Infinity pleats and fan gele.' }
    ]
  }
];

export const MOCK_CERTIFICATES: TradeCertificate[] = [
  {
    id: 'CERT-NG-2026-0842',
    enrollmentId: 'e2',
    courseId: 'c2',
    courseTitle: 'Advanced Embroidery (Virtual & Studio)',
    apprenticeId: 'u2',
    apprenticeName: 'Chidi Okonkwo',
    ogaId: 'u1',
    ogaName: 'Ada Tailor',
    tradeSkill: 'Bespoke Embroidery & Monogramming',
    issueDate: '2026-01-15',
    verificationHash: '0x8f2a93c4b1d7e5021a8c9b3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    masterBlessing: 'Chidi has shown steadfast loyalty, patience, and impeccable precision with the needle. May the work of his hands open doors in palace gates and international runways.',
    seedCapitalAmount: 150000,
    equipmentGrant: 'Brother Industrial Monogramming Machine + Golden Tape Rule & Starter Thread Spools',
    status: 'verified',
    grade: 'Distinction with Honors',
    guildSealNumber: 'NAG-LAG-2026-7721'
  }
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e1',
    courseId: 'c1',
    apprenticeId: 'u2',
    ogaId: 'u1',
    escrowBalance: 40000, // 10k released already
    status: 'active',
    startDate: '2023-09-01',
    progress: [
      { milestoneId: 'm1', status: 'completed', paidAt: '2023-09-15', evidenceUrl: 'https://picsum.photos/id/100/200/300' },
      { milestoneId: 'm2', status: 'evidence_submitted', evidenceUrl: 'https://picsum.photos/id/101/200/300' },
      { milestoneId: 'm3', status: 'pending' }
    ]
  },
  {
    id: 'e2',
    courseId: 'c2',
    apprenticeId: 'u2',
    ogaId: 'u1',
    escrowBalance: 0,
    status: 'completed',
    startDate: '2023-06-01',
    certificateId: 'CERT-NG-2026-0842',
    settlementPackage: {
      seedCapital: 150000,
      equipmentGrant: 'Brother Industrial Monogramming Machine + Golden Tape Rule & Starter Thread Spools',
      masterBlessing: 'Chidi has shown steadfast loyalty, patience, and impeccable precision with the needle. May the work of his hands open doors in palace gates and international runways.',
      trustPoolGrant: 25000,
      settledAt: '2026-01-15'
    },
    progress: [
      { milestoneId: 'm4', status: 'completed', paidAt: '2023-06-15', evidenceUrl: 'https://picsum.photos/id/100/200/300' },
      { milestoneId: 'm5', status: 'completed', paidAt: '2023-07-01', evidenceUrl: 'https://picsum.photos/id/101/200/300' }
    ]
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    clientId: 'u4',
    clientName: 'Dangote Refinery Corp',
    title: 'Industrial Welder Assistant',
    budget: 120000,
    description: 'Need a certified welder assistant for a 3-month contract.',
    location: 'Lekki Free Zone',
    status: 'open'
  },
  {
    id: 'j2',
    clientId: 'u5',
    clientName: 'Mama Nkechi Restaurant',
    title: 'Sous Chef Apprentice',
    budget: 45000,
    description: 'Learn traditional cooking in a high-volume kitchen.',
    location: 'Abuja',
    status: 'open'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-01', type: 'deposit', amount: 50000, description: 'Escrow funding for Course c1', hash: '0xabc...123', status: 'success' },
  { id: 't2', date: '2023-10-15', type: 'release', amount: 9900, description: 'Milestone 1 Release (Net)', hash: '0xdef...456', status: 'success' },
  { id: 't3', date: '2023-10-15', type: 'trust_pool_fee', amount: 100, description: '1% Community Trust Fee', hash: '0xghi...789', status: 'success' },
  { id: 't4', date: '2023-11-01', type: 'withdrawal', amount: 5000, description: 'Bank Withdrawal to GTBank', hash: '0xjkl...012', status: 'pending' }
];

export let TRUST_POOL_BALANCE = 125400; // NGN

export const MOCK_CHATS: ChatMessage[] = [
  {
    id: 'msg1',
    enrollmentId: 'e1',
    senderId: 'u2',
    senderName: 'Chidi Okonkwo',
    text: 'Good afternoon Ma. I have uploaded the evidence for the Pattern Making milestone.',
    timestamp: '2023-10-20T14:30:00Z'
  },
  {
    id: 'msg2',
    enrollmentId: 'e1',
    senderId: 'u1',
    senderName: 'Ada Tailor',
    text: 'Thank you Chidi. I will review it this evening. Did you remember to allow for seam allowance?',
    timestamp: '2023-10-20T15:15:00Z'
  },
  {
    id: 'msg3',
    enrollmentId: 'e1',
    senderId: 'u2',
    senderName: 'Chidi Okonkwo',
    text: 'Yes Ma, 1 inch allowance as taught.',
    timestamp: '2023-10-20T15:16:00Z'
  }
];

export const MOCK_CRM_CUSTOMERS: CRMCustomer[] = [
  {
    id: 'cust1',
    name: 'Mrs. Johnson',
    email: 'mjohnson@gmail.com',
    phone: '08012345678',
    status: 'new',
    lastContact: '2023-11-01',
    value: 150000,
    notes: 'Interested in 10 set of uniforms for school.'
  },
  {
    id: 'cust2',
    name: 'Greenfield Hotel',
    email: 'procurement@greenfield.ng',
    phone: '07098765432',
    status: 'negotiating',
    lastContact: '2023-10-28',
    value: 500000,
    notes: 'Bulk order for staff aprons and caps.'
  },
  {
    id: 'cust3',
    name: 'Tunde Bakare',
    email: 'tunde@yahoo.com',
    phone: '08123456789',
    status: 'won',
    lastContact: '2023-10-15',
    value: 45000,
    notes: 'Wedding Agbada tailored and delivered.'
  }
];

export const MOCK_MARKET_PRICES: MarketPrice[] = [
  { id: 'mp1', item: 'Cement (Dangote 50kg)', category: 'material', currentPrice: 5500, previousPrice: 5200, trend: 'up', lastUpdated: '2023-11-02' },
  { id: 'mp2', item: 'Petrol (Litre)', category: 'commodity', currentPrice: 630, previousPrice: 630, trend: 'stable', lastUpdated: '2023-11-02' },
  { id: 'mp3', item: 'Web Hosting (Basic/Yr)', category: 'service', currentPrice: 15000, previousPrice: 12000, trend: 'up', lastUpdated: '2023-10-30' },
  { id: 'mp4', item: 'Tailoring Chalk (Pack)', category: 'material', currentPrice: 1200, previousPrice: 1500, trend: 'down', lastUpdated: '2023-11-01' },
  { id: 'mp5', item: 'Plumbing Pipe (PVC 4")', category: 'material', currentPrice: 3500, previousPrice: 3200, trend: 'up', lastUpdated: '2023-11-02' },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: '3 Bedroom Flat in Yaba',
    location: 'Alagomeji, Yaba, Lagos',
    price: 2500000,
    type: 'lease',
    bedrooms: 3,
    bathrooms: 3,
    description: 'Newly built, serviced apartment with ample parking space and security.',
    imageUrl: 'https://picsum.photos/id/1040/400/300',
    agentId: 'u3',
    agentName: 'Estate Agent Deluxe',
    status: 'available'
  },
  {
    id: 'p2',
    title: '4 Bedroom Duplex in Lekki',
    location: 'Chevron Drive, Lekki',
    price: 150000000,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 5,
    description: 'Luxury duplex with BQ, swimming pool, and solar power installed.',
    imageUrl: 'https://picsum.photos/id/1031/400/300',
    agentId: 'u3',
    agentName: 'Lekki Gardens Agent',
    status: 'available'
  },
  {
    id: 'p3',
    title: 'Shop Space at Computer Village',
    location: 'Ikeja, Lagos',
    price: 800000,
    type: 'lease',
    bedrooms: 0,
    bathrooms: 0,
    description: 'Ground floor shop space suitable for phone repairs or sales.',
    imageUrl: 'https://picsum.photos/id/1070/400/300',
    agentId: 'u3',
    agentName: 'Ikeja Properties',
    status: 'available'
  }
];
