import { boot } from 'quasar/wrappers';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
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

export default boot(async ({ app, urlPath, redirect }) => {
  const fbApp = getApps().length ? getApp() : initializeApp(getFirebaseConfig());

  const db = getFirestore(fbApp);
  const auth = getAuth(fbApp);

  // 任意：ローカルエミュレータに接続（開発時だけ）
  if (import.meta.env.DEV) {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
  }

  const autoLoginPromise = new Promise<void>((resolve) => {
    const off = onAuthStateChanged(auth, () => {
      off();
      resolve();
    });
  });

  await autoLoginPromise;

  const isAuthorized = auth.currentUser != null;
  const isLogingIn = urlPath.startsWith('/login');
  const shouldLogin = !isAuthorized && !isLogingIn;
  const shouldSkipLogin = isAuthorized && isLogingIn;

  if (shouldLogin) {
    redirect('/login');
  }
  if (shouldSkipLogin) {
    redirect('/');
  }

  app.config.globalProperties.$firebase = { app: fbApp, db, auth };
});
