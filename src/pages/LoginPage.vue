<template>
  <q-page class="column items-center justify-center" style="gap: 0.5rem">
    <p class="text-h6">Login</p>

    <div>
      <q-form ref="formRef" @submit.prevent="onSubmit" class="column" style="gap: 2rem">
        <div class="column" style="gap: 1rem">
          <q-select v-model="tenant" :options="options" :rules="ruleRequired" />
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
            <q-btn
              type="submit"
              label="Login"
              :loading="loading"
              :disable="loading"
              value="signin"
            />
            <q-btn
              type="submit"
              label="Sign up"
              outline
              :loading="loading"
              :disable="loading"
              value="signup"
            />
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

type SubmitAction = 'signin' | 'signup';

function getSubmitAction(e: Event): SubmitAction {
  // submit を発火させたボタン（HTML仕様）
  const submitter = (e as SubmitEvent).submitter as HTMLButtonElement | null;

  const v = submitter?.value;
  return v === 'signup' ? 'signup' : 'signin'; // デフォルト signin
}

async function onSubmit(e: Event) {
  error.value = null;

  const ok = await formRef.value?.validate();
  if (!ok) return;

  loading.value = true;
  try {
    const action = getSubmitAction(e);

    const auth = getAuth();
    auth.tenantId = tenant.value;

    const mail = email.value.trim();
    const pass = password.value.trim();

    if (action === 'signup') {
      await createUserWithEmailAndPassword(auth, mail, pass);
    } else {
      await signInWithEmailAndPassword(auth, mail, pass);
    }

    await router.replace(getRedirectPath());
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}
</script>
