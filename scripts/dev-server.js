// Dev server simples, sem dependências externas.
// Serve a pasta do site (raiz do DraKerly) e, por padrão, roda o Tailwind em
// modo --watch para regenerar o output.css automaticamente ao mudar classes.
//
//   npm run dev              -> serve + watch CSS
//   npm run dev -- --no-watch-> só serve (sem watch)
//   PORT=3000 npm run dev    -> escolhe a porta
//
// Não tem auto-reload do navegador: salve o arquivo e dê F5 (refresh).

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const NO_WATCH = process.argv.includes('--no-watch');
let PORT = parseInt(process.env.PORT, 10) || 5500;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return send(res, 400, 'text/plain; charset=utf-8', 'Bad request');
  }

  let filePath = path.normalize(path.join(ROOT, pathname));
  // Bloqueia path traversal para fora da raiz
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'text/plain; charset=utf-8', 'Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (e, data) => {
      const code = e ? 404 : 200;
      console.log(`${req.method} ${pathname} -> ${code}`);
      if (e) {
        return send(res, 404, 'text/html; charset=utf-8',
          `<!doctype html><meta charset="utf-8"><title>404</title>` +
          `<body style="font-family:system-ui;padding:3rem;color:#4A3B40">` +
          `<h1>404</h1><p>Não encontrado: <code>${pathname}</code></p>`);
      }
      const ext = path.extname(filePath).toLowerCase();
      send(res, 200, MIME[ext] || 'application/octet-stream', data);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Porta ${PORT} ocupada, tentando ${PORT + 1}…`);
    PORT += 1;
    setTimeout(() => server.listen(PORT, '127.0.0.1'), 200);
  } else {
    console.error(err);
    process.exit(1);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ▸ Dev server no ar:  http://localhost:' + PORT);
  console.log('  ▸ Servindo:          ' + ROOT);
  console.log('  ▸ Pare com Ctrl+C');
  console.log('');
});

// Tailwind watch (rebuild do output.css ao salvar). Best-effort: se falhar,
// o servidor continua e você roda "npm run build:css" manualmente.
let watcher = null;
if (!NO_WATCH) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try {
    watcher = spawn(npm, ['run', 'watch:css'], { cwd: ROOT, stdio: 'inherit', shell: true });
    watcher.on('error', (e) => {
      console.log('Aviso: watch:css não iniciou (' + e.message + '). Rode "npm run build:css" ao mudar classes Tailwind.');
    });
  } catch (e) {
    console.log('Aviso: watch:css indisponível. Rode "npm run build:css" ao mudar classes Tailwind.');
  }
}

function shutdown() {
  if (watcher) { try { watcher.kill(); } catch (e) {} }
  try { server.close(); } catch (e) {}
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
