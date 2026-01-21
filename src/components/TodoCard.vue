<template>
  <q-card>
    <q-checkbox
      :model-value="todo.done"
      @update:model-value="emit('toggle-done', todo.id, $event)"
    ></q-checkbox>
    {{ todo.content }}
  </q-card>
  <q-btn v-on:click="emit('remove', todo.id)">x</q-btn>
</template>

<script setup lang="ts">
import type { Todo } from './models';

interface Props {
  todo: Todo;
}

interface Emits {
  (e: 'remove', todoId: number): void;
  (e: 'toggle-done', id: number, next: boolean): void;
}

const { todo } = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
