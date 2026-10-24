// Local wall time is a view of the stored instant, never a second source of truth.
export function countdownISOToLocal(value){
 if(typeof value!=='string'||!value)return '';
 const date=new Date(value);
 if(!Number.isFinite(date.getTime()))return '';
 const pad=(number,length=2)=>String(number).padStart(length,'0');
 const time=`${pad(date.getFullYear(),4)}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
 const seconds=date.getSeconds(),milliseconds=date.getMilliseconds();
 return time+(seconds||milliseconds?`:${pad(seconds)}`:'')+(milliseconds?`.${pad(milliseconds,3)}`:'');
}
export function countdownLocalToISO(value){
 if(value==='')return '';
 const parts=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value);
 if(!parts)throw Error('Érvénytelen helyi időpont.');
 const expected=parts.slice(1,7).map(part=>Number(part||0));expected.push(Number((parts[7]||'').padEnd(3,'0')));
 const date=new Date(value);
 const actual=[date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()];
 // Date normalizes spring-forward gaps and impossible dates. Never silently
 // schedule the event at that normalized, different wall time.
 if(!Number.isFinite(date.getTime())||actual.some((part,index)=>part!==expected[index]))throw Error('Ez a helyi időpont nem létezik az időzónádban, vagy érvénytelen. Válassz másikat.');
 if(date.getUTCFullYear()<2000||date.getUTCFullYear()>2100)throw Error('Az esemény időpontja 2000 és 2100 közé essen.');
 return date.toISOString();
}
