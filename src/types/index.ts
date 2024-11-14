export interface StoryAttributes {
  title: string
  content: string
  status: string
  'category-id': number
  'user-id': number
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
        id: number
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
  category_id: number
  status: 'draft' | 'published'
}

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface Category {
  id: number
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
      id: number
      name: string
    }
  }
}
