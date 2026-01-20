<template>
  <q-page class="row items-center justify-evenly">
    <form>
      <q-input v-model="todoText" autogrow></q-input>
    </form>
    <q-list>
      <q-item v-for="todo in todos" :key="todo.id">
        <todo-card>
          {{ todo.content }}
        </todo-card>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TodoCard from 'src/components/TodoCard.vue';

// TODO: TODOの追加の仕組み実装
const todoText = ref('');

interface Todo {
  id: number;
  content: string;
}

function makeTodo(id: number, content: string): Todo {
  return { id, content };
}

const defaultTodos: Todo[] = ['Todoアプリを作る', 'Quasarを勉強する'].map((e, i) => makeTodo(i, e));

const todos = defaultTodos;
</script>
