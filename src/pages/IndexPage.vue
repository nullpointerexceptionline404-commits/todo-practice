<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="addTodo">
      <q-input v-model="todoText" autogrow></q-input>
      <q-btn type="submit">submit</q-btn>
    </q-form>
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
import { computed, ref } from 'vue';
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
</script>
