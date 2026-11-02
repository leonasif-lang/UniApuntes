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
  updateProfile
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
  updateProfile
};
