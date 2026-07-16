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

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  authorId: string;
  author?: Author;
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
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
  categoryIds?: string[];
  page?: number;
  size?: number;
};

export type CreateBlogInput = {
  title: string;
  content: string;
  status?: BlogStatus;
  categoryIds?: string[];
};

export type UpdateBlogInput = Partial<CreateBlogInput>;

export type CategoriesResponse = {
  categories: Category[];
  pageInfo: PageInfo;
};

export type ListCategoriesParams = {
  search?: string;
  page?: number;
  size?: number;
};

export type CreateCategoryInput = {
  name: string;
};

export type CommentsResponse = {
  comments: Comment[];
  pageInfo: PageInfo;
};

export type CreateCommentInput = {
  content: string;
};

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
