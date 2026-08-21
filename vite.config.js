import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { VITE_ALLOWED_HOST } = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      allowedHosts: VITE_ALLOWED_HOST ? [VITE_ALLOWED_HOST] : [],
    },
  };
});
