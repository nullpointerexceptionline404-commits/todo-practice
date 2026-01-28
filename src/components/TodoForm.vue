<template>
  <q-form @submit.prevent="addTodo" @reset="reset">
    <q-input v-model="todoText" autogrow></q-input>
    <q-btn type="submit">submit</q-btn>
    <q-btn type="reset">reset</q-btn>
    <!-- <q-btn type="button" @click="reset2default">to default</q-btn> -->
  </q-form>
  <todo-list
    :todos="todos"
    @remove="removeTodo"
    @toggle-done="(id, next) => toggleDone(id, next)"
  ></todo-list>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import TodoList from './TodoList.vue';
import type { TodoValues } from 'src/TodoLogic/types/TodoTypes';
import { TodoBox } from 'src/TodoLogic/TodoBox';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const todoText = ref('');
const todos = ref([] as TodoValues[]);

const box = new TodoBox();
let offTodos: (() => void) | undefined;

const isReady = computed(() => box.isReady());

onMounted(() => {
  const db = getFirestore();

  offTodos = box.onChangeTodos((nextTodos) => {
    todos.value = nextTodos;
  });

  const { currentUser } = getAuth();
  const { uid, tenantId } = currentUser!;

  // ログイン済みでしか見ないので
  box.initializeTodo(db, uid, tenantId!);
});

onBeforeUnmount(() => {
  offTodos?.();
  box.unsubscribe();
});

async function addTodo() {
  const text = todoText.value.trim();
  if (!text) return;
  if (!isReady.value) return;

  await box.add(text);
  todoText.value = '';
}

async function removeTodo(targetId: string) {
  if (!box.isReady()) return;

  await box.remove(targetId);
}

function reset() {
  todoText.value = '';
}

// reset to default実装は後回し
// function reset2default() {
//   reset();
//   todos.value = defaultTodos;
// }

async function toggleDone(id: string, next: boolean) {
  if (!box.isReady()) return;

  await box.update({ id, done: next });
}
</script>
