import { boot } from 'quasar/wrappers';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';

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

export default boot(async () => {
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
});
