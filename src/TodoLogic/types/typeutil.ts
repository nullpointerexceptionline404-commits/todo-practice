type AtLeastOneRequired<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

type RequireIdAndAtLeastOneOther<T extends { id: any }> = { id: T['id'] } & AtLeastOneRequired<
  Omit<T, 'id'>
>;

export type Patch<T extends { id: any }> = RequireIdAndAtLeastOneOther<T>;
