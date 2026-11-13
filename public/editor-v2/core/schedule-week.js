export const SCHEDULE_TIME_ZONE = 'Europe/Budapest';
const WEEKDAYS = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
const huDate = new Intl.DateTimeFormat('hu-HU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const huMonth = new Intl.DateTimeFormat('hu-HU', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const localClock = new Intl.DateTimeFormat('hu-HU', { timeZone: SCHEDULE_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const localDate = new Intl.DateTimeFormat('en-GB', { timeZone: SCHEDULE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function validDateKey(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const date = new Date(`${key}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === key;
}
export function addCalendarDays(key, days) {
  if (!validDateKey(key) || !Number.isInteger(days) || Math.abs(days) > 3700) throw new Error('Invalid calendar date');
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function mondayOf(key) {
  if (!validDateKey(key)) throw new Error('Invalid calendar date');
  const day = new Date(`${key}T12:00:00Z`).getUTCDay();
  return addCalendarDays(key, -(day === 0 ? 6 : day - 1));
}
export function currentBudapestDate(now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Invalid timestamp');
  const parts = Object.fromEntries(localDate.formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function currentBudapestMonday(now = new Date()) { return mondayOf(currentBudapestDate(now)); }
export function shiftScheduleWeek(weekMonday, offset) {
  if (!Number.isInteger(offset) || Math.abs(offset) > 52) throw new Error('Invalid week offset');
  return addCalendarDays(mondayOf(weekMonday), offset * 7);
}
// Manual timestamps without offset represent Budapest local wall time.
// Provider ISO timestamps with Z/offset are converted to Europe/Budapest.
export function budapestEventDateTime(value) {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  const wall = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(raw);
  if (wall) {
    if (!validDateKey(wall[1]) || Number(wall[2]) > 23 || Number(wall[3]) > 59) return null;
    return { day: wall[1], time: `${wall[2]}:${wall[3]}` };
  }
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) return null;
  return { day: currentBudapestDate(date), time: localClock.format(date) };
}
export function weekScheduleDays(items, weekMonday) {
  const start = mondayOf(weekMonday), days = Array.from({length:7},(_,i)=>({date:addCalendarDays(start,i),items:[]}));
  if (!Array.isArray(items)) return days;
  for (const item of items) {
    const dateTime = budapestEventDateTime(item?.startsAt);
    if (!dateTime || dateTime.day < days[0].date || dateTime.day > days[6].date) continue;
    const idx = days.findIndex(d=>d.date===dateTime.day);
    days[idx].items.push({...item, displayTime:dateTime.time});
  }
  for (const day of days) day.items.sort((a,b)=>a.displayTime.localeCompare(b.displayTime)||String(a.id||'').localeCompare(String(b.id||'')));
  return days;
}
function safeExternalURL(value) {
  if (typeof value!=='string' || /[\u0000-\u001F\\]/.test(value)) return '';
  try {const url = new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';} catch {return '';}
}
function scheduleCard(item, config) {
  const time = escapeHTML(item.displayTime);
  const end = budapestEventDateTime(item.endsAt);
  const endText = end && config.showEndTime ? ` – ${escapeHTML(end.time)}` : '';
  const statusNames = {scheduled:'Tervezett',live:'Élő',completed:'Lezajlott',cancelled:'Elmarad'};
  const href = config.showLink ? safeExternalURL(item.url) : '';
  // Media IDs are site-owned server records, never unvalidated user URLs.
  const imageId = typeof item.imageAssetId==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.imageAssetId)
    ? item.imageAssetId.toLowerCase() : '';
  const image = imageId && config.showArtwork!==false
    ? `<img class="sanci-week-event-image" src="/media/${imageId}" alt="" loading="lazy" decoding="async">` : '';
  return `<article class="sanci-week-event${item.status==='live'?' is-live':''}${item.status==='cancelled'?' is-cancelled':''}">`+
    image+
    `${config.showTime?`<time class="sanci-week-event-time" datetime="${escapeHTML(item.startsAt)}">${time}${endText}</time>`:''}`+
    `${config.showTitle?`<strong class="sanci-week-event-title">${escapeHTML(item.title)}</strong>`:''}`+
    `${config.showPlatform?`<span class="sanci-week-event-platform">${escapeHTML(item.platform)}</span>`:''}`+
    `${config.showStatus?`<span class="sanci-week-event-status">${escapeHTML(statusNames[item.status]||item.status)}</span>`:''}`+
    `${config.showNotes&&item.notes?`<p class="sanci-week-event-notes">${escapeHTML(item.notes)}</p>`:''}`+
    `${href?`<a class="sanci-week-event-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">Csatorna megnyitása</a>`:''}`+
    `</article>`;
}
export function renderScheduleWeek(items, weekStart, config = {}, today = currentBudapestDate()) {
  const start = mondayOf(weekStart), days = weekScheduleDays(items,start);
  const last = days[6].date;
  const month = huMonth.format(new Date(`${start}T12:00:00Z`));
  const heading = `${huDate.format(new Date(`${start}T12:00:00Z`))} – ${huDate.format(new Date(`${last}T12:00:00Z`))}`;
  const empty = String(config.emptyText || 'Erre a hétre nincs meghirdetett adás.');
  return `<div class="sanci-week-calendar" data-schedule-week-start="${start}" aria-label="Heti adásrend">`+
    `<div class="sanci-week-toolbar"><div class="sanci-week-heading"><strong>${escapeHTML(heading)}</strong><span>${escapeHTML(month)} · Europe/Budapest</span></div>`+
    `<div class="sanci-week-navigation" role="group" aria-label="Hétválasztás">`+
    `<button type="button" data-schedule-week-action="previous" aria-label="Előző hét">‹</button>`+
    `<button type="button" data-schedule-week-action="today">Aktuális hét</button>`+
    `<button type="button" data-schedule-week-action="next" aria-label="Következő hét">›</button>`+
    `</div></div><div class="sanci-week-grid">`+
    days.map((day,index)=>`<section class="sanci-week-day${day.date===today?' is-today':''}" aria-label="${escapeHTML(WEEKDAYS[index])}, ${escapeHTML(day.date)}"${day.date===today?' aria-current="date"':''}>`+
      `<header class="sanci-week-day-header"><span>${WEEKDAYS[index]}</span><strong>${day.date.slice(-2)}.</strong></header>`+
      `<div class="sanci-week-day-events">${day.items.length?day.items.map(item=>scheduleCard(item,config)).join(''):'<span class="sanci-week-day-empty">Nincs adás</span>'}</div></section>`).join('')+
    `</div>${days.every(day=>!day.items.length)?`<p class="sanci-week-global-empty" role="status">${escapeHTML(empty)}</p>`:''}</div>`;
}
