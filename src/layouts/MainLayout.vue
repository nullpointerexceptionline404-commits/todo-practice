<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Todo List </q-toolbar-title>
        <q-btn flat v-if="showSignOut" @click="onSignOut">Sign Out</q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const auth = getAuth();
const router = useRouter();

const user = ref<User | null>(auth.currentUser);

let off: (() => void) | null = null;
onMounted(() => {
  off = onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});
onUnmounted(() => {
  off?.();
});

const showSignOut = computed(() => user.value != null);

const onSignOut = async () => {
  try {
    await signOut(auth);
    await router.push('/login');
  } catch (error) {
    console.error('sign out error:', error);
  }
};
</script>
