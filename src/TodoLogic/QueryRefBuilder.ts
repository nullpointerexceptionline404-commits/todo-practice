import {
  type Query,
  type Firestore,
  collection,
  type DocumentReference,
  doc,
  type CollectionReference,
} from 'firebase/firestore';
import type {
  IQueryRefBuilder,
  ITodoConverter,
  IQueryPathBuilder,
  TodoValues,
  TodoValues4DB,
} from './types/TodoTypes';
import { QueryPathBuilder } from './QueryPathBuilder';
import { TodoConverter } from './TodoConverter';

const todoConverter = new TodoConverter();

export class QueryRefBuilder implements IQueryRefBuilder {
  static converter: ITodoConverter = todoConverter;
  private pathBuilder: IQueryPathBuilder;
  private collectionPath: CollectionReference<TodoValues, TodoValues4DB>;

  constructor(
    private db: Firestore,
    uid: string,
  ) {
    this.pathBuilder = new QueryPathBuilder(uid);
    const path = this.pathBuilder.pathAll();
    this.collectionPath = collection(db, path).withConverter(todoConverter);
  }

  pathAll(): CollectionReference<TodoValues, TodoValues4DB> {
    return this.collectionPath;
  }

  pathOne(todoId: string): DocumentReference<TodoValues, TodoValues4DB> {
    const path = this.pathBuilder.pathOne(todoId);
    return doc(this.db, path).withConverter(todoConverter);
  }
}
