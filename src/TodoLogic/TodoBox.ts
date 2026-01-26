import type { Firestore } from 'firebase/firestore';
import type {
  ITodosBox,
  ITodosBoxReady,
  DataState,
  TodoValues,
  TodoForUpdate,
  IQueryRefBuilder,
} from './types/TodoTypes';
import { addDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QueryRefBuilder } from './QueryRefBuilder';

export class TodoBox implements ITodosBox {
  state: DataState = 'loading';
  private todos: TodoValues[] | undefined;
  private unsubscribeFn: (() => void) | undefined;
  queryRefBuilder: IQueryRefBuilder | undefined;

  constructor(public db: Firestore) {}

  isReady(): this is ITodosBoxReady {
    return this.state === 'ready';
  }

  initializeTodo(uid: string): void {
    // 二重購読防止
    this.unsubscribe();

    // クエリ用
    this.queryRefBuilder = new QueryRefBuilder(this.db, uid);

    const todosRef = this.queryRefBuilder.pathAll();

    this.unsubscribeFn = onSnapshot(todosRef, (querySnapshot) => {
      // converterにデータ変換させているので余計なことはしない
      this.todos = querySnapshot.docs.map((e) => e.data());
      this.state = 'ready';
    });
  }

  // immutable強制にスライス返却
  getTodos(): TodoValues[] | undefined {
    return this.todos?.slice();
  }

  async add(todo: Omit<TodoValues, 'id'>): Promise<void> {
    if (!this.isReady()) throw new Error('this is not ready');
    const ref = this.queryRefBuilder.pathAll();
    await addDoc(ref, todo);
  }

  async update(target: TodoForUpdate) {
    if (!this.isReady()) throw new Error('this is not ready');
    const ref = this.queryRefBuilder.pathOne(target.id);
    await updateDoc(ref, target);
  }

  async remove(id: string): Promise<void> {
    if (!this.isReady()) throw new Error('this is not ready');

    const ref = this.queryRefBuilder.pathOne(id);
    await deleteDoc(ref);
  }

  unsubscribe(): void {
    this.unsubscribeFn?.();
    this.unsubscribeFn = undefined;
  }
}
