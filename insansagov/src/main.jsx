import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ApiProvider } from "./Context/ApiContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Context/AuthContext.jsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data stays fresh for 5 minutes
      cacheTime: 24 * 60 * 60 * 1000, // Cache stays in memory for 24 hours
    },
  },
});

// Persist Cache Using localStorage
// persistQueryClient({
//   queryClient,
//   persister: createSyncStoragePersister({
//     storage: window.localStorage, // You can also use sessionStorage
//   }),
// });

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <ApiProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster/>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ApiProvider>
  </HelmetProvider>
);
