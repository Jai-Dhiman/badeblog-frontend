export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user?: User;
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
  user?: User;
  category?: Category;
  comments?: Comment[];
}

export interface StoryFormData {
  title: string;
  content: string;
  categoryId: number;
  status: "draft" | "published";
  photo?: File;
}
