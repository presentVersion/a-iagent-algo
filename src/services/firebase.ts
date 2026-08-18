import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if a real Firebase configuration is present
const hasFirebaseConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your-api-key" && 
  firebaseConfig.projectId;

let app;
let auth: any;
let db: any;

if (hasFirebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully using VITE environment config.");
  } catch (error) {
    console.error("Failed to initialize real Firebase:", error);
  }
}

// ==========================================
// Graceful Fallback Mock Implementation
// ==========================================
class MockAuthService {
  currentUser: any = null;

  async signIn(email: string, _pass: string) {
    const users = JSON.parse(localStorage.getItem('scrolliq_users') || '[]');
    const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!found) {
      throw new Error("No user found with this email. Please register!");
    }
    
    this.currentUser = { email: found.email, uid: found.uid, displayName: found.username };
    localStorage.setItem('scrolliq_current_user', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  async register(email: string, pass: string, username: string, role: string) {
    const users = JSON.parse(localStorage.getItem('scrolliq_users') || '[]');
    const duplicate = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (duplicate) {
      throw new Error("User with this email already exists!");
    }

    const uid = 'mock-user-' + Math.random().toString(36).substr(2, 9);
    const newUser = { uid, email, username, role, pass };
    users.push(newUser);
    localStorage.setItem('scrolliq_users', JSON.stringify(users));

    this.currentUser = { email, uid, displayName: username, role };
    localStorage.setItem('scrolliq_current_user', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('scrolliq_current_user');
  }

  getSavedUser() {
    const saved = localStorage.getItem('scrolliq_current_user');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      return this.currentUser;
    }
    return null;
  }
}

const mockAuth = new MockAuthService();

export async function loginWithFirebase(email: string, pass: string) {
  if (hasFirebaseConfig && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } else {
    return await mockAuth.signIn(email, pass);
  }
}

export async function registerWithFirebase(email: string, pass: string, username: string, role: string) {
  if (hasFirebaseConfig && auth && db) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Save additional profile details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      role,
      email,
      createdAt: new Date().toISOString()
    });
    
    return user;
  } else {
    return await mockAuth.register(email, pass, username, role);
  }
}

export async function logoutWithFirebase() {
  if (hasFirebaseConfig && auth) {
    await signOut(auth);
  } else {
    await mockAuth.logout();
  }
}

export function getCurrentUserSync() {
  if (!hasFirebaseConfig) {
    return mockAuth.getSavedUser();
  }
  if (auth && auth.currentUser) {
    return auth.currentUser;
  }
  // Try localstorage fallback even for Firebase persistence checks
  const saved = localStorage.getItem('scrolliq_current_user');
  return saved ? JSON.parse(saved) : null;
}

export async function saveInteractionsFirebase(userId: string, interactions: any[]) {
  if (hasFirebaseConfig && db) {
    await setDoc(doc(db, "interactions", userId), {
      userId,
      list: interactions,
      updatedAt: new Date().toISOString()
    });
  } else {
    localStorage.setItem(`scrolliq_interactions_${userId}`, JSON.stringify(interactions));
  }
}

export async function fetchInteractionsFirebase(userId: string): Promise<any[]> {
  if (hasFirebaseConfig && db) {
    const docRef = doc(db, "interactions", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().list || [];
    }
    return [];
  } else {
    const local = localStorage.getItem(`scrolliq_interactions_${userId}`);
    return local ? JSON.parse(local) : [];
  }
}
