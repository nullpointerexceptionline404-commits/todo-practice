import { getCurrentInstance } from 'vue';

export function useFirebase() {
  const inst = getCurrentInstance();
  if (!inst) throw new Error('useFirebase() must be called inside setup().');
  return inst.appContext.config.globalProperties.$firebase;
}
