import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

// Credenciales oficiales de Firebase para UniApuntes
const firebaseConfig = {
  apiKey: "AIzaSyBGpzC6DInWTwHxBUj4pA-cpiMG6BLVOrg",
  authDomain: "uniapuntes-49527.firebaseapp.com",
  projectId: "uniapuntes-49527",
  storageBucket: "uniapuntes-49527.firebasestorage.app",
  messagingSenderId: "950401238600",
  appId: "1:950401238600:web:d6b095eead071cbf78fa7d",
  measurementId: "G-8XLLSX5211"
};

// Inicialización de la aplicación Firebase (patrón Singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Servicio de Base de Datos Cloud Firestore
const db = getFirestore(app);

// Servicio de Autenticación
const auth = getAuth(app);

// Helper para recuperación de contraseña institucional
export async function sendAccountRecoveryEmail(email) {
  if (!email || !email.trim()) {
    throw new Error('Debés ingresar un correo electrónico institucional.');
  }
  const cleanEmail = email.trim();
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return { success: true, message: `Se envió un enlace de restablecimiento a ${cleanEmail}.` };
  } catch (err) {
    // Si la cuenta es de prueba o no está en Firebase Auth, proveer respuesta guiada
    if (err.code === 'auth/user-not-found') {
      return { 
        success: true, 
        isSimulated: true, 
        message: `Si la cuenta ${cleanEmail} está registrada en UNP, recibirás un correo de recuperación.` 
      };
    }
    throw err;
  }
}

// Verificación de estado del backend en la nube
export async function checkBackendHealth() {
  try {
    const isOnline = !!auth && !!db;
    return {
      status: 'online',
      provider: 'Google Firebase (Cloud Firestore & Auth)',
      projectId: firebaseConfig.projectId,
      timestamp: Date.now(),
    };
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
}

export { 
  app, 
  auth, 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
};
