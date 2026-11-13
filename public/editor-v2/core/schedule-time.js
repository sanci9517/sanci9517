/* Shared Europe/Budapest stream clock conversion. Do not guess the
 * visitor's device timezone: schedule_items without an offset are Budapest
 * wall-clock times. Validate both CET/CEST offsets, including DST gaps/folds.
 */
const budapest=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Budapest',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
const wall=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?$/;
const zone=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i;
export function scheduleStartEpoch(value){
  if(typeof value!=='string')return null;
  if(zone.test(value)){
    const t=Date.parse(value);return Number.isFinite(t)?t:null;
  }
  const match=wall.exec(value);
  if(!match)return null;
  const [,y,mo,d,h,mi,s='0']=match;
  const fields=[Number(y),Number(mo),Number(d),Number(h),Number(mi),Number(s)];
  if(fields[0]<2000||fields[0]>2100||fields[1]<1||fields[1]>12||fields[2]<1||fields[2]>31||fields[3]>23||fields[4]>59||fields[5]>59)return null;
  const asUTC=Date.UTC(...[fields[0],fields[1]-1,fields[2],fields[3],fields[4],fields[5]]);
  const expected=[y,mo,d,h,mi,String(s).padStart(2,'0')];
  const matches=[];
  for(const offset of [2,1]){
    const candidate=asUTC-offset*3600000;
    const parts=Object.fromEntries(budapest.formatToParts(candidate).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    const actual=[parts.year,parts.month,parts.day,parts.hour,parts.minute,parts.second];
    if(expected.every((v,i)=>v===actual[i]))matches.push(candidate);
  }
  // Fall DST overlap is ambiguous without an explicit offset: choose earlier
  // occurrence deterministically. Invalid spring-forward local time is rejected.
  return matches.length?Math.min(...matches):null;
}
export function scheduleStartISO(value){
  const epoch=scheduleStartEpoch(value);
  return epoch===null?'':new Date(epoch).toISOString();
}
