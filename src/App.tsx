import {useEffect,useRef,useState,ReactNode} from 'react';
import {NavLink,Navigate,Route,Routes,useNavigate,useSearchParams,useLocation} from 'react-router-dom';
import {useDemo} from './store';import WMLOGO from './wm-logo.png';import Invitation from './Invitation';
import {SECS,CATS,GAL,Status,Guest,stats,EventData} from './data';

const NAV:[string,string][]=[['/','Beranda'],['/dashboard','Dashboard'],['/editor','Editor & Preview'],['/guests','Daftar Tamu'],['/share','Pesan WhatsApp'],['/rsvp','RSVP Simulator'],['/analytics','Analitik RSVP'],['/about','Tentang Demo']];
function Watermark(){const r=useRef<HTMLDivElement>(null);
useEffect(()=>{const o=new MutationObserver(()=>{const w=r.current;if(w&&(w.hasAttribute('style')&&w.style.display!==''||getComputedStyle(w).opacity==='0'||getComputedStyle(w).display==='none')){w.removeAttribute('style');w.className=CLS}});
if(r.current)o.observe(r.current,{attributes:true});return()=>o.disconnect()},[]);
return<div ref={r} aria-hidden="true" className={CLS}>{Array.from({length:14},(_,y)=>Array.from({length:4},(_,x)=><img key={y+'-'+x} src={WMLOGO} alt="" draggable={false} className="absolute -rotate-[24deg] w-[190px] max-w-none select-none" style={{left:x*320+(y%2)*140-60,top:y*150}}/>))}</div>}
const CLS='fixed inset-0 z-[60] pointer-events-none opacity-[.16] overflow-hidden';

function Modal({children}:{children:ReactNode}){return<div className="fade fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"><div role="dialog" aria-modal="true" className="pop bg-white rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-auto shadow-2xl">{children}</div></div>}
function useToast(){const [t,setT]=useState<{m:string;ok:boolean;go?:string}|null>(null);const nav=useNavigate();
return[t?<Modal><div className="flex gap-3 items-start" role="alert"><span className={`text-2xl font-bold leading-none ${t.ok?'text-green-600':'text-red-600'}`}>{t.ok?'✓':'✗'}</span><p className="pt-0.5">{t.m}</p></div>
<div className="flex gap-2 mt-5">{t.go&&<button className="btn btn-alt flex-1" onClick={()=>{const g=t.go!;setT(null);nav(g)}}>Lihat dashboard</button>}<button className="btn flex-1" autoFocus onClick={()=>setT(null)}>OK</button></div></Modal>:null,(m:string,ok=true,go?:string)=>setT({m,ok,go})] as const}
const Lb=({t}:{t:string})=>t[0]==='✓'||t[0]==='✗'?<><span className={t[0]==='✓'?'text-green-600 font-bold':'text-red-600 font-bold'}>{t[0]}</span>{t.slice(1)}</>:<>{t}</>;
const STEPS=[['/editor','Edit & preview'],['/guests','Tamu'],['/rsvp','RSVP'],['/analytics','Statistik']];
const H=({t,s,n}:{t:string;s:string;n?:number})=><>{n!==undefined&&<ol className="no-print flex gap-1.5 flex-wrap mb-3 text-sm" aria-label="Alur demo">{STEPS.map(([to,l],i)=><li key={to}><NavLink to={to} className={`inline-block px-2.5 py-1 rounded-full border ${i===n?'bg-pr text-white border-pr':'bg-white border-bd text-mut'}`}>{i+1}. {l}</NavLink></li>)}</ol>}<h2 className="text-2xl font-extrabold tracking-tight">{t}</h2><span className="block w-10 h-1 rounded-full bg-ac mt-1.5 mb-2"/><p className="text-mut mb-4">{s}</p></>;

