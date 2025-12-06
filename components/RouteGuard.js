import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { getFavourites } from '@/lib/userData';

const PUBLIC_PATHS = ['/login', '/register', '/about'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  async function updateAtom() {
    setFavouritesList(await getFavourites());
  }

  useEffect(() => {
    const path = router.pathname;

    if (!PUBLIC_PATHS.includes(path) && !isAuthenticated()) {
      router.push('/login'); 
    } else if (isAuthenticated()) {
      updateAtom(); 
    }
  }, [router.pathname]);

  return <>{children}</>;
}
