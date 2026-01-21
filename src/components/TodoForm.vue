<template>
  <q-form @submit="addTodo" @reset="reset">
    <q-input v-model="todoText" autogrow></q-input>
    <q-btn type="submit">submit</q-btn>
    <q-btn type="reset">reset</q-btn>
    <q-btn type="button" @click="reset2default">to default</q-btn>
  </q-form>
  <todo-list
    :todos="todos"
    @remove="removeTodo"
    @toggle-done="(id, next) => toggleDone(id, next)"
  ></todo-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo } from './models';
import TodoList from './TodoList.vue';

const todoText = ref('');

function makeTodo(id: number, content: string): Todo {
  return { id, content, done: false };
}

const defaultTodos: Todo[] = ['Todoアプリを作る', 'Quasarを勉強する'].map((e, i) => makeTodo(i, e));

const todos = ref(defaultTodos);

const maxId = computed(() => {
  const ids = todos.value.map((e) => e.id);
  return Math.max(...ids);
});

function addTodo() {
  const newTodo = makeTodo(maxId.value + 1, todoText.value);
  todoText.value = '';
  todos.value = [...todos.value, newTodo];
}

function removeTodo(targetId: number) {
  const removed = todos.value.filter((e) => e.id !== targetId);
  todos.value = removed;
}

function reset() {
  todoText.value = '';
}

function reset2default() {
  reset();
  todos.value = defaultTodos;
}

function toggleDone(id: number, next: boolean) {
  const nextTodos = todos.value.map((e) => {
    if (e.id !== id) return e;
    const toggled = { ...e, done: next };
    return toggled;
  });
  todos.value = nextTodos;
}
</script>
