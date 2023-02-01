import { defineConfig, loadEnv, Plugin } from 'vite';
import { handleHook } from './src/webhook';

const MiroHookPlugin: Plugin = {
  name: 'hook-plugin',
  configureServer(server) {
    server.middlewares.use('/webhook', (req, res) => {
      let body = '';

      req.on('data', (chunk) => body += chunk);
      req.on('end', () => {
        const hookReq = {
          url: req.url,
          headers: req.headers,
          body
        };

        handleHook(hookReq)
          .then((hookRes) => {
            res.statusCode = hookRes.statusCode;
            res.statusMessage = hookRes.statusMessage;
            if (hookRes.headers) {
              for (const headerName in hookRes.headers) {
                res.setHeader(headerName, hookRes.headers[headerName] ?? '')
              }
            }
            res.end(hookRes.body);
          });
      });
    })
  }
}

export default defineConfig(({ mode }) => {
  // https://vitejs.dev/config/#environment-variables
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};

  return {
    plugins: [
      MiroHookPlugin
    ]
  };
});
