import {createContext,useContext,useEffect,useState,ReactNode} from 'react';import {State,fresh} from './data';
const KEY='srt-demo-v1';
function load():State{try{const v=JSON.parse(sessionStorage.getItem(KEY)||'null');if(v&&v.ev&&v.guests)return{log:[],...v}}catch{}return fresh()}
interface Ctx{s:State;set:(f:(p:State)=>State)=>void;reset:()=>void;note:(m:string)=>void}
const C=createContext<Ctx>(null!);
export const useDemo=()=>useContext(C);
export function DemoProvider({children}:{children:ReactNode}){
const [s,setS]=useState<State>(load);
useEffect(()=>{try{sessionStorage.setItem(KEY,JSON.stringify(s))}catch{}},[s]);
return <C.Provider value={{s,set:setS,reset:()=>setS(fresh()),note:(m:string)=>setS(p=>({...p,log:[{t:Date.now(),m},...(p.log||[])].slice(0,8)}))}}>{children}</C.Provider>}
