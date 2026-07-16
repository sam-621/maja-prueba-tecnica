// Turns a category name into a url-safe, unique-friendly slug.
// e.g. "Web  Development!" -> "web-development"
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
