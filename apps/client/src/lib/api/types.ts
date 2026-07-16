export type User = {
  id: string;
  email: string;
  fullname: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogStatus = 'draft' | 'published' | 'archived';

export type Author = {
  id: string;
  fullname: string;
  email?: string;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  status: BlogStatus;
  authorId: string;
  author?: Author;
  createdAt: string;
  updatedAt: string;
};

export type PageInfo = {
  page: number;
  size: number;
  totalPages: number;
};

export type BlogsResponse = {
  blogs: Blog[];
  pageInfo: PageInfo;
};

export type ListBlogsParams = {
  search?: string;
  categoryId?: string;
  page?: number;
  size?: number;
};

export type CreateBlogInput = {
  title: string;
  content: string;
  status?: BlogStatus;
};

export type UpdateBlogInput = Partial<CreateBlogInput>;

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  fullname: string;
};

export type AccessToken = string;
