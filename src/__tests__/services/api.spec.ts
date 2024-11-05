import { describe, it, expect, jest } from '@jest/globals'
import type { Story } from '@/types'
import type { ApiResponse, ApiMockFunction } from '../types'

// Add interface for mock API
interface MockApi {
  post: ApiMockFunction<any>;
  storyApi: {
    create: ApiMockFunction<Story>;
  };
}

// Create mock functions with proper typing
const mockPost = jest.fn() as ApiMockFunction<any>;
const mockCreate = jest.fn() as ApiMockFunction<Story>;

// Create mock API with interface
const mockApi: MockApi = {
  post: mockPost,
  storyApi: {
    create: mockCreate
  }
};

// Mock the entire api module
jest.mock('@/services/api', () => mockApi);

describe('storyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates story with correct form data', async () => {
    const formData = new FormData();
    formData.append('story[title]', 'Test Story');
    formData.append('story[content]', 'Test content');
    formData.append('story[category_id]', '1');
    formData.append('story[status]', 'published');
    
    const mockResponse: ApiResponse<Story> = {
      data: {
        id: 1,
        title: 'Test Story',
        content: 'Test content',
        status: 'published',
        categoryId: 1,
        userId: 1,
        createdAt: '2024-11-05T00:00:00.000Z',
        updatedAt: '2024-11-05T00:00:00.000Z'
      }
    };

    mockCreate.mockResolvedValue(mockResponse);
    
    // Call create with the form data
    await mockApi.storyApi.create(formData);
    
    // Verify the mock was called with the form data
    expect(mockCreate).toHaveBeenCalledWith(formData);
  });
});