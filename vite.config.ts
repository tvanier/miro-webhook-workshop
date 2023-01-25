import { defineConfig, Plugin } from 'vite';
import { hook } from './src/hook';

const MiroHookPlugin: Plugin = {
  name: 'hook-plugin',
  configureServer(server) {
    server.middlewares.use('/hook', (req, res) => {
      let body = '';

      req.on('data', (chunk) => body += chunk);
      req.on('end', () => {
        hook({ ...req, body })
          .then((hookRes) => {
            res.statusCode = hookRes.statusCode;
            res.statusMessage = hookRes.statusMessage;
            if (hookRes.headers) {
              for (const headerName in hookRes.headers) {
                res.setHeader(headerName, hookRes.headers[headerName] ?? '')
              }
            }
            res.end(hookRes.body);
          })
      });
    })
  }
}

export default defineConfig({
  plugins: [
    MiroHookPlugin
  ]
});
