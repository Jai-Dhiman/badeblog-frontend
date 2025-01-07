export interface StoryAttributes {
  title: string
  content: string
  status: string
  'category-id': string
  'user-id': string
  'created-at': string
  'updated-at': string
}

export interface Story {
  id: string
  type: string
  attributes: StoryAttributes
  relationships: {
    category: {
      data: {
        id: string
        type: string
      }
    }
    user: {
      data: {
        id: string
        name: string
        email: string
        role: string
        created_at: string
        updated_at: string
      }
    }
  }
}

export interface CreateStoryData {
  title: string
  content: string
  category_id: string
  status: 'draft' | 'published'
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface Category {
  id: string
  type: string
  attributes: {
    name: string
  }
}

export interface Comment {
  id: string
  type: string
  attributes: {
    content: string
    'created-at': string
    'updated-at': string
    'user-info': {
      id: string
      name: string
    }
    'story-info': {
      id: string
      title: string
    }
  }
}

export interface ApiError {
  message?: string
  errors?: string[]
  error?: string
}
