<template>
  <q-page class="column items-center justify-center" style="gap: 0.5rem">
    <p class="text-h6">Login</p>

    <div>
      <q-form @submit.prevent="onLogin" class="column" style="gap: 2rem">
        <div class="column" style="gap: 1rem">
          <q-input v-model="email" type="email" label="Email" />
          <q-input v-model="password" type="password" label="Password" />
        </div>

        <div class="column" style="gap: 1rem">
          <div class="row q-gutter-sm">
            <q-btn type="submit" label="Login" :loading="loading" />
            <q-btn type="button" label="Sign up" outline :disable="loading" @click="onSignup" />
          </div>

          <div v-if="error" class="text-negative q-mt-md">
            {{ error }}
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

function getRedirectPath() {
  const r = route.query.redirect;
  return typeof r === 'string' && r.length > 0 ? r : '/';
}

async function onLogin() {
  error.value = null;
  loading.value = true;
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email.value, password.value);
    await router.replace(getRedirectPath());
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = String(e);
    }
  } finally {
    loading.value = false;
  }
}

async function onSignup() {
  error.value = null;
  loading.value = true;
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    await router.replace(getRedirectPath());
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = String(e);
    }
  } finally {
    loading.value = false;
  }
}
</script>
