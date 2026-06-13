import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';
import '@/index.css';

import { ThemeProvider } from '@/components/providers/ThemeProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ecom-theme">
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
