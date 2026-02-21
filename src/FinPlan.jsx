import { useState, useEffect, useCallback, useRef } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

// ─── Theme & Constants ───
const COLORS = {
  bg: "#0A0A0F", bgCard: "#13131A", bgCardHover: "#1A1A24",
  border: "#1E1E2A", borderLight: "#2A2A3A",
  text: "#E8E8F0", textMuted: "#8888A0", textDim: "#55556A",
  accent: "#3B82F6", accentLight: "#60A5FA", accentDim: "#1E3A5F",
  green: "#22C55E", greenDim: "#0A3D1F", greenBg: "#0F2D1A",
  red: "#EF4444", redDim: "#3D0A0A", redBg: "#2D0F0F",
  orange: "#F59E0B", orangeDim: "#3D2A0A",
  purple: "#A855F7", purpleDim: "#2A0A3D",
  cyan: "#06B6D4", cyanDim: "#0A2A3D",
  white: "#FFFFFF",
};

const PIE_COLORS = ["#3B82F6","#22C55E","#F59E0B","#EF4444","#A855F7","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DEFAULT_EXPENSE_CATEGORIES = [
  "Home","House Rent","PG Rent","ICICI Mine","Axis","Jupiter","Rupay ICICI",
  "Other","LIC","Emma Matress","Trimmer","Income Tax","Photoshoot","Food","Transport","Shopping","Entertainment","Health","Education"
];
const INITIAL_CATEGORIES = DEFAULT_EXPENSE_CATEGORIES.map((name, i) => ({ id:`cat${i}`, name, visible:true }));

const SAVINGS_CATEGORIES = [
  "LIC","Quant ELSS Tax Saver","HDFC Mutual Fund","UTI Nifty Next 50 Index",
  "Quant Small Cap","Parag Parikh Flexi Cap","Motilal Oswal Midcap 150","UTI Nifty 200 Momentum 30","Saving RD"
];

// ─── Icons (inline SVG) ───
const Icons = {
  dashboard: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  expense: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  goal: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  tools: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  plus: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevDown: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevLeft: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevRight: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  bike: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 100-2 1 1 0 000 2zM12 17.5V14l-3-3 4-3 2 3h3"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  calc: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/><line x1="16" y1="18" x2="16" y2="18.01"/></svg>,
};

// ─── Historical Data from Excel ───
const INITIAL_HISTORICAL_DATA = [
  { month:"May 2024", salary:59320, reimbursement:5720, totalIncome:65040, expenses:{Home:20000,"PG Rent":9000,LIC:1000,"Quant MF":1000,"HDFC MF":1000,ICICI:4937.23,Axis:4968.19,"Axis Processing":494.94,Abhilash:1490,Saving:10000}, totalExpenses:53890.36, left:11149.64 },
  { month:"Jun 2024", salary:57920, reimbursement:10612, fdReturn:16101, totalIncome:84633, expenses:{Home:20000,"PG Rent":9000,LIC:1000,"Quant MF":1000,"HDFC MF":1000,ICICI:4926.29,Axis:1860.94,Jupiter:4410,"Saving RD":10000,Abhilash:1490}, totalExpenses:54687.23, left:29945.77 },
  { month:"Jul 2024", salary:58010, reimbursement:30995, totalIncome:99525, expenses:{Home:20000,"PG Rent":9000,ICICI:1876.08,Axis:20894.4,Jupiter:25699}, totalExpenses:90469.48, left:9055.52, savings:{LIC:1000,"Quant MF":1000,"HDFC MF":1000,"Saving RD":10000} },
  { month:"Aug 2024", salary:58010, reimbursement:25811, totalIncome:99821, expenses:{Home:20000,"PG Rent":9000,Jupiter:40019,Abhilash:9824}, totalExpenses:91777, left:8044, savings:{LIC:934,"Quant MF":500,"HDFC MF":1500,"Saving RD":10000} },
  { month:"Sep 2024", salary:60368, reimbursement:16299.20, totalIncome:78320.79, expenses:{Home:20000,"PG Rent":9000,ICICI:1868.07,Axis:7649.27,Jupiter:20541.09}, totalExpenses:71992.43, left:6328.36, savings:{LIC:934,"Quant MF":500,"HDFC MF":1500,"Saving RD":10000} },
  { month:"Oct 2024", salary:60368, totalIncome:60368, expenses:{Home:20000,"PG Rent":9000,ICICI:3071.52,Axis:10810.21,Jupiter:1887}, totalExpenses:57702.73, left:2665.27, savings:{LIC:934,"Quant MF":500,"HDFC MF":1500,"Saving RD":10000} },
  { month:"Nov 2024", salary:60368, reimbursement:5574, totalIncome:66198.03, expenses:{Home:20000,"PG Rent":9000,ICICI:970.99,Axis:7166.64,Jupiter:4285.67,"Rupay ICICI":2}, totalExpenses:56859.30, left:9338.73, savings:{LIC:934,"Quant ELSS":500,"HDFC Sensex":1500,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"Saving RD":10000} },
  { month:"Dec 2024", salary:60369, reimbursement:909, totalIncome:62031, expenses:{Home:20000,"PG Rent":9000,ICICI:969.19,Axis:6723.33,"Rupay ICICI":1744.19}, totalExpenses:54370.71, left:7660.29, savings:{LIC:934,"Quant ELSS":500,"UTI Next50":1000,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"UTI Momentum":1000,"Saving RD":10000} },
  { month:"Jan 2025", salary:60369, reimbursement:10336.88, totalIncome:75263.48, expenses:{Home:20000,"PG Rent":9000,ICICI:967.37,Axis:6788.56,Jupiter:13260.92,"Rupay ICICI":2956.4}, totalExpenses:68907.25, left:6356.23, savings:{LIC:934,"Quant ELSS":500,"UTI Next50":1000,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"UTI Momentum":1000,"Saving RD":10000} },
  { month:"Feb 2025", salary:60369, reimbursement:16774, totalIncome:77143, expenses:{Home:20000,"PG Rent":9000,ICICI:965.53,Axis:10501.24,Jupiter:1249.45,"Rupay ICICI":1506.36,Other:15527}, totalExpenses:74683.58, left:2459.42, savings:{LIC:934,"Quant ELSS":500,"UTI Next50":1000,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"UTI Momentum":1000,"Saving RD":10000} },
  { month:"Mar 2025", salary:60368, totalIncome:61615.45, expenses:{Home:20000,"PG Rent":4500,ICICI:963.66,Axis:7043.31,Jupiter:619.2,"Rupay ICICI":1912.47}, totalExpenses:50972.64, left:10642.81, savings:{LIC:934,"Quant ELSS":500,"UTI Next50":1000,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"UTI Momentum":1000,"Saving RD":10000} },
  { month:"Apr 2025", salary:60369, totalIncome:62204.49, expenses:{Home:20000,"PG Rent":3000,ICICI:961.77,Axis:234.82,Jupiter:4890.9,"Rupay ICICI":2099.25}, totalExpenses:47120.74, left:15083.75, savings:{LIC:934,"Quant ELSS":500,"UTI Next50":1000,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"UTI Momentum":1000,"Saving RD":10000} },
  { month:"May 2025", salary:74684, totalIncome:77295.07, expenses:{Home:20000,"PG Rent":14000,ICICI:959.86,Axis:2294.12,Jupiter:3462.42,"Rupay ICICI":2235.51,Other:12235.06}, totalExpenses:71120.97, left:6174.10, savings:{LIC:934,"Quant ELSS":500,"UTI Next50":1000,"Quant Small Cap":1000,"Parag Parikh":1000,"Motilal Midcap":500,"UTI Momentum":1000,"Saving RD":10000} },
  { month:"Jun 2025", salary:74684, totalIncome:74684, expenses:{Home:29000,"PG Rent":9000,ICICI:957.91,Axis:1498.75,"Rupay ICICI":1490.075}, totalExpenses:52880.74, left:21803.27, savings:{LIC:934,"Saving RD":10000} },
  { month:"Jul 2025", salary:74684, reimbursement:7551, totalIncome:82756, expenses:{Home:25000,"PG Rent":9000,ICICI:955.94,Axis:1670.34,Jupiter:6310.65,"Rupay ICICI":1655.44,Rohan:800,"Kiran Sir":5000,Shilpa:3420}, totalExpenses:64746.37, left:18009.63, savings:{LIC:934,"Saving RD":10000} },
  { month:"Aug 2025", salary:74684, totalIncome:81085.15, expenses:{Home:25000,"PG Rent":9000,ICICI:953.95,Axis:5810.94,Jupiter:13410.44,"Rupay ICICI":5449.74}, totalExpenses:59625.07, left:10526.08, savings:{LIC:934,"Saving RD":10000} },
  { month:"Sep 2025", salary:105334, reimbursement:430, totalIncome:128295.02, expenses:{Home:25000,"PG Rent":9000,ICICI:951.93,Axis:26675.36,Jupiter:11282.4,"Rupay ICICI":2325.8,"Income Tax":9330}, totalExpenses:95499.49, left:7795.53, savings:{LIC:934,"Saving RD":10000} },
  { month:"Oct 2025", salary:105411, reimbursement:3272, fdReturn:26764, totalIncome:153517.67, expenses:{Home:20000,"PG Rent":9000,ICICI:949.88,Axis:1228.11,Jupiter:4926.78,"Rupay ICICI":3527.41,"Income Tax":1000,"Emma Matress":1280,Photoshoot:23000}, totalExpenses:75846.18, left:77671.49, savings:{LIC:934,"Saving RD":10000} },
  { month:"Nov 2025", salary:80334, fdReturn:190552, totalIncome:285794.31, expenses:{Home:220000,"PG Rent":9000,ICICI:947.8,Axis:3257.28,Jupiter:5315.22,"Rupay ICICI":1473.96,Trimmer:840,"Emma Matress":1280}, totalExpenses:243048.26, left:42746.05, savings:{LIC:934} },
  { month:"Dec 2025", salary:80334, totalIncome:81391, expenses:{Home:20000,"PG Rent":9000,ICICI:947.8,Axis:3713.17,Jupiter:2682,Trimmer:840,"Emma Matress":1280}, totalExpenses:39396.97, left:41994.03, savings:{LIC:934} },
  { month:"Jan 2026", salary:80334, totalIncome:80512.50, expenses:{"House Rent":14000,ICICI:943.57,Axis:3705.39,Jupiter:18565.53,"Emma Matress":1280,"House Advance":28000}, totalExpenses:67428.49, left:13084.01, savings:{LIC:934} },
  { month:"Feb 2026", salary:80334, totalIncome:95334, expenses:{Home:20000,"House Rent":14000,ICICI:11003.83,Jupiter:9388.24}, totalExpenses:55326.07, left:40007.93, savings:{LIC:934} },
  { month:"Mar 2026", salary:80334, reimbursement:2820.5, totalIncome:93154.50, expenses:{Home:17500,"House Rent":14000,ICICI:9687.37,Axis:5000,Jupiter:5674,Bujji:2000}, totalExpenses:84795.37, left:8359.13, savings:{LIC:934,"Savings RD":30000} },
];

const INITIAL_GOALS = [
  { id: "bike", name: "Bike Purchase", icon: "bike", target: 120640, saved: 85000, color: COLORS.accent, sources: ["ICICI RD: ₹30,000","Jupiter RD: ₹5,000","Feb Salary: ₹20,000","Bujji: ₹30,000"] },
];

const INITIAL_FD_DATA = [
  { id:"fd1", bank:"KPSSN", amount:61421, maturity:"19 Jan 2025", status:"matured" },
  { id:"fd2", bank:"KPSSN", amount:50347, maturity:"25 Feb 2025", status:"matured" },
  { id:"fd3", bank:"SVPSSN", amount:14896, maturity:"18 Mar 2025", status:"matured" },
  { id:"fd4", bank:"Swami Vivekananda", amount:13543, maturity:"24 May 2025", status:"matured" },
  { id:"fd5", bank:"KPSSN", amount:62433, maturity:"13 Jun 2025", status:"matured" },
  { id:"fd6", bank:"KPSSN", amount:12100, maturity:"30 Jun 2025", status:"matured" },
  { id:"fd7", bank:"KPSSN", amount:225000, maturity:"19 Jul 2025", status:"matured" },
  { id:"fd8", bank:"Jupiter", amount:16605, maturity:"23 Jul 2025", status:"received" },
  { id:"fd9", bank:"Jupiter", amount:5536, maturity:"13 Aug 2025", status:"matured" },
  { id:"fd10", bank:"KPSSN", amount:121000, maturity:"13 Sep 2025", status:"matured" },
  { id:"fd11", bank:"ICICI", amount:27332, maturity:"24 Sep 2025", status:"matured" },
  { id:"fd12", bank:"ICICI", amount:190552, maturity:"1 Nov 2025", status:"matured" },
  { id:"fd13", bank:"SVPSSN", amount:67758, maturity:"16 Nov 2025", status:"matured" },
  { id:"fd14", bank:"SVPSSN", amount:13543, maturity:"18 Nov 2025", status:"matured" },
];

