// src/__tests__/types.ts
import type { Story, Category, User } from '@/types'

export type ApiResponse<T> = {
  data: T
}

export interface ApiMockFunction<T = any> {
  (args?: any): Promise<ApiResponse<T>>;
  mockResolvedValue: (value: ApiResponse<T>) => ApiMockFunction<T>;
  mockReset: () => void;
  mockClear: () => void;
  mockImplementation: (fn: () => Promise<ApiResponse<T>>) => ApiMockFunction<T>;
}