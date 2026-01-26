import type {
  QueryDocumentSnapshot,
  SnapshotOptions,
  PartialWithFieldValue,
  WithFieldValue,
  SetOptions,
} from 'firebase/firestore';
import type { ITodoConverter, TodoValues, TodoValues4DB } from './types/TodoTypes';

export class TodoConverter implements ITodoConverter {
  // 通常の set/add 用（全フィールド想定）オーバーロード
  toFirestore(modelObject: WithFieldValue<TodoValues>): WithFieldValue<TodoValues4DB>;
  // merge / mergeFields 用（部分更新想定）オーバーロード
  toFirestore(
    modelObject: PartialWithFieldValue<TodoValues>,
    _: SetOptions,
  ): PartialWithFieldValue<TodoValues4DB>;
  // 部分更新使る用Partialに
  //TODO: Overload
  toFirestore(
    modelObject: WithFieldValue<TodoValues> | PartialWithFieldValue<TodoValues>,
  ): WithFieldValue<TodoValues4DB> | PartialWithFieldValue<TodoValues4DB> {
    const { id: _, ...values } = modelObject;
    return values;
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<TodoValues4DB>,
    options?: SnapshotOptions,
  ): TodoValues {
    const id = snapshot.id;
    const values = snapshot.data(options);
    return { ...values, id };
  }
}
