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
import { TodoValues } from 'src/TodoLogic/types/TodoTypes';

interface Props {
  todo: TodoValues;
}

interface Emits {
  (e: 'remove', todoId: string): void;
  (e: 'toggle-done', id: string, next: boolean): void;
}

const { todo } = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
