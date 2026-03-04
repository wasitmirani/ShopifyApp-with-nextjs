'use client';
import { useEffect, useState } from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useSearchParams } from 'next/navigation';

export function AppBridgeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [host, setHost] = useState<string>('');

  useEffect(() => {
    // Shopify passes the base64-encoded host on first load
    const h = searchParams.get('host');
    if (h) {
      setHost(h);
      sessionStorage.setItem('shopify-host', h); // persist for navigation
    } else {
      const stored = sessionStorage.getItem('shopify-host');
      if (stored) setHost(stored);
    }
  }, [searchParams]);

  if (!host) return <>{children}</>;

  return (
    <Provider
      config={{
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
        host,
        forceRedirect: true, // redirect to Shopify Admin if accessed directly
      }}
    >
      {children}
    </Provider>
  );
}