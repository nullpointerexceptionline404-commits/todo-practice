import { boot } from 'quasar/wrappers';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $firebase: {
      app: FirebaseApp;
      db: Firestore;
      fn: Functions;
    };
  }
}

function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

export default boot(({ app }) => {
  const fbApp = getApps().length ? getApp() : initializeApp(getFirebaseConfig());

  const db = getFirestore(fbApp);
  const fn = getFunctions(fbApp);

  // 任意：ローカルエミュレータに接続（開発時だけ）
  if (import.meta.env.DEV) {
    // Firestore Emulator: localhost:8080
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Functions Emulator: localhost:5001
    connectFunctionsEmulator(fn, 'localhost', 5001);
  }

  app.config.globalProperties.$firebase = { app: fbApp, db, fn };
});
