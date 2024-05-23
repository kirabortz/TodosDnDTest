export type ActionTypeForTest<T extends (...args: any) => any> = Omit<
  ReturnType<T>,
  "meta"
>;
