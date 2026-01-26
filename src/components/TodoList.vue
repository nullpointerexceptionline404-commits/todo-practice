<template>
  <q-list>
    <q-item v-for="todo in props.todos" :key="todo.id">
      <todo-card
        :todo="todo"
        @remove="emit('remove', $event)"
        @toggle-done="(id, next) => emit('toggle-done', id, next)"
      >
      </todo-card>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { TodoValues } from 'src/TodoLogic/types/TodoTypes';
import TodoCard from './TodoCard.vue';

interface Emits {
  (e: 'remove', id: string): void;
  (e: 'toggle-done', id: string, next: boolean): void;
}

interface Props {
  todos: TodoValues[];
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
</script>
