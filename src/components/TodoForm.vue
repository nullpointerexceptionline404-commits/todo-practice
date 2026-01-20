<template>
  <q-form @submit="addTodo">
    <q-input v-model="todoText" autogrow></q-input>
    <q-btn type="submit">submit</q-btn>
  </q-form>
  <todo-list :todos="todos" @remove="removeTodo"></todo-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo } from './models';
import TodoList from './TodoList.vue';

const todoText = ref('');

function makeTodo(id: number, content: string): Todo {
  return { id, content };
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
  todos.value.push(newTodo);
}

function removeTodo(targetId: number) {
  const removed = todos.value.filter((e) => e.id !== targetId);
  todos.value = removed;
}
</script>
