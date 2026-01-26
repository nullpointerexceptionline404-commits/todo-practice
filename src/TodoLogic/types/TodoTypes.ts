import type {
  Firestore,
  FirestoreDataConverter,
  DocumentData,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';
import type { Patch } from './typeutil';

// privateにしたいメンバはコメントアウトしてある

// これはレコードの中身なのでIDは別
export interface TodoValues4DB extends DocumentData {
  // TODOの内容
  content: string;
  // やったがtrue。初期値はfalse
  done: boolean;
}

// エンティティ
export interface TodoValues {
  // TODOの内容
  content: string;
  // やったがtrue。初期値はfalse
  done: boolean;
  // DBの自動的に払い出されるキー
  id: string;
}

export interface IQueryPathBuilder {
  // constructor(uid:string)
  pathAll(): string;
  pathOne(todoId: string): string;
}

export interface IQueryRefBuilder {
  // converter: ITodoConverter;
  // pathBuilder: IQueryPathBuilder;
  // collectionPath: Query<TodoValues, TodoValues4DB>;

  // collectionPathを返すだけ
  pathAll(): CollectionReference<TodoValues, TodoValues4DB>;
  // DocRefを作って返す
  pathOne(todoId: string): DocumentReference<TodoValues, TodoValues4DB>;
  // constructor(uid,db)
}

// FireStore内とApp内のデータの相互変換
export type ITodoConverter = FirestoreDataConverter<TodoValues>;

export type TodoForUpdate = Patch<TodoValues>;

export type DataState = 'loading' | 'ready';

export type TodosListener = (todos: TodoValues[], state: DataState) => void;

// SnapShotが送られてきてない状態
export interface ITodosBox {
  state: DataState;
  // snapshot用
  // unsubscribeFn: (() => void) | undefined;
  // queryRefを作る
  // 全体の場合はキャッシュを作る
  queryRefBuilder: IQueryRefBuilder | undefined;
  // Todo変更のリスナー
  // listeners: Set<TodosListener>;

  // constructor(db: Firestore): ITodosBox;

  // 準備完了しているのを示す型ガード
  isReady(): this is ITodosBoxReady;
  // auth時にUIDもここに組み込む
  // 全部読み込み
  // 初期化時に使う
  // ITodoDataを更新する処理
  // snapshot変更をリッスンしたときのコールバック
  // ここでステート変化も行う
  initializeTodo(db: Firestore, uid: string): void;
  // 追加
  // IDは払い出しのため要らない
  // doneもデフォルトはfalse
  add(content: string): Promise<void>;
  // 書き込み
  // idとその他一つがあればOK
  // mergeオプションでやる
  update(target: TodoForUpdate): Promise<void>;
  // 削除
  // レコード特定にIDさえあればOK
  remove(targetId: string): Promise<void>;
  // todosの購読解除処理
  unsubscribe(): void;
  // Todo変化購読
  // 購読解除処理を返す
  onChangeTodos(listener: TodosListener): () => void;
}

// Snapshotが送られてきていける状態
// データを保存したり同期したりをfirestore越しにやる
// ITodoBoxReadyを実装して、ITodoBoxにキャストしてrefに入れるのがよさそう
export interface ITodosBoxReady extends ITodosBox {
  state: 'ready';
  queryRefBuilder: IQueryRefBuilder;
}

// 全部静的関数でいいと思う
export interface IUserInitializer {
  // 初めてサイトを訪れるのか判定
  checkFirst(): boolean;
  // デフォルトのそれっぽいTodoを入れる関数
  makeExample(): ITodosBox;
}
