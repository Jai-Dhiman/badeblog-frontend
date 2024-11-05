import type { Story, Category, User } from '@/types'

export type ApiResponse<T> = {
  data: T
}

export type JestMockFunction<T = any> = {
  (...args: any[]): Promise<ApiResponse<T>>;
  mockClear: () => void;
  mockReset: () => void;
  mockResolvedValue: (value: ApiResponse<T>) => void;
  mockRejectedValue: (value: any) => void;
}

export type StoryResponse = ApiResponse<Story>
export type StoriesResponse = ApiResponse<Story[]>
export type CategoryResponse = ApiResponse<Category>
export type CategoriesResponse = ApiResponse<Category[]>
export type UserResponse = ApiResponse<User>