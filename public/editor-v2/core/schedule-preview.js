import { normalizeScheduleConfig } from './schedule-schema.js';

const PREVIEW_ITEMS = Object.freeze([
  {
    id: 'preview-1',
    title: 'Következő stream',
    platform: 'Twitch',
    startsAt: '2026-09-23T15:00:00',
    endsAt: '2026-09-23T17:00:00',
    status: 'scheduled',
    url: 'https://www.twitch.tv/sanci9517',
    notes: 'Editor preview mintaadat'
  },
  {
    id: 'preview-2',
    title: 'Közösségi stream',
    platform: 'YouTube',
    startsAt: '2026-09-25T18:00:00',
    endsAt: null,
    status: 'scheduled',
    url: 'https://www.youtube.com/@sanci9517',
    notes: ''
  }
]);

export function getSchedulePreviewItems(config = {}) {
  const normalized = normalizeScheduleConfig(config);
  let items = PREVIEW_ITEMS.filter((item) => normalized.statuses.includes(item.status));
  if (normalized.platforms.length) {
    items = items.filter((item) => normalized.platforms.includes(item.platform));
  }
  if (normalized.order === 'desc') items = [...items].reverse();
  if (normalized.mode === 'next') items = items.slice(0, 1);
  return items.slice(0, normalized.limit);
}

function formatScheduleDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function renderSchedulePreview(container, config = {}) {
  const normalized = normalizeScheduleConfig(config);
  const items = getSchedulePreviewItems(normalized);
  container.replaceChildren();
  container.classList.add('schedule-preview');

  const header = document.createElement('div');
  header.className = 'schedule-preview-header';
  const title = document.createElement('strong');
  title.textContent = 'Adásrend';
  const badge = document.createElement('span');
  badge.textContent = 'PREVIEW';
  header.append(title, badge);
  container.append(header);

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'schedule-preview-empty';
    empty.textContent = normalized.emptyText;
    container.append(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'schedule-preview-list';

  for (const item of items) {
    const card = document.createElement('article');
    card.className = 'schedule-preview-card';

    if (normalized.showTitle) {
      const itemTitle = document.createElement('strong');
      itemTitle.className = 'schedule-preview-title';
      itemTitle.textContent = item.title;
      card.append(itemTitle);
    }

    const meta = document.createElement('div');
    meta.className = 'schedule-preview-meta';

    if (normalized.showPlatform) {
      const platform = document.createElement('span');
      platform.textContent = item.platform;
      meta.append(platform);
    }

    if (normalized.showTime) {
      const time = document.createElement('span');
      time.textContent = formatScheduleDate(item.startsAt);
      meta.append(time);
    }

    if (normalized.showEndTime && item.endsAt) {
      const end = document.createElement('span');
      end.textContent = formatScheduleDate(item.endsAt);
      meta.append(end);
    }

    if (meta.childElementCount) card.append(meta);

    if (normalized.showStatus) {
      const status = document.createElement('span');
      status.className = 'schedule-preview-status';
      status.textContent = item.status;
      card.append(status);
    }

    if (normalized.showNotes && item.notes) {
      const notes = document.createElement('p');
      notes.className = 'schedule-preview-notes';
      notes.textContent = item.notes;
      card.append(notes);
    }

    if (normalized.showLink && item.url) {
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Megnyitás';
      link.addEventListener('click', (event) => event.stopPropagation());
      card.append(link);
    }

    list.append(card);
  }

  container.append(list);
}
