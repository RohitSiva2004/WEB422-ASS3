import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import { SWRConfig } from 'swr';
import RouteGuard from '@/components/RouteGuard';
import MainNav from '@/components/MainNav';

const fetcher = async (...args) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }
  return response.json();
};

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <RouteGuard>
        <MainNav />
        <Component {...pageProps} />
      </RouteGuard>
    </SWRConfig>
  );
}
