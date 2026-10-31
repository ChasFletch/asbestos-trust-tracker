// network-events.js
// Sends GA4 events when a visitor clicks through to the firm site or a sister site.
// Same file on every site; it works out which site it is running on by itself.
(function () {
  var FIRM = 'dandell.com';
  var NETWORK = [
    'wikimesothelioma.com',
    'asbestosatlas.org',
    'asbestostrusts.org',
    'lucianomutti.com',
    'puncturefilm.com',
    'mesotheliomalawyersnearme.com'
  ];
  var SELF = location.hostname.replace(/^www\./, '');

  function placement(a) {
    if (a.closest('footer')) return 'footer';
    if (a.closest('header, nav')) return 'header';
    return 'body';
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || typeof window.gtag !== 'function') return;
    var url;
    try { url = new URL(a.href); } catch (err) { return; }
    var host = url.hostname.replace(/^www\./, '');
    if (host === SELF) return;
    var params = {
      link_url: url.origin + url.pathname,
      link_text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
      placement: placement(a),
      transport_type: 'beacon'
    };
    if (host === FIRM) {
      window.gtag('event', 'click_to_firm', params);
    } else if (NETWORK.indexOf(host) !== -1) {
      params.destination = host;
      window.gtag('event', 'click_to_network', params);
    }
  }, true);
})();
