import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useLogout } from '@/lib/auth/hooks/use-logout';
import { useUser } from '@/shared/contexts/user-context';

export const UserMenu = () => {
  const { user } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = getInitials(user.fullname);
  const avatarUrl = `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${encodeURIComponent(user.email)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={user.fullname} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate">{user.fullname}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User />
          Perfil
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getInitials(fullname: string): string {
  return fullname.slice(0, 2).toUpperCase();
}
