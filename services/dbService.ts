import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  increment 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Course, Enrollment, ChatMessage, Transaction, User, UserRole, EnrollmentMilestone, TradeCertificate, SettlementPackage } from '../types';

// User Profile
export async function fetchUserProfile(uid: string): Promise<User | null> {
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfile(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserBalance(uid: string, newBalance: number): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), { balance: newBalance });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Courses
export function subscribeToCourses(onUpdate: (courses: Course[]) => void): () => void {
  const path = 'courses';
  const q = collection(db, path);
  return onSnapshot(
    q,
    (snapshot) => {
      const courses: Course[] = [];
      snapshot.forEach((doc) => {
        courses.push(doc.data() as Course);
      });
      onUpdate(courses);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function createCourseInDb(course: Course): Promise<void> {
  const path = `courses/${course.id}`;
  try {
    await setDoc(doc(db, 'courses', course.id), {
      ...course,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Enrollments
export function subscribeToEnrollments(
  userId: string, 
  role: UserRole, 
  onUpdate: (enrollments: Enrollment[]) => void
): () => void {
  const path = 'enrollments';
  const q = collection(db, path);
  return onSnapshot(
    q,
    (snapshot) => {
      const enrollments: Enrollment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Enrollment;
        if (role === UserRole.ADMIN || data.apprenticeId === userId) {
          enrollments.push(data);
        } else {
          // If Oga, we will filter by their courses or return all they have
          enrollments.push(data);
        }
      });
      onUpdate(enrollments);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function createEnrollmentInDb(enrollment: Enrollment): Promise<void> {
  const path = `enrollments/${enrollment.id}`;
  try {
    await setDoc(doc(db, 'enrollments', enrollment.id), enrollment);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateEnrollmentProgressInDb(
  enrollmentId: string, 
  progress: EnrollmentMilestone[], 
  newEscrowBalance?: number
): Promise<void> {
  const path = `enrollments/${enrollmentId}`;
  try {
    const updateData: Record<string, any> = { progress };
    if (newEscrowBalance !== undefined) {
      updateData.escrowBalance = newEscrowBalance;
    }
    await updateDoc(doc(db, 'enrollments', enrollmentId), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Chat Messages
export function subscribeToChats(onUpdate: (messages: ChatMessage[]) => void): () => void {
  const path = 'chats';
  const q = collection(db, path);
  return onSnapshot(
    q,
    (snapshot) => {
      const chats: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        chats.push(doc.data() as ChatMessage);
      });
      chats.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      onUpdate(chats);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveChatMessageInDb(message: ChatMessage): Promise<void> {
  const path = `chats/${message.id}`;
  try {
    await setDoc(doc(db, 'chats', message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Transactions
export function subscribeToTransactions(
  userId: string,
  onUpdate: (transactions: Transaction[]) => void
): () => void {
  const path = 'transactions';
  const q = userId ? query(collection(db, path), where('userId', '==', userId)) : collection(db, path);
  return onSnapshot(
    q,
    (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Transaction;
        txs.push(data);
      });
      txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onUpdate(txs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveTransactionInDb(transaction: Transaction): Promise<void> {
  const path = `transactions/${transaction.id}`;
  try {
    await setDoc(doc(db, 'transactions', transaction.id), transaction);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Trust Pool
export function subscribeToTrustPool(onUpdate: (balance: number) => void): () => void {
  const path = 'trust_pool/storehouse';
  return onSnapshot(
    doc(db, 'trust_pool', 'storehouse'),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate(data.balance || 0);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function incrementTrustPoolInDb(amount: number): Promise<void> {
  const path = 'trust_pool/storehouse';
  try {
    await setDoc(doc(db, 'trust_pool', 'storehouse'), {
      balance: increment(amount),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Certificates & Settlement
export function subscribeToCertificates(onUpdate: (certificates: TradeCertificate[]) => void): () => void {
  const path = 'certificates';
  const q = collection(db, path);
  return onSnapshot(
    q,
    (snapshot) => {
      const certs: TradeCertificate[] = [];
      snapshot.forEach((doc) => {
        certs.push(doc.data() as TradeCertificate);
      });
      certs.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
      onUpdate(certs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveCertificateInDb(certificate: TradeCertificate): Promise<void> {
  const path = `certificates/${certificate.id}`;
  try {
    await setDoc(doc(db, 'certificates', certificate.id), certificate);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchCertificateById(certId: string): Promise<TradeCertificate | null> {
  const path = `certificates/${certId}`;
  try {
    const docSnap = await getDoc(doc(db, 'certificates', certId));
    if (docSnap.exists()) {
      return docSnap.data() as TradeCertificate;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function completeEnrollmentWithSettlementInDb(
  enrollmentId: string, 
  settlementPackage: SettlementPackage, 
  certificateId: string
): Promise<void> {
  const path = `enrollments/${enrollmentId}`;
  try {
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      status: 'completed',
      settlementPackage,
      certificateId,
      escrowBalance: 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
