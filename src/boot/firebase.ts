import { boot } from 'quasar/wrappers';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import type { Auth, User } from 'firebase/auth';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $firebase: {
      app: FirebaseApp;
      db: Firestore;
      auth: Auth;
    };
  }
}

function getFirebaseConfig() {
  return {
    apiKey: 'mock',
    authDomain: 'mock',
    projectId: 'mock',
    storageBucket: 'mock',
    messagingSenderId: 'mock',
    appId: 'mock',
  };
}

export const authState = {
  user: null as User | null,
  ready: false,
};

export default boot(async ({ app }) => {
  const fbApp = getApps().length ? getApp() : initializeApp(getFirebaseConfig());

  const db = getFirestore(fbApp);
  const auth = getAuth(fbApp);

  // 任意：ローカルエミュレータに接続（開発時だけ）
  if (import.meta.env.DEV) {
    // Firestore Emulator: localhost:8080
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Functions Emulator: localhost:5001
    connectAuthEmulator(auth, 'http://localhost:9099');
  }

  const autoLoginPromise = new Promise<void>((resolve) => {
    const off = onAuthStateChanged(auth, (u) => {
      authState.user = u;
      authState.ready = true;
      off();
      resolve();
    });
  });

  await autoLoginPromise;

  app.config.globalProperties.$firebase = { app: fbApp, db, auth };
});
