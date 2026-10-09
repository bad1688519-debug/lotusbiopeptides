const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.rsc':'text/x-component','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.pdf':'application/pdf'};
http.createServer((req,res)=>{
  let file;
  try { file = path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400); return res.end(); }
  if (!file.startsWith(root+path.sep) && file!==root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  const size=fs.statSync(file).size;
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':size});
  fs.createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
