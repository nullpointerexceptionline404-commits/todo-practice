<template>
  <q-page class="column items-center justify-center" style="gap: 0.5rem">
    <p class="text-h6">Login</p>

    <div>
      <q-form ref="formRef" @submit.prevent="onLogin" class="column" style="gap: 2rem">
        <div class="column" style="gap: 1rem">
          <q-select v-model="tenant" :options="options" :rules="ruleRequired"></q-select>
          <q-input v-model="email" type="email" label="Email" :rules="ruleStringRequired" />
          <q-input
            v-model="password"
            type="password"
            label="Password"
            :rules="ruleStringRequired"
          />
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
import type { QForm } from 'quasar';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const options = ['tenant1', 'tenant2'];

const formRef = ref<QForm | null>(null);
const email = ref('');
const password = ref('');
const tenant = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

function ValidateRequired(v: unknown) {
  return (v != null && v !== '') || 'required';
}

function ValidateStringRequired(v: string) {
  return v.trim().length > 0 || 'no only spaces';
}

const ruleRequired = [ValidateRequired];
const ruleStringRequired = [ValidateRequired, ValidateStringRequired];

function getRedirectPath() {
  const r = route.query.redirect;
  return typeof r === 'string' && r.length > 0 ? r : '/';
}

async function onLogin() {
  error.value = null;

  const ok = await formRef.value?.validate();
  if (!ok) return;

  loading.value = true;
  try {
    const auth = getAuth();
    auth.tenantId = tenant.value;
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value.trim());
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
    auth.tenantId = tenant.value;
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
