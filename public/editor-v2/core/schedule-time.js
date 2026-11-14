/* Shared Europe/Budapest stream clock conversion. Do not guess the
 * visitor's device timezone: schedule_items without an offset are Budapest
 * wall-clock times. Validate both CET/CEST offsets, including DST gaps/folds.
 */
const budapest=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Budapest',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
const wall=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/;
const zone=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|([+-])(\d{2}):(\d{2}))$/i;
function validCalendar(match){
  const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
  const hour=Number(match[4]),minute=Number(match[5]),second=Number(match[6]||0);
  const leap=year%4===0&&(year%100!==0||year%400===0);
  const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  return year>=2000&&year<=2100&&month>=1&&month<=12&&day>=1&&day<=days[month-1]
    &&hour>=0&&hour<=23&&minute>=0&&minute<=59&&second>=0&&second<=59;
}
export function scheduleStartEpoch(value){
  if(typeof value!=='string')return null;
  const explicit=zone.exec(value);
  if(explicit){
    // Date.parse silently normalizes impossible calendar days such as Feb 30.
    // Source imports must never turn a malformed stream date into a real timer.
    if(!validCalendar(explicit))return null;
    if(explicit[8]&&(Number(explicit[9])>23||Number(explicit[10])>59))return null;
    const t=Date.parse(value);return Number.isFinite(t)?t:null;
  }
  const match=wall.exec(value);
  if(!match||!validCalendar(match))return null;
  const [,y,mo,d,h,mi,s='0',fraction='']=match;
  const fields=[Number(y),Number(mo),Number(d),Number(h),Number(mi),Number(s)];
  const ms=Number(fraction.padEnd(3,'0')||0);
  const asUTC=Date.UTC(fields[0],fields[1]-1,fields[2],fields[3],fields[4],fields[5],ms);
  const expected=[y,mo,d,h,mi,String(s).padStart(2,'0')];
  const matches=[];
  for(const offset of [2,1]){
    const candidate=asUTC-offset*3600000;
    const parts=Object.fromEntries(budapest.formatToParts(candidate).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    const actual=[parts.year,parts.month,parts.day,parts.hour,parts.minute,parts.second];
    if(expected.every((v,i)=>v===actual[i]))matches.push(candidate);
  }
  // An autumn overlap has two real instants; prefer the earlier occurrence.
  // A spring-forward gap has none: never silently shift to another hour.
  return matches.length?Math.min(...matches):null;
}
export function scheduleStartISO(value){
  const epoch=scheduleStartEpoch(value);
  return epoch===null?'':new Date(epoch).toISOString();
}
