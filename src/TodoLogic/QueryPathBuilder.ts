import type { IQueryPathBuilder } from './types/TodoTypes';

export class QueryPathBuilder implements IQueryPathBuilder {
  constructor(private uid: string) {}

  pathAll() {
    // return `/users/${this.uid}/todos`;
    return `todos`;
  }

  pathOne(todoId: string) {
    return `todos/${todoId}`;
  }
}
