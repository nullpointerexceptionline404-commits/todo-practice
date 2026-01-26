import type {
  Firestore,
  FirestoreDataConverter,
  DocumentData,
  Query,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';
import type { Patch } from './typeutil';

// これはレコードの中身なのでIDは別
export interface TodoValues4DB extends DocumentData {
  // TODOの内容
  content: string;
  // やったがtrue。初期値はfalse
  done: boolean;
}

// エンティティ
export interface TodoValues extends TodoValues4DB {
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

// SnapShotが送られてきてない状態
export interface ITodosBox {
  // private
  state: DataState;
  // privateで外には見せない
  // initializeTodoで常に更新される
  // todos: TodoValues[] | undefined;
  // snapshot用
  // unsubscribeFn: (() => void) | undefined;
  // クエリ投げる用
  db: Firestore;
  // queryRefを作る
  // 全体の場合はキャッシュを作る
  queryRefBuilder: IQueryRefBuilder | undefined;

  // constructor(db: Firestore): ITodosBox;

  // 準備完了しているのを示す型ガード
  isReady(): this is ITodosBoxReady;
  // auth時にUIDもここに組み込む
  // 全部読み込み
  // 初期化時に使う
  // ITodoDataを更新する処理
  // snapshot変更をリッスンしたときのコールバック
  // ここでステート変化も行う
  initializeTodo(uid: string): void;
  getTodos(): TodoValues[] | undefined;
  // 追加
  // パラメータはすべて必要
  // ただしIDは払い出しのため要らない
  add(todo: Omit<TodoValues, 'id'>): Promise<void>;
  // 書き込み
  // idとその他一つがあればOK
  // mergeオプションでやる
  update(target: TodoForUpdate): Promise<void>;
  // todosの購読解除処理
  unsubscribe(): void;
}

// Snapshotが送られてきていける状態
// データを保存したり同期したりをfirestore越しにやる
// ITodoBoxReadyを実装して、ITodoBoxにキャストしてrefに入れるのがよさそう
export interface ITodosBoxReady extends ITodosBox {
  state: 'ready';
  queryRefBuilder: IQueryRefBuilder;

  getTodos(): TodoValues[];
}

// 全部静的関数でいいと思う
export interface IUserInitializer {
  // 初めてサイトを訪れるのか判定
  checkFirst(): boolean;
  // デフォルトのそれっぽいTodoを入れる関数
  makeExample(): ITodosBox;
}
