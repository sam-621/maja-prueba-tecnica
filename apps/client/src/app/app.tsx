/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import { LoginPage } from '@/lib/auth/pages/login-page';
import { SignupPage } from '@/lib/auth/pages/signup-page';
import { BlogDetailPage } from '@/lib/blog/pages/blog-detail-page';
import { BlogsFeedPage } from '@/lib/blog/pages/blogs-feed-page';
import { EditBlogPage } from '@/lib/blog/pages/edit-blog-page';
import { NewBlogPage } from '@/lib/blog/pages/new-blog-page';
import { ProfilePage } from '@/lib/profile/pages/profile-page';
import { SiteLayout } from '@/shared/components/layout/site-layout';
import { NotFoundPage } from '@/shared/components/not-found-page';
import { UserContextProvider } from '@/shared/contexts/user-context';
import { Protect } from '@/shared/guards/protect';
import { Public } from '@/shared/guards/public';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<BlogsFeedPage />} />
              <Route path="/blogs/:slug" element={<BlogDetailPage />} />

              <Route
                path="/profile"
                element={
                  <Protect>
                    <ProfilePage />
                  </Protect>
                }
              />

              <Route
                path="/new"
                element={
                  <Protect>
                    <NewBlogPage />
                  </Protect>
                }
              />

              <Route
                path="/blogs/:slug/edit"
                element={
                  <Protect>
                    <EditBlogPage />
                  </Protect>
                }
              />
            </Route>

            <Route
              path="/login"
              element={
                <Public>
                  <LoginPage />
                </Public>
              }
            />
            <Route
              path="/signup"
              element={
                <Public>
                  <SignupPage />
                </Public>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </UserContextProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
