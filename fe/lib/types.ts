export interface ContentItem {
  _id: string;
  type: string;
  title: string;
  content: string;
  link?: string | null;
  imageUrl?: string | null;
  tag?: string[];
  userId?: string;
  createdAt?: string;
}

export interface ApiError {
  message: string;
  error?: string[];
}