const INITIAL_MF_DATA = [
  { id:"mf1", name:"Quant ELSS Tax Saver", amount:13000, color:"#3B82F6" },
  { id:"mf2", name:"Parag Parikh Flexi Cap", amount:6000, color:"#22C55E" },
  { id:"mf3", name:"UTI Nifty Next 50 Index", amount:6000, color:"#F59E0B" },
  { id:"mf4", name:"UTI Nifty 200 Momentum 30", amount:6000, color:"#A855F7" },
  { id:"mf5", name:"Quant Small Cap", amount:6000, color:"#EF4444" },
  { id:"mf6", name:"Motilal Oswal Midcap 150", amount:3000, color:"#06B6D4" },
];

// ─── Helpers ───
const fmt = (n) => {
  if (n === undefined || n === null) return "₹0";
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n/1000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};
const fmtFull = (n) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

// ─── Storage Helpers (localStorage) ───
const loadData = async (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};
const saveData = async (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.error(e); }
};

// ─── Components ───
const Card = ({ children, style, onClick, className="" }) => (
  <div onClick={onClick} className={className} style={{
    background: COLORS.bgCard, borderRadius: 16, border: `1px solid ${COLORS.border}`,
    padding: "16px 18px", ...style,
    ...(onClick ? { cursor: "pointer" } : {}),
    transition: "all 0.2s ease",
  }}>{children}</div>
);

const ProgressBar = ({ value, max, color = COLORS.accent, height = 8 }) => (
  <div style={{ background: COLORS.border, borderRadius: height/2, height, width: "100%", overflow: "hidden" }}>
    <div style={{ background: color, height: "100%", width: `${Math.min(pct(value,max),100)}%`, borderRadius: height/2, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }}/>
  </div>
);

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{ background: color+"20", color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.3 }}>{children}</span>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <div style={{
        position:"relative", background:COLORS.bg, borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480,
        maxHeight:"85vh", overflow:"auto", border:`1px solid ${COLORS.border}`, borderBottom:"none",
        animation:"slideUp 0.3s ease", padding: "0 0 24px",
      }}>
        <div style={{ padding:"20px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center",
          position:"sticky", top:0, background:COLORS.bg, zIndex:1, borderBottom:`1px solid ${COLORS.border}` }}>
          <h3 style={{ color:COLORS.text, fontSize:17, fontWeight:600, margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.close}</button>
        </div>
        <div style={{ padding:"16px 20px 0" }}>{children}</div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type="text", placeholder, prefix, suffix }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display:"block", fontSize:12, color:COLORS.textMuted, marginBottom:6, fontWeight:500 }}>{label}</label>}
    <div style={{ display:"flex", alignItems:"center", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"0 12px", height:44 }}>
      {prefix && <span style={{ color:COLORS.textMuted, fontSize:14, marginRight:6 }}>{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ flex:1, background:"none", border:"none", color:COLORS.text, fontSize:14, outline:"none", height:"100%", fontFamily:"inherit" }}/>
      {suffix && <span style={{ color:COLORS.textMuted, fontSize:12, marginLeft:6 }}>{suffix}</span>}
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display:"block", fontSize:12, color:COLORS.textMuted, marginBottom:6, fontWeight:500 }}>{label}</label>}
    <div style={{ position:"relative" }}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"10px 36px 10px 12px",
          color:COLORS.text, fontSize:14, outline:"none", appearance:"none", cursor:"pointer", fontFamily:"inherit" }}>
        {options.map(o => <option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value}>{typeof o==="string"?o:o.label}</option>)}
      </select>
      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:COLORS.textMuted, pointerEvents:"none" }}>{Icons.chevDown}</span>
    </div>
  </div>
);

const Button = ({ children, onClick, variant="primary", full, style:s, disabled }) => {
  const styles = {
    primary: { background:COLORS.accent, color:"#fff" },
    secondary: { background:COLORS.bgCard, color:COLORS.text, border:`1px solid ${COLORS.border}` },
    danger: { background:COLORS.redBg, color:COLORS.red, border:`1px solid ${COLORS.red}30` },
    ghost: { background:"transparent", color:COLORS.textMuted },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], border:styles[variant].border||"none", borderRadius:12, padding:"11px 20px",
      fontSize:14, fontWeight:600, cursor: disabled?"not-allowed":"pointer", fontFamily:"inherit",
      width:full?"100%":"auto", opacity:disabled?0.5:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      transition:"all 0.15s ease", ...s,
    }}>{children}</button>
  );
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ textAlign:"center", padding:"40px 20px" }}>
    <div style={{ fontSize:40, marginBottom:12, opacity:0.3 }}>{icon}</div>
    <p style={{ color:COLORS.text, fontSize:15, fontWeight:500, margin:"0 0 4px" }}>{title}</p>
    <p style={{ color:COLORS.textMuted, fontSize:13, margin:0 }}>{subtitle}</p>
  </div>
);

