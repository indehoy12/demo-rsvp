export type Status='hadir'|'tidak'|'belum';
export interface Guest{id:number;name:string;cat:string;st:Status;cp:number;max:number}
export type Font='serif'|'sans'|'hand';
export interface EventData{title:string;host:string;date:string;place:string;intro:string;color:string;font:Font;img:number;secs:{id:string;on:boolean}[]}
export interface State{ev:EventData;guests:Guest[];wishes:{n:string;m:string}[];sel:number;log:{t:number;m:string}[]}
export const SECS:[string,string][]=[['cover','Opening cover'],['hero','Hero'],['info','Informasi acara'],['gallery','Galeri'],['countdown','Countdown'],['location','Lokasi'],['rsvp','RSVP'],['wishes','Ucapan'],['closing','Penutup']];
export const CATS=['Keluarga','Teman','Kolega'];
export const GAL=['#b08968','#6c9a8b','#c9ada7','#7b8fa1','#d4a373','#8e9aaf','#a3b18a','#cb997e'];
const FN=['Andi','Siti','Budi','Nadia','Raka','Dewi','Agus','Lina','Fajar','Maya','Rudi','Tari','Eko','Wulan','Hendra'];
const LN=['Pratama','Maharani','Santoso','Putri','Wijaya','Lestari','Hidayat','Kusuma','Saputra','Permata'];
const FIXED=['Andi Pratama','Siti Maharani','Budi Santoso','Nadia Putri','Raka Wijaya'];
function seed():Guest[]{let h=0;return Array.from({length:150},(_,i)=>{const r=i%15;const st:Status=r<9?'hadir':r<11?'tidak':'belum';let cp=0;if(st==='hadir'){cp=h%3===0?1:0;h++}
return{id:i+1,name:i<5?FIXED[i]:`${FN[(i*7)%15]} ${LN[(i*3+(i%4))%10]}${i>20?' '+(i-4):''}`,cat:CATS[i%3],st,cp,max:i%4===0?1:2}})}
export function fresh():State{return{sel:1,log:[],wishes:[{n:'Tim Demo',m:'Selamat! Semoga bahagia selalu.'}],guests:seed(),
ev:{title:'Pernikahan Rani & Dimas',host:'Rani & Dimas',date:'2027-01-24T10:00',place:'Gedung Serbaguna Pelita, Bandung',intro:'Dengan penuh syukur, kami mengundang Anda untuk hadir di hari bahagia kami.',color:'#8a6f3b',font:'serif',img:0,secs:SECS.map(s=>({id:s[0],on:true}))}}}
export function stats(g:Guest[]){const s={t:g.length,h:0,n:0,b:0,e:0,c:{} as Record<string,{t:number;h:number}>};
g.forEach(x=>{if(x.st==='hadir'){s.h++;s.e+=1+x.cp}else if(x.st==='tidak')s.n++;else s.b++;const c=(s.c[x.cat]??={t:0,h:0});c.t++;if(x.st==='hadir')c.h++});return s}
