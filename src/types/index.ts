export interface Story {
  id: number
  title: string
  content: string
  status: 'draft' | 'published'
  category_id: number
  user_id: number
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