// ─── Dashboard Tab ───
const DashboardTab = ({ currentMonth, setCurrentMonth, expenses, goals, monthlyData, setMonthlyData }) => {
  const hist = monthlyData;
  const mi = currentMonth;
  const data = hist[mi] || hist[hist.length - 1] || { month:"No Data", salary:0, income:{}, totalIncome:0, expenses:{}, totalExpenses:0, left:0, savings:{} };
  const [showAddMonth, setShowAddMonth] = useState(false);
  const [showEditMonth, setShowEditMonth] = useState(false);
  const [showDeleteMonthConfirm, setShowDeleteMonthConfirm] = useState(false);

  const nextMonthLabel = () => {
    if (hist.length === 0) return "Jan 2024";
    const last = hist[hist.length - 1].month;
    const [mName, yr] = last.split(" ");
    const mIdx = MONTHS.indexOf(mName.slice(0,3));
    if (mIdx === 11) return `Jan ${parseInt(yr)+1}`;
    return `${MONTHS[mIdx+1]} ${yr}`;
  };

  const blankMonth = (label) => ({
    month: label, income:{}, totalIncome:0,
    expenses:{}, totalExpenses:0, left:0, savings:{},
  });

  const [mForm, setMForm] = useState(() => blankMonth(nextMonthLabel()));

  const resetMForm = (label) => setMForm(blankMonth(label || nextMonthLabel()));

  // Dynamic rows for form - each row gets a stable id to prevent focus loss
  const [formIncRows, setFormIncRows] = useState([{ id:"r1", name:"Salary", amount:"" }]);
  const [formExpRows, setFormExpRows] = useState([{ id:"r1", name:"Home", amount:"" }]);
  const [formSavRows, setFormSavRows] = useState([{ id:"r1", name:"LIC", amount:"" }]);

  const openAddMonth = () => {
    const label = nextMonthLabel();
    setMForm({ month:label });
    setFormIncRows([
      { id:uid(), name:"Salary", amount:"" },{ id:uid(), name:"Reimbursement", amount:"" },{ id:uid(), name:"FD Return", amount:"" },
    ]);
    setFormExpRows([
      { id:uid(), name:"Home", amount:"" },{ id:uid(), name:"House Rent", amount:"" },{ id:uid(), name:"ICICI Mine", amount:"" },
      { id:uid(), name:"Axis", amount:"" },{ id:uid(), name:"Jupiter", amount:"" },{ id:uid(), name:"Rupay ICICI", amount:"" },
    ]);
    setFormSavRows([
      { id:uid(), name:"LIC", amount:"" },{ id:uid(), name:"Saving RD", amount:"" },
    ]);
    setShowAddMonth(true);
  };

  const openEditMonth = () => {
    const d = data;
    setMForm({ month:d.month });
    // Build income rows from existing data
    const incRows = [];
    if (d.income && typeof d.income === "object") {
      Object.entries(d.income).forEach(([name, amount]) => incRows.push({ id:uid(), name, amount:String(amount) }));
    } else {
      // Legacy format: extract from individual fields
      if (d.salary) incRows.push({ id:uid(), name:"Salary", amount:String(d.salary) });
      if (d.reimbursement) incRows.push({ id:uid(), name:"Reimbursement", amount:String(d.reimbursement) });
      if (d.fdReturn) incRows.push({ id:uid(), name:"FD Return", amount:String(d.fdReturn) });
      if (d.otherIncome) incRows.push({ id:uid(), name:"Other Income", amount:String(d.otherIncome) });
    }
    if (incRows.length === 0) incRows.push({ id:uid(), name:"Salary", amount:"" });
    setFormIncRows(incRows);
    const expRows = Object.entries(d.expenses||{}).map(([name, amount]) => ({ id:uid(), name, amount:String(amount) }));
    if (expRows.length === 0) expRows.push({ id:uid(), name:"", amount:"" });
    setFormExpRows(expRows);
    const savRows = Object.entries(d.savings||{}).map(([name, amount]) => ({ id:uid(), name, amount:String(amount) }));
    if (savRows.length === 0) savRows.push({ id:uid(), name:"", amount:"" });
    setFormSavRows(savRows);
    setShowEditMonth(true);
  };

  const buildMonthData = () => {
    const incObj = {};
    formIncRows.forEach(r => { if (r.name && r.amount) incObj[r.name] = parseFloat(r.amount); });
    const totalIncome = Object.values(incObj).reduce((s,v)=>s+v, 0);
    const salary = incObj["Salary"] || 0;
    const expObj = {};
    formExpRows.forEach(r => { if (r.name && r.amount) expObj[r.name] = parseFloat(r.amount); });
    const savObj = {};
    formSavRows.forEach(r => { if (r.name && r.amount) savObj[r.name] = parseFloat(r.amount); });
    const totalExpenses = Object.values(expObj).reduce((s,v)=>s+v, 0) + Object.values(savObj).reduce((s,v)=>s+v, 0);
    const left = totalIncome - totalExpenses;
    return { month:mForm.month, salary, income:incObj, totalIncome, expenses:expObj, savings:savObj, totalExpenses, left };
  };

  const saveNewMonth = () => {
    const newMonth = buildMonthData();
    if (!newMonth.month || newMonth.totalIncome === 0) return;
    setMonthlyData(prev => [...prev, newMonth]);
    setShowAddMonth(false);
    setTimeout(() => setCurrentMonth(hist.length), 50);
  };

  const saveEditedMonth = () => {
    const updated = buildMonthData();
    setMonthlyData(prev => prev.map((m, i) => i === mi ? updated : m));
    setShowEditMonth(false);
  };

  const deleteMonth = () => {
    setMonthlyData(prev => prev.filter((_, i) => i !== mi));
    setCurrentMonth(Math.max(0, mi - 1));
    setShowDeleteMonthConfirm(false);
    setShowEditMonth(false);
  };

  // Shared form UI for add/edit
  const renderMonthForm = (isEdit) => (
    <div>
      {!isEdit && <Input label="Month Label" value={mForm.month} onChange={v=>setMForm(f=>({...f,month:v}))} placeholder="e.g. Apr 2026"/>}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4, marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:600, color:COLORS.accentLight }}>Income</span>
        <button onClick={()=>setFormIncRows(r=>[...r,{id:uid(),name:"",amount:""}])} style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"4px 10px", color:COLORS.accentLight, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>+ Row</button>
      </div>
      {formIncRows.map((row) => (
        <div key={row.id} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <input value={row.name} onChange={e=>setFormIncRows(r=>r.map(rr=>rr.id===row.id?{...rr,name:e.target.value}:rr))}
              placeholder="Source (e.g. Salary)" style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <div style={{ width:110 }}>
            <input type="number" value={row.amount} onChange={e=>setFormIncRows(r=>r.map(rr=>rr.id===row.id?{...rr,amount:e.target.value}:rr))}
              placeholder="₹ Amount" style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <button onClick={()=>setFormIncRows(r=>r.filter(rr=>rr.id!==row.id))} disabled={formIncRows.length<=1}
            style={{ background:"none", border:"none", color:formIncRows.length<=1?COLORS.border:COLORS.textDim, cursor:formIncRows.length<=1?"default":"pointer", padding:2, flexShrink:0 }}>{Icons.trash}</button>
        </div>
      ))}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:600, color:COLORS.red }}>Expenses</span>
        <button onClick={()=>setFormExpRows(r=>[...r,{id:uid(),name:"",amount:""}])} style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"4px 10px", color:COLORS.accentLight, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>+ Row</button>
      </div>
      {formExpRows.map((row) => (
        <div key={row.id} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <input value={row.name} onChange={e=>setFormExpRows(r=>r.map(rr=>rr.id===row.id?{...rr,name:e.target.value}:rr))}
              placeholder="Category" style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <div style={{ width:110 }}>
            <input type="number" value={row.amount} onChange={e=>setFormExpRows(r=>r.map(rr=>rr.id===row.id?{...rr,amount:e.target.value}:rr))}
              placeholder="₹ Amount" style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <button onClick={()=>setFormExpRows(r=>r.filter(rr=>rr.id!==row.id))} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", padding:2, flexShrink:0 }}>{Icons.trash}</button>
        </div>
      ))}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:600, color:COLORS.green }}>Savings & Investments</span>
        <button onClick={()=>setFormSavRows(r=>[...r,{id:uid(),name:"",amount:""}])} style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"4px 10px", color:COLORS.accentLight, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>+ Row</button>
      </div>
      {formSavRows.map((row) => (
        <div key={row.id} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <input value={row.name} onChange={e=>setFormSavRows(r=>r.map(rr=>rr.id===row.id?{...rr,name:e.target.value}:rr))}
              placeholder="Fund / RD" style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <div style={{ width:110 }}>
            <input type="number" value={row.amount} onChange={e=>setFormSavRows(r=>r.map(rr=>rr.id===row.id?{...rr,amount:e.target.value}:rr))}
              placeholder="₹ Amount" style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <button onClick={()=>setFormSavRows(r=>r.filter(rr=>rr.id!==row.id))} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", padding:2, flexShrink:0 }}>{Icons.trash}</button>
        </div>
      ))}

      {/* Preview */}
      {(formIncRows.some(r=>r.amount) || formExpRows.some(r=>r.amount)) && (() => {
        const preview = buildMonthData();
        return (
          <Card style={{ marginTop:12, background:COLORS.bg, border:`1px solid ${COLORS.border}` }}>
            <div style={{ fontSize:11, fontWeight:600, color:COLORS.textMuted, marginBottom:6 }}>PREVIEW</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, fontSize:12 }}>
              <div><span style={{ color:COLORS.textMuted }}>Income</span><br/><span style={{ color:COLORS.accentLight, fontWeight:700 }}>{fmtFull(preview.totalIncome)}</span></div>
              <div><span style={{ color:COLORS.textMuted }}>Expenses</span><br/><span style={{ color:COLORS.red, fontWeight:700 }}>{fmtFull(preview.totalExpenses)}</span></div>
              <div><span style={{ color:COLORS.textMuted }}>Left</span><br/><span style={{ color:preview.left>=0?COLORS.green:COLORS.red, fontWeight:700 }}>{fmtFull(preview.left)}</span></div>
            </div>
          </Card>
        );
      })()}
    </div>
  );

  // ─── Dynamic Calculations ───
  // For new months (with income obj): compute everything fresh
  // For legacy months (from Excel): use stored totalIncome & left, derive expenses to balance
  const isNewFormat = (d) => d.income && typeof d.income === "object" && Object.keys(d.income).length > 0;

  const calcIncome = (d) => {
    if (isNewFormat(d)) return Object.values(d.income).reduce((s,v) => s + (parseFloat(v)||0), 0);
    return d.totalIncome || ((d.salary||0) + (d.reimbursement||0) + (d.fdReturn||0) + (d.otherIncome||0));
  };
  const calcSavings = (d) => d.savings ? Object.values(d.savings).reduce((s,v) => s + (parseFloat(v)||0), 0) : 0;
  const calcExpenses = (d) => {
    if (isNewFormat(d)) return d.expenses ? Object.values(d.expenses).reduce((s,v) => s + (parseFloat(v)||0), 0) : 0;
    // Legacy: back-calculate so Income = Expenses + Investments + Left always balances
    const inc = calcIncome(d);
    const sav = calcSavings(d);
    const left = (d.left !== undefined) ? d.left : 0;
    return inc - sav - left;
  };
  const calcLeft = (d) => {
    if (isNewFormat(d)) return calcIncome(d) - (d.expenses ? Object.values(d.expenses).reduce((s,v) => s+(parseFloat(v)||0), 0) : 0) - calcSavings(d);
    return (d.left !== undefined) ? d.left : (calcIncome(d) - calcExpenses(d) - calcSavings(d));
  };
  const calcSalary = (d) => {
    if (isNewFormat(d) && d.income["Salary"]) return d.income["Salary"];
    return d.salary || 0;
  };

  const cIncome = calcIncome(data);
  const cExpenses = calcExpenses(data);
  const cSavings = calcSavings(data);
  const cLeft = calcLeft(data);

  const salaryTrend = hist.slice(Math.max(0, hist.length - 12)).map(h => ({
    name: h.month.split(" ")[0].slice(0,3),
    income: calcIncome(h),
    expenses: calcExpenses(h) + calcSavings(h),
    saved: calcLeft(h),
  }));

  const expEntries = data.expenses ? Object.entries(data.expenses).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]) : [];

  const userExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    const mStr = data.month;
    const [mName, yr] = mStr.split(" ");
    const mIdx = MONTHS.indexOf(mName.slice(0,3));
    return d.getMonth() === mIdx && d.getFullYear() === parseInt(yr);
  });
  const userExpTotal = userExpenses.reduce((s,e) => s + (e.amount||0), 0);

  if (hist.length === 0) return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>👋</div>
      <div style={{ fontSize:20, fontWeight:700, color:COLORS.text, marginBottom:8 }}>Welcome to FinPlan!</div>
      <div style={{ fontSize:13, color:COLORS.textMuted, marginBottom:24, lineHeight:1.5 }}>Start by adding your first month's budget data. Track income, expenses, and savings all in one place.</div>
      <Button onClick={openAddMonth} full style={{ padding:"14px 0" }}>{Icons.plus} Add Your First Month</Button>
      <Modal open={showAddMonth} onClose={()=>setShowAddMonth(false)} title={`Add ${mForm.month || "New Month"}`}>
        {renderMonthForm(false)}
        <div style={{ marginTop:8 }}>
          <Button onClick={saveNewMonth} full disabled={!formIncRows.some(r=>r.amount)}>Add Month</Button>
        </div>
      </Modal>
    </div>
  );

  return (
    <div>
      {/* Month Selector */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <button onClick={()=>setCurrentMonth(Math.max(0,mi-1))} disabled={mi===0}
          style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:mi===0?COLORS.textDim:COLORS.text, cursor:mi===0?"default":"pointer" }}>
          {Icons.chevLeft}
        </button>
        <div style={{ textAlign:"center", flex:1 }}>
          <div style={{ fontSize:18, fontWeight:700, color:COLORS.text, letterSpacing:-0.3 }}>{data.month}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:4 }}>
            <button onClick={openEditMonth} style={{ background:"none", border:"none", color:COLORS.accentLight, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
              {Icons.edit} Edit
            </button>
            <button onClick={openAddMonth} style={{ background:"none", border:"none", color:COLORS.green, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
              {Icons.plus} New Month
            </button>
          </div>
        </div>
        <button onClick={()=>setCurrentMonth(Math.min(hist.length-1,mi+1))} disabled={mi===hist.length-1}
          style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:mi===hist.length-1?COLORS.textDim:COLORS.text, cursor:mi===hist.length-1?"default":"pointer" }}>
          {Icons.chevRight}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <Card style={{ background:`linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.bgCard})` }}>
          <div style={{ fontSize:11, color:COLORS.accentLight, fontWeight:500, marginBottom:4 }}>INCOME</div>
          <div style={{ fontSize:20, fontWeight:700, color:COLORS.white, letterSpacing:-0.5 }}>{fmt(cIncome)}</div>
          <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:2 }}>Salary: {fmt(calcSalary(data))}</div>
        </Card>
        <Card style={{ background:`linear-gradient(135deg, ${COLORS.redDim}, ${COLORS.bgCard})` }}>
          <div style={{ fontSize:11, color:COLORS.red, fontWeight:500, marginBottom:4 }}>EXPENSES</div>
          <div style={{ fontSize:20, fontWeight:700, color:COLORS.white, letterSpacing:-0.5 }}>{fmt(cExpenses)}</div>
          <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:2 }}>{pct(cExpenses, cIncome)}% of income</div>
        </Card>
        <Card style={{ background:`linear-gradient(135deg, ${COLORS.greenDim}, ${COLORS.bgCard})` }}>
          <div style={{ fontSize:11, color:COLORS.green, fontWeight:500, marginBottom:4 }}>LEFT OVER</div>
          <div style={{ fontSize:20, fontWeight:700, color:cLeft>=0?COLORS.green:COLORS.red, letterSpacing:-0.5 }}>{fmt(cLeft)}</div>
          <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:2 }}>{pct(Math.max(0,cLeft), cIncome)}% saved</div>
        </Card>
        <Card style={{ background:`linear-gradient(135deg, ${COLORS.purpleDim}, ${COLORS.bgCard})` }}>
          <div style={{ fontSize:11, color:COLORS.purple, fontWeight:500, marginBottom:4 }}>INVESTMENTS</div>
          <div style={{ fontSize:20, fontWeight:700, color:COLORS.white, letterSpacing:-0.5 }}>{fmt(cSavings)}</div>
          <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:2 }}>{pct(cSavings, cIncome)}% of income</div>
        </Card>
      </div>

      {/* Spending Breakdown Pie */}
      {(expEntries.length > 0 || cSavings > 0) && (
        <Card style={{ marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:600, color:COLORS.text, marginBottom:12 }}>Full Breakdown</div>
          {(() => {
            const savEntries = data.savings ? Object.entries(data.savings).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]) : [];
            const allEntries = [...expEntries.map(([n,v])=>({name:n,value:v,type:"exp"})), ...savEntries.map(([n,v])=>({name:n,value:v,type:"sav"}))];
            const allPie = allEntries.slice(0, 10).map(item => ({ name: item.name.length > 14 ? item.name.slice(0,14)+"…" : item.name, value: item.value, type: item.type }));
            if (allEntries.length > 10) allPie.push({ name:"Others", value:allEntries.slice(10).reduce((s,i)=>s+i.value,0), type:"exp" });
            return (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:140, height:140, flexShrink:0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={allPie} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={2} strokeWidth={0}>
                        {allPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex:1, fontSize:11 }}>
                  {allPie.map((item, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <div style={{ width:8, height:8, borderRadius:2, background:PIE_COLORS[i%PIE_COLORS.length], flexShrink:0 }}/>
                      <span style={{ color:COLORS.textMuted, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {item.name} {item.type==="sav" ? <span style={{color:COLORS.green, fontSize:9}}>INV</span> : ""}
                      </span>
                      <span style={{ color:COLORS.text, fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{fmt(item.value)}</span>
                    </div>
                  ))}
                  {/* Totals */}
                  <div style={{ borderTop:`1px solid ${COLORS.border}`, marginTop:6, paddingTop:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", color:COLORS.red, fontWeight:600 }}>
                      <span>Expenses</span><span>{fmt(cExpenses)}</span>
                    </div>
                    {cSavings > 0 && <div style={{ display:"flex", justifyContent:"space-between", color:COLORS.green, fontWeight:600 }}>
                      <span>Investments</span><span>{fmt(cSavings)}</span>
                    </div>}
                    <div style={{ display:"flex", justifyContent:"space-between", color:COLORS.accentLight, fontWeight:700, marginTop:2 }}>
                      <span>Total Out</span><span>{fmt(cExpenses + cSavings)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Salary vs Expenses Trend */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, color:COLORS.text, marginBottom:12 }}>Income vs Expenses Trend</div>
        <div style={{ height:180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryTrend} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:COLORS.textMuted, fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:COLORS.textMuted, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?(v/1000)+"K":""}/>
              <Tooltip contentStyle={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, fontSize:12, color:COLORS.text }}
                formatter={(v) => [fmtFull(v)]} labelStyle={{ color:COLORS.textMuted }}/>
              <Bar dataKey="income" fill={COLORS.accent} radius={[4,4,0,0]} barSize={12} name="Income"/>
              <Bar dataKey="expenses" fill={COLORS.red+"99" } radius={[4,4,0,0]} barSize={12} name="Expenses"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Savings Trend Line */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, color:COLORS.text, marginBottom:12 }}>Savings Trend</div>
        <div style={{ height:160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salaryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:COLORS.textMuted, fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:COLORS.textMuted, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?(v/1000)+"K":""}/>
              <Tooltip contentStyle={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, fontSize:12, color:COLORS.text }}
                formatter={(v) => [fmtFull(v)]} labelStyle={{ color:COLORS.textMuted }}/>
              <Line type="monotone" dataKey="saved" stroke={COLORS.green} strokeWidth={2.5} dot={{ fill:COLORS.green, r:3 }} name="Saved"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats */}
      {userExpenses.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontSize:14, fontWeight:600, color:COLORS.text, marginBottom:8 }}>Quick-Added This Month</div>
          <div style={{ fontSize:11, color:COLORS.textMuted, marginBottom:12 }}>{userExpenses.length} entries · Total: {fmtFull(userExpTotal)}</div>
          {userExpenses.slice(0,5).map(e => (
            <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${COLORS.border}10` }}>
              <div>
                <span style={{ color:COLORS.text, fontSize:13 }}>{e.description}</span>
                <span style={{ color:COLORS.textDim, fontSize:11, marginLeft:8 }}>{e.category}</span>
              </div>
              <span style={{ color:COLORS.red, fontSize:13, fontWeight:600 }}>{fmtFull(e.amount)}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Add Month Modal */}
      <Modal open={showAddMonth} onClose={()=>setShowAddMonth(false)} title={`Add ${mForm.month || "New Month"}`}>
        {renderMonthForm(false)}
        <div style={{ marginTop:12 }}>
          <Button onClick={saveNewMonth} full disabled={!formIncRows.some(r=>r.amount)}>Add Month</Button>
        </div>
      </Modal>

      {/* Edit Month Modal */}
      <Modal open={showEditMonth} onClose={()=>{setShowEditMonth(false);setShowDeleteMonthConfirm(false);}} title={`Edit ${data.month}`}>
        {renderMonthForm(true)}
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          {!showDeleteMonthConfirm ? (
            <Button variant="danger" onClick={()=>setShowDeleteMonthConfirm(true)} style={{ flex:0 }}>{Icons.trash} Delete</Button>
          ) : (
            <div style={{ display:"flex", gap:6, flex:0 }}>
              <Button variant="ghost" onClick={()=>setShowDeleteMonthConfirm(false)} style={{ padding:"10px 12px", fontSize:12 }}>Cancel</Button>
              <Button variant="danger" onClick={deleteMonth} style={{ padding:"10px 12px", fontSize:12 }}>Confirm</Button>
            </div>
          )}
          <Button onClick={saveEditedMonth} full>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
};

// ─── Expenses Tab ───
const ExpensesTab = ({ expenses, setExpenses, monthlyData, currentMonth, setCurrentMonth, categories, setCategories }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Visible category names for dropdown
  const visibleCats = categories.filter(c => c.visible).map(c => c.name);

  // Current month context
  const hist = monthlyData;
  const mi = currentMonth;
  const data = hist[mi] || hist[hist.length - 1] || { month:"No Data", expenses:{}, savings:{} };
  const [mName, yr] = data.month.split(" ");
  const mIdx = MONTHS.indexOf(mName?.slice(0,3));
  const monthYear = parseInt(yr) || 2026;

  // Default date for forms: today if viewing current month, else 1st of viewed month
  const getDefaultDate = () => {
    const now = new Date();
    if (mIdx < 0 || !monthYear) return now.toISOString().slice(0,10);
    if (now.getMonth() === mIdx && now.getFullYear() === monthYear) {
      return now.toISOString().slice(0,10);
    }
    const m = String(mIdx + 1).padStart(2,"0");
    return `${monthYear}-${m}-01`;
  };

  const [form, setForm] = useState({ description:"", amount:"", category:visibleCats[0]||"Other", date:getDefaultDate() });

  const resetForm = () => setForm({ description:"", amount:"", category:visibleCats[0]||"Other", date:getDefaultDate() });

  const addExpense = () => {
    if (!form.description || !form.amount) return;
    const newExp = { ...form, amount:parseFloat(form.amount), id:uid(), createdAt:Date.now() };
    setExpenses(prev => [newExp, ...prev]);
    resetForm();
    setShowAdd(false);
  };

  const openEdit = (e) => {
    setEditId(e.id);
    setForm({ description:e.description, amount:String(e.amount), category:e.category, date:e.date });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!form.description || !form.amount) return;
    setExpenses(prev => prev.map(e => e.id === editId ? { ...e, description:form.description, amount:parseFloat(form.amount), category:form.category, date:form.date } : e));
    resetForm();
    setEditId(null);
    setShowEdit(false);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setShowDeleteConfirm(null);
  };

  // User-added expenses for selected month
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === mIdx && d.getFullYear() === monthYear;
  });

  // Search filter
  const filteredExpenses = search
    ? monthExpenses.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))
    : monthExpenses;

  // Group by date
  const grouped = {};
  filteredExpenses.forEach(e => {
    const key = e.date || "Unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });
  const sortedDates = Object.keys(grouped).sort((a,b) => b.localeCompare(a));

  // Budget data from dashboard (expenses + savings from monthly sheet)
  const budgetExpenses = data.expenses ? Object.entries(data.expenses) : [];
  const budgetSavings = data.savings ? Object.entries(data.savings) : [];
  const budgetTotal = budgetExpenses.reduce((s,[,v])=>s+v,0) + budgetSavings.reduce((s,[,v])=>s+v,0);
  const quickAddTotal = monthExpenses.reduce((s,e)=>s+(e.amount||0),0);
  const grandTotal = budgetTotal + quickAddTotal;

  // Category summary (quick-added only)
  const cats = {};
  monthExpenses.forEach(e => { cats[e.category] = (cats[e.category]||0) + e.amount; });
  const catEntries = Object.entries(cats).sort((a,b)=>b[1]-a[1]);

  // Format date nicely
  const fmtDate = (dateStr) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      const day = d.getDate();
      const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
      const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
      return `${weekday}, ${day} ${mon}`;
    } catch { return dateStr; }
  };

  return (
    <div>
      {/* Month Selector */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={()=>setCurrentMonth(Math.max(0,mi-1))} disabled={mi===0}
          style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:mi===0?COLORS.textDim:COLORS.text, cursor:mi===0?"default":"pointer" }}>
          {Icons.chevLeft}
        </button>
        <div style={{ textAlign:"center", flex:1 }}>
          <div style={{ fontSize:18, fontWeight:700, color:COLORS.text, letterSpacing:-0.3 }}>{data.month}</div>
          <div style={{ fontSize:11, color:COLORS.textMuted }}>Expenses</div>
        </div>
        <button onClick={()=>setCurrentMonth(Math.min(hist.length-1,mi+1))} disabled={mi===hist.length-1}
          style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:mi===hist.length-1?COLORS.textDim:COLORS.text, cursor:mi===hist.length-1?"default":"pointer" }}>
          {Icons.chevRight}
        </button>
      </div>

      {/* Monthly Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
        <Card style={{ padding:"10px 12px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:COLORS.textMuted, fontWeight:500 }}>BUDGET</div>
          <div style={{ fontSize:16, fontWeight:700, color:COLORS.red }}>{fmt(budgetTotal)}</div>
        </Card>
        <Card style={{ padding:"10px 12px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:COLORS.textMuted, fontWeight:500 }}>QUICK ADD</div>
          <div style={{ fontSize:16, fontWeight:700, color:COLORS.orange }}>{fmt(quickAddTotal)}</div>
        </Card>
        <Card style={{ padding:"10px 12px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:COLORS.textMuted, fontWeight:500 }}>TOTAL</div>
          <div style={{ fontSize:16, fontWeight:700, color:COLORS.white }}>{fmt(grandTotal)}</div>
        </Card>
      </div>

      {/* Budget Expenses from Monthly Sheet - Collapsible */}
      {(budgetExpenses.length > 0 || budgetSavings.length > 0) && (
        <Card style={{ marginBottom:12 }}>
          <div onClick={()=>setBudgetOpen(!budgetOpen)}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", userSelect:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:COLORS.text }}>Monthly Budget Items</span>
              <Badge color={COLORS.red}>{budgetExpenses.length + budgetSavings.length}</Badge>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, fontWeight:700, color:COLORS.white }}>{fmtFull(budgetTotal)}</span>
              <span style={{ color:COLORS.textMuted, transform:budgetOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s ease", display:"flex" }}>
                {Icons.chevDown}
              </span>
            </div>
          </div>
          {budgetOpen && (
            <div style={{ marginTop:12 }}>
              {budgetExpenses.map(([name, val]) => (
                <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${COLORS.border}30` }}>
                  <span style={{ fontSize:13, color:COLORS.text }}>{name}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:COLORS.red, fontVariantNumeric:"tabular-nums" }}>{fmtFull(val)}</span>
                </div>
              ))}
              {budgetSavings.length > 0 && budgetSavings.map(([name, val]) => (
                <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${COLORS.border}30` }}>
                  <span style={{ fontSize:13, color:COLORS.text }}>{name} <span style={{ fontSize:9, color:COLORS.green, fontWeight:600 }}>INV</span></span>
                  <span style={{ fontSize:13, fontWeight:600, color:COLORS.green, fontVariantNumeric:"tabular-nums" }}>{fmtFull(val)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Search + Add + Categories */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, position:"relative" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search expenses..."
            style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"10px 32px 10px 36px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:COLORS.textDim }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          {search && (
            <button onClick={()=>setSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>
              {Icons.close}
            </button>
          )}
        </div>
        <button onClick={()=>setShowCatManager(true)}
          style={{ background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"0 12px", cursor:"pointer", flexShrink:0, color:COLORS.textMuted, display:"flex", alignItems:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <Button onClick={()=>{resetForm();setShowAdd(true);}} style={{ padding:"10px 14px", fontSize:13, flexShrink:0 }}>{Icons.plus} Add</Button>
      </div>

      {/* Category Summary (quick-added) */}
      {catEntries.length > 0 && (
        <Card style={{ marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:600, color:COLORS.text, marginBottom:10 }}>Quick-Add by Category</div>
          {catEntries.slice(0,6).map(([cat, val], i) => (
            <div key={cat} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                <span style={{ color:COLORS.text }}>{cat}</span>
                <span style={{ color:COLORS.textMuted }}>{fmtFull(val)} · {pct(val,quickAddTotal)}%</span>
              </div>
              <ProgressBar value={val} max={quickAddTotal} color={PIE_COLORS[i%PIE_COLORS.length]} height={5}/>
            </div>
          ))}
        </Card>
      )}

      {/* Quick-Added Expense List */}
      <div style={{ fontSize:13, fontWeight:600, color:COLORS.text, marginBottom:8 }}>
        Quick-Added ({filteredExpenses.length})
        {search && <span style={{ fontWeight:400, color:COLORS.textMuted }}> · matching "{search}"</span>}
      </div>

      {sortedDates.length === 0 ? (
        <EmptyState icon="📝" title={search ? "No matches" : "No quick-added expenses"} subtitle={search ? `No expenses match "${search}"` : "Tap + Add to track an expense"}/>
      ) : sortedDates.map(date => {
        const dayTotal = grouped[date].reduce((s,e)=>s+(e.amount||0),0);
        return (
          <div key={date} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:12, color:COLORS.textMuted, fontWeight:600, letterSpacing:0.3 }}>{fmtDate(date)}</span>
              <span style={{ fontSize:11, color:COLORS.red, fontWeight:600 }}>{fmtFull(dayTotal)}</span>
            </div>
            {grouped[date].map(e => (
              <Card key={e.id} style={{ marginBottom:6, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:COLORS.text, fontSize:14, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.description}</div>
                    <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:2 }}>{e.category}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <span style={{ color:COLORS.red, fontSize:15, fontWeight:700, fontVariantNumeric:"tabular-nums" }}>{fmtFull(e.amount)}</span>
                    <button onClick={()=>openEdit(e)} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.edit}</button>
                    <button onClick={()=>setShowDeleteConfirm(e.id)} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", padding:4 }}>{Icons.trash}</button>
                  </div>
                </div>
                {/* Delete Confirmation - directly under this card */}
                {showDeleteConfirm === e.id && (
                  <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:10, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:COLORS.red, fontWeight:500 }}>Delete?</span>
                    <div style={{ display:"flex", gap:6 }}>
                      <Button variant="ghost" onClick={()=>setShowDeleteConfirm(null)} style={{ padding:"5px 10px", fontSize:12 }}>Cancel</Button>
                      <Button variant="danger" onClick={()=>deleteExpense(e.id)} style={{ padding:"5px 10px", fontSize:12 }}>Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        );
      })}

      {/* Spacer for FAB */}
      <div style={{ height:60 }}/>

      {/* Add Expense Modal */}
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);resetForm();}} title="Add Expense">
        <Input label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="e.g. Lunch at Rameshwaram Cafe"/>
        <Input label="Amount" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))} type="number" prefix="₹" placeholder="0"/>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={{ fontSize:12, color:COLORS.textMuted, fontWeight:500 }}>Category</label>
            <button onClick={()=>{setShowAdd(false);setTimeout(()=>setShowCatManager(true),250);}} style={{ background:"none", border:"none", color:COLORS.accentLight, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>Manage</button>
          </div>
          {visibleCats.length > 0 ? (
            <div style={{ position:"relative" }}>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"10px 36px 10px 12px",
                  color:COLORS.text, fontSize:14, outline:"none", appearance:"none", cursor:"pointer", fontFamily:"inherit" }}>
                {visibleCats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:COLORS.textMuted, pointerEvents:"none" }}>{Icons.chevDown}</span>
            </div>
          ) : (
            <div style={{ padding:"10px 12px", background:COLORS.bgCard, borderRadius:12, border:`1px solid ${COLORS.border}`, fontSize:12, color:COLORS.textMuted }}>
              No visible categories — <button onClick={()=>{setShowAdd(false);setTimeout(()=>setShowCatManager(true),250);}} style={{ background:"none", border:"none", color:COLORS.accentLight, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, padding:0 }}>manage categories</button>
            </div>
          )}
        </div>
        <Input label="Date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
        <div style={{ marginTop:8 }}>
          <Button onClick={addExpense} full disabled={!form.description||!form.amount||visibleCats.length===0}>Add Expense</Button>
        </div>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal open={showEdit} onClose={()=>{setShowEdit(false);resetForm();setEditId(null);}} title="Edit Expense">
        <Input label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="e.g. Lunch at Rameshwaram Cafe"/>
        <Input label="Amount" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))} type="number" prefix="₹" placeholder="0"/>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={{ fontSize:12, color:COLORS.textMuted, fontWeight:500 }}>Category</label>
            <button onClick={()=>{setShowEdit(false);setTimeout(()=>setShowCatManager(true),250);}} style={{ background:"none", border:"none", color:COLORS.accentLight, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>Manage</button>
          </div>
          <div style={{ position:"relative" }}>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
              style={{ width:"100%", background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"10px 36px 10px 12px",
                color:COLORS.text, fontSize:14, outline:"none", appearance:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {[...new Set([...visibleCats, ...(form.category?[form.category]:[])])].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:COLORS.textMuted, pointerEvents:"none" }}>{Icons.chevDown}</span>
          </div>
        </div>
        <Input label="Date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <Button variant="danger" onClick={()=>{deleteExpense(editId);setShowEdit(false);resetForm();setEditId(null);}} style={{ flex:0 }}>
            {Icons.trash} Delete
          </Button>
          <Button onClick={saveEdit} full disabled={!form.description||!form.amount}>Save Changes</Button>
        </div>
      </Modal>

      {/* Category Manager Modal */}
      <Modal open={showCatManager} onClose={()=>{setShowCatManager(false);setNewCatName("");}} title="Manage Categories">
        {/* Add new category */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <input value={newCatName} onChange={e=>setNewCatName(e.target.value)}
            placeholder="New category name..."
            onKeyDown={e=>{if(e.key==="Enter"&&newCatName.trim()&&!categories.find(c=>c.name.toLowerCase()===newCatName.trim().toLowerCase())){setCategories(prev=>[...prev,{id:uid(),name:newCatName.trim(),visible:true}]);setNewCatName("");}}}
            style={{ flex:1, background:COLORS.bgCard, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"10px 12px", color:COLORS.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          <Button onClick={()=>{
            if(!newCatName.trim()) return;
            if(categories.find(c=>c.name.toLowerCase()===newCatName.trim().toLowerCase())) return;
            setCategories(prev=>[...prev,{id:uid(),name:newCatName.trim(),visible:true}]);
            setNewCatName("");
          }} disabled={!newCatName.trim()} style={{ padding:"10px 14px", fontSize:13 }}>{Icons.plus} Add</Button>
        </div>

        <div style={{ fontSize:11, color:COLORS.textMuted, marginBottom:10 }}>Toggle visibility · Tap eye to show/hide in dropdown</div>

        {/* Category list */}
        {categories.map((cat) => (
          <div key={cat.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${COLORS.border}30` }}>
            {/* Visibility toggle */}
            <button onClick={()=>setCategories(prev=>prev.map(c=>c.id===cat.id?{...c,visible:!c.visible}:c))}
              style={{ background:"none", border:"none", cursor:"pointer", padding:4, color:cat.visible?COLORS.accent:COLORS.textDim, flexShrink:0 }}>
              {cat.visible ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              )}
            </button>

            {/* Name */}
            <span style={{ flex:1, fontSize:14, color:cat.visible?COLORS.text:COLORS.textDim, fontWeight:500, textDecoration:cat.visible?"none":"line-through" }}>{cat.name}</span>

            {/* Usage count */}
            {(() => {
              const count = expenses.filter(e=>e.category===cat.name).length;
              return count > 0 ? <span style={{ fontSize:10, color:COLORS.textMuted, background:COLORS.bgCard, padding:"2px 8px", borderRadius:8 }}>{count}</span> : null;
            })()}

            {/* Delete - only if no expenses use it */}
            <button onClick={()=>{
              const used = expenses.some(e=>e.category===cat.name);
              if (used) return;
              setCategories(prev=>prev.filter(c=>c.id!==cat.id));
            }}
              style={{ background:"none", border:"none", cursor: expenses.some(e=>e.category===cat.name) ? "not-allowed":"pointer",
                padding:4, color: expenses.some(e=>e.category===cat.name) ? COLORS.border : COLORS.textDim, flexShrink:0 }}>
              {Icons.trash}
            </button>
          </div>
        ))}

        {/* Quick actions */}
        <div style={{ display:"flex", gap:8, marginTop:16 }}>
          <Button variant="secondary" onClick={()=>setCategories(prev=>prev.map(c=>({...c,visible:true})))} style={{ flex:1, fontSize:12, padding:"8px 0" }}>Show All</Button>
          <Button variant="secondary" onClick={()=>setCategories(prev=>prev.map(c=>({...c,visible:false})))} style={{ flex:1, fontSize:12, padding:"8px 0" }}>Hide All</Button>
        </div>
      </Modal>

      {/* Floating Add Button */}
      <div style={{ position:"fixed", bottom:80, right:20, zIndex:50 }}>
        <button onClick={()=>{resetForm();setShowAdd(true);}}
          style={{ width:54, height:54, borderRadius:"50%", background:COLORS.accent, border:"none", color:"#fff",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 20px ${COLORS.accent}60`, fontSize:24, fontWeight:300 }}>
          {Icons.plus}
        </button>
      </div>
    </div>
  );
};

// ─── Goals Tab ───
const GoalsTab = ({ goals, setGoals, mfData, setMfData, fdData, setFdData, monthlyData, archivedSavings, setArchivedSavings }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showFD, setShowFD] = useState(false);
  const [showAddFD, setShowAddFD] = useState(false);
  const [showEditFD, setShowEditFD] = useState(false);
  const [editFDId, setEditFDId] = useState(null);
  const [showDeleteFDConfirm, setShowDeleteFDConfirm] = useState(null);
  const [showMF, setShowMF] = useState(false);
  const [showAddMF, setShowAddMF] = useState(false);
  const [showEditMF, setShowEditMF] = useState(false);
  const [editMFId, setEditMFId] = useState(null);
  const [showDeleteMFConfirm, setShowDeleteMFConfirm] = useState(null);
  const [showSavingsDetail, setShowSavingsDetail] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [form, setForm] = useState({ name:"", target:"", saved:"", color:COLORS.accent });
  const [mfForm, setMfForm] = useState({ name:"", amount:"", color:PIE_COLORS[0] });
  const [fdForm, setFdForm] = useState({ bank:"", amount:"", maturity:"", status:"active" });

  // ─── Aggregate Savings from Monthly Data ───
  const savingsAgg = {};
  (monthlyData || []).forEach(m => {
    if (m.savings) {
      Object.entries(m.savings).forEach(([name, amount]) => {
        if (!savingsAgg[name]) savingsAgg[name] = { total:0, months:[] };
        savingsAgg[name].total += amount;
        savingsAgg[name].months.push({ month:m.month, amount });
      });
    }
  });

  const activeSavings = Object.entries(savingsAgg).filter(([name]) => !archivedSavings.includes(name));
  const archivedSavingsList = Object.entries(savingsAgg).filter(([name]) => archivedSavings.includes(name));
  const totalRecurringSavings = activeSavings.reduce((s,[,v]) => s + v.total, 0);

  const resetForm = () => setForm({ name:"", target:"", saved:"", color:COLORS.accent });

  const addGoal = () => {
    if (!form.name || !form.target) return;
    setGoals(prev => [...prev, { ...form, target:parseFloat(form.target), saved:parseFloat(form.saved||0), id:uid(), sources:[] }]);
    resetForm();
    setShowAdd(false);
  };

  const openEdit = (goal) => {
    setEditId(goal.id);
    setForm({ name:goal.name, target:String(goal.target), saved:String(goal.saved), color:goal.color||COLORS.accent });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!form.name || !form.target) return;
    setGoals(prev => prev.map(g => g.id === editId ? { ...g, name:form.name, target:parseFloat(form.target), saved:parseFloat(form.saved||0), color:form.color } : g));
    resetForm();
    setEditId(null);
    setShowEdit(false);
  };

  const updateSaved = (id, amount) => {
    setGoals(prev => prev.map(g => g.id===id ? {...g, saved: Math.max(0, g.saved + amount)} : g));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setShowDeleteConfirm(null);
  };

  const resetMfForm = () => setMfForm({ name:"", amount:"", color:PIE_COLORS[0] });

  const addMF = () => {
    if (!mfForm.name || !mfForm.amount) return;
    setMfData(prev => [...prev, { ...mfForm, amount:parseFloat(mfForm.amount), id:uid(), color:PIE_COLORS[prev.length % PIE_COLORS.length] }]);
    resetMfForm();
    setShowAddMF(false);
  };

  const openEditMF = (mf) => {
    setEditMFId(mf.id);
    setMfForm({ name:mf.name, amount:String(mf.amount), color:mf.color });
    setShowEditMF(true);
  };

  const saveEditMF = () => {
    if (!mfForm.name || !mfForm.amount) return;
    setMfData(prev => prev.map(m => m.id === editMFId ? { ...m, name:mfForm.name, amount:parseFloat(mfForm.amount), color:mfForm.color } : m));
    resetMfForm();
    setEditMFId(null);
    setShowEditMF(false);
  };

  const deleteMF = (id) => {
    setMfData(prev => prev.filter(m => m.id !== id));
    setShowDeleteMFConfirm(null);
    setShowEditMF(false);
    resetMfForm();
    setEditMFId(null);
  };

  const resetFdForm = () => setFdForm({ bank:"", amount:"", maturity:"", status:"active" });

  const addFD = () => {
    if (!fdForm.bank || !fdForm.amount) return;
    setFdData(prev => [...prev, { ...fdForm, amount:parseFloat(fdForm.amount), id:uid() }]);
    resetFdForm();
    setShowAddFD(false);
  };

  const openEditFD = (fd) => {
    setEditFDId(fd.id);
    setFdForm({ bank:fd.bank, amount:String(fd.amount), maturity:fd.maturity||"", status:fd.status||"active" });
    setShowEditFD(true);
  };

  const saveEditFD = () => {
    if (!fdForm.bank || !fdForm.amount) return;
    setFdData(prev => prev.map(f => f.id === editFDId ? { ...f, bank:fdForm.bank, amount:parseFloat(fdForm.amount), maturity:fdForm.maturity, status:fdForm.status } : f));
    resetFdForm();
    setEditFDId(null);
    setShowEditFD(false);
  };

  const deleteFD = (id) => {
    setFdData(prev => prev.filter(f => f.id !== id));
    setShowDeleteFDConfirm(null);
    setShowEditFD(false);
    resetFdForm();
    setEditFDId(null);
  };

  const totalMF = mfData.reduce((s,f) => s+f.amount, 0);
  const totalFD = fdData.reduce((s,f) => s+f.amount, 0);
  const totalGoalsSaved = goals.reduce((s,g) => s+g.saved, 0);
  const totalSIPMonthly = totalMF;
  const grandTotal = totalFD + totalGoalsSaved + totalRecurringSavings;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:18, fontWeight:700, color:COLORS.text }}>Goals & Savings</div>
        <Button onClick={()=>setShowAdd(true)} style={{ padding:"8px 14px", fontSize:13 }}>{Icons.plus} Goal</Button>
      </div>

      {/* Wealth Summary */}
      <Card style={{ marginBottom:16, background:`linear-gradient(135deg, ${COLORS.accentDim}80, ${COLORS.purpleDim}80, ${COLORS.bgCard})` }}>
        <div style={{ fontSize:12, color:COLORS.accentLight, fontWeight:600, marginBottom:10 }}>TOTAL WEALTH SNAPSHOT</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div onClick={()=>setShowFD(true)} style={{ cursor:"pointer" }}>
            <div style={{ fontSize:11, color:COLORS.textMuted }}>Fixed Deposits ({fdData.length})</div>
            <div style={{ fontSize:18, fontWeight:700, color:COLORS.orange }}>{fmt(totalFD)}</div>
          </div>
          <div>
            <div style={{ fontSize:11, color:COLORS.textMuted }}>Goal Savings</div>
            <div style={{ fontSize:18, fontWeight:700, color:COLORS.green }}>{fmt(totalGoalsSaved)}</div>
          </div>
          <div onClick={()=>setShowMF(true)} style={{ cursor:"pointer" }}>
            <div style={{ fontSize:11, color:COLORS.textMuted }}>MF SIPs ({mfData.length})</div>
            <div style={{ fontSize:18, fontWeight:700, color:COLORS.cyan }}>{fmt(totalSIPMonthly)}<span style={{ fontSize:11, color:COLORS.textMuted }}>/mo</span></div>
          </div>
          <div>
            <div style={{ fontSize:11, color:COLORS.textMuted }}>Recurring Savings</div>
            <div style={{ fontSize:18, fontWeight:700, color:COLORS.accentLight }}>{fmt(totalRecurringSavings)}</div>
          </div>
          <div style={{ gridColumn:"1/-1", borderTop:`1px solid ${COLORS.border}40`, paddingTop:10, marginTop:2 }}>
            <div style={{ fontSize:11, color:COLORS.textMuted }}>Grand Total (FD + Goals + Savings)</div>
            <div style={{ fontSize:22, fontWeight:700, color:COLORS.purple }}>{fmt(grandTotal)}</div>
          </div>
        </div>
      </Card>

      {/* Recurring Savings from Monthly Data */}
      {activeSavings.length > 0 && (
        <Card style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:600, color:COLORS.text }}>Recurring Savings</div>
            {archivedSavingsList.length > 0 && (
              <button onClick={()=>setShowArchived(true)} style={{ background:"none", border:"none", color:COLORS.textMuted, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                Archived ({archivedSavingsList.length})
              </button>
            )}
          </div>
          {activeSavings.map(([name, data], i) => {
            const lastMonth = data.months[data.months.length - 1];
            return (
              <div key={name} onClick={()=>setShowSavingsDetail(name)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${COLORS.border}30`, cursor:"pointer" }}>
                <div style={{ width:8, height:8, borderRadius:4, background:PIE_COLORS[i % PIE_COLORS.length], flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:COLORS.text }}>{name}</div>
                  <div style={{ fontSize:10, color:COLORS.textMuted }}>{data.months.length} months · Last: {lastMonth.month}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:COLORS.green }}>{fmtFull(data.total)}</div>
                  <div style={{ fontSize:10, color:COLORS.textMuted }}>{fmtFull(lastMonth.amount)}/mo</div>
                </div>
                <span style={{ color:COLORS.textDim, flexShrink:0 }}>{Icons.chevRight}</span>
              </div>
            );
          })}
        </Card>
      )}

      {/* Mutual Fund Portfolio */}
      <Card style={{ marginBottom:16 }} onClick={()=>setShowMF(true)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:14, fontWeight:600, color:COLORS.text }}>Mutual Fund SIPs</div>
          <Badge color={COLORS.green}>{fmtFull(totalMF)}/mo</Badge>
        </div>
        {mfData.length > 0 ? (
          <>
            <div style={{ display:"flex", gap:3, height:8, borderRadius:4, overflow:"hidden" }}>
              {mfData.map((f,i) => <div key={f.id||i} style={{ flex:f.amount, background:f.color, transition:"flex 0.3s ease" }}/>)}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:10 }}>
              {mfData.map((f,i) => (
                <div key={f.id||i} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:COLORS.textMuted }}>
                  <div style={{ width:6, height:6, borderRadius:2, background:f.color }}/>
                  {f.name.split(" ").slice(0,2).join(" ")}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontSize:12, color:COLORS.textDim, textAlign:"center", padding:"8px 0" }}>No SIPs added. Tap to manage.</div>
        )}
      </Card>

      {/* Goals */}
      {goals.map(goal => {
        const progress = pct(goal.saved, goal.target);
        const remaining = Math.max(0, goal.target - goal.saved);
        return (
          <Card key={goal.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {goal.id === "bike" ? <div style={{ color:COLORS.accent }}>{Icons.bike}</div> : <div style={{ width:24, height:24, borderRadius:8, background:goal.color+"20", display:"flex", alignItems:"center", justifyContent:"center" }}>{Icons.goal}</div>}
                <div>
                  <div style={{ fontSize:15, fontWeight:600, color:COLORS.text }}>{goal.name}</div>
                  <div style={{ fontSize:11, color:COLORS.textMuted }}>Target: {fmtFull(goal.target)}</div>
                </div>
              </div>
              <Badge color={progress >= 100 ? COLORS.green : COLORS.orange}>{progress}%</Badge>
            </div>
            <ProgressBar value={goal.saved} max={goal.target} color={goal.color || COLORS.accent} height={10}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12 }}>
              <span style={{ color:COLORS.green }}>Saved: {fmtFull(goal.saved)}</span>
              <span style={{ color:COLORS.red }}>Need: {fmtFull(remaining)}</span>
            </div>
            {goal.sources && goal.sources.length > 0 && (
              <div style={{ marginTop:10, padding:"8px 10px", background:COLORS.bg, borderRadius:8 }}>
                <div style={{ fontSize:10, color:COLORS.textMuted, fontWeight:600, marginBottom:4 }}>FUNDING SOURCES</div>
                {goal.sources.map((s,i) => <div key={i} style={{ fontSize:11, color:COLORS.text, padding:"2px 0" }}>• {s}</div>)}
              </div>
            )}
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <Button variant="secondary" onClick={()=>updateSaved(goal.id, 1000)} style={{ flex:1, padding:"7px 0", fontSize:12 }}>+ ₹1K</Button>
              <Button variant="secondary" onClick={()=>updateSaved(goal.id, 5000)} style={{ flex:1, padding:"7px 0", fontSize:12 }}>+ ₹5K</Button>
              <Button variant="secondary" onClick={()=>openEdit(goal)} style={{ padding:"7px 10px", fontSize:12 }}>{Icons.edit}</Button>
              <Button variant="danger" onClick={()=>setShowDeleteConfirm(goal.id)} style={{ padding:"7px 10px", fontSize:12 }}>{Icons.trash}</Button>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm === goal.id && (
              <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:10, padding:"10px 14px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:COLORS.red, fontWeight:500 }}>Delete "{goal.name}"?</span>
                <div style={{ display:"flex", gap:6 }}>
                  <Button variant="ghost" onClick={()=>setShowDeleteConfirm(null)} style={{ padding:"5px 10px", fontSize:12 }}>Cancel</Button>
                  <Button variant="danger" onClick={()=>deleteGoal(goal.id)} style={{ padding:"5px 10px", fontSize:12 }}>Delete</Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Add Goal Modal */}
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);resetForm();}} title="New Goal">
        <Input label="Goal Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. New Laptop"/>
        <Input label="Target Amount" value={form.target} onChange={v=>setForm(f=>({...f,target:v}))} type="number" prefix="₹"/>
        <Input label="Already Saved" value={form.saved} onChange={v=>setForm(f=>({...f,saved:v}))} type="number" prefix="₹"/>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, color:COLORS.textMuted, marginBottom:6, fontWeight:500 }}>Color</label>
          <div style={{ display:"flex", gap:8 }}>
            {[COLORS.accent, COLORS.green, COLORS.orange, COLORS.red, COLORS.purple, COLORS.cyan].map(c => (
              <button key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{
                width:32, height:32, borderRadius:10, background:c, border: form.color===c ? "3px solid white" : "3px solid transparent",
                cursor:"pointer", transition:"border 0.15s ease",
              }}/>
            ))}
          </div>
        </div>
        <div style={{ marginTop:8 }}>
          <Button onClick={addGoal} full disabled={!form.name||!form.target}>Create Goal</Button>
        </div>
      </Modal>

      {/* Edit Goal Modal */}
      <Modal open={showEdit} onClose={()=>{setShowEdit(false);resetForm();setEditId(null);}} title="Edit Goal">
        <Input label="Goal Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. New Laptop"/>
        <Input label="Target Amount" value={form.target} onChange={v=>setForm(f=>({...f,target:v}))} type="number" prefix="₹"/>
        <Input label="Saved So Far" value={form.saved} onChange={v=>setForm(f=>({...f,saved:v}))} type="number" prefix="₹"/>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, color:COLORS.textMuted, marginBottom:6, fontWeight:500 }}>Color</label>
          <div style={{ display:"flex", gap:8 }}>
            {[COLORS.accent, COLORS.green, COLORS.orange, COLORS.red, COLORS.purple, COLORS.cyan].map(c => (
              <button key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{
                width:32, height:32, borderRadius:10, background:c, border: form.color===c ? "3px solid white" : "3px solid transparent",
                cursor:"pointer", transition:"border 0.15s ease",
              }}/>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <Button variant="danger" onClick={()=>{deleteGoal(editId);setShowEdit(false);resetForm();setEditId(null);}} style={{ flex:0 }}>
            {Icons.trash} Delete
          </Button>
          <Button onClick={saveEdit} full disabled={!form.name||!form.target}>Save Changes</Button>
        </div>
      </Modal>

      {/* FD Detail Modal */}
      <Modal open={showFD} onClose={()=>{setShowFD(false);setShowDeleteFDConfirm(null);}} title="Fixed Deposits">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:12, color:COLORS.textMuted }}>{fdData.length} FDs · Total: {fmtFull(totalFD)}</div>
          <Button onClick={()=>{setShowFD(false);setTimeout(()=>setShowAddFD(true),200);}} style={{ padding:"7px 12px", fontSize:12 }}>{Icons.plus} Add FD</Button>
        </div>
        {fdData.length === 0 ? (
          <EmptyState icon="🏦" title="No Fixed Deposits" subtitle="Add your first FD to track maturity"/>
        ) : fdData.map((fd) => (
          <Card key={fd.id} style={{ marginBottom:8, padding:"10px 12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:COLORS.text }}>{fd.bank}</div>
                <div style={{ fontSize:11, color:COLORS.textMuted }}>{fd.maturity}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{fmtFull(fd.amount)}</div>
                  <Badge color={fd.status==="received"?COLORS.green:fd.status==="matured"?COLORS.orange:COLORS.accent}>{fd.status}</Badge>
                </div>
                <button onClick={()=>{setShowFD(false);setTimeout(()=>openEditFD(fd),200);}} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.edit}</button>
                <button onClick={()=>setShowDeleteFDConfirm(fd.id)} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", padding:4 }}>{Icons.trash}</button>
              </div>
            </div>
            {showDeleteFDConfirm === fd.id && (
              <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:8, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:COLORS.red, fontWeight:500 }}>Delete this FD?</span>
                <div style={{ display:"flex", gap:6 }}>
                  <Button variant="ghost" onClick={()=>setShowDeleteFDConfirm(null)} style={{ padding:"4px 8px", fontSize:11 }}>Cancel</Button>
                  <Button variant="danger" onClick={()=>deleteFD(fd.id)} style={{ padding:"4px 8px", fontSize:11 }}>Delete</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </Modal>

      {/* Add FD Modal */}
      <Modal open={showAddFD} onClose={()=>{setShowAddFD(false);resetFdForm();}} title="Add Fixed Deposit">
        <Input label="Bank / Institution" value={fdForm.bank} onChange={v=>setFdForm(f=>({...f,bank:v}))} placeholder="e.g. ICICI, KPSSN, Jupiter"/>
        <Input label="Amount" value={fdForm.amount} onChange={v=>setFdForm(f=>({...f,amount:v}))} type="number" prefix="₹" placeholder="e.g. 50000"/>
        <Input label="Maturity Date" value={fdForm.maturity} onChange={v=>setFdForm(f=>({...f,maturity:v}))} placeholder="e.g. 15 Mar 2026"/>
        <Select label="Status" value={fdForm.status} onChange={v=>setFdForm(f=>({...f,status:v}))} options={[{value:"active",label:"Active"},{value:"matured",label:"Matured"},{value:"received",label:"Received"}]}/>
        <div style={{ marginTop:8 }}>
          <Button onClick={addFD} full disabled={!fdForm.bank||!fdForm.amount}>Add FD</Button>
        </div>
      </Modal>

      {/* Edit FD Modal */}
      <Modal open={showEditFD} onClose={()=>{setShowEditFD(false);resetFdForm();setEditFDId(null);}} title="Edit Fixed Deposit">
        <Input label="Bank / Institution" value={fdForm.bank} onChange={v=>setFdForm(f=>({...f,bank:v}))} placeholder="e.g. ICICI"/>
        <Input label="Amount" value={fdForm.amount} onChange={v=>setFdForm(f=>({...f,amount:v}))} type="number" prefix="₹"/>
        <Input label="Maturity Date" value={fdForm.maturity} onChange={v=>setFdForm(f=>({...f,maturity:v}))} placeholder="e.g. 15 Mar 2026"/>
        <Select label="Status" value={fdForm.status} onChange={v=>setFdForm(f=>({...f,status:v}))} options={[{value:"active",label:"Active"},{value:"matured",label:"Matured"},{value:"received",label:"Received"}]}/>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <Button variant="danger" onClick={()=>deleteFD(editFDId)} style={{ flex:0 }}>{Icons.trash} Delete</Button>
          <Button onClick={saveEditFD} full disabled={!fdForm.bank||!fdForm.amount}>Save Changes</Button>
        </div>
      </Modal>

      {/* MF Detail Modal */}
      <Modal open={showMF} onClose={()=>setShowMF(false)} title="Mutual Fund Portfolio">
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
          <Button onClick={()=>{setShowMF(false);setTimeout(()=>setShowAddMF(true),200);}} style={{ padding:"7px 12px", fontSize:12 }}>{Icons.plus} Add SIP</Button>
        </div>
        {mfData.length === 0 ? (
          <EmptyState icon="📈" title="No SIPs yet" subtitle="Add your first mutual fund SIP"/>
        ) : (
          <>
            {mfData.map((mf) => (
              <Card key={mf.id} style={{ marginBottom:8, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:mf.color, flexShrink:0 }}/>
                    <span style={{ fontSize:13, color:COLORS.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mf.name}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{fmtFull(mf.amount)}/mo</span>
                    <button onClick={(e)=>{e.stopPropagation();setShowMF(false);setTimeout(()=>openEditMF(mf),200);}} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.edit}</button>
                    <button onClick={(e)=>{e.stopPropagation();setShowDeleteMFConfirm(mf.id);}} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", padding:4 }}>{Icons.trash}</button>
                  </div>
                </div>
                {showDeleteMFConfirm === mf.id && (
                  <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:8, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:COLORS.red, fontWeight:500 }}>Remove this SIP?</span>
                    <div style={{ display:"flex", gap:6 }}>
                      <Button variant="ghost" onClick={(e)=>{e.stopPropagation();setShowDeleteMFConfirm(null);}} style={{ padding:"4px 8px", fontSize:11 }}>Cancel</Button>
                      <Button variant="danger" onClick={(e)=>{e.stopPropagation();deleteMF(mf.id);}} style={{ padding:"4px 8px", fontSize:11 }}>Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
            <Card style={{ background:COLORS.accentDim+"40", marginTop:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:600, color:COLORS.accentLight }}>Total Monthly SIP</span>
                <span style={{ fontSize:16, fontWeight:700, color:COLORS.white }}>{fmtFull(totalMF)}</span>
              </div>
            </Card>
          </>
        )}
      </Modal>

      {/* Add MF Modal */}
      <Modal open={showAddMF} onClose={()=>{setShowAddMF(false);resetMfForm();}} title="Add SIP">
        <Input label="Fund Name" value={mfForm.name} onChange={v=>setMfForm(f=>({...f,name:v}))} placeholder="e.g. Quant Small Cap Fund"/>
        <Input label="Monthly SIP Amount" value={mfForm.amount} onChange={v=>setMfForm(f=>({...f,amount:v}))} type="number" prefix="₹" placeholder="e.g. 1000"/>
        <div style={{ marginTop:8 }}>
          <Button onClick={addMF} full disabled={!mfForm.name||!mfForm.amount}>Add SIP</Button>
        </div>
      </Modal>

      {/* Edit MF Modal */}
      <Modal open={showEditMF} onClose={()=>{setShowEditMF(false);resetMfForm();setEditMFId(null);}} title="Edit SIP">
        <Input label="Fund Name" value={mfForm.name} onChange={v=>setMfForm(f=>({...f,name:v}))} placeholder="e.g. Quant Small Cap Fund"/>
        <Input label="Monthly SIP Amount" value={mfForm.amount} onChange={v=>setMfForm(f=>({...f,amount:v}))} type="number" prefix="₹"/>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <Button variant="danger" onClick={()=>deleteMF(editMFId)} style={{ flex:0 }}>
            {Icons.trash} Delete
          </Button>
          <Button onClick={saveEditMF} full disabled={!mfForm.name||!mfForm.amount}>Save Changes</Button>
        </div>
      </Modal>

      {/* Savings Detail Modal */}
      <Modal open={!!showSavingsDetail} onClose={()=>setShowSavingsDetail(null)} title={showSavingsDetail || "Savings Detail"}>
        {showSavingsDetail && savingsAgg[showSavingsDetail] && (() => {
          const detail = savingsAgg[showSavingsDetail];
          const isArchived = archivedSavings.includes(showSavingsDetail);
          return (
            <div>
              <Card style={{ marginBottom:14, background:`linear-gradient(135deg, ${COLORS.greenDim}, ${COLORS.bgCard})` }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <div style={{ fontSize:10, color:COLORS.textMuted }}>Total Saved</div>
                    <div style={{ fontSize:20, fontWeight:700, color:COLORS.green }}>{fmtFull(detail.total)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:COLORS.textMuted }}>Months Active</div>
                    <div style={{ fontSize:20, fontWeight:700, color:COLORS.text }}>{detail.months.length}</div>
                  </div>
                </div>
              </Card>
              <div style={{ fontSize:12, fontWeight:600, color:COLORS.textMuted, marginBottom:8 }}>MONTHLY BREAKDOWN</div>
              {detail.months.slice().reverse().map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${COLORS.border}30` }}>
                  <span style={{ fontSize:13, color:COLORS.text }}>{m.month}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:COLORS.green, fontVariantNumeric:"tabular-nums" }}>{fmtFull(m.amount)}</span>
                </div>
              ))}
              <div style={{ marginTop:16 }}>
                {isArchived ? (
                  <Button variant="secondary" onClick={()=>{setArchivedSavings(prev=>prev.filter(n=>n!==showSavingsDetail));setShowSavingsDetail(null);}} full>
                    Restore to Active
                  </Button>
                ) : (
                  <Button variant="danger" onClick={()=>{setArchivedSavings(prev=>[...prev,showSavingsDetail]);setShowSavingsDetail(null);}} full>
                    Mark as Completed → Archive
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Archived Savings Modal */}
      <Modal open={showArchived} onClose={()=>setShowArchived(false)} title="Archived Savings">
        {archivedSavingsList.length === 0 ? (
          <EmptyState icon="📦" title="No archived items" subtitle="Completed savings will appear here"/>
        ) : archivedSavingsList.map(([name, data], i) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${COLORS.border}30` }}>
            <div style={{ flex:1, cursor:"pointer" }} onClick={()=>{setShowArchived(false);setTimeout(()=>setShowSavingsDetail(name),250);}}>
              <div style={{ fontSize:13, fontWeight:500, color:COLORS.textDim }}>{name}</div>
              <div style={{ fontSize:10, color:COLORS.textMuted }}>{data.months.length} months · {fmtFull(data.total)}</div>
            </div>
            <Button variant="secondary" onClick={()=>setArchivedSavings(prev=>prev.filter(n=>n!==name))} style={{ padding:"5px 10px", fontSize:11 }}>Restore</Button>
          </div>
        ))}
      </Modal>
    </div>
  );
};

// ─── Tools Tab ───
const ToolsTab = ({ reminders, setReminders }) => {
  const [activeT, setActiveT] = useState("emi");
  const [emi, setEmi] = useState({ principal:"120640", rate:"9.5", tenure:"36" });
  const [emiResult, setEmiResult] = useState(null);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showEditReminder, setShowEditReminder] = useState(false);
  const [editReminderId, setEditReminderId] = useState(null);
  const [showDeleteReminderConfirm, setShowDeleteReminderConfirm] = useState(null);
  const [rForm, setRForm] = useState({ name:"", amount:"", dueDate:"1", category:"Bill" });

  const resetRForm = () => setRForm({ name:"", amount:"", dueDate:"1", category:"Bill" });

  const calcEMI = () => {
    const P = parseFloat(emi.principal), R = parseFloat(emi.rate)/12/100, N = parseFloat(emi.tenure);
    if (!P || !R || !N) return;
    const emiVal = P * R * Math.pow(1+R, N) / (Math.pow(1+R, N) - 1);
    const totalPay = emiVal * N;
    setEmiResult({ emi: emiVal, total: totalPay, interest: totalPay - P });
  };

  const addReminder = () => {
    if (!rForm.name || !rForm.amount) return;
    setReminders(prev => [...prev, { ...rForm, amount:parseFloat(rForm.amount), id:uid(), active:true }]);
    resetRForm();
    setShowAddReminder(false);
  };

  const openEditReminder = (r) => {
    setEditReminderId(r.id);
    setRForm({ name:r.name, amount:String(r.amount), dueDate:r.dueDate||"1", category:r.category||"Bill" });
    setShowEditReminder(true);
  };

  const saveEditReminder = () => {
    if (!rForm.name || !rForm.amount) return;
    setReminders(prev => prev.map(r => r.id === editReminderId ? { ...r, name:rForm.name, amount:parseFloat(rForm.amount), dueDate:rForm.dueDate, category:rForm.category } : r));
    resetRForm();
    setEditReminderId(null);
    setShowEditReminder(false);
  };

  const toggleReminder = (id) => setReminders(prev => prev.map(r => r.id===id ? {...r, active:!r.active} : r));

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setShowDeleteReminderConfirm(null);
    setShowEditReminder(false);
    resetRForm();
    setEditReminderId(null);
  };

  const tabs = [
    { id:"emi", label:"EMI Calculator", icon:Icons.calc },
    { id:"reminders", label:"Bill Reminders", icon:Icons.bell },
  ];

  return (
    <div>
      <div style={{ fontSize:18, fontWeight:700, color:COLORS.text, marginBottom:16 }}>Tools</div>

      {/* Sub Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setActiveT(t.id)} style={{
            flex:1, background:activeT===t.id?COLORS.accent+"20":"transparent", border:`1px solid ${activeT===t.id?COLORS.accent:COLORS.border}`,
            borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            color:activeT===t.id?COLORS.accentLight:COLORS.textMuted, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit"
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* EMI Calculator */}
      {activeT === "emi" && (
        <div>
          <Card style={{ marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:600, color:COLORS.text, marginBottom:12 }}>Loan EMI Calculator</div>
            <Input label="Loan Amount" value={emi.principal} onChange={v=>setEmi(e=>({...e,principal:v}))} type="number" prefix="₹" placeholder="e.g. 120640"/>
            <Input label="Interest Rate" value={emi.rate} onChange={v=>setEmi(e=>({...e,rate:v}))} type="number" suffix="% p.a." placeholder="e.g. 9.5"/>
            <Input label="Tenure" value={emi.tenure} onChange={v=>setEmi(e=>({...e,tenure:v}))} type="number" suffix="months" placeholder="e.g. 36"/>
            <Button onClick={calcEMI} full>Calculate EMI</Button>
          </Card>

          {emiResult && (
            <Card style={{ background:`linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.bgCard})` }}>
              <div style={{ fontSize:12, color:COLORS.accentLight, fontWeight:600, marginBottom:12 }}>EMI BREAKDOWN</div>
              <div style={{ textAlign:"center", marginBottom:16 }}>
                <div style={{ fontSize:11, color:COLORS.textMuted }}>Monthly EMI</div>
                <div style={{ fontSize:32, fontWeight:800, color:COLORS.white, letterSpacing:-1 }}>{fmtFull(emiResult.emi)}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, color:COLORS.textMuted }}>Principal</div>
                  <div style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{fmt(parseFloat(emi.principal))}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, color:COLORS.textMuted }}>Interest</div>
                  <div style={{ fontSize:14, fontWeight:700, color:COLORS.red }}>{fmt(emiResult.interest)}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, color:COLORS.textMuted }}>Total Pay</div>
                  <div style={{ fontSize:14, fontWeight:700, color:COLORS.orange }}>{fmt(emiResult.total)}</div>
                </div>
              </div>
              {/* Visual breakdown bar */}
              <div style={{ display:"flex", gap:2, height:12, borderRadius:6, overflow:"hidden", marginTop:14 }}>
                <div style={{ flex:parseFloat(emi.principal), background:COLORS.accent }}/>
                <div style={{ flex:emiResult.interest, background:COLORS.red }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:10 }}>
                <span style={{ color:COLORS.accentLight }}>Principal {pct(parseFloat(emi.principal), emiResult.total)}%</span>
                <span style={{ color:COLORS.red }}>Interest {pct(emiResult.interest, emiResult.total)}%</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Bill Reminders */}
      {activeT === "reminders" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <Button onClick={()=>setShowAddReminder(true)} style={{ padding:"8px 14px", fontSize:13 }}>{Icons.plus} Add</Button>
          </div>

          {reminders.length === 0 ? (
            <EmptyState icon="🔔" title="No reminders yet" subtitle="Add recurring bills to never miss a payment"/>
          ) : (
            <>
              {/* Upcoming this month */}
              {(() => {
                const today = new Date().getDate();
                const upcoming = reminders.filter(r => r.active && parseInt(r.dueDate) >= today).sort((a,b) => parseInt(a.dueDate) - parseInt(b.dueDate));
                const overdue = reminders.filter(r => r.active && parseInt(r.dueDate) < today).sort((a,b) => parseInt(a.dueDate) - parseInt(b.dueDate));
                return (
                  <>
                    {overdue.length > 0 && (
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:11, color:COLORS.red, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Overdue</div>
                        {overdue.map(r => (
                          <Card key={r.id} style={{ marginBottom:6, padding:"10px 12px", borderColor:COLORS.red+"30" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <div>
                                <span style={{ color:COLORS.text, fontSize:13, fontWeight:500 }}>{r.name}</span>
                                <span style={{ color:COLORS.red, fontSize:11, marginLeft:8 }}>Due: {r.dueDate}th</span>
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ color:COLORS.red, fontSize:14, fontWeight:700 }}>{fmtFull(r.amount)}</span>
                                <button onClick={()=>openEditReminder(r)} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.edit}</button>
                                <button onClick={()=>setShowDeleteReminderConfirm(r.id)} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer" }}>{Icons.trash}</button>
                              </div>
                            </div>
                            {showDeleteReminderConfirm === r.id && (
                              <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:8, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                <span style={{ fontSize:11, color:COLORS.red, fontWeight:500 }}>Delete?</span>
                                <div style={{ display:"flex", gap:6 }}>
                                  <Button variant="ghost" onClick={()=>setShowDeleteReminderConfirm(null)} style={{ padding:"4px 8px", fontSize:11 }}>Cancel</Button>
                                  <Button variant="danger" onClick={()=>deleteReminder(r.id)} style={{ padding:"4px 8px", fontSize:11 }}>Delete</Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                    {upcoming.length > 0 && (
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:11, color:COLORS.green, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Upcoming</div>
                        {upcoming.map(r => (
                          <Card key={r.id} style={{ marginBottom:6, padding:"10px 12px" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <div>
                                <span style={{ color:COLORS.text, fontSize:13, fontWeight:500 }}>{r.name}</span>
                                <span style={{ color:COLORS.textMuted, fontSize:11, marginLeft:8 }}>Due: {r.dueDate}th</span>
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ color:COLORS.text, fontSize:14, fontWeight:700 }}>{fmtFull(r.amount)}</span>
                                <button onClick={()=>openEditReminder(r)} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.edit}</button>
                                <button onClick={()=>setShowDeleteReminderConfirm(r.id)} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer" }}>{Icons.trash}</button>
                              </div>
                            </div>
                            {showDeleteReminderConfirm === r.id && (
                              <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:8, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                <span style={{ fontSize:11, color:COLORS.red, fontWeight:500 }}>Delete?</span>
                                <div style={{ display:"flex", gap:6 }}>
                                  <Button variant="ghost" onClick={()=>setShowDeleteReminderConfirm(null)} style={{ padding:"4px 8px", fontSize:11 }}>Cancel</Button>
                                  <Button variant="danger" onClick={()=>deleteReminder(r.id)} style={{ padding:"4px 8px", fontSize:11 }}>Delete</Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* All Reminders */}
              <div style={{ fontSize:11, color:COLORS.textMuted, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>All Bills ({reminders.length})</div>
              {reminders.map(r => (
                <Card key={r.id} style={{ marginBottom:6, padding:"10px 12px", opacity:r.active?1:0.5 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                      <button onClick={()=>toggleReminder(r.id)} style={{ width:20, height:20, borderRadius:6, border:`2px solid ${r.active?COLORS.accent:COLORS.textDim}`, background:r.active?COLORS.accent:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {r.active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:500, color:COLORS.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
                        <div style={{ fontSize:10, color:COLORS.textMuted }}>Every {r.dueDate}th · {r.category}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{fmtFull(r.amount)}</span>
                      <button onClick={()=>openEditReminder(r)} style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer", padding:4 }}>{Icons.edit}</button>
                      <button onClick={()=>setShowDeleteReminderConfirm(r.id)} style={{ background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", padding:4 }}>{Icons.trash}</button>
                    </div>
                  </div>
                  {showDeleteReminderConfirm === r.id && (
                    <div style={{ background:COLORS.redBg, border:`1px solid ${COLORS.red}30`, borderRadius:8, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:11, color:COLORS.red, fontWeight:500 }}>Delete "{r.name}"?</span>
                      <div style={{ display:"flex", gap:6 }}>
                        <Button variant="ghost" onClick={()=>setShowDeleteReminderConfirm(null)} style={{ padding:"4px 8px", fontSize:11 }}>Cancel</Button>
                        <Button variant="danger" onClick={()=>deleteReminder(r.id)} style={{ padding:"4px 8px", fontSize:11 }}>Delete</Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </>
          )}

          <Modal open={showAddReminder} onClose={()=>{setShowAddReminder(false);resetRForm();}} title="Add Bill Reminder">
            <Input label="Bill Name" value={rForm.name} onChange={v=>setRForm(f=>({...f,name:v}))} placeholder="e.g. ICICI Credit Card"/>
            <Input label="Amount" value={rForm.amount} onChange={v=>setRForm(f=>({...f,amount:v}))} type="number" prefix="₹"/>
            <Select label="Due Date (Day of Month)" value={rForm.dueDate} onChange={v=>setRForm(f=>({...f,dueDate:v}))} options={Array.from({length:28},(_,i)=>({value:String(i+1),label:`${i+1}th`}))}/>
            <Select label="Category" value={rForm.category} onChange={v=>setRForm(f=>({...f,category:v}))} options={["Bill","EMI","Insurance","Subscription","Investment","Other"]}/>
            <div style={{ marginTop:8 }}>
              <Button onClick={addReminder} full disabled={!rForm.name||!rForm.amount}>Add Reminder</Button>
            </div>
          </Modal>

          {/* Edit Reminder Modal */}
          <Modal open={showEditReminder} onClose={()=>{setShowEditReminder(false);resetRForm();setEditReminderId(null);}} title="Edit Bill Reminder">
            <Input label="Bill Name" value={rForm.name} onChange={v=>setRForm(f=>({...f,name:v}))} placeholder="e.g. ICICI Credit Card"/>
            <Input label="Amount" value={rForm.amount} onChange={v=>setRForm(f=>({...f,amount:v}))} type="number" prefix="₹"/>
            <Select label="Due Date (Day of Month)" value={rForm.dueDate} onChange={v=>setRForm(f=>({...f,dueDate:v}))} options={Array.from({length:28},(_,i)=>({value:String(i+1),label:`${i+1}th`}))}/>
            <Select label="Category" value={rForm.category} onChange={v=>setRForm(f=>({...f,category:v}))} options={["Bill","EMI","Insurance","Subscription","Investment","Other"]}/>
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <Button variant="danger" onClick={()=>deleteReminder(editReminderId)} style={{ flex:0 }}>{Icons.trash} Delete</Button>
              <Button onClick={saveEditReminder} full disabled={!rForm.name||!rForm.amount}>Save Changes</Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

// ─── Main App ───
export default function FinPlan() {
  const [tab, setTab] = useState("dashboard");
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [mfData, setMfData] = useState([]);
  const [fdData, setFdData] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [archivedSavings, setArchivedSavings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      const e = await loadData("finplan-expenses", []);
      const g = await loadData("finplan-goals", null);
      const r = await loadData("finplan-reminders", []);
      const m = await loadData("finplan-mfdata", null);
      const fd = await loadData("finplan-fddata", null);
      const cats = await loadData("finplan-categories", INITIAL_CATEGORIES);
      const md = await loadData("finplan-monthlydata", null);
      const arch = await loadData("finplan-archived-savings", []);
      const isNew = !md;
      setExpenses(e);
      setGoals(g || (isNew ? [] : INITIAL_GOALS));
      setReminders(r);
      setMfData(m || (isNew ? [] : INITIAL_MF_DATA));
      setFdData(fd || (isNew ? [] : INITIAL_FD_DATA));
      setCategories(cats);
      setMonthlyData(md || (isNew ? [] : INITIAL_HISTORICAL_DATA));
      setArchivedSavings(arch);
      if (isNew) {
        // New user: start fresh with current month
        const now = new Date();
        const mLabel = MONTHS[now.getMonth()] + " " + now.getFullYear();
        const emptyMonth = { month:mLabel, income:{}, totalIncome:0, expenses:{}, totalExpenses:0, left:0, savings:{} };
        setMonthlyData([emptyMonth]);
        setCurrentMonth(0);
      } else {
        setMonthlyData(md);
        setCurrentMonth(Math.max(0, md.length - 1));
      }
      setLoaded(true);
    })();
  }, []);

  // Save on changes
  useEffect(() => { if (loaded) saveData("finplan-expenses", expenses); }, [expenses, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-goals", goals); }, [goals, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-reminders", reminders); }, [reminders, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-mfdata", mfData); }, [mfData, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-fddata", fdData); }, [fdData, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-categories", categories); }, [categories, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-archived-savings", archivedSavings); }, [archivedSavings, loaded]);
  useEffect(() => { if (loaded) saveData("finplan-monthlydata", monthlyData); }, [monthlyData, loaded]);

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:Icons.dashboard },
    { id:"expenses", label:"Expenses", icon:Icons.expense },
    { id:"goals", label:"Goals", icon:Icons.goal },
    { id:"tools", label:"Tools", icon:Icons.tools },
  ];

  if (!loaded) return (
    <div style={{ background:COLORS.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:28, fontWeight:800, color:COLORS.accent, marginBottom:8, letterSpacing:-0.5 }}>FinPlan</div>
        <div style={{ fontSize:13, color:COLORS.textMuted }}>Loading your finances...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background:COLORS.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", fontFamily:"'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position:"relative" }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
        select option { background: ${COLORS.bgCard}; color: ${COLORS.text}; }
      `}</style>

      {/* Header */}
      <div style={{ padding:"16px 20px 8px", display:"flex", justifyContent:"space-between", alignItems:"center",
        position:"sticky", top:0, background:COLORS.bg, zIndex:50, borderBottom:`1px solid ${COLORS.border}20` }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:COLORS.text, letterSpacing:-0.5 }}>
            Fin<span style={{ color:COLORS.accent }}>Plan</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <div style={{ width:8, height:8, borderRadius:4, background:COLORS.green, animation:"pulse 2s infinite" }}/>
          <span style={{ fontSize:11, color:COLORS.textMuted }}>Local</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"16px 16px 100px" }}>
        {tab === "dashboard" && <DashboardTab currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} expenses={expenses} goals={goals} monthlyData={monthlyData} setMonthlyData={setMonthlyData}/>}
        {tab === "expenses" && <ExpensesTab expenses={expenses} setExpenses={setExpenses} monthlyData={monthlyData} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} categories={categories} setCategories={setCategories}/>}
        {tab === "goals" && <GoalsTab goals={goals} setGoals={setGoals} mfData={mfData} setMfData={setMfData} fdData={fdData} setFdData={setFdData} monthlyData={monthlyData} archivedSavings={archivedSavings} setArchivedSavings={setArchivedSavings}/>}
        {tab === "tools" && <ToolsTab reminders={reminders} setReminders={setReminders}/>}
      </div>

      {/* FAB for Quick Add */}
      {tab !== "expenses" && (
        <button onClick={()=>setTab("expenses")} style={{
          position:"fixed", bottom:88, right:20, width:52, height:52, borderRadius:16,
          background:`linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`, border:"none",
          color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 4px 20px ${COLORS.accent}40`, zIndex:40,
          transition:"transform 0.2s ease",
        }}
        onMouseEnter={e=>e.target.style.transform="scale(1.08)"}
        onMouseLeave={e=>e.target.style.transform="scale(1)"}>
          {Icons.plus}
        </button>
      )}

      {/* Bottom Navigation */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480,
        background:COLORS.bg+"F0", backdropFilter:"blur(20px)", borderTop:`1px solid ${COLORS.border}`,
        display:"flex", padding:"6px 0 env(safe-area-inset-bottom, 8px)", zIndex:50,
      }}>
        {navItems.map(item => (
          <button key={item.id} onClick={()=>setTab(item.id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer", padding:"8px 0 4px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            color: tab===item.id ? COLORS.accent : COLORS.textDim,
            transition:"color 0.2s ease", fontFamily:"inherit",
          }}>
            <div style={{ position:"relative" }}>
              {item.icon}
              {tab===item.id && <div style={{ position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:2, background:COLORS.accent }}/>}
            </div>
            <span style={{ fontSize:10, fontWeight:tab===item.id?600:400 }}>{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
