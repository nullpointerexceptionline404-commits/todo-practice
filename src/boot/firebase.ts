import { boot } from 'quasar/wrappers';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $firebase: {
      app: FirebaseApp;
      db: Firestore;
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

export default boot(({ app }) => {
  const fbApp = getApps().length ? getApp() : initializeApp(getFirebaseConfig());

  const db = getFirestore(fbApp);

  // 任意：ローカルエミュレータに接続（開発時だけ）
  if (import.meta.env.DEV) {
    // Firestore Emulator: localhost:8080
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Functions Emulator: localhost:5001
  }

  app.config.globalProperties.$firebase = { app: fbApp, db };
});
