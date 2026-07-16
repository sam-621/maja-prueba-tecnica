import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/shared/contexts/user-context';

export const useLogout = () => {
  const { signOut } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    signOut();
    queryClient.clear();
    navigate('/login', { replace: true });
  };
};
