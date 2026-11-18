import {useState} from 'react';import {State,Guest,Status,GAL} from './data';
const fmt=(d:string)=>{const x=new Date(d);return isNaN(+x)?'-':x.toLocaleString('id-ID',{dateStyle:'full',timeStyle:'short'})};
const fc={serif:'font-serif',sans:'font-ui',hand:'font-hand text-lg'};
interface P{s:State;g:Guest;onRsvp:(st:Status,cp:number)=>void;onWish:(n:string,m:string)=>void;onNotice:(m:string,ok:boolean,go?:string)=>void}
export default function Invitation({s,g,onRsvp,onWish,onNotice}:P){
const e=s.ev,c=e.color;
const [open,setOpen]=useState(false);
const [st,setSt]=useState<Status|''>(g.st==='belum'?'':g.st);
const [cp,setCp]=useState(g.cp);
const [wn,setWn]=useState('');const [wm,setWm]=useState('');
const on=e.secs.filter(x=>x.on);const gr=`Yth. Bapak/Ibu ${g.name}`;
const dl=+new Date(e.date)-Date.now();const dd=Math.max(0,Math.floor(dl/864e5)),hh=Math.max(0,Math.floor(dl/36e5)%24),mm=Math.max(0,Math.floor(dl/6e4)%60);
const sec='px-5 py-9 text-center';const bt='rounded-full px-5 py-2 m-1 text-white';
const send=()=>{if(!st){onNotice('Pilih Hadir atau Tidak Hadir dulu.',false);return}
const n=st==='tidak'?0:Math.min(cp,g.max);onRsvp(st,n);onNotice('Terima kasih! RSVP terkirim. Dashboard sudah diperbarui.',true,'/dashboard')};
const wish=()=>{const a=wn.trim(),b=wm.trim();if(!a||!b){onNotice('Isi nama dan ucapan terlebih dulu.',false);return}onWish(a.slice(0,30),b.slice(0,140));setWn('');setWm('');onNotice('Ucapan ditambahkan.',true)};
if(on[0]?.id==='cover'&&!open)return(<div className={`min-h-[560px] flex flex-col items-center justify-center text-center text-white p-6 ${fc[e.font]}`} style={{background:c}}>
<p>{gr}</p><h3 className="text-4xl my-2">{e.title}</h3><p>{e.host}</p>
<button className="pulse mt-4 rounded-full border border-white px-5 py-2" onClick={()=>setOpen(true)}>Buka Undangan</button></div>);
return(<div className={`inv bg-white text-neutral-800 min-h-full ${fc[e.font]}`}>
{on.length===0&&<p className={sec}>Semua section disembunyikan. Aktifkan minimal satu di editor.</p>}
{on.map(({id})=>{switch(id){
case'hero':return<section key={id} className="px-5 py-16 text-center text-white" style={{background:`linear-gradient(160deg,${c},${GAL[e.img%8]})`}}><p>{gr}</p><h3 className="text-3xl my-2">{e.title}</h3><p>{e.host}</p><p className="mt-2">{e.intro}</p></section>;
case'info':return<section key={id} className={sec+' bg-stone-100'}><h3 className="text-2xl" style={{color:c}}>Informasi Acara</h3><p>{fmt(e.date)}</p><p>{e.place}</p></section>;
case'gallery':return<section key={id} className={sec}><h3 className="text-2xl mb-3" style={{color:c}}>Galeri</h3><div className="grid grid-cols-2 gap-1.5">{[0,1,2,3].map(i=><i key={i} className="h-24 rounded-md" style={{background:GAL[(e.img+i*2)%8]}}/>)}</div></section>;
case'countdown':return<section key={id} className={sec+' bg-stone-100'}><h3 className="text-2xl mb-2" style={{color:c}}>Menuju Hari H</h3><div className="flex gap-2 justify-center">{[[dd,'hari'],[hh,'jam'],[mm,'menit']].map(([v,l])=><div key={l} className="bg-white rounded-lg px-3 py-2 min-w-[60px] text-xs"><b className="block text-2xl" style={{color:c}}>{v}</b>{l}</div>)}</div></section>;
case'location':return<section key={id} className={sec}><h3 className="text-2xl" style={{color:c}}>Lokasi</h3><p>{e.place}</p><button className={bt} style={{background:c}} onClick={()=>onNotice('Peta tidak aktif di demo ini.',false)}>Lihat Peta (simulasi)</button></section>;
case'rsvp':return<section key={id} className={sec+' bg-stone-100'}><h3 className="text-2xl" style={{color:c}}>RSVP</h3><p>Konfirmasi untuk <b>{g.name}</b></p>
<div>{(['hadir','tidak'] as Status[]).map(v=><button key={v} className={bt} style={st===v?{background:c}:{background:'#fff',color:c,border:`1px solid ${c}`}} onClick={()=>{setSt(v);if(v==='tidak')setCp(0)}}>{v==='hadir'?'✓ Hadir':'✗ Tidak Hadir'}</button>)}</div>
{st==='hadir'&&<><select aria-label="Jumlah pendamping" className="border rounded-lg px-2 py-2 my-2" value={cp} onChange={ev=>setCp(+ev.target.value)}>{Array.from({length:g.max+1},(_,i)=><option key={i} value={i}>{i} pendamping</option>)}</select><p className="text-xs">Maksimal {g.max} pendamping.</p></>}
<div><button className={bt} style={{background:c}} onClick={send}>Kirim konfirmasi</button></div></section>;
case'wishes':return<section key={id} className={sec}><h3 className="text-2xl mb-2" style={{color:c}}>Ucapan</h3>{s.wishes.map((w,i)=><div key={i} className="text-left bg-stone-100 rounded-lg px-3 py-2 my-1.5 text-sm"><b>{w.n}</b><br/>{w.m}</div>)}
<input className="border rounded-lg w-full px-2 py-2 my-1" maxLength={30} placeholder="Nama (contoh)" value={wn} onChange={ev=>setWn(ev.target.value)}/>
<textarea className="border rounded-lg w-full px-2 py-2 my-1" rows={2} maxLength={140} placeholder="Tulis ucapan (maks. 140 karakter)" value={wm} onChange={ev=>setWm(ev.target.value)}/>
<button className={bt} style={{background:c}} onClick={wish}>Kirim ucapan</button></section>;
case'closing':return<section key={id} className="px-5 py-12 text-center text-white" style={{background:`linear-gradient(160deg,${c},#222)`}}><h3 className="text-2xl">Terima kasih</h3><p>Merupakan kehormatan bagi kami atas kehadiran Anda.</p><p>{e.host}</p></section>;
default:return null}})}</div>)}
