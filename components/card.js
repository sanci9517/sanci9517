export function Card(title, content, detail = '') {
  return `
    <article class="card">
      <div class="card-label">${title}</div>
      <div class="card-content">${content}</div>
      <p class="card-detail">${detail}</p>
    </article>
  `;
}
