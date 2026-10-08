import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const {Pool}=pg;
const app=express();
const port=Number(process.env.PORT||8080);
const origins=(process.env.CORS_ORIGINS||'*').split(',').map(x=>x.trim());
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false});

app.use(cors({origin:(origin,cb)=>{if(!origin||origins.includes('*')||origins.includes(origin))return cb(null,true);cb(new Error('CORS blocked'))}}));
app.use(express.json({limit:'64kb'}));

app.get('/health',async(_req,res)=>{
  try{await pool.query('SELECT 1');res.json({ok:true,service:'aba-run-api',database:'connected',environment:process.env.NODE_ENV||'development'})}
  catch(e){res.status(503).json({ok:false,service:'aba-run-api',database:'unavailable'})}
});

app.get('/api/config',async(_req,res)=>{
  const {rows}=await pool.query('SELECT key,value FROM game_config ORDER BY key');
  res.json(Object.fromEntries(rows.map(r=>[r.key,r.value])));
});

app.get('/api/radio/stations',async(_req,res)=>{
  const {rows}=await pool.query('SELECT id,name,frequency,city,stream_url AS "streamUrl",logo_url AS "logoUrl" FROM radio_stations WHERE enabled=true ORDER BY sort_order,name');
  res.json(rows);
});

app.get('/api/billboards',async(req,res)=>{
  const zone=req.query.zone;
  const params=[];
  let sql='SELECT id,zone,title,image_url AS "imageUrl",target_url AS "targetUrl",campaign FROM billboards WHERE enabled=true AND (starts_at IS NULL OR starts_at<=NOW()) AND (ends_at IS NULL OR ends_at>=NOW())';
  if(zone){params.push(zone);sql+=' AND zone=$1'}
  sql+=' ORDER BY sort_order,title';
  const {rows}=await pool.query(sql,params);res.json(rows);
});

app.get('/api/missions',async(_req,res)=>{
  const {rows}=await pool.query('SELECT slug,name,description,reward FROM missions WHERE enabled=true ORDER BY reward');
  res.json(rows);
});

app.get('/api/leaderboard',async(req,res)=>{
  const limit=Math.min(Number(req.query.limit)||20,100);
  const {rows}=await pool.query('SELECT COALESCE(p.display_name,\'Anonymous\') AS "player",r.score,r.cash,r.distance,r.zone,r.vehicle,r.created_at AS "createdAt" FROM runs r LEFT JOIN players p ON p.id=r.player_id ORDER BY r.score DESC LIMIT $1',[limit]);
  res.json(rows);
});

app.post('/api/players',async(req,res)=>{
  const name=String(req.body?.displayName||'Anonymous').trim().slice(0,32)||'Anonymous';
  const {rows}=await pool.query('INSERT INTO players(display_name) VALUES($1) RETURNING id,display_name AS "displayName"', [name]);
  res.status(201).json(rows[0]);
});

app.post('/api/runs',async(req,res)=>{
  const b=req.body||{};
  const score=Math.max(0,Number(b.score)||0),cash=Math.max(0,Number(b.cash)||0),distance=Math.max(0,Number(b.distance)||0);
  const {rows}=await pool.query('INSERT INTO runs(player_id,score,cash,distance,zone,vehicle) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,score,cash,distance,zone,vehicle,created_at AS "createdAt"',[
    b.playerId||null,score,cash,distance,String(b.zone||'').slice(0,64)||null,String(b.vehicle||'keke').slice(0,32)
  ]);
  res.status(201).json(rows[0]);
});

app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:'Internal server error'})});
app.listen(port,()=>console.log(`ABA RUN API listening on :${port}`));
