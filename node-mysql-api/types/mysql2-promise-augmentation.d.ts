import 'mysql2/promise';

declare module 'mysql2/promise' {
  interface Connection {
    query<T = any>(sql: string, values?: any): Promise<[T, any]>;
    execute<T = any>(sql: string, values?: any): Promise<[T, any]>;
  }
}

export {};
