const http=require('http');
const fs=require('fs');
const path=require('path');
const {URL}=require('url');

const PORT=Number(process.env.PORT||8080);
const ROOT=path.join(__dirname,'aba-run');
const API_TARGET=(process.env.ABA_RUN_API||'https://uhznenjxhdosesgvylts.supabase.co/functions/v1/aba-run-api').replace(/\/$/,'');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};

function send(res,status,body,type='text/plain; charset=utf-8'){res.writeHead(status,{'content-type':type,'cache-control':'no-store'});res.end(body);}
async function proxy(req,res,url){
  try{
    const target=API_TARGET+url.pathname.replace(/^\/api/,'/api')+url.search;
    const headers={'content-type':req.headers['content-type']||'application/json'};
    if(req.headers.authorization) headers.authorization=req.headers.authorization;
    let body;
    if(req.method!=='GET'&&req.method!=='HEAD'){
      const chunks=[]; for await(const c of req) chunks.push(c); body=Buffer.concat(chunks);
    }
    const r=await fetch(target,{method:req.method,headers,body});
    const text=await r.text();
    res.writeHead(r.status,{'content-type':r.headers.get('content-type')||'application/json','cache-control':'no-store'});
    res.end(text);
  }catch(e){send(res,502,JSON.stringify({error:'API proxy unavailable'}),'application/json');}
}
function safeFile(p){const resolved=path.resolve(ROOT,p);return resolved.startsWith(path.resolve(ROOT)+path.sep)?resolved:null;}
function staticFile(req,res,url){
  let rel=decodeURIComponent(url.pathname.replace(/^\/aba-run\/?/,''));
  if(!rel) rel='index.html';
  if(rel==='admin'||rel==='admin/') rel='admin/index.html';
  const file=safeFile(rel);
  if(!file)return send(res,403,'Forbidden');
  fs.stat(file,(err,st)=>{
    if(err||!st.isFile()) return send(res,404,'Not found');
    const ext=path.extname(file).toLowerCase();
    res.writeHead(200,{'content-type':mime[ext]||'application/octet-stream','cache-control':ext==='.html'?'no-store':'public,max-age=300'});
    fs.createReadStream(file).pipe(res);
  });
}
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/health'){return send(res,200,JSON.stringify({ok:true,service:'aba-run',api:API_TARGET}),'application/json');}
  if(u.pathname==='/') {res.writeHead(302,{location:'/aba-run/'});return res.end();}
  if(u.pathname.startsWith('/api/')) return proxy(req,res,u);
  if(u.pathname.startsWith('/aba-run')) return staticFile(req,res,u);
  return send(res,404,'Not found');
});
server.listen(PORT,'0.0.0.0',()=>console.log('ABA RUN Cloud Run server listening on '+PORT));
