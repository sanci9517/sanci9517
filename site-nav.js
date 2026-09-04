(() => {
  function initSanciNav() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    // Keep the SANCI9517 brand identical on every page.
    header.querySelectorAll('.logo').forEach(el => {
      el.textContent = 'SANCI9517';
    });

    // Replace the button so older inline menu listeners cannot fire twice.
    const oldButton = header.querySelector('.menu-toggle');
    const navLinks = header.querySelector('.nav-links');
    if (!oldButton || !navLinks) return;
    const button = oldButton.cloneNode(true);
    oldButton.replaceWith(button);

    button.type = 'button';
    button.textContent = '☰';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'navLinks');

    const closeMenu = () => {
      navLinks.classList.remove('open');
      button.textContent = '☰';
      button.setAttribute('aria-expanded', 'false');
    };

    button.addEventListener('click', () => {
      const open = !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', open);
      button.textContent = open ? '✕' : '☰';
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });

    // Consistent, simple mobile dropdown across every page.
    if (!document.getElementById('sanci-mobile-nav-style')) {
      const style = document.createElement('style');
      style.id = 'sanci-mobile-nav-style';
      style.textContent = `
        .site-header{overflow:visible!important}
        .site-header .nav{position:relative}
        @media(max-width:760px){
          .site-header .nav{min-height:64px!important;width:min(100% - 28px,1120px)!important}
          .menu-toggle{display:flex!important;width:42px!important;height:42px!important;font-size:21px!important;line-height:1!important;z-index:1002!important}
          .nav-links{display:none!important;position:absolute!important;z-index:1001!important;top:calc(100% + 1px)!important;left:0!important;right:0!important;width:100%!important;flex-direction:column!important;align-items:stretch!important;gap:3px!important;padding:10px!important;background:rgba(10,9,13,.99)!important;border:1px solid rgba(167,139,250,.28)!important;border-top:0!important;border-radius:0 0 14px 14px!important;box-shadow:0 22px 45px rgba(0,0,0,.55)!important}
          .nav-links.open{display:flex!important}
          .nav-links a{display:flex!important;align-items:center!important;min-height:44px!important;padding:10px 13px!important;border-radius:9px!important;font-size:12px!important}
          .nav-links a.active{background:#241c32!important;color:#fff!important}
          .site-twitch-status{max-width:150px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
        }
      `;
      document.head.appendChild(style);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSanciNav);
  else initSanciNav();
})();
