/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are now hardcoded in src/integrations/supabase/client.ts
  // and are no longer needed as environment variables for the frontend.
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}