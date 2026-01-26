type AtLeastOneRequired<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

type RequireIdAndAtLeastOneOther<T extends { id: unknown }> = { id: T['id'] } & AtLeastOneRequired<
  Omit<T, 'id'>
>;

export type Patch<T extends { id: unknown }> = RequireIdAndAtLeastOneOther<T>;
