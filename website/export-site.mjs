// Build two independent static sites; this never publishes or changes DNS.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createZip} from '../tools/package-dev.mjs';
export const WEBSITE=path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ASSETS=['styles.css','app.js','assets/apex.svg'];
function origin(value){
 const u=new URL(value);
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash)
  throw new Error('Domain origins must be HTTPS addresses without paths or credentials.');
 return u.origin;
}
export function deploymentConfig(c){
 return {brandOrigin:origin(c.brandOrigin),productOrigin:origin(c.productOrigin),domainsVerified:c.domainsVerified===true};
}
export function hostedHtml(html,kind,rawConfig){
 const c=deploymentConfig(rawConfig);
 const pages={'index.html':'/pl/','en.html':'/en/','privacy.html':'/pl/privacy/','privacy-en.html':'/en/privacy/'};
 return html.replace(/\b(href|src)="([^"]+)"/g,(attribute,key,value)=>{
  if(/^(?:https?:|mailto:|data:|#|\/)/.test(value))return attribute;
  const i=value.indexOf('#'),file=i<0?value:value.slice(0,i),hash=i<0?'':value.slice(i);
  let dest;
  if(kind==='product'&&file.startsWith('brand/')){
   const target=pages[file.slice(6)];if(target)dest=c.brandOrigin+target;
  }else if(kind==='brand'&&file.startsWith('../')&&pages[file.slice(3)]){
   dest=c.productOrigin+pages[file.slice(3)];
  }else{
   const local=file.replace(/^\.\.\//,'');
   dest=pages[local]||(PUBLIC_ASSETS.includes(local)?'/'+local:null);
  }
  if(!dest)throw new Error('Unmapped local link: '+value);
  return key+'="'+dest+hash+'"';
 });
}
function entryPage(){
 return '<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/pl/"><title>Apex</title></head><body><a href="/pl/" lang="pl">Polski</a> · <a href="/en/" lang="en">English</a></body></html>\n';
}
function notFoundPage(){
 return '<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><link rel="stylesheet" href="/styles.css"><title>404 — Apex</title></head><body><main class="container section"><p class="eyebrow">APEX / 404</p><h1>Nie znaleziono strony.</h1><p lang="en">This page could not be found.</p><p><a class="inline-link" href="/pl/" lang="pl">Strona główna</a> · <a class="inline-link" href="/en/" lang="en">Home</a></p></main></body></html>\n';
}
export function siteEntries(kind,config,source=WEBSITE){
 if(!['brand','product'].includes(kind))throw new Error('Unknown site kind.');
 const entries=PUBLIC_ASSETS.map(name=>({name,data:fs.readFileSync(path.join(source,name))}));
 for(const [lang,template]of [['pl','index.html'],['en','en.html']]){
  const file=path.join(source,kind==='brand'?'brand':'',template);
  entries.push({name:lang+'/index.html',data:Buffer.from(hostedHtml(fs.readFileSync(file,'utf8'),kind,config))});
  if(kind==='product'){
   const policy=lang==='pl'?'privacy.html':'privacy-en.html';
   entries.push({name:lang+'/privacy/index.html',data:Buffer.from(hostedHtml(fs.readFileSync(path.join(source,policy),'utf8'),kind,config))});
  }
 }
 const redirects=['/ /pl/ 302','/pl /pl/ 301','/en /en/ 301','/index.html /pl/ 301','/en.html /en/ 301'];
 if(kind==='product')redirects.push('/privacy.html /pl/privacy/ 301','/privacy-en.html /en/privacy/ 301');
 entries.push({name:'index.html',data:Buffer.from(entryPage())},{name:'404.html',data:Buffer.from(notFoundPage())},{name:'_redirects',data:Buffer.from(redirects.join('\n')+'\n')},{name:'.nojekyll',data:Buffer.alloc(0)});
 return entries;
}
export function exportSites({config=JSON.parse(fs.readFileSync(path.join(WEBSITE,'deployment.config.json'),'utf8')),source=WEBSITE,outDir=path.join(WEBSITE,'..','docs','website')}={}){
 const checked=deploymentConfig(config),output=[];
 fs.mkdirSync(outDir,{recursive:true});
 for(const [kind,filename]of [['brand','Apex-Brand-hosting.zip'],['product','Apex-AdBlocker-hosting.zip']]){
  const file=path.join(outDir,filename);fs.writeFileSync(file,createZip(siteEntries(kind,checked,source)));output.push(file);
 }
 fs.copyFileSync(output[1],path.join(outDir,'Apex-Website-hosting.zip'));
 return {...checked,files:output};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{const result=exportSites();console.log(JSON.stringify(result,null,2));if(!result.domainsVerified)console.log('Domain availability/ownership is unverified. Exports are prepared, not deployed.');}
 catch(e){console.error(e.message);process.exitCode=1;}
}
