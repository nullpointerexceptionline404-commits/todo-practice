import type { Firestore } from 'firebase/firestore';
import type {
  ITodosBox,
  ITodosBoxReady,
  DataState,
  TodoValues,
  TodoForUpdate,
  IQueryRefBuilder,
  TodosListener,
  TodoValues4DB,
} from './types/TodoTypes';
import { addDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QueryRefBuilder } from './QueryRefBuilder';

const defaultParamTodo = { done: false } as const;

export class TodoBox implements ITodosBox {
  state: DataState = 'loading';
  private unsubscribeFn: (() => void) | undefined;
  queryRefBuilder: IQueryRefBuilder | undefined;
  private listeners: Set<TodosListener> = new Set();

  isReady(): this is ITodosBoxReady {
    return this.state === 'ready';
  }

  private notify(todos: TodoValues[]): void {
    this.listeners.forEach((fn) => fn(todos, this.state));
  }

  initializeTodo(db: Firestore, uid: string): void {
    // 二重購読防止
    this.unsubscribe();

    // クエリ用
    this.queryRefBuilder = new QueryRefBuilder(db, uid);

    const todosRef = this.queryRefBuilder.pathAll();

    this.unsubscribeFn = onSnapshot(todosRef, (querySnapshot) => {
      // converterにデータ変換させているので余計なことはしない
      const todos = querySnapshot.docs.map((e) => e.data());
      this.state = 'ready';
      this.notify(todos);
    });
  }

  async add(content: string): Promise<void> {
    if (!this.isReady()) throw new Error('this is not ready');

    const todo: TodoValues4DB = { ...defaultParamTodo, content };

    const ref = this.queryRefBuilder.pathAll();
    await addDoc(ref, todo);
  }

  async update(target: TodoForUpdate) {
    if (!this.isReady()) throw new Error('this is not ready');
    const ref = this.queryRefBuilder.pathOne(target.id);
    // updateDocがconverterを通さないので手動で通す
    const values = QueryRefBuilder.converter.toFirestore(
      target,
      // 本来ならいらないが、setDocに近い書き方をしておく
      { merge: true },
    );
    await updateDoc(ref, values);
  }

  async remove(id: string): Promise<void> {
    if (!this.isReady()) throw new Error('this is not ready');

    const ref = this.queryRefBuilder.pathOne(id);
    await deleteDoc(ref);
  }

  // unmount時にコールすること
  unsubscribe(): void {
    this.unsubscribeFn?.();
    this.unsubscribeFn = undefined;
  }

  onChangeTodos(listener: TodosListener): () => void {
    this.listeners.add(listener);

    // unsubscribe 関数を返す
    return () => {
      this.listeners.delete(listener);
    };
  }
}
