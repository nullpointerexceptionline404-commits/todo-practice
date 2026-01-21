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
import type { Todo } from './models';
import TodoCard from './TodoCard.vue';

interface Emits {
  (e: 'remove', id: number): void;
  (e: 'toggle-done', id: number, next: boolean): void;
}

interface Props {
  todos: Todo[];
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
</script>