const SI:Record<string,number>={'/editor':0,'/guests':1,'/rsvp':2,'/analytics':3};
export default function App(){const {s,reset}=useDemo();const [ask,setAsk]=useState(false);const nav=useNavigate();const loc=useLocation();
const [vis,setVis]=useState<string[]>(()=>{try{return JSON.parse(sessionStorage.getItem('srt-vis')||'[]')}catch{return[]}});
useEffect(()=>{setVis(v=>v.includes(loc.pathname)?v:[...v,loc.pathname])},[loc.pathname]);
useEffect(()=>{try{sessionStorage.setItem('srt-vis',JSON.stringify(vis))}catch{}},[vis]);
const lg=s.log||[];const done=[vis.includes('/editor'),vis.includes('/guests'),lg.some(l=>l.m.includes('RSVP')),vis.includes('/analytics')];
return<div className="lg:grid lg:grid-cols-[220px_1fr] min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
<Routes><Route path="/" element={null}/><Route path="*" element={null}/></Routes>
<nav className="no-print bg-pr text-white p-2 lg:p-3 flex lg:flex-col gap-1 overflow-x-auto sticky top-0 z-50 lg:h-screen" aria-label="Menu utama">
<div className="hidden lg:block bg-white rounded-xl p-2.5 mb-3 mx-1"><img src={WMLOGO} alt="Sumber Rejeki Tech" className="w-full"/></div><div className="hidden lg:block px-2 pb-3 font-bold leading-tight">Invitation & RSVP<small className="block font-normal opacity-70">Demo Sumber Rejeki Tech</small></div>
{NAV.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${isActive?'bg-white/20 shadow-[inset_3px_0_0_#ff7b00]':'opacity-80 hover:bg-white/10'}`}>{l}{SI[to]!==undefined&&done[SI[to]]&&<span className="text-green-400 font-bold ml-1.5">✓</span>}</NavLink>)}
<div className="hidden lg:block flex-1"/><button className="px-3 py-2 rounded-lg text-left opacity-80 hover:bg-white/10 whitespace-nowrap" onClick={()=>setAsk(true)}>Reset Demo</button></nav>
<main key={loc.pathname} className="pg p-4 pb-44 md:p-6 md:pb-44 min-w-0 w-full max-w-[1200px] mx-auto"><Routes>
<Route path="/" element={<Welcome/>}/><Route path="/dashboard" element={<Dashboard/>}/>
<Route path="/editor" element={<Editor/>}/><Route path="/guests" element={<Guests/>}/><Route path="/share" element={<Share/>}/><Route path="/rsvp" element={<Rsvp/>}/>
<Route path="/analytics" element={<Analytics/>}/><Route path="/about" element={<About onReset={()=>setAsk(true)}/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main>
{ask&&<Modal><h3 className="font-bold text-lg">Reset demo?</h3><p className="my-2">Template, data acara, daftar tamu, RSVP, dan ucapan akan kembali ke kondisi awal.</p>
<div className="flex gap-2"><button className="btn btn-danger" onClick={()=>{reset();setVis([]);setAsk(false);nav('/dashboard')}}>Reset Demo</button><button className="btn btn-ghost" onClick={()=>setAsk(false)}>Batal</button></div></Modal>}
<Guide path={loc.pathname} done={done} go={nav}/><Watermark/></div>}

function Welcome(){const nav=useNavigate();const {set}=useDemo();
const st:[string,string,string][]=[['Edit undangan','Ubah judul, tanggal, warna. Preview langsung berubah.','/editor'],['Kelola tamu','Cari tamu dan buka undangan personal.','/guests'],['Coba RSVP','Kirim konfirmasi sebagai tamu.','/rsvp'],['Lihat statistik','Angka dashboard berubah sesuai RSVP.','/analytics']];
return<div className="relative">
<div aria-hidden="true" className="float absolute -top-8 -left-8 w-72 h-72 rounded-full bg-[#001f59]/10 blur-3xl pointer-events-none"/><div aria-hidden="true" className="float absolute top-24 right-0 w-64 h-64 rounded-full bg-[#ff7b00]/20 blur-3xl pointer-events-none" style={{animationDelay:'-3.5s'}}/>
<div className="relative max-w-3xl mx-auto text-center pt-4 md:pt-10">
<img src={WMLOGO} alt="Sumber Rejeki Tech" className="h-14 mx-auto mb-5"/>
<span className="inline-block text-sm font-semibold text-pr bg-pr2 rounded-full px-3 py-1">Demo interaktif, tanpa login</span>
<h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-4 leading-[1.05]">Invitation &amp; RSVP System</h2>
<p className="text-mut text-lg my-4">Buat undangan digital, sesuaikan desain, dan coba sistem konfirmasi kehadiran dalam satu aplikasi.</p>
<p className="mb-6">Ini merupakan demo interaktif Sumber Rejeki Tech. Seluruh data hanya untuk simulasi.</p>
<div className="flex gap-2.5 justify-center flex-wrap"><button className="btn !bg-ac !text-pr px-6 py-3" onClick={()=>nav('/editor')}>Sesuaikan Undangan</button><button className="btn btn-alt px-6 py-3" onClick={()=>nav('/dashboard')}>Jelajahi Dashboard</button>
<button className="btn btn-alt px-6 py-3" onClick={()=>{set(p=>({...p,sel:1}));nav('/rsvp')}}>Lihat Contoh Undangan</button></div></div>
<h3 className="relative text-center font-bold mt-12 mb-3">Alur demo dalam 4 langkah</h3>
<ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-left">{st.map(([t,d,to],i)=><li key={t}><button className="card w-full h-full text-left" onClick={()=>nav(to)}><span className="inline-flex w-8 h-8 rounded-full bg-pr text-white items-center justify-center font-bold">{i+1}</span><b className="block mt-2">{t}</b><span className="text-sm text-mut">{d}</span></button></li>)}</ol></div>}

function Dashboard(){const {s}=useDemo();const x=stats(s.guests);const d=new Date(s.ev.date);const days=isNaN(+d)?-1:Math.max(0,Math.ceil((+d-Date.now())/864e5));
const C:[string,number,string][]=[['Total undangan',x.t,'/guests'],['✓ RSVP hadir',x.h,'/guests?status=hadir'],['✗ RSVP tidak hadir',x.n,'/guests?status=tidak'],['Belum menjawab',x.b,'/guests?status=belum'],['Estimasi hadir + pendamping',x.e,'/analytics']];
return<><H t="Dashboard" s="Klik kartu untuk melihat daftar tamu atau grafiknya."/>
<div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">{C.map(([l,v,to],i)=><NavLink key={l} to={to} className={`card block hover:border-pr border-t-4 ${['border-t-[#001f59]','border-t-green-600','border-t-red-600','border-t-slate-400','border-t-[#ff7b00]'][i]}`}><div className="text-4xl font-extrabold"><Num v={v}/></div><div className="text-sm text-mut mt-1.5"><Lb t={l}/></div></NavLink>)}</div>
<div className="grid gap-3.5 mt-3.5 md:grid-cols-2">
<div className="card"><b>Acara Anda</b><p className="mt-1">{s.ev.title}</p><p className="text-sm text-mut">{s.ev.host}{days>=0?`, ${days} hari lagi`:''}.</p><div className="flex gap-2 flex-wrap mt-3"><NavLink to="/editor" className="btn btn-sm">Edit undangan</NavLink><NavLink to="/share" className="btn btn-ghost btn-sm">Pesan WhatsApp</NavLink></div></div>
<div className="card"><b>Aktivitas terbaru</b>{(s.log||[]).length===0?<p className="text-sm text-mut mt-1">Belum ada aktivitas. Coba kirim RSVP atau ganti template.</p>:<ul className="mt-1 text-sm">{s.log.map((l,i)=><li key={i} className="py-1 border-b border-bd last:border-0">{l.m}</li>)}</ul>}</div>
<div className="card md:col-span-2"><b>Ucapan ({s.wishes.length})</b>{s.wishes.slice(-3).reverse().map((w,i)=><p key={i} className="text-sm mt-1.5"><b>{w.n}:</b> {w.m}</p>)}</div></div>
<div className="flex gap-2 flex-wrap mt-3.5"><NavLink to="/rsvp" className="btn">Coba RSVP</NavLink><a className="btn btn-ghost" href="https://sumberrejekitech.web.id" target="_blank" rel="noopener noreferrer">Konsultasi</a></div></>}


function Preview(){const {s,set,note}=useDemo();const [mob,setMob]=useState(true);const [k,setK]=useState(0);const [toast,say]=useToast();const g=s.guests.find(x=>x.id===s.sel)||s.guests[0];
return<><div className="no-print flex gap-2 flex-wrap mb-2"><select className="inp flex-1 min-w-[160px]" aria-label="Pilih tamu" value={g.id} onChange={ev=>set(p=>({...p,sel:+ev.target.value}))}>{s.guests.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
<button className="btn btn-alt btn-sm" onClick={()=>setMob(!mob)}>{mob?'Tampilan Desktop':'Tampilan Mobile'}</button><button className="btn btn-ghost btn-sm" onClick={()=>setK(k+1)}>Tutup cover</button><button className="btn btn-ghost btn-sm" onClick={()=>window.print()}>Cetak / PDF</button></div>
<div className={`pframe mx-auto overflow-y-auto h-[min(640px,78vh)] min-h-[300px] w-full bg-white border-[#0b1b3d] ${mob?'max-w-[360px] border-8 rounded-[26px]':'border-4 rounded-lg'}`}>
<Invitation key={g.id+'-'+k} s={s} g={g} onNotice={say}
onRsvp={(st,cp)=>{set(p=>({...p,guests:p.guests.map(x=>x.id===g.id?{...x,st,cp}:x)}));note(`${g.name}: RSVP ${st==='hadir'?'hadir':'tidak hadir'}${cp?`, +${cp} pendamping`:''}`)}}
onWish={(n,m)=>{set(p=>({...p,wishes:[...p.wishes,{n,m}]}));note(`Ucapan baru dari ${n}`)}}/></div>{toast}</>}

function Editor(){const {s,set}=useDemo();const e=s.ev;
const up=<K extends keyof EventData>(k:K,v:EventData[K])=>set(p=>({...p,ev:{...p.ev,[k]:v}}));
const mv=(i:number,d:number)=>{const j=i+d;if(j<0||j>=e.secs.length)return;const a=[...e.secs];[a[i],a[j]]=[a[j],a[i]];up('secs',a)};
const F=(k:'title'|'host'|'date'|'place',l:string,t='text')=><><label className="lbl" htmlFor={k}>{l}</label><input id={k} className="inp" type={t} maxLength={120} value={e[k]} onChange={ev=>up(k,ev.target.value)}/></>;
return<><H n={0} t="Invitation Designer" s="Perubahan langsung tampil di preview. Tidak disimpan ke server."/>
<div className="grid gap-3.5 lg:grid-cols-[minmax(260px,340px)_1fr] items-start"><div className="card no-print">
{F('title','Judul acara')}{F('host','Nama penyelenggara')}{F('date','Tanggal & waktu','datetime-local')}{F('place','Lokasi')}
<label className="lbl" htmlFor="intro">Teks pembuka</label><textarea id="intro" className="inp" rows={3} maxLength={200} value={e.intro} onChange={ev=>up('intro',ev.target.value)}/>
<div className="flex gap-2"><div className="flex-1"><label className="lbl" htmlFor="color">Warna</label><input id="color" type="color" className="inp h-10 p-0.5" value={e.color} onChange={ev=>up('color',ev.target.value)}/></div>
<div className="flex-[2]"><label className="lbl" htmlFor="font">Font</label><select id="font" className="inp" value={e.font} onChange={ev=>up('font',ev.target.value as EventData['font'])}><option value="serif">Fraunces (elegan)</option><option value="sans">Bricolage (modern)</option><option value="hand">Caveat (ekspresif)</option></select></div></div>
<span className="lbl">Aset gambar contoh</span><div className="flex gap-1.5 flex-wrap">{[0,1,2,3,4,5].map(i=><button key={i} className="btn btn-sm" style={{background:GAL[i],outline:e.img===i?'2px solid #000':'none'}} onClick={()=>up('img',i)}>Aset {i+1}</button>)}</div>
<span className="lbl">Section (tampil & urutan)</span>{e.secs.map((x,i)=><div key={x.id} className="flex items-center gap-1.5 py-1 border-b border-dashed border-bd"><input type="checkbox" checked={x.on} aria-label={'Tampilkan '+SECS.find(a=>a[0]===x.id)![1]} onChange={ev=>up('secs',e.secs.map((y,j)=>j===i?{...y,on:ev.target.checked}:y))}/>
<span className="flex-1">{SECS.find(a=>a[0]===x.id)![1]}</span><button className="btn btn-ghost btn-sm" aria-label="Naik" onClick={()=>mv(i,-1)}>Naik</button><button className="btn btn-ghost btn-sm" aria-label="Turun" onClick={()=>mv(i,1)}>Turun</button></div>)}</div>
<div className="lg:sticky lg:top-2"><Preview/></div></div></>}

function Guests(){const {s,set,note}=useDemo();const [sp,setSp]=useSearchParams();const [q,setQ]=useState('');const [f,setF]=useState<{id?:number;name:string;cat:string;max:number}|null>(null);const [dt,setDt]=useState<number|null>(null);const [err,setErr]=useState('');
const [toast,say]=useToast();const nav=useNavigate();
const fl=sp.get('status')||'semua',ct=sp.get('cat')||'semua';
const upd=(k:string,v:string)=>{const n=new URLSearchParams(sp);if(v==='semua')n.delete(k);else n.set(k,v);setSp(n,{replace:true})};
const r=s.guests.filter(g=>(fl==='semua'||g.st===fl)&&(ct==='semua'||g.cat===ct)&&g.name.toLowerCase().includes(q.toLowerCase()));const v=r.slice(0,25);const dg=s.guests.find(g=>g.id===dt);
const link=(g:Guest)=>`${location.origin}/rsvp?tamu=${g.id}`;
const go=(g:Guest,to:string)=>{set(p=>({...p,sel:g.id}));setDt(null);nav(to)};
const copy=(g:Guest)=>{const c=navigator.clipboard;if(!c){say('Tidak bisa menyalin otomatis di browser ini.',false);return}c.writeText(link(g)).then(()=>say('Tautan contoh disalin. Hanya untuk simulasi.'),()=>say('Tidak bisa menyalin tautan.',false))};
const save=()=>{const n=f!.name.trim();if(n.length<2){setErr('Nama minimal 2 karakter.');return}
set(p=>f!.id?{...p,guests:p.guests.map(g=>g.id===f!.id?{...g,name:n,cat:f!.cat,max:f!.max,cp:Math.min(g.cp,f!.max)}:g)}:{...p,guests:[{id:Date.now()%1e9,name:n,cat:f!.cat,max:f!.max,st:'belum',cp:0},...p.guests]});
note((f!.id?'Tamu diedit: ':'Tamu ditambahkan: ')+n);setF(null);setErr('');say('Tamu disimpan.')};
const tg=(g:Guest)=><span className={`tag ${g.st==='hadir'?'bg-green-100 text-green-800':g.st==='tidak'?'bg-red-100 text-red-800':'bg-slate-200 text-slate-700'}`}>{g.st==='hadir'?'✓ hadir':g.st==='tidak'?'✗ tidak hadir':'belum menjawab'}</span>;
const ac=(g:Guest)=><div className="flex gap-1.5 flex-wrap"><button className="btn btn-sm" onClick={()=>setDt(g.id)}>Detail</button><button className="btn btn-alt btn-sm" onClick={()=>go(g,'/rsvp')}>Lihat undangan</button><button className="btn btn-ghost btn-sm" onClick={()=>setF({id:g.id,name:g.name,cat:g.cat,max:g.max})}>Edit</button></div>;
return<><H n={1} t="Daftar Tamu" s="Tamu contoh. Perubahan hanya berlaku di sesi browser Anda."/>
<div className="flex gap-2 flex-wrap mb-3"><input className="inp flex-[2] min-w-[160px]" placeholder="Cari nama" aria-label="Cari" value={q} onChange={ev=>setQ(ev.target.value)}/>
<select className="inp flex-1 min-w-[120px]" aria-label="Filter status" value={fl} onChange={ev=>upd('status',ev.target.value)}>{['semua','hadir','tidak','belum'].map(o=><option key={o}>{o}</option>)}</select>
<select className="inp flex-1 min-w-[120px]" aria-label="Filter kategori" value={ct} onChange={ev=>upd('cat',ev.target.value)}>{['semua',...CATS].map(o=><option key={o}>{o}</option>)}</select>
<button className="btn" onClick={()=>setF({name:'',cat:CATS[0],max:2})}>Tambah tamu</button></div>
<div className="card hidden md:block overflow-x-auto"><table className="w-full text-left"><thead><tr className="text-sm text-mut">{['Nama','Kategori','Status','Pendamping',''].map(h=><th key={h} className="p-2 font-semibold">{h}</th>)}</tr></thead><tbody>
{v.map(g=><tr key={g.id} className="border-t border-bd"><td className="p-2">{g.name}</td><td className="p-2">{g.cat}</td><td className="p-2">{tg(g)}</td><td className="p-2">{g.cp}/{g.max}</td><td className="p-2">{ac(g)}</td></tr>)}</tbody></table></div>
<div className="grid gap-2.5 md:hidden">{v.map(g=><div key={g.id} className="card"><div className="flex justify-between gap-2 items-start"><b>{g.name}</b>{tg(g)}</div><div className="text-sm text-mut my-1.5">{g.cat}, pendamping {g.cp} dari maks. {g.max}</div>{ac(g)}</div>)}</div>
{r.length===0&&<p className="card">Tidak ada tamu yang cocok. Ubah kata kunci atau filter.</p>}{r.length>25&&<p className="text-mut mt-3">Menampilkan 25 dari {r.length} tamu. Persempit dengan pencarian.</p>}
<div className="mt-4"><NavLink to="/rsvp" className="btn btn-alt">Lanjut: coba RSVP</NavLink></div>
{dg&&<Modal><h3 className="font-bold text-lg">{dg.name}</h3><dl className="my-3 text-sm grid grid-cols-[110px_1fr] gap-y-1.5"><dt className="text-mut">Kategori</dt><dd>{dg.cat}</dd><dt className="text-mut">Status</dt><dd>{tg(dg)}</dd><dt className="text-mut">Pendamping</dt><dd>{dg.cp} dari maks. {dg.max}</dd><dt className="text-mut">Tautan contoh</dt><dd className="break-all">{link(dg)}</dd></dl>
<div className="flex gap-2 flex-wrap"><button className="btn btn-sm" onClick={()=>go(dg,'/rsvp')}>Lihat undangan</button><button className="btn btn-alt btn-sm" onClick={()=>go(dg,'/share')}>Pesan WhatsApp</button><button className="btn btn-ghost btn-sm" onClick={()=>copy(dg)}>Salin tautan</button><button className="btn btn-ghost btn-sm" onClick={()=>{setF({id:dg.id,name:dg.name,cat:dg.cat,max:dg.max});setDt(null)}}>Edit</button><button className="btn btn-ghost btn-sm" onClick={()=>setDt(null)}>Tutup</button></div></Modal>}
{f&&<Modal><h3 className="font-bold text-lg">{f.id?'Edit tamu':'Tambah tamu simulasi'}</h3><p className="text-mut">Gunakan nama contoh, bukan data pribadi asli.</p>
<label className="lbl" htmlFor="gn">Nama</label><input id="gn" className="inp" maxLength={40} value={f.name} onChange={ev=>setF({...f,name:ev.target.value})}/>
<label className="lbl" htmlFor="gc">Kategori</label><select id="gc" className="inp" value={f.cat} onChange={ev=>setF({...f,cat:ev.target.value})}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
<label className="lbl" htmlFor="gm">Batas pendamping</label><select id="gm" className="inp" value={f.max} onChange={ev=>setF({...f,max:+ev.target.value})}>{[0,1,2,3].map(i=><option key={i}>{i}</option>)}</select>
<div className="flex gap-2 mt-4"><button className="btn" onClick={save}>Simpan</button><button className="btn btn-ghost" onClick={()=>{setF(null);setErr('')}}>Batal</button></div>{err&&<p className="text-red-700 mt-2 font-semibold">✗ {err}</p>}</Modal>}{toast}</>}

function Rsvp(){const {s,set}=useDemo();const [sp]=useSearchParams();const id=+(sp.get('tamu')||0);useEffect(()=>{if(id&&id!==s.sel&&s.guests.some(g=>g.id===id))set(p=>({...p,sel:id}))},[id]);return<><H n={2} t="RSVP Simulator" s="Pilih tamu, buka undangan, lalu kirim konfirmasi. Dashboard ikut berubah."/><Preview/><p className="text-mut mt-3">Section RSVP ada di bagian bawah undangan — gulir di dalam preview.</p></>}

function Analytics(){const {s}=useDemo();const x=stats(s.guests);const m=Math.max(x.h,x.n,x.b,1);const mc=Math.max(...CATS.map(k=>x.c[k]?.t??0),1);
const B=(l:string,v:number,c:string,to:string,mx=m)=><NavLink key={l} to={to} className="flex items-center gap-2.5 my-2 hover:opacity-80"><span className="w-32 text-sm"><Lb t={l}/></span><div className="flex-1"><div className="grow h-6 rounded-md text-white text-xs flex items-center px-2 min-w-[30px]" style={{background:c,width:`${Math.max(8,v/mx*100)}%`}}>{v}</div></div></NavLink>;
return<><H n={3} t="Analitik RSVP" s="Klik batang untuk melihat tamu yang sesuai."/>
<div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]"><div className="card"><div className="text-4xl font-extrabold"><Num v={x.t}/></div><div className="text-sm text-mut">Total tamu</div></div><div className="card"><div className="text-4xl font-extrabold"><Num v={x.e}/></div><div className="text-sm text-mut">Estimasi orang hadir</div></div></div>
<div className="card mt-3.5"><b>Grafik RSVP</b>{B('✓ Hadir',x.h,'#1f8a5b','/guests?status=hadir')}{B('✗ Tidak hadir',x.n,'#b8433a','/guests?status=tidak')}{B('Belum',x.b,'#8a948f','/guests?status=belum')}</div>
<div className="card mt-3.5"><b>Kategori tamu (yang hadir)</b>{CATS.map(c=>B(`${c} (${x.c[c]?.t??0})`,x.c[c]?.h??0,'#001f59','/guests?cat='+c,mc))}</div>
<NavLink to="/dashboard" className="btn btn-alt mt-3.5">Kembali ke dashboard</NavLink></>}

function About({onReset}:{onReset:()=>void}){return<><H t="Tentang Demo" s="Demo interaktif dari Sumber Rejeki Tech."/><div className="card"><p className="mb-3">Semua data adalah contoh dan disimpan hanya di sessionStorage browser Anda. Tidak ada login, database, upload file, atau pengiriman pesan nyata. Undangan tidak dipublikasikan ke URL permanen.</p>
<div className="flex gap-2 flex-wrap"><a className="btn" href="https://sumberrejekitech.web.id" target="_blank" rel="noopener noreferrer">Konsultasi dengan kami</a><button className="btn btn-danger" onClick={onReset}>Reset Demo</button></div></div></>}

function Share(){const {s,set}=useDemo();const [toast,say]=useToast();const g=s.guests.find(x=>x.id===s.sel)||s.guests[0];
const d=new Date(s.ev.date);const ds=isNaN(+d)?'-':d.toLocaleString('id-ID',{dateStyle:'full',timeStyle:'short'});
const text=`Yth. Bapak/Ibu ${g.name},\n\nKami mengundang Anda ke ${s.ev.title}.\n${ds}\n${s.ev.place}\n\nBuka undangan (DEMO): ${location.origin}/rsvp?tamu=${g.id}`;
const copy=()=>{const c=navigator.clipboard;if(!c){say('Tidak bisa menyalin otomatis. Salin manual dari kotak pesan.',false);return}c.writeText(text).then(()=>say('Pesan disalin.'),()=>say('Tidak bisa menyalin pesan.',false))};
return<><H t="Pesan WhatsApp" s="Contoh pesan undangan untuk tamu. Tidak ada pengiriman otomatis atau massal."/>
<div className="card max-w-xl"><label className="lbl !mt-0" htmlFor="sg">Pilih tamu</label><select id="sg" className="inp" value={g.id} onChange={ev=>set(p=>({...p,sel:+ev.target.value}))}>{s.guests.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
<pre className="whitespace-pre-wrap font-ui bg-[#dcf8c6] rounded-xl p-3 mt-3 text-sm">{text}</pre>
<p className="text-sm text-mut mt-2">Tautan yang dibagikan adalah undangan demo, bukan undangan klien.</p>
<div className="flex gap-2 flex-wrap mt-3"><button className="btn" onClick={copy}>Copy Message</button><NavLink className="btn btn-ghost" to={`/rsvp?tamu=${g.id}`}>Lihat undangan tamu ini</NavLink><a className="btn btn-alt" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(text)}`}>Bagikan lewat WhatsApp</a></div></div>{toast}</>}

const GUIDE:Record<string,{n:number;t:string;d:string;next:string;to:string}>={
'/dashboard':{n:0,t:'Ringkasan demo',d:'Semua angka di sini berubah saat Anda mencoba fitur lain. Klik kartu untuk melihat tamunya.',next:'Mulai: sesuaikan undangan',to:'/editor'},
'/editor':{n:1,t:'Edit undangan',d:'Ubah judul, tanggal, warna, dan urutan section. Preview di sebelahnya langsung berubah.',next:'Lanjut: kelola tamu',to:'/guests'},
'/guests':{n:2,t:'Kelola tamu',d:'Cari atau filter tamu, buka Detail, lalu pilih "Lihat undangan" untuk melihat sapaan personal.',next:'Lanjut: coba RSVP',to:'/rsvp'},
'/rsvp':{n:3,t:'Coba RSVP sebagai tamu',d:'Klik "Buka Undangan", gulir ke bagian RSVP, pilih Hadir atau Tidak Hadir, lalu kirim.',next:'Lihat hasil di statistik',to:'/analytics'},
'/analytics':{n:4,t:'Lihat statistik',d:'Angka berubah sesuai RSVP Anda. Klik batang grafik untuk melihat tamu terkait.',next:'Selesai: ke dashboard',to:'/dashboard'}};
function Guide({path,done,go}:{path:string;done:boolean[];go:(to:string)=>void}){
const g=GUIDE[path];
const [open,setOpen]=useState(()=>{try{const v=sessionStorage.getItem('srt-guide');if(v!==null)return v==='1'}catch{}return !window.matchMedia('(max-height:480px)').matches});
const tog=(v:boolean)=>{setOpen(v);try{sessionStorage.setItem('srt-guide',v?'1':'0')}catch{}};
if(!g)return null;
if(!open)return<button className="no-print btn btn-sm fixed z-[55] right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg" onClick={()=>tog(true)}>Panduan</button>;
return<aside aria-label="Panduan demo" className="no-print pop fixed z-[55] left-3 right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:left-auto sm:w-[350px] bg-white border border-bd rounded-2xl shadow-xl p-4">
<div className="flex gap-1 mb-2">{done.map((d,i)=><span key={i} className={`h-1.5 flex-1 rounded-full ${d?'bg-green-500':i===g.n-1?'bg-ac':'bg-slate-200'}`}/>)}</div>
<p className="text-xs font-semibold text-mut">{g.n?`Langkah ${g.n} dari 4`:'Panduan'}</p><b className="block">{g.t}</b><p className="text-sm text-mut mt-0.5">{g.d}</p>
<div className="flex gap-2 mt-3"><button className="btn btn-sm" onClick={()=>go(g.to)}>{g.next}</button><button className="btn btn-ghost btn-sm" onClick={()=>tog(false)}>Sembunyikan</button></div></aside>}
function Num({v}:{v:number}){const [d,setD]=useState(0);const p=useRef(0);
useEffect(()=>{const from=p.current;if(from===v||window.matchMedia('(prefers-reduced-motion: reduce)').matches){p.current=v;setD(v);return}
let r=0;const t0=performance.now();const tick=(t:number)=>{const k=Math.min(1,(t-t0)/700),e=1-Math.pow(1-k,3),x=Math.round(from+(v-from)*e);setD(x);p.current=x;if(k<1)r=requestAnimationFrame(tick)};r=requestAnimationFrame(tick);return()=>cancelAnimationFrame(r)},[v]);
return<>{d}</>}
