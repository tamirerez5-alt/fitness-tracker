import { useState, useEffect, useRef } from "react";

const COLORS = {
  run:"#22c55e", strength:"#3b82f6", rest:"#a855f7",
  food:"#f59e0b", water:"#06b6d4", bg:"#0f0f1a", card:"#1a1a2e",
};

// ─── Day templates by type ────────────────────────────────────────────────────
const DAY_TYPES = {
  strength_upper: {
    type:"strength", typeLabel:"אימון כוח 💪",
    training:{ name:"אימון כוח – משקל גוף + משקולות", duration:"45–55 דק'",
      exercises:["תוכנית אימון בבנייה – לפי תוכנית הגרמין החדשה","שילוב משקל גוף ומשקולות","3 אימוני כוח בשבוע: ראשון / שלישי / חמישי","פרטי האימון יתעדכנו ברגע שהתוכנית סגורה 💪"] },
    meals:{
      m1:{time:"13:00",name:"ארוחה ראשונה",items:"פרגית שווארמה 225 גר' (מבושל) + אורז מלא 200 גר' (מבושל) + 3 ביצים + סלט חי (עגבנייה, מלפפון, פלפל)",kcal:"~1,050 קל' | חלבון 88 גר'"},
      m2:{time:"21:30",name:"ארוחת ערב",items:"סינטה/שייטל 165 גר' (מבושל) + כוסמת 200 גר' (מבושל) + ירק לבחירה",kcal:"~950 קל' | חלבון 62 גר'"},
      dessert:{time:"22:30",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2200, water:3 },
  strength_lower: {
    type:"strength", typeLabel:"אימון כוח 💪",
    training:{ name:"אימון כוח – משקל גוף + משקולות", duration:"45–55 דק'",
      exercises:["תוכנית אימון בבנייה – לפי תוכנית הגרמין החדשה","שילוב משקל גוף ומשקולות","3 אימוני כוח בשבוע: ראשון / שלישי / חמישי","פרטי האימון יתעדכנו ברגע שהתוכנית סגורה 💪"] },
    meals:{
      m1:{time:"13:00",name:"ארוחה ראשונה",items:"סינטה/שייטל 165 גר' (מבושל) + כוסמת 200 גר' (מבושל) + 3 ביצים + סלט חי",kcal:"~1,000 קל' | חלבון 75 גר'"},
      m2:{time:"21:00",name:"ארוחת ערב",items:"מוסר ים/הלבוט 185 גר' (מבושל) + תפוחי אדמה 185 גר' (מבושל) + ירק מבושל (ברוקולי/קישוא)",kcal:"~900 קל' | חלבון 60 גר'"},
      dessert:{time:"22:00",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2100, water:3 },
  run_easy: {
    type:"run", typeLabel:"אינטרוולים קצרים (גרמין) ⚡",
    training:{ name:"אימון אינטרוולים – לפי תוכנית גרמין", duration:"30–40 דק' (לפי גרמין)",
      exercises:["מבנה משתנה כל שבוע לפי גרמין (לדוגמה: 7×30 שנ' ריצה / 30 שנ' התאוששות)","דופק יעד: לפי טווח שמוגדר באימון (לרוב 150-200 צל\"ד)","חימום 10 דק' הליכה/ריצה קלה","מתיחות 10 דק' בסיום"] },
    meals:{
      m1:{time:"13:00",name:"ארוחה ראשונה",items:"פרגית שווארמה 225 גר' (מבושל) + אורז מלא 200 גר' (מבושל) + סלט סלרי + תפוח + אגוזי מלך",kcal:"~1,080 קל' | חלבון 72 גר'"},
      m2:{time:"21:30",name:"ארוחת ערב (אחרי ריצה)",items:"סינטה/שייטל 165 גר' (מבושל) + כוסמת 200 גר' (מבושל) + 3 ביצים + ירק לבחירה",kcal:"~1,050 קל' | חלבון 75 גר'"},
      dessert:{time:"22:30",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2330, water:3.5 },
  run_intervals: {
    type:"run", typeLabel:"יום אימון קשה (גרמין) ⚡",
    training:{ name:"אימון אינטנסיבי – לפי תוכנית גרמין", duration:"40–50 דק' (לפי גרמין)",
      exercises:["יום האימון הקשה של השבוע – הסוג המדויק משתנה כל שבוע לפי גרמין","דוגמאות: חזרות 400-800 מ', אימון עליות/ירידות, חזרות בקצב מהיר","חימום קל לפני, מתיחות/קירור בסיום","דופק/קצב לפי מה שמוגדר באפליקציית הגרמין באותו שבוע"] },
    meals:{
      m1:{time:"13:00",name:"ארוחה ראשונה",items:"סינטה/שייטל 165 גר' (מבושל) + כוסמת 200 גר' (מבושל) + סלט סלרי + תפוח + אגוזי מלך",kcal:"~980 קל' | חלבון 62 גר'"},
      m2:{time:"21:30",name:"ארוחת ערב (אחרי ריצה)",items:"מוסר ים/הלבוט 185 גר' (מבושל) + תפוחי אדמה 185 גר' (מבושל) + 3 ביצים + ירק מבושל (כרוב/פטריות/גמבה בתנור)",kcal:"~1,020 קל' | חלבון 75 גר'"},
      dessert:{time:"22:30",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2200, water:3.5 },
  run_long: {
    type:"run", typeLabel:"לונג ראן (Run Walk Run) 🔥",
    training:{ name:"ריצה ארוכה – Run Walk Run®", duration:"60–100 דק' (לפי גרמין)",
      exercises:["מרחק לפי תוכנית גרמין השבועית (משתנה כל שבוע, ~8–14 ק\"מ)","חימום 5 דק' הליכה","אסטרטגיית Run-Walk לפי הגרמין","מתיחות 5 דק' בסיום","קצב: זון 2–3, שתייה כל 20 דק'"] },
    meals:{
      m1:{time:"13:00",name:"ארוחה ראשונה",items:"פרגית שווארמה 225 גר' (מבושל) + אורז מלא 200 גר' (מבושל) + 3 ביצים + סלט חי",kcal:"~1,050 קל' | חלבון 88 גר'"},
      m2:{time:"20:00",name:"ארוחת ערב",items:"שרימפס/קלמרי 240 גר' (מבושל) + אורז מלא 200 גר' (מבושל) + ירק לבחירה",kcal:"~900 קל' | חלבון 72 גר'"},
      dessert:{time:"22:00",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2150, water:3.5 },
  rest: {
    type:"rest", typeLabel:"מנוחה פעילה 🧘",
    training:{ name:"מנוחה פעילה", duration:"20–30 דק'",
      exercises:["הליכה קלה 20 דק'","גלגל קצף – ירכיים ושוקיים","מתיחות קלות"] },
    meals:{
      m1:{time:"13:00",name:"ארוחה ראשונה",items:"מוסר ים/הלבוט 185 גר' (מבושל) + תפוחי אדמה 185 גר' (מבושל) + 3 ביצים + סלט חי",kcal:"~980 קל' | חלבון 72 גר'"},
      m2:{time:"20:00",name:"ארוחת ערב",items:"שרימפס/קלמרי 240 גר' (מבושל) + אורז מלא 200 גר' (מבושל) + ירק לבחירה",kcal:"~900 קל' | חלבון 72 גר'"},
      dessert:{time:"22:00",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2080, water:3 },
  shabbat: {
    type:"run", typeLabel:"שבת – לונג ראן 🔥",
    training:{ name:"ריצה ארוכה – Run Walk Run® (גרמין)", duration:"60–100 דק' (לפי גרמין)",
      exercises:["מרחק לפי תוכנית גרמין השבועית (משתנה כל שבוע, ~8–14 ק\"מ)","חימום 5 דק' הליכה","אסטרטגיית Run-Walk לפי הגרמין","מתיחות 5 דק' בסיום","ארוחת פרס אחרי הריצה 🥩"] },
    meals:{
      m1:{time:"13:00",name:"ארוחת פרס 🎉 (אחרי ריצה)",items:"פרגית שווארמה 240 גר' (מבושל) + אורז מלא 250 גר' (מבושל) + 3 ביצים + סלט חי",kcal:"~1,150 קל' | חלבון 95 גר'"},
      m2:{time:"20:00",name:"ארוחת ערב",items:"שרימפס/קלמרי 240 גר' (מבושל) + אורז מלא 200 גר' (מבושל) + ירק לבחירה",kcal:"~900 קל' | חלבון 72 גר'"},
      dessert:{time:"22:00",name:"קינוח",items:"יוגורט חלבון (Skyr/דנונה פרו) 200 גר' + פירות קיץ + מעט דבש",kcal:"~200 קל' | חלבון 24 גר'"} },
    kcal:2400, water:4 },
};

// Default week plan (0=Sun)
const DEFAULT_WEEK = ["strength_upper","run_easy","strength_lower","run_intervals","strength_upper","rest","shabbat"]; // ראשון/שלישי/חמישי=כוח | שני/רביעי/שבת=ריצה

const DAY_TYPE_OPTIONS = [
  {id:"strength_upper", label:"אימון כוח 💪", color:"#3b82f6"},
  {id:"strength_lower", label:"אימון כוח 💪", color:"#3b82f6"},
  {id:"run_easy",       label:"אינטרוולים קצרים (גרמין) ⚡", color:"#22c55e"},
  {id:"run_intervals",  label:"יום אימון קשה (גרמין) ⚡", color:"#22c55e"},
  {id:"run_long",       label:"לונג ראן 🔥",  color:"#22c55e"},
  {id:"rest",           label:"מנוחה 🧘",      color:"#a855f7"},
  {id:"shabbat",        label:"שבת 😎",        color:"#a855f7"},
];

const DAY_NAMES = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

const SHOP_CATS = [
  { name:"בשר אדום", icon:"🥩", color:"#ef4444", items:[{n:"סינטה/שייטל",a:"~880 גר'"},{n:"אנטריקוט (לשבת אם רוצה)",a:"לפי צורך"}]},
  { name:"עוף", icon:"🍗", color:"#f59e0b", items:[{n:"פרגיות (לשווארמה)",a:"~1.52 ק\"ג"},{n:"כמון, כורכום, פפריקה, שום",a:"לפי מלאי"}]},
  { name:"דגים ופירות ים", icon:"🐟", color:"#06b6d4", items:[{n:"מוסר ים / הלבוט",a:"~690 גר'"},{n:"שרימפס קפוא",a:"~840 גר'"},{n:"קלמרי קפוא (חלופה)",a:"לפי צורך"}]},
  { name:"ביצים ומוצרי חלב", icon:"🥚", color:"#eab308", items:[{n:"ביצים גדולות",a:"×18"},{n:"יוגורט חלבון (Skyr/דנונה פרו)",a:"×7 יחידות 200 גר'"}]},
  { name:"פחמימות מורכבות", icon:"🍠", color:"#f97316", items:[{n:"אורז מלא / בסמטי (יבש)",a:"~580 גר'"},{n:"כוסמת (יבשה)",a:"~320 גר'"},{n:"תפוחי אדמה",a:"~660 גר'"}]},
  { name:"ירקות סלט (חי)", icon:"🥗", color:"#22c55e", items:[{n:"עגבניות",a:"1 ק\"ג"},{n:"מלפפונים",a:"×6"},{n:"פלפלים",a:"×4"},{n:"סלרי",a:"ראש אחד"},{n:"בצל ירוק",a:"×2 צרורות"}]},
  { name:"ירקות מבושלים", icon:"🥦", color:"#16a34a", items:[{n:"ברוקולי",a:"500 גר'"},{n:"קישואים",a:"×3"},{n:"כרוב (לתנור)",a:"חצי ראש"},{n:"פטריות (לתנור)",a:"250 גר'"},{n:"גמבה (לתנור)",a:"×3"}]},
  { name:"פירות", icon:"🍎", color:"#ec4899", items:[{n:"תפוחים (לסלט סלרי)",a:"×2"},{n:"בננות (לפני ריצה)",a:"×3"},{n:"פירות קיץ (אפרסק/משמש/תות)",a:"לפי צורך"}]},
  { name:"שמנים ואגוזים", icon:"🫒", color:"#84cc16", items:[{n:"שמן זית כתית מעולה",a:"בקבוק גדול"},{n:"אגוזי מלך (לסלט סלרי)",a:"~100 גר'"}]},
  { name:"תבלינים", icon:"🧂", color:"#8b5cf6", items:[{n:"מלח גס",a:"לפי מלאי"},{n:"פפריקה מעושנת",a:"לפי מלאי"},{n:"כורכום",a:"לפי מלאי"},{n:"לימונים",a:"×4"},{n:"רוטב סויה",a:"קטן"}]},
  { name:"שתייה", icon:"💧", color:"#06b6d4", items:[{n:"מים מינרלים / סודה",a:"24 בקבוקים"},{n:"קפה שחור / תה",a:"לפי מלאי"}]},
];

const SK = "fitness_tamir_v5";
function load() { try { return JSON.parse(localStorage.getItem(SK)||"{}"); } catch { return {}; } }
function save(d) { try { localStorage.setItem(SK,JSON.stringify(d)); } catch {} }

// One-time migration: reset weekTypes to the new Mon/Wed/Sat running schedule
// without touching checklist history, weights, chat memory, etc.
function migrateWeekTypes(data) {
  const MIGRATION_KEY = "migrated_week_schedule_v2";
  try {
    if (!localStorage.getItem(MIGRATION_KEY)) {
      if (data.weekTypes) { delete data.weekTypes; }
      localStorage.setItem(MIGRATION_KEY, "1");
      save(data);
    }
  } catch {}
  return data;
}

// ─── Daily Audit ──────────────────────────────────────────────────────────────
function DailyAudit({ plan, dayIdx, mealOverrides, onMealUpdate }) {
  const todayKey = new Date().toISOString().slice(0,10);
  const auditKey = `audit_${todayKey}`;
  const [result, setResult] = useState(()=>{ try{ return JSON.parse(localStorage.getItem(auditKey)||"null"); }catch{return null;} });
  const [loading, setLoading] = useState(false);

  const mealsStr = Object.entries(plan.meals).map(([k,m])=>{
    const ov = mealOverrides?.[k];
    return `${m.name}: ${ov ? ov.items+" – "+ov.kcal : m.items+" – "+m.kcal}`;
  }).join("\n");

  async function run() {
    setLoading(true); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1000,
        system:`אתה דיאטן קליני ספורט מוסמך (ISSN/ACSM/AND). תנתח תפריט ותחזיר JSON בלבד ללא backticks:
{"score":1-10,"summary":"משפט אחד","positives":["..."],"warnings":["..."],"suggestions":["..."],"protein_ok":true/false,"kcal_ok":true/false,"timing_ok":true/false}
פרופיל: תמיר 35 שנה, 100 ק"ג, 177 ס"מ, יעד ירידה במשקל + תוכנית ריצה גרמין 10 קמ/שעה (שני/רביעי/שבת-לונג ראן). צום 16/8, 2 ארוחות/יום. יעדים: ${plan.kcal} קל', חלבון 175-190 גר', שומן 65-80 גר', פחמימות 150-200 גר'.`,
        messages:[{role:"user",content:`יום ${DAY_NAMES[dayIdx]} (${plan.typeLabel}):\n${mealsStr}`}]
      })});
      const d = await res.json();
      const text = d.content?.[0]?.text||"{}";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setResult(parsed);
      try { localStorage.setItem(auditKey, JSON.stringify(parsed)); } catch {}
    } catch { setResult({score:0,summary:"שגיאה – נסה שוב",positives:[],warnings:[],suggestions:[],protein_ok:false,kcal_ok:false,timing_ok:false}); }
    setLoading(false);
  }

  const sc = s=>s>=8?"#22c55e":s>=6?"#f59e0b":"#ef4444";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><div style={{fontSize:14,fontWeight:700}}>🩺 וידוא תזונתי</div><div style={{fontSize:11,color:"#666"}}>דיאטן קליני ספורט מוסמך</div></div>
        <button onClick={run} disabled={loading} style={{background:loading?"#222":"linear-gradient(135deg,#22c55e,#16a34a)",border:"none",borderRadius:11,padding:"9px 14px",color:loading?"#555":"#000",fontSize:12,fontWeight:700,cursor:loading?"not-allowed":"pointer"}}>
          {loading?"⏳ בודק...":"🔍 בדוק תפריט"}
        </button>
      </div>
      {!result && !loading && <div style={{background:"#1a1a2e",borderRadius:12,padding:20,border:"1px solid #333",textAlign:"center",color:"#555",fontSize:12}}>לחץ "בדוק תפריט" לניתוח מקצועי</div>}
      {result && result.score>0 && (
        <div style={{background:"#1a1a2e",borderRadius:14,padding:14,border:`1px solid ${sc(result.score)}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:`${sc(result.score)}22`,border:`2px solid ${sc(result.score)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:20,fontWeight:800,color:sc(result.score)}}>{result.score}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:5}}>{result.summary}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[["✅","חלבון",result.protein_ok],["🔥","קלוריות",result.kcal_ok],["⏰","תזמון",result.timing_ok]].map(([ic,lb,ok])=>(
                  <span key={lb} style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:ok?"#22c55e22":"#ef444422",color:ok?"#22c55e":"#ef4444",border:`1px solid ${ok?"#22c55e33":"#ef444433"}`}}>{ic} {lb}</span>
                ))}
              </div>
            </div>
          </div>
          {result.positives?.length>0 && <div style={{marginBottom:8}}>
            <div style={{fontSize:11,color:"#22c55e",fontWeight:600,marginBottom:4}}>✅ מה טוב</div>
            {result.positives.map((p,i)=><div key={i} style={{fontSize:12,color:"#aaa",padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#22c55e"}}>•</span>{p}</div>)}
          </div>}
          {result.warnings?.length>0 && <div style={{marginBottom:8,background:"#f59e0b0a",borderRadius:9,padding:"8px 10px",border:"1px solid #f59e0b33"}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:4}}>⚠️ לשים לב</div>
            {result.warnings.map((w,i)=><div key={i} style={{fontSize:12,color:"#aaa",padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#f59e0b"}}>•</span>{w}</div>)}
          </div>}
          {result.suggestions?.length>0 && <div style={{background:"#3b82f60a",borderRadius:9,padding:"8px 10px",border:"1px solid #3b82f633"}}>
            <div style={{fontSize:11,color:"#3b82f6",fontWeight:600,marginBottom:4}}>💡 המלצות</div>
            {result.suggestions.map((s,i)=><div key={i} style={{fontSize:12,color:"#aaa",padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#3b82f6"}}>•</span>{s}</div>)}
          </div>}
        </div>
      )}
      {result && result.score>0 && <AuditChat plan={plan} dayIdx={dayIdx} mealsStr={mealsStr} auditResult={result} onMealUpdate={onMealUpdate} mealOverrides={mealOverrides}/>}
    </div>
  );
}

// ─── Audit Follow-up Chat ──────────────────────────────────────────────────────
function AuditChat({ plan, dayIdx, mealsStr, auditResult, onMealUpdate, mealOverrides }) {
  const todayKey = new Date().toISOString().slice(0,10);
  const chatKey = `auditchat_${todayKey}`;
  const initMsgs = () => { try { const s=JSON.parse(localStorage.getItem(chatKey)||"null"); if(s?.length>0) return s; } catch {} return []; };
  const [msgs, setMsgs] = useState(initMsgs);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(()=>initMsgs().length>0);
  const [applying, setApplying] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{ try{localStorage.setItem(chatKey,JSON.stringify(msgs));}catch{} },[msgs]);
  useEffect(()=>{ if(open) bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,open]);

  function clearChat() { try{localStorage.removeItem(chatKey);}catch{} setMsgs([]); }

  async function send() {
    if(!input.trim()||loading) return;
    const userMsg=input.trim(); setInput("");
    const newMsgs=[...msgs,{role:"user",content:userMsg}]; setMsgs(newMsgs); setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:800,
        system:`אתה דיאטן קליני ספורט מוסמך (ISSN/ACSM/AND), עונה על שאלות המשך לגבי הוידוא התזונתי שביצעת.
פרופיל: תמיר 35, 100 ק"ג, 177 ס"מ, יעד ירידה במשקל + תוכנית ריצה גרמין 10 קמ/שעה (שני/רביעי/שבת-לונג ראן). צום 16/8, 2 ארוחות/יום.
יום ${DAY_NAMES[dayIdx]} (${plan.typeLabel}). יעד: ${plan.kcal} קל', חלבון 175-190 גר', שומן 65-80 גר', פחמימות 150-200 גר'.

תפריט שנבדק:\n${mealsStr}

תוצאות הוידוא:
ציון: ${auditResult.score}/10
סיכום: ${auditResult.summary}
חוזקות: ${(auditResult.positives||[]).join("; ")}
אזהרות: ${(auditResult.warnings||[]).join("; ")}
המלצות: ${(auditResult.suggestions||[]).join("; ")}

ענה בעברית, קצר, מקצועי ומעשי. אם המשתמש שואל על שינוי ספציפי בתפריט - תן הצעה מדויקת עם גרמים וציין בבירור לאיזו ארוחה (ראשונה/ערב/שחזור) זה מתייחס, כדי שניתן יהיה להעביר את ההמלצה לעדכון אוטומטי.`,
        messages:newMsgs.map(m=>({role:m.role,content:m.content}))
      })});
      const d=await res.json();
      setMsgs(m=>[...m,{role:"assistant",content:d.content?.[0]?.text||"שגיאה. נסה שוב."}]);
    } catch { setMsgs(m=>[...m,{role:"assistant",content:"שגיאת חיבור."}]); }
    setLoading(false);
  }

  // Send a dietitian recommendation to the substitution bot, which computes exact grams and auto-applies
  async function consultAndApply(recommendationText, sourceLabel) {
    setApplying(true);
    setMsgs(m=>[...m,{role:"assistant",content:`🔄 מעביר את ההמלצה לבוט התחליפים לחישוב מדויק...`}]);
    try {
      const instruction = `הדיאטן הקליני המליץ: "${recommendationText}"\nתרגם את ההמלצה הזו לעדכון ארוחה מדויק (גרמים + ערכים) והתאם אותה לארוחה הרלוונטית.`;
      const { text, update } = await computeMealUpdate(instruction, plan, dayIdx, mealOverrides);
      if(update) {
        onMealUpdate(update.key, {items:update.items, kcal:update.kcal});
        setMsgs(m=>[...m,{role:"assistant",content:`✅ בוט התחליפים חישב ועדכן את "${plan.meals[update.key]?.name}" אוטומטית:\n\n${update.items}\n${update.kcal}\n\n${text}\n\nתוכל לראות את השינוי בטאב "היום".`}]);
      } else {
        setMsgs(m=>[...m,{role:"assistant",content:`בוט התחליפים הגיב אך לא הצליח לזהות עדכון מדויק:\n\n${text||"(אין תגובה)"}`}]);
      }
    } catch {
      setMsgs(m=>[...m,{role:"assistant",content:"שגיאה בתקשורת עם בוט התחליפים. נסה שוב."}]);
    }
    setApplying(false);
  }


  if(!open) return (
    <button onClick={()=>setOpen(true)} style={{width:"100%",marginTop:10,background:"#1a1a2e",border:"1px solid #3b82f644",borderRadius:12,padding:"10px 14px",color:"#3b82f6",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
      💬 התייעץ עם הדיאטן על הוידוא הזה
    </button>
  );

  return (
    <div style={{marginTop:10,background:"#1a1a2e",borderRadius:14,padding:10,border:"1px solid #3b82f644"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:12,fontWeight:700,color:"#3b82f6"}}>💬 התייעצות עם הדיאטן</div>
        <div style={{display:"flex",gap:6}}>
          {msgs.length>0 && <button onClick={clearChat} style={{fontSize:11,padding:"3px 8px",background:"none",border:"1px solid #333",borderRadius:7,color:"#555",cursor:"pointer"}}>🗑 נקה</button>}
          <button onClick={()=>setOpen(false)} style={{fontSize:11,padding:"3px 8px",background:"none",border:"1px solid #333",borderRadius:7,color:"#555",cursor:"pointer"}}>סגור ✕</button>
        </div>
      </div>

      {msgs.length===0 && (
        <div style={{fontSize:11,color:"#666",marginBottom:8,lineHeight:1.6}}>
          שאל שאלות על הניתוח – למשל "למה הציון לא 10?", "איך אפשר לשפר את התזמון?", "מה התחליף הכי קל לסינטה?"
        </div>
      )}

      {/* Quick-apply for original audit suggestions */}
      {auditResult.suggestions?.length>0 && (
        <div style={{marginBottom:8}}>
          <div style={{fontSize:11,color:"#666",marginBottom:5}}>החל המלצה אוטומטית:</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {auditResult.suggestions.map((s,i)=>(
              <button key={i} disabled={applying} onClick={()=>consultAndApply(s)} style={{display:"flex",alignItems:"center",gap:6,textAlign:"right",fontSize:11,padding:"6px 10px",background:"#22c55e0d",border:"1px solid #22c55e33",borderRadius:9,color:"#9fe8c4",cursor:applying?"not-allowed":"pointer"}}>
                <span style={{flexShrink:0}}>🤖</span><span style={{flex:1}}>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{maxHeight:260,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,marginBottom:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-start":"flex-end",gap:4}}>
            <div style={{maxWidth:"88%",background:m.role==="user"?"#1e3a5f":"#0a0a14",border:`1px solid ${m.role==="user"?"#3b82f644":"#2a2a3e"}`,borderRadius:m.role==="user"?"12px 12px 12px 3px":"12px 12px 3px 12px",padding:"8px 11px",fontSize:12,color:"#ddd",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.content}</div>
            {m.role==="assistant" && i===msgs.length-1 && !loading && !applying && !m.content.startsWith("✅") && !m.content.startsWith("🔄") && (
              <button onClick={()=>consultAndApply(m.content)} style={{fontSize:10,padding:"3px 9px",background:"#3b82f622",border:"1px solid #3b82f644",borderRadius:7,color:"#3b82f6",cursor:"pointer"}}>🔗 העבר לבוט התחליפים ועדכן אוטומטית</button>
            )}
          </div>
        ))}
        {(loading||applying) && <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:"#0a0a14",border:"1px solid #2a2a3e",borderRadius:"12px 12px 3px 12px",padding:"8px 14px",color:"#555",fontSize:16}}>•••</div></div>}
        <div ref={bottomRef}/>
      </div>

      <div style={{display:"flex",gap:7}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="שאל את הדיאטן..." style={{flex:1,background:"#0a0a14",border:"1px solid #333",borderRadius:10,padding:"9px 12px",color:"#fff",fontSize:12,outline:"none",direction:"rtl"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?"#222":"#3b82f6",border:"none",borderRadius:10,padding:"9px 13px",color:"#fff",fontSize:14,cursor:"pointer"}}>➤</button>
      </div>
      <div style={{marginTop:7,display:"flex",gap:5,flexWrap:"wrap"}}>
        {["למה הציון לא 10?","איך לשפר את התזמון?","יש משהו מיותר בתפריט?"].map(q=>(
          <button key={q} onClick={()=>setInput(q)} style={{fontSize:11,padding:"4px 9px",background:"#0a0a14",border:"1px solid #222",borderRadius:18,color:"#777",cursor:"pointer"}}>{q}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Garmin Text Analysis ─────────────────────────────────────────────────────
function GarminAnalysis({ plan, dayIdx }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // {base64, mime, preview}
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dtype, setDtype] = useState("run");
  const [mode, setMode] = useState("image"); // image | text
  const [phase, setPhase] = useState("after"); // before | after

  function handleFile(e) {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1400;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const scale = MAX_DIM / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setImage({ base64: dataUrl.split(",")[1], mime: "image/jpeg", preview: dataUrl });
      };
      img.onerror = () => {
        // Fallback: use original file as-is if resizing fails
        setImage({ base64: ev.target.result.split(",")[1], mime: file.type, preview: ev.target.result });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function switchPhase(p) {
    setPhase(p); setResult(null); setImage(null); setText("");
  }

  async function analyze() {
    if(loading) return;
    if(mode==="image" && !image) return;
    if(mode==="text" && !text.trim()) return;
    setLoading(true); setResult(null);

    const typeLabels = {run:"ריצה",sleep:"שינה",steps:"צעדים/פעילות יומית",hrv:"HRV/מצב גוף",general:"כללי"};

    const beforeSystem = `אתה מאמן ריצה מוסמך, מומחה בניתוח תוכניות אימון מגרמין. תמיר מתאמן לפי תוכנית גרמין ל-10 ק"מ/שעה, מתאמן ריצה בימי שני/רביעי/שבת (שבת = לונג ראן, מרחק משתנה כל שבוע). יום נוכחי: ${DAY_NAMES[dayIdx]} (${plan.typeLabel}). זהו צילום מסך של האימון המתוכנן (לפני הריצה). קרא את הפרטים (מרחק, קצב יעד, מבנה אימון, זמן משוער) ותן:\n1. מה מתוכנן (פרט את הנתונים)\n2. איך להתכונן לאימון הזה (חימום, תזונה לפני, שתייה)\n3. נקודות למיקוד בזמן הריצה\nכתוב בעברית, קצר וברור.`;

    const afterSystem = `אתה מאמן כושר ודיאטן קליני ספורט, מומחה בניתוח נתוני שעוני גרמין. תנתח נתוני ${typeLabels[dtype]} (אחרי האימון) ותן המלצות מותאמות לתמיר (100 ק"ג, יעד: ירידה במשקל + ריצה לפי תוכנית גרמין 10 ק"מ/שעה). יום: ${DAY_NAMES[dayIdx]} (${plan.typeLabel}), יעד קלורי: ${plan.kcal} קל'. כתוב בעברית, קצר וברור עם נקודות.`;

    const systemPrompt = phase==="before" ? beforeSystem : afterSystem;

    try {
      let messageContent;
      if(mode==="image") {
        const promptText = phase==="before"
          ? `זהו צילום מסך של האימון המתוכנן בגרמין (לפני הריצה). קרא את הנתונים (מרחק, קצב יעד, מבנה, זמן) ותן הכנה לאימון.`
          : `זהו צילום מסך מהגרמין אחרי אימון (סוג: ${typeLabels[dtype]}). קרא את הנתונים המספריים מהתמונה (מרחק, זמן, קצב/דופק, קלוריות, שעות שינה וכו') ונתח:\n1. מה הנתונים שראית בתמונה (פרט את המספרים)\n2. האם לאמן היום/מחר בעצימות גבוהה? (דגל 🟢/🔴)\n3. המלצות תזונה ספציפיות\n4. המלצות לאימון הבא`;
        messageContent = [
          {type:"image", source:{type:"base64", media_type: image.mime, data: image.base64}},
          {type:"text", text: promptText}
        ];
      } else {
        messageContent = phase==="before"
          ? `נתוני האימון המתוכנן:\n${text}\n\nתן הכנה לאימון (חימום, תזונה, נקודות מיקוד).`
          : `נתוני גרמין אחרי אימון (${typeLabels[dtype]}):\n${text}\n\nאנא נתח ותן:\n1. מה הנתונים אומרים\n2. האם לאמן בעצימות גבוהה בקרוב? (דגל 🟢/🔴)\n3. המלצות תזונה\n4. המלצות לאימון הבא`;
      }
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1200,
        system: systemPrompt,
        messages:[{role:"user", content: messageContent}]
      })});
      const d = await res.json();
      if (d.error) {
        setResult(`שגיאה מה-AI: ${d.error.message || JSON.stringify(d.error)}`);
      } else {
        setResult(d.content?.[0]?.text||"לא הצלחתי לנתח. נסה שוב.");
      }
    } catch (e) { setResult(`שגיאת חיבור: ${e?.message || e}. נסה שוב, או נסה במצב ⌨️ טקסט.`); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>⌚ ניתוח גרמין AI</div>
      <div style={{fontSize:11,color:"#666",marginBottom:10}}>העלה צילום מסך מהגרמין – לפני האימון (תכנון) או אחרי (תוצאות)</div>

      {/* Before / After toggle */}
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <button onClick={()=>switchPhase("before")} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1px solid ${phase==="before"?"#f59e0b":"#222"}`,background:phase==="before"?"#f59e0b22":"#0a0a14",color:phase==="before"?"#f59e0b":"#666",fontSize:12,fontWeight:phase==="before"?700:400,cursor:"pointer"}}>📋 לפני האימון</button>
        <button onClick={()=>switchPhase("after")} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1px solid ${phase==="after"?"#22c55e":"#222"}`,background:phase==="after"?"#22c55e22":"#0a0a14",color:phase==="after"?"#22c55e":"#666",fontSize:12,fontWeight:phase==="after"?700:400,cursor:"pointer"}}>✅ אחרי האימון</button>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <button onClick={()=>setMode("image")} style={{flex:1,padding:"7px 0",borderRadius:9,border:`1px solid ${mode==="image"?"#3b82f6":"#222"}`,background:mode==="image"?"#3b82f622":"#0a0a14",color:mode==="image"?"#3b82f6":"#666",fontSize:12,fontWeight:mode==="image"?700:400,cursor:"pointer"}}>📸 תמונה</button>
        <button onClick={()=>setMode("text")} style={{flex:1,padding:"7px 0",borderRadius:9,border:`1px solid ${mode==="text"?"#3b82f6":"#222"}`,background:mode==="text"?"#3b82f622":"#0a0a14",color:mode==="text"?"#3b82f6":"#666",fontSize:12,fontWeight:mode==="text"?700:400,cursor:"pointer"}}>⌨️ טקסט</button>
      </div>

      {phase==="after" && (
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {[["run","🏃 ריצה"],["sleep","😴 שינה"],["steps","👟 צעדים"],["hrv","💚 HRV"],["general","📊 כללי"]].map(([id,lb])=>(
            <button key={id} onClick={()=>setDtype(id)} style={{fontSize:11,padding:"5px 10px",borderRadius:20,border:`1px solid ${dtype===id?"#3b82f6":"#333"}`,background:dtype===id?"#3b82f622":"#0a0a14",color:dtype===id?"#3b82f6":"#666",cursor:"pointer"}}>{lb}</button>
          ))}
        </div>
      )}

      {mode==="image" ? (
        <div>
          <div style={{position:"relative",border:"2px dashed #333",borderRadius:14,padding:image?10:"20px 16px",textAlign:"center",marginBottom:10,background:"#0a0a14"}}>
            {image ? (
              <div>
                <img src={image.preview} alt="garmin" style={{maxWidth:"100%",maxHeight:220,borderRadius:10,marginBottom:6,objectFit:"contain"}}/>
                <div style={{fontSize:11,color:"#666"}}>לחץ להחלפת תמונה</div>
              </div>
            ) : (
              <div>
                <div style={{fontSize:32,marginBottom:6}}>{phase==="before"?"📋":"📸"}</div>
                <div style={{fontSize:13,color:"#666",marginBottom:3}}>{phase==="before"?"לחץ להעלאת צילום התוכנית המתוכננת":"לחץ להעלאת צילום מסך מהגרמין"}</div>
                <div style={{fontSize:11,color:"#444"}}>{phase==="before"?"מרחק, קצב יעד, מבנה אימון":"ריצה · שינה · צעדים · HRV"}</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer"}}
            />
          </div>
          {!image && <div style={{fontSize:11,color:"#555",textAlign:"center",marginBottom:6}}>אם הלחיצה לא פותחת גלריה, נסה ⌨️ טקסט במקום, או פתח את האפליקציה דרך Chrome הרגיל ולא מהאייקון המותקן</div>}
        </div>
      ) : (
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={phase==="before"
          ? `הדבק כאן את פרטי האימון המתוכנן...\n\nלדוגמה:\nמרחק: 8 ק"מ\nקצב יעד: 6:00 דק'/ק"מ\nמבנה: ריצה רציפה זון 2-3`
          : `הדבק כאן נתוני ${dtype} מהגרמין...\n\nלדוגמה (ריצה):\nמרחק: 5.2 ק"מ\nזמן: 36:45\nקצב ממוצע: 7:04\nדופק ממוצע: 142\nדופק מקסימלי: 158\nקלוריות: 420`}
          style={{width:"100%",minHeight:120,background:"#0a0a14",border:"1px solid #333",borderRadius:12,padding:12,color:"#ccc",fontSize:12,outline:"none",resize:"vertical",direction:"rtl",lineHeight:1.6,marginBottom:10}}/>
      )}

      <button onClick={analyze} disabled={loading||(mode==="image"?!image:!text.trim())} style={{width:"100%",background:loading||(mode==="image"?!image:!text.trim())?"#222":phase==="before"?"linear-gradient(135deg,#f59e0b,#ea580c)":"linear-gradient(135deg,#3b82f6,#8b5cf6)",border:"none",borderRadius:12,padding:12,color:loading||(mode==="image"?!image:!text.trim())?"#555":"#fff",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",marginBottom:10}}>
        {loading?"⏳ מנתח...":phase==="before"?"📋 הכן אותי לאימון":"🔍 נתח תוצאות עם AI"}
      </button>
      {result && <div style={{background:"#1a1a2e",borderRadius:14,padding:14,border:`1px solid ${phase==="before"?"#f59e0b44":"#3b82f644"}`,fontSize:12,color:"#ccc",lineHeight:1.8,whiteSpace:"pre-wrap"}}>
        <div style={{fontSize:11,color:phase==="before"?"#f59e0b":"#3b82f6",fontWeight:600,marginBottom:6}}>{phase==="before"?"📋 הכנה לאימון":"⌚ תוצאת ניתוח"}</div>
        {result}
      </div>}
    </div>
  );
}

// ─── Shared: ask substitution bot to compute a meal update from a free-text instruction ──
async function computeMealUpdate(instruction, plan, dayIdx, mealOverrides) {
  const mealsStr = Object.entries(plan.meals).map(([k,m])=>{
    const ov = mealOverrides?.[k];
    return `${m.name}(${m.time}) [key:${k}]: ${ov?ov.items+" – "+ov.kcal:m.items+" – "+m.kcal}`;
  }).join("\n");
  const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    model:"claude-sonnet-4-20250514",max_tokens:800,
    system:`אתה בוט תזונה עבור תמיר (35, 100 ק"ג, 177 ס"מ, יעד ירידה במשקל + ריצה לפי תוכנית גרמין 10 קמ/שעה).
יום ${DAY_NAMES[dayIdx]} (${plan.typeLabel}). יעד: ${plan.kcal} קל', חלבון 175-190 גר'.
ארוחות נוכחיות:\n${mealsStr}
ערכים ל-100 גר' (לפני בישול): סינטה/שייטל 250קל/26חלבון, פרגית 180קל/22חלבון, סלמון 208קל/20חלבון, שרימפס 99קל/24חלבון, טונה 116קל/26חלבון, ביצה(60גר') 78קל/6חלבון, בטטה 86קל/1.6חלבון, תפו"א 77קל/2חלבון, אורז מלא(יבש) 370קל/7.5חלבון, יוגורט חלבון (Skyr/דנונה פרו) 95קל/12חלבון.
קיבלת המלצה/הוראה מדיאטן קליני (ראה הודעת המשתמש). תרגם אותה לעדכון ארוחה קונקרטי:
1) חשב גרמים מדויקים 2) בחר את KEY המתאים מהמפתחות: ${Object.keys(plan.meals).join(", ")}
חובה: ענה בקצרה (2-3 שורות הסבר) ובסוף שורה נפרדת בדיוק:
📋UPDATE:KEY|תיאור קצר של הארוחה המעודכנת|ערכים תזונתיים`,
    messages:[{role:"user",content:instruction}]
  })});
  const d = await res.json();
  const text = d.content?.[0]?.text||"";
  const upd = text.match(/📋\s*UPDATE\s*:\s*(m1|m2|dessert|recovery)\s*\|\s*([^|\n]+)\s*\|\s*([^\n]+)/i);
  return { text: text.replace(/📋\s*UPDATE\s*:.*/is,"").trim(), update: upd ? {key:upd[1].trim(), items:upd[2].trim(), kcal:upd[3].trim()} : null };
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────
function AIChat({ plan, dayIdx, onMealUpdate, mealOverrides, getPlan, weekTypes }) {
  const todayKey = new Date().toISOString().slice(0,10);
  const chatKey = `chat_${todayKey}`;
  const initMsgs = () => { try { const s=JSON.parse(localStorage.getItem(chatKey)||"null"); if(s?.length>0) return s; } catch {} return [{role:"assistant",content:`שלום תמיר! 👋\nספר לי מה יש לך במקרר ואני אחשב בדיוק כמה גרם לאכול כדי להישאר ביעדי היום (${plan.kcal.toLocaleString()} קל').\n\nאפשר גם לתכנן ארוחות לימים קדימה – פשוט ציין את היום, לדוגמה: "מחר יש לי רק עוף, מה לאכול?"`}]; };
  const [msgs, setMsgs] = useState(initMsgs);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null); // {key, items, kcal, targetDayIdx, targetDateKey}
  const bottomRef = useRef(null);

  useEffect(()=>{ try{localStorage.setItem(chatKey,JSON.stringify(msgs));}catch{} },[msgs]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  function clearChat() { try{localStorage.removeItem(chatKey);}catch{} setMsgs([{role:"assistant",content:"שיחה חדשה! 🔄 מה יש לך במקרר? (אפשר לציין יום ספציפי)"}]); setPending(null); }

  // Get date key for a given day offset from today
  function getDateKeyForDayIdx(targetDayIdx) {
    const today = new Date();
    const todayIdx = today.getDay();
    let diff = targetDayIdx - todayIdx;
    if(diff < 0) diff += 7;
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    return target.toISOString().slice(0,10);
  }

  // Detect which day the user is asking about
  function detectTargetDay(userMsg) {
    const msg = userMsg.toLowerCase();
    const today = new Date();
    const todayDayIdx = today.getDay();

    if(msg.includes("מחר")) {
      const idx = (todayDayIdx + 1) % 7;
      return { idx, label: `מחר (${DAY_NAMES[idx]})` };
    }
    if(msg.includes("מחרתיים")) {
      const idx = (todayDayIdx + 2) % 7;
      return { idx, label: `מחרתיים (${DAY_NAMES[idx]})` };
    }
    for(let i=0; i<DAY_NAMES.length; i++) {
      if(msg.includes(DAY_NAMES[i])) {
        return { idx: i, label: DAY_NAMES[i] };
      }
    }
    // Default: today
    return { idx: todayDayIdx, label: "היום" };
  }

  async function send() {
    if(!input.trim()||loading) return;
    const userMsg=input.trim(); setInput("");
    const newMsgs=[...msgs,{role:"user",content:userMsg}]; setMsgs(newMsgs); setLoading(true);

    // Detect target day
    const targetDay = detectTargetDay(userMsg);
    const targetPlan = getPlan(targetDay.idx);
    const targetDateKey = getDateKeyForDayIdx(targetDay.idx);
    const targetOverrides = (() => { try { const d=JSON.parse(localStorage.getItem("fitness_tamir_v5")||"{}"); return d[`overrides_${targetDateKey}`]||{}; } catch { return {}; } })();

    const mealsStr=Object.entries(targetPlan.meals).map(([k,m])=>{ const ov=targetOverrides[k]; return `${m.name}(${m.time}): ${ov?ov.items+" – "+ov.kcal:m.items+" – "+m.kcal}`; }).join("\n");

    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:1000,
        system:`אתה בוט תזונה עבור תמיר (35, 100 ק"ג, 177 ס"מ, יעד ירידה במשקל + ריצה לפי תוכנית גרמין 10 קמ/שעה).
היום המבוקש: ${targetDay.label} (${targetPlan.typeLabel}). יעד: ${targetPlan.kcal} קל', חלבון 175-190 גר'.
ארוחות מתוכננות ליום זה:\n${mealsStr}
ערכים ל-100 גר' (לפני בישול): סינטה/שייטל 250קל/26חלבון, פרגית 180קל/22חלבון, סלמון 208קל/20חלבון, שרימפס 99קל/24חלבון, טונה 116קל/26חלבון, ביצה(60גר') 78קל/6חלבון, בטטה 86קל/1.6חלבון, תפו"א 77קל/2חלבון, אורז מלא(יבש) 370קל/7.5חלבון, יוגורט חלבון (Skyr/דנונה פרו) 95קל/12חלבון.
כשמשתמש מציע מה יש לו ורוצה תחליף לארוחה:
1) חשב גרמים מדויקים 2) השווה לתוכנית המקורית.
חובה: בסוף התשובה, בשורה נפרדת, כתוב בדיוק:
📋UPDATE:KEY|תיאור קצר של הארוחה המעודכנת|ערכים תזונתיים
כאשר KEY הוא אחד מ: ${Object.keys(targetPlan.meals).join(", ")}
אם לא בטוח לאיזו ארוחה, שאל את המשתמש.`,
        messages:newMsgs.slice(1).map(m=>({role:m.role,content:m.content}))
      })});
      const d=await res.json(); const text=d.content?.[0]?.text||"שגיאה.";
      const upd=text.match(/📋\s*UPDATE\s*:\s*(m1|m2|dessert|recovery)\s*\|\s*([^|\n]+)\s*\|\s*([^\n]+)/i);
      if(upd) {
        setPending({key:upd[1].trim(), items:upd[2].trim(), kcal:upd[3].trim(), targetDayIdx:targetDay.idx, targetDateKey, targetDayLabel:targetDay.label, targetPlan});
      } else if(/\d/.test(text) && (text.includes("גר'")||text.includes("גרם"))) {
        setPending({key:"m1", items:text.replace(/📋.*$/s,"").trim().slice(0,300), kcal:"לפי חישוב AI", fallback:true, targetDayIdx:targetDay.idx, targetDateKey, targetDayLabel:targetDay.label, targetPlan});
      }
      setMsgs(m=>[...m,{role:"assistant",content:text.replace(/📋\s*UPDATE\s*:.*/is,"").trim()}]);
    } catch { setMsgs(m=>[...m,{role:"assistant",content:"שגיאת חיבור."}]); }
    setLoading(false);
  }

  function applyPending() {
    if(!pending) return;
    // Save to the correct date's overrides
    const storageKey = "fitness_tamir_v5";
    try {
      const d = JSON.parse(localStorage.getItem(storageKey)||"{}");
      const ovKey = `overrides_${pending.targetDateKey}`;
      d[ovKey] = {...(d[ovKey]||{}), [pending.key]: {items:pending.items, kcal:pending.kcal}};
      localStorage.setItem(storageKey, JSON.stringify(d));
    } catch {}
    // Also call onMealUpdate if it's today
    const todayDayIdx = new Date().getDay();
    if(pending.targetDayIdx === todayDayIdx) {
      onMealUpdate(pending.key, {items:pending.items, kcal:pending.kcal});
    }
    const mealName = pending.targetPlan?.meals[pending.key]?.name || pending.key;
    setMsgs(m=>[...m,{role:"assistant",content:`✅ שמרתי את "${mealName}" עבור ${pending.targetDayLabel}!\n${pending.items}\n${pending.kcal}`}]);
    setPending(null);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 230px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,background:"#1a1a2e",borderRadius:10,padding:"8px 12px",border:"1px solid #f59e0b33"}}>
        <div style={{fontSize:11,color:"#f59e0b"}}>{DAY_NAMES[dayIdx]} · {plan.kcal.toLocaleString()} קל' · 💧{plan.water}L</div>
        <button onClick={clearChat} style={{fontSize:11,padding:"3px 9px",background:"none",border:"1px solid #333",borderRadius:7,color:"#555",cursor:"pointer"}}>🗑 נקה</button>
      </div>
      {pending && <div style={{background:"#22c55e0d",border:"1px solid #22c55e44",borderRadius:11,padding:10,marginBottom:8}}>
        <div style={{fontSize:11,color:"#22c55e",fontWeight:700,marginBottom:3}}>🍽️ לשמור עבור {pending.targetDayLabel}?</div>
        <div style={{fontSize:12,color:"#ccc",marginBottom:7,lineHeight:1.5}}>{pending.items}<br/><span style={{color:"#888"}}>{pending.kcal}</span></div>
        <div style={{fontSize:11,color:"#888",marginBottom:5}}>איזו ארוחה?</div>
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
          {Object.entries(pending.targetPlan?.meals||plan.meals).map(([k,m])=>(
            <button key={k} onClick={()=>setPending(p=>({...p,key:k}))} style={{fontSize:11,padding:"4px 10px",borderRadius:8,border:`1px solid ${pending.key===k?"#22c55e":"#333"}`,background:pending.key===k?"#22c55e22":"#0a0a14",color:pending.key===k?"#22c55e":"#888",cursor:"pointer"}}>{m.name} ({m.time})</button>
          ))}
        </div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={applyPending} style={{flex:1,background:"#22c55e",border:"none",borderRadius:9,padding:8,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>✅ שמור</button>
          <button onClick={()=>setPending(null)} style={{flex:1,background:"#222",border:"1px solid #333",borderRadius:9,padding:8,color:"#888",fontSize:12,cursor:"pointer"}}>ביטול</button>
        </div>
      </div>}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,paddingBottom:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-start":"flex-end"}}>
            <div style={{maxWidth:"88%",background:m.role==="user"?"#1e3a5f":"#1a1a2e",border:`1px solid ${m.role==="user"?"#3b82f644":"#2a2a3e"}`,borderRadius:m.role==="user"?"13px 13px 13px 3px":"13px 13px 3px 13px",padding:"8px 11px",fontSize:12,color:"#ddd",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:"#1a1a2e",border:"1px solid #2a2a3e",borderRadius:"13px 13px 3px 13px",padding:"8px 14px",color:"#555",fontSize:16}}>•••</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:7,marginTop:7}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="מה יש לך במקרר?" style={{flex:1,background:"#1a1a2e",border:"1px solid #333",borderRadius:11,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",direction:"rtl"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?"#222":"#3b82f6",border:"none",borderRadius:11,padding:"10px 14px",color:"#fff",fontSize:16,cursor:"pointer"}}>➤</button>
      </div>
      <div style={{marginTop:7,display:"flex",gap:5,flexWrap:"wrap"}}>
        {["יש לי סינטה וביצים","יש לי עוף ובטטה","מחר יש לי רק סלמון","ביום שני יש לי עוף"].map(q=>(
          <button key={q} onClick={()=>setInput(q)} style={{fontSize:11,padding:"4px 9px",background:"#0a0a14",border:"1px solid #222",borderRadius:18,color:"#777",cursor:"pointer"}}>{q}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Day Type Picker Modal ────────────────────────────────────────────────────
function DayTypePicker({ dayIdx, current, onSave, onClose }) {
  const [selected, setSelected] = useState(current);
  return (
    <div style={{position:"fixed",inset:0,background:"#000000dd",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 0 0 0"}}>
      <div style={{background:"#1a1a2e",borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:430,border:"1px solid #333"}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:4,textAlign:"center"}}>שנה יום {DAY_NAMES[dayIdx]}</div>
        <div style={{fontSize:11,color:"#666",textAlign:"center",marginBottom:14}}>בחר סוג אימון ליום זה</div>
        {DAY_TYPE_OPTIONS.map(opt=>(
          <button key={opt.id} onClick={()=>setSelected(opt.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,background:selected===opt.id?`${opt.color}22`:"#0a0a14",border:`1px solid ${selected===opt.id?opt.color:"#222"}`,borderRadius:12,padding:"10px 14px",marginBottom:7,cursor:"pointer",textAlign:"right"}}>
            <div style={{width:20,height:20,borderRadius:6,background:selected===opt.id?opt.color:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{selected===opt.id?"✓":""}</div>
            <span style={{fontSize:13,color:selected===opt.id?"#fff":"#999",flex:1}}>{opt.label}</span>
          </button>
        ))}
        <div style={{display:"flex",gap:9,marginTop:4}}>
          <button onClick={onClose} style={{flex:1,background:"#222",border:"1px solid #333",borderRadius:12,padding:12,color:"#888",fontSize:13,cursor:"pointer"}}>ביטול</button>
          <button onClick={()=>onSave(selected)} style={{flex:1,background:"#3b82f6",border:"none",borderRadius:12,padding:12,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>שמור</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(()=>migrateWeekTypes(load()));
  const [tab, setTab] = useState("today");
  const [aiSub, setAiSub] = useState("audit");
  const [selDay, setSelDay] = useState(new Date().getDay());
  const [wInput, setWInput] = useState("");
  const [showW, setShowW] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [pickerDay, setPickerDay] = useState(null);

  useEffect(()=>{ save(data); },[data]);

  const todayKey = new Date().toISOString().slice(0,10);
  const todayIdx = new Date().getDay();

  // Week plan with overrides
  const weekTypes = data.weekTypes || DEFAULT_WEEK;
  const getPlan = idx => DAY_TYPES[weekTypes[idx]] || DAY_TYPES[DEFAULT_WEEK[idx]];
  const todayPlan = getPlan(todayIdx);
  const selPlan = getPlan(selDay);

  const checks = data[todayKey]||{};
  const shopChecked = data.shop||{};
  const mealOverrides = data[`overrides_${todayKey}`]||{};

  function toggle(k) {
    setData(d=>({...d,[todayKey]:{...(d[todayKey]||{}),[k]:!(d[todayKey]||{})[k]}}));
    if(!checks[k]){ setConfetti(true); setTimeout(()=>setConfetti(false),1200); }
  }
  function toggleShop(k) { setData(d=>({...d,shop:{...(d.shop||{}),[k]:!(d.shop||{})[k]}})); }
  function resetShop() { setData(d=>({...d,shop:{}})); }
  function logWeight(w) { setData(d=>({...d,weights:[...(d.weights||[]),{date:todayKey,w:parseFloat(w)}]})); setWInput(""); setShowW(false); }
  function handleMealUpdate(k,v) { setData(d=>({...d,[`overrides_${todayKey}`]:{...(d[`overrides_${todayKey}`]||{}),[k]:v}})); }
  function resetOverrides() { setData(d=>{const n={...d};delete n[`overrides_${todayKey}`];return n;}); }
  function saveWeekType(dayIdx, typeId) { const wt=[...weekTypes]; wt[dayIdx]=typeId; setData(d=>({...d,weekTypes:wt})); setPickerDay(null); }

  const tc = t=>({run:COLORS.run,strength:COLORS.strength,rest:COLORS.rest}[t]||COLORS.rest);
  const streak=(()=>{let c=0,d=new Date();while(true){const k=d.toISOString().slice(0,10),ch=data[k]||{};if(Object.values(ch).some(Boolean)){c++;d.setDate(d.getDate()-1);}else break;}return c;})();
  const weights=data.weights||[];
  const pct=Math.round((Object.values(checks).filter(Boolean).length/5)*100);
  const shopTotal=SHOP_CATS.reduce((a,c)=>a+c.items.length,0);
  const shopDone=Object.values(shopChecked).filter(Boolean).length;
  const shopPct=Math.round((shopDone/shopTotal)*100);
  const S=s=>s;

  return (
    <div dir="rtl" style={S({fontFamily:"'Segoe UI',Tahoma,sans-serif",background:COLORS.bg,minHeight:"100vh",color:"#fff",maxWidth:430,margin:"0 auto",position:"relative"})}>
      <style>{`@keyframes pop{0%{transform:scale(0);opacity:0}30%{transform:scale(1.4);opacity:1}70%{transform:scale(1);opacity:1}100%{transform:scale(0.8);opacity:0}}@keyframes slideIn{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}.btn{transition:all 0.15s;cursor:pointer;}.btn:active{transform:scale(0.96);}`}</style>

      {confetti&&<div style={S({position:"fixed",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,pointerEvents:"none"})}><div style={S({fontSize:80,animation:"pop 1.2s ease forwards"})}>✅</div></div>}
      {pickerDay!==null && <DayTypePicker dayIdx={pickerDay} current={weekTypes[pickerDay]} onSave={(t)=>saveWeekType(pickerDay,t)} onClose={()=>setPickerDay(null)}/>}

      {/* Header */}
      <div style={S({background:`linear-gradient(135deg,${tc(todayPlan.type)}22,${COLORS.card})`,padding:"16px 16px 12px",borderBottom:`1px solid ${tc(todayPlan.type)}44`})}>
        <div style={S({display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8})}>
          <div>
            <div style={S({fontSize:11,color:"#777",marginBottom:1})}>{new Date().toLocaleDateString("he-IL",{weekday:"long",day:"numeric",month:"long"})}</div>
            <div style={S({fontSize:19,fontWeight:700,marginBottom:4})}>שלום תמיר 👋</div>
            <button className="btn" onClick={()=>setPickerDay(todayIdx)} style={S({background:`${tc(todayPlan.type)}33`,border:`1px solid ${tc(todayPlan.type)}66`,borderRadius:20,padding:"3px 10px",fontSize:12,color:tc(todayPlan.type),fontWeight:600,display:"inline-flex",alignItems:"center",gap:5})}>
              {todayPlan.typeLabel} <span style={{fontSize:10,opacity:0.7}}>✏️</span>
            </button>
          </div>
          <div style={S({textAlign:"center"})}><div style={S({fontSize:24,fontWeight:800,color:streak>0?"#f59e0b":"#444"})}>🔥{streak}</div><div style={S({fontSize:10,color:"#666"})}>ימים ברצף</div></div>
        </div>
        <div style={S({display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",marginBottom:3})}><span>התקדמות היום</span><span style={S({color:pct===100?"#22c55e":"#fff"})}>{pct}%</span></div>
        <div style={S({background:"#333",borderRadius:6,height:5,overflow:"hidden"})}><div style={S({width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${tc(todayPlan.type)},${pct===100?"#f59e0b":tc(todayPlan.type)})`,borderRadius:6,transition:"width 0.5s"})}/></div>
      </div>

      {/* Tabs */}
      <div style={S({display:"flex",background:COLORS.card,borderBottom:"1px solid #222",overflowX:"auto"})}>
        {[["today","היום"],["week","השבוע"],["ai","🤖 AI"],["shop","🛒"],["stats","נתונים"]].map(([id,lb])=>(
          <button key={id} className="btn" onClick={()=>setTab(id)} style={S({flex:1,minWidth:58,padding:"10px 3px",background:"none",border:"none",color:tab===id?"#fff":"#555",fontSize:11,fontWeight:tab===id?700:400,borderBottom:tab===id?`2px solid ${id==="ai"?"#3b82f6":tc(todayPlan.type)}`:"2px solid transparent",whiteSpace:"nowrap"})}>{lb}</button>
        ))}
      </div>

      <div style={S({padding:14,paddingBottom:tab==="ai"?14:80,animation:"slideIn 0.3s ease"})}>

        {/* TODAY */}
        {tab==="today"&&<div>
          <div style={S({background:COLORS.card,borderRadius:16,padding:14,marginBottom:12,border:"1px solid #222"})}>
            <div style={S({fontSize:13,fontWeight:700,marginBottom:10,color:"#ddd"})}>✅ צ'קליסט היום</div>
            {[{k:"workout",lb:`אימון – ${todayPlan.typeLabel}`,ic:"",cl:tc(todayPlan.type)},{k:"meal1",lb:"ארוחה ראשונה – 13:00",ic:"🍽️",cl:COLORS.food},{k:"meal2",lb:"ארוחת ערב – 20:00",ic:"🥩",cl:"#ef4444"},{k:"dessert",lb:"קינוח חלבון – 21:00",ic:"🍨",cl:"#ec4899"},{k:"water",lb:`${todayPlan.water} ליטר מים`,ic:"💧",cl:COLORS.water}].map(({k,lb,ic,cl})=>(
              <button key={k} className="btn" onClick={()=>toggle(k)} style={S({width:"100%",display:"flex",alignItems:"center",gap:10,background:checks[k]?`${cl}22`:"#0a0a14",border:`1px solid ${checks[k]?cl:"#222"}`,borderRadius:12,padding:"9px 12px",marginBottom:7,textAlign:"right"})}>
                <div style={S({width:22,height:22,borderRadius:7,background:checks[k]?cl:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,transition:"all 0.2s"})}>{checks[k]?"✓":""}</div>
                <span style={S({fontSize:13,color:checks[k]?"#fff":"#999",flex:1})}>{ic} {lb}</span>
              </button>
            ))}
          </div>
          <div style={S({background:COLORS.card,borderRadius:16,padding:14,marginBottom:12,border:`1px solid ${tc(todayPlan.type)}44`})}>
            <div style={S({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8})}>
              <div style={S({fontSize:13,fontWeight:700,color:tc(todayPlan.type)})}>{todayPlan.training.name}</div>
              <div style={S({fontSize:11,color:"#777",background:"#111",borderRadius:6,padding:"2px 7px"})}>⏱ {todayPlan.training.duration}</div>
            </div>
            {todayPlan.training.exercises.map((ex,i)=>(
              <div key={i} style={S({display:"flex",alignItems:"center",gap:7,padding:"4px 0",borderBottom:i<todayPlan.training.exercises.length-1?"1px solid #1a1a2e":"none"})}>
                <div style={S({width:5,height:5,borderRadius:"50%",background:tc(todayPlan.type),flexShrink:0})}/>
                <span style={S({fontSize:12,color:"#bbb"})}>{ex}</span>
              </div>
            ))}
          </div>
          <div style={S({background:COLORS.card,borderRadius:16,padding:14,border:"1px solid #f59e0b44"})}>
            <div style={S({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10})}>
              <div style={S({fontSize:13,fontWeight:700,color:COLORS.food})}>🍽️ ארוחות היום</div>
              <div style={S({display:"flex",gap:6})}>
                {Object.keys(mealOverrides).length>0&&<button className="btn" onClick={resetOverrides} style={S({fontSize:11,padding:"3px 8px",background:"#ef444422",border:"1px solid #ef444444",borderRadius:7,color:"#ef4444"})}>↺ איפוס</button>}
                <button className="btn" onClick={()=>setTab("ai")} style={S({fontSize:11,padding:"3px 10px",background:"#3b82f622",border:"1px solid #3b82f644",borderRadius:8,color:"#3b82f6"})}>🤖 AI</button>
              </div>
            </div>
            {Object.entries(todayPlan.meals).map(([k,meal],i)=>{
              const ov=mealOverrides[k];
              return (<div key={i} style={S({background:ov?"#22c55e0a":"#0a0a14",borderRadius:11,padding:11,marginBottom:7,border:`1px solid ${ov?"#22c55e33":"#1a1a2e"}`})}>
                <div style={S({display:"flex",justifyContent:"space-between",marginBottom:3})}>
                  <div style={S({display:"flex",alignItems:"center",gap:6})}>
                    <span style={S({fontSize:13,fontWeight:600})}>{meal.name}</span>
                    {ov&&<span style={S({fontSize:10,color:"#22c55e",background:"#22c55e22",borderRadius:5,padding:"1px 5px"})}>🤖 AI</span>}
                  </div>
                  <span style={S({fontSize:11,color:COLORS.food,background:"#f59e0b22",borderRadius:6,padding:"1px 7px"})}>{meal.time}</span>
                </div>
                <div style={S({fontSize:12,color:ov?"#ccc":"#aaa",marginBottom:3,lineHeight:1.5})}>{ov?ov.items:meal.items}</div>
                <div style={S({fontSize:11,color:"#555"})}>{ov?ov.kcal:meal.kcal}</div>
              </div>);
            })}
            <div style={S({padding:"6px 10px",background:"#f59e0b11",borderRadius:9,fontSize:11,color:"#f59e0b",textAlign:"center"})}>יעד: {todayPlan.kcal.toLocaleString()} קל' | 💧{todayPlan.water}L | ⚠️ גרמים = לפני בישול</div>
          </div>
        </div>}

        {/* WEEK */}
        {tab==="week"&&<div>
          <div style={S({display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4})}>
            {DAY_NAMES.map((d,i)=>(
              <button key={i} className="btn" onClick={()=>setSelDay(i)} style={S({flexShrink:0,background:selDay===i?tc(getPlan(i).type):"#1a1a2e",border:`1px solid ${selDay===i?tc(getPlan(i).type):"#333"}`,borderRadius:11,padding:"5px 10px",color:selDay===i?"#000":"#777",fontSize:11,fontWeight:selDay===i?700:400,position:"relative"})}>
                {i===todayIdx&&<div style={S({position:"absolute",top:-3,right:-3,width:7,height:7,borderRadius:"50%",background:"#f59e0b"})}/>}
                {d}
              </button>
            ))}
          </div>
          <div style={S({background:COLORS.card,borderRadius:16,padding:14,marginBottom:12,border:`1px solid ${tc(selPlan.type)}44`})}>
            <div style={S({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8})}>
              <div style={S({fontSize:15,fontWeight:700})}>{DAY_NAMES[selDay]}</div>
              <div style={S({display:"flex",alignItems:"center",gap:8})}>
                <div style={S({background:`${tc(selPlan.type)}33`,borderRadius:20,padding:"3px 10px",fontSize:12,color:tc(selPlan.type),fontWeight:600})}>{selPlan.typeLabel}</div>
                <button className="btn" onClick={()=>setPickerDay(selDay)} style={S({background:"#222",border:"1px solid #333",borderRadius:8,padding:"4px 9px",color:"#888",fontSize:11})}>✏️ שנה</button>
              </div>
            </div>
            <div style={S({fontSize:13,fontWeight:600,color:tc(selPlan.type),marginBottom:7})}>{selPlan.training.name}</div>
            {selPlan.training.exercises.map((ex,i)=>(
              <div key={i} style={S({display:"flex",alignItems:"center",gap:7,padding:"3px 0",fontSize:12,color:"#bbb"})}>
                <div style={S({width:4,height:4,borderRadius:"50%",background:tc(selPlan.type),flexShrink:0})}/>{ex}
              </div>
            ))}
          </div>
          <div style={S({background:COLORS.card,borderRadius:16,padding:14,border:"1px solid #333"})}>
            <div style={S({fontSize:13,fontWeight:700,marginBottom:10,color:COLORS.food})}>🍽️ ארוחות {DAY_NAMES[selDay]}</div>
            {Object.values(selPlan.meals).map((meal,i)=>(
              <div key={i} style={S({background:"#0a0a14",borderRadius:10,padding:10,marginBottom:7})}>
                <div style={S({display:"flex",justifyContent:"space-between",marginBottom:3})}><span style={S({fontSize:13,fontWeight:600})}>{meal.name}</span><span style={S({fontSize:11,color:"#777"})}>{meal.time}</span></div>
                <div style={S({fontSize:12,color:"#999",lineHeight:1.5})}>{meal.items}</div>
                <div style={S({fontSize:11,color:"#555",marginTop:2})}>{meal.kcal}</div>
              </div>
            ))}
            <div style={S({padding:"5px 10px",background:"#ffffff08",borderRadius:7,fontSize:11,color:"#555",marginTop:4})}>⚠️ כל הגרמים הם לפני בישול</div>
          </div>
        </div>}

        {/* AI */}
        {tab==="ai"&&<div>
          <div style={S({display:"flex",gap:6,marginBottom:14})}>
            {[["audit","🩺 וידוא"],["chat","💬 צ'אט"],["garmin","⌚ גרמין"]].map(([id,lb])=>(
              <button key={id} className="btn" onClick={()=>setAiSub(id)} style={S({flex:1,padding:"8px 4px",background:aiSub===id?"#1a1a2e":"#0a0a14",border:`1px solid ${aiSub===id?"#3b82f6":"#222"}`,borderRadius:10,color:aiSub===id?"#3b82f6":"#555",fontSize:12,fontWeight:aiSub===id?700:400})}>{lb}</button>
            ))}
          </div>
          {aiSub==="audit"&&<DailyAudit plan={todayPlan} dayIdx={todayIdx} mealOverrides={mealOverrides} onMealUpdate={handleMealUpdate}/>}
          {aiSub==="chat"&&<AIChat plan={todayPlan} dayIdx={todayIdx} onMealUpdate={handleMealUpdate} mealOverrides={mealOverrides} getPlan={getPlan} weekTypes={weekTypes}/>}
          {aiSub==="garmin"&&<GarminAnalysis plan={todayPlan} dayIdx={todayIdx}/>}
        </div>}

        {/* SHOP */}
        {tab==="shop"&&<div>
          <div style={S({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10})}>
            <div style={S({fontSize:15,fontWeight:700})}>🛒 קניות שבועיות</div>
            <button className="btn" onClick={resetShop} style={S({fontSize:12,padding:"5px 12px",background:"#222",border:"1px solid #333",borderRadius:9,color:"#888"})}>אפס</button>
          </div>
          <div style={S({marginBottom:12})}>
            <div style={S({display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",marginBottom:4})}><span>{shopDone} מתוך {shopTotal} פריטים</span><span style={S({color:shopPct===100?"#22c55e":"#fff"})}>{shopPct}%</span></div>
            <div style={S({background:"#333",borderRadius:5,height:5,overflow:"hidden"})}><div style={S({width:`${shopPct}%`,height:"100%",background:"#22c55e",borderRadius:5,transition:"width 0.4s"})}/></div>
          </div>
          {SHOP_CATS.map((cat,ci)=>{
            const catDone=cat.items.filter((_,ii)=>shopChecked[`${ci}_${ii}`]).length;
            return (<div key={ci} style={S({background:COLORS.card,borderRadius:14,padding:12,marginBottom:10,border:`1px solid ${cat.color}33`})}>
              <div style={S({display:"flex",alignItems:"center",gap:8,marginBottom:8})}><span style={S({fontSize:16})}>{cat.icon}</span><span style={S({fontSize:13,fontWeight:700,color:"#ddd",flex:1})}>{cat.name}</span><span style={S({fontSize:11,color:cat.color,background:`${cat.color}22`,borderRadius:6,padding:"2px 8px"})}>{catDone}/{cat.items.length}</span></div>
              {cat.items.map((item,ii)=>{ const k=`${ci}_${ii}`,done=!!shopChecked[k]; return (
                <button key={ii} className="btn" onClick={()=>toggleShop(k)} style={S({width:"100%",display:"flex",alignItems:"center",gap:9,background:done?`${cat.color}18`:"#0a0a14",border:`1px solid ${done?cat.color:"#1a1a2e"}`,borderRadius:9,padding:"7px 10px",marginBottom:5,textAlign:"right"})}>
                  <div style={S({width:18,height:18,borderRadius:5,background:done?cat.color:"#222",border:done?"none":"1px solid #444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,color:"#fff"})}>{done?"✓":""}</div>
                  <span style={S({fontSize:12,color:done?"#888":"#ccc",textDecoration:done?"line-through":"none",flex:1})}>{item.n}</span>
                  <span style={S({fontSize:11,color:"#555",flexShrink:0})}>{item.a}</span>
                </button>
              );})}
            </div>);
          })}
          <div style={S({background:"#22c55e11",border:"1px solid #22c55e33",borderRadius:12,padding:10,fontSize:12,color:"#22c55e"})}>💡 קנה ביום ראשון · הקפא בשר ודגים שלא תשתמש בהם תוך 2 ימים</div>
        </div>}

        {/* STATS */}
        {tab==="stats"&&<div>
          <div style={S({display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12})}>
            {[{label:"ימים ברצף",value:streak,unit:"🔥",color:"#f59e0b"},{label:"משקל נוכחי",value:weights.length?weights[weights.length-1].w:"—",unit:"ק\"ג",color:"#22c55e"},{label:"יעד ריצה",value:"10 קמ/שעה",unit:"לפי תוכנית גרמין",color:"#3b82f6"},{label:"יעד משקל",value:"86–89",unit:"ק\"ג",color:"#a855f7"}].map((s,i)=>(
              <div key={i} style={S({background:COLORS.card,borderRadius:13,padding:13,border:`1px solid ${s.color}44`})}><div style={S({fontSize:11,color:"#777",marginBottom:3})}>{s.label}</div><div style={S({fontSize:22,fontWeight:800,color:s.color})}>{s.value}</div><div style={S({fontSize:11,color:"#555"})}>{s.unit}</div></div>
            ))}
          </div>

          {/* Week overview */}
          <div style={S({background:COLORS.card,borderRadius:16,padding:14,marginBottom:12,border:"1px solid #333"})}>
            <div style={S({fontSize:13,fontWeight:700,marginBottom:10})}>📅 סקירת השבוע</div>
            <div style={S({display:"flex",gap:5,flexWrap:"wrap"})}>
              {DAY_NAMES.map((d,i)=>{ const p=getPlan(i); return (
                <button key={i} className="btn" onClick={()=>setPickerDay(i)} style={S({background:i===todayIdx?`${tc(p.type)}22`:"#0a0a14",border:`1px solid ${i===todayIdx?tc(p.type):"#222"}`,borderRadius:9,padding:"5px 8px",textAlign:"center",flex:1,minWidth:40})}>
                  <div style={S({fontSize:10,color:"#666",marginBottom:2})}>{d.slice(0,3)}</div>
                  <div style={S({fontSize:15})}>{p.type==="run"?"🏃":p.type==="strength"?"💪":"🧘"}</div>
                </button>
              );})}
            </div>
            <div style={S({fontSize:11,color:"#555",textAlign:"center",marginTop:8})}>לחץ על יום לשינוי סוג האימון</div>
          </div>

          <div style={S({background:COLORS.card,borderRadius:16,padding:14,marginBottom:12,border:"1px solid #333"})}>
            <div style={S({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10})}><div style={S({fontSize:13,fontWeight:700})}>📊 יומן משקל</div><button className="btn" onClick={()=>setShowW(true)} style={S({background:"#22c55e33",border:"1px solid #22c55e66",borderRadius:9,padding:"4px 11px",color:"#22c55e",fontSize:12})}>+ הוסף</button></div>
            {weights.length===0?<div style={S({textAlign:"center",color:"#444",fontSize:13,padding:"16px 0"})}>עדיין אין נתונים – תתחיל לשקול!</div>:(
              <div>
                {weights.slice(-6).reverse().map((w,i)=>(
                  <div key={i} style={S({display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #1a1a2e",fontSize:13})}><span style={S({color:"#777"})}>{new Date(w.date).toLocaleDateString("he-IL")}</span><span style={S({fontWeight:700,color:i===0?"#22c55e":"#ccc"})}>{w.w} ק"ג</span></div>
                ))}
                {weights.length>1&&<div style={S({marginTop:9,padding:"8px 10px",background:"#0a0a14",borderRadius:9,textAlign:"center"})}><span style={S({fontSize:12,color:"#777"})}>שינוי מההתחלה: </span><span style={S({fontWeight:700,fontSize:15,color:weights[weights.length-1].w<weights[0].w?"#22c55e":"#ef4444"})}>{(weights[weights.length-1].w-weights[0].w).toFixed(1)} ק"ג</span></div>}
              </div>
            )}
          </div>
          <div style={S({background:"#a855f711",borderRadius:14,padding:13,border:"1px solid #a855f744"})}>
            <div style={S({fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:7})}>⚡ כללי ברזל</div>
            {["לעולם לא פעמיים ברצף","הבוקר נשמר גם בחופשות","קניות ביום ראשון","לא לדון עם עצמך בבוקר","ארוחת שבת = חלק מהתוכנית"].map((r,i)=>(
              <div key={i} style={S({display:"flex",gap:7,padding:"3px 0",fontSize:12,color:"#ccc"})}><span style={S({color:"#a855f7"})}>◆</span>{r}</div>
            ))}
          </div>
        </div>}

        {/* USA TAB */}
      </div>

      {showW&&<div style={S({position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24})}>
        <div style={S({background:COLORS.card,borderRadius:20,padding:22,width:"100%",maxWidth:300,border:"1px solid #333"})}>
          <div style={S({fontSize:15,fontWeight:700,marginBottom:14,textAlign:"center"})}>⚖️ רישום משקל</div>
          <input type="number" step="0.1" placeholder="לדוגמה: 99.5" value={wInput} onChange={e=>setWInput(e.target.value)} style={S({width:"100%",background:"#0a0a14",border:"1px solid #333",borderRadius:11,padding:"11px 14px",color:"#fff",fontSize:16,textAlign:"center",outline:"none",marginBottom:11})}/>
          <div style={S({display:"flex",gap:9})}>
            <button className="btn" onClick={()=>setShowW(false)} style={S({flex:1,background:"#222",border:"1px solid #333",borderRadius:11,padding:11,color:"#888",fontSize:13})}>ביטול</button>
            <button className="btn" onClick={()=>wInput&&logWeight(wInput)} style={S({flex:1,background:"#22c55e",border:"none",borderRadius:11,padding:11,color:"#000",fontSize:13,fontWeight:700})}>שמור</button>
          </div>
        </div>
      </div>}

      {tab!=="ai"&&<div style={S({position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${COLORS.card}ee`,borderTop:"1px solid #222",padding:"9px 14px",display:"flex",justifyContent:"center",gap:8,fontSize:11,color:"#444"})}>
        <span>💧 שתה מים</span><span>·</span><span>🔥 שמור רצף</span><span>·</span><span>💪 לא פעמיים</span>
      </div>}
    </div>
  );
}
