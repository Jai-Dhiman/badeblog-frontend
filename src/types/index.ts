export interface Story {
  id: number
  title: string
  content: string
  status: 'draft' | 'published'
  category_id: number
  category?: Category
  user_id: number
  user?: User
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface Category {
  id: number
  name: string
}

export interface Comment {
  id: number
  content: string
  user: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}
