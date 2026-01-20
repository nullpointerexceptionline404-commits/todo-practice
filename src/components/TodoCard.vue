<template>
  <q-card>
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
}

const { todo } = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
