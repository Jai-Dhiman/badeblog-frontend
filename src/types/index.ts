export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  status: "draft" | "published";
  categoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  photoUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}