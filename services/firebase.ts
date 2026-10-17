import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { User, Course, Enrollment, ChatMessage, Transaction, UserRole } from '../types';
import { MOCK_COURSES, MOCK_USERS, TRUST_POOL_BALANCE } from './mockData';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline. Check configuration.");
      return false;
    }
    // permission-denied or doc not found is normal for test doc
    return true;
  }
}

// Seed initial courses if database is brand new
export async function seedInitialCoursesIfEmpty(): Promise<void> {
  const path = 'courses';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      console.log('Seeding initial Nigerian apprenticeship courses into Firestore...');
      for (const course of MOCK_COURSES) {
        await setDoc(doc(db, 'courses', course.id), {
          ...course,
          createdAt: new Date().toISOString()
        });
      }
      // Also seed initial trust pool storehouse
      await setDoc(doc(db, 'trust_pool', 'storehouse'), {
        balance: TRUST_POOL_BALANCE,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    // Graceful fallback to local mock courses if offline or during rule propagation
    console.info('Course catalog running with initial offline/mock seed.');
  }
}

// Authentication helpers
export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
    throw err;
  }
}
