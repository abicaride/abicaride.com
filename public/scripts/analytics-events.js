(() => {
  const locale = document.documentElement.lang;
  const debugMode = new URLSearchParams(location.search).get('debug_ga') === '1';
  let projectViewSent = false;

  const trackAnalyticsEvent = (name, parameters) => {
    if (!window.__abicarideAnalyticsActive || typeof window.gtag !== 'function') {
      return false;
    }

    window.gtag('event', name, {
      ...parameters,
      ...(debugMode ? { debug_mode: true } : {}),
    });
    return true;
  };

  const trackProjectView = () => {
    if (projectViewSent) return;

    const project = document.querySelector('[data-analytics-project-view]');
    if (!project) return;

    projectViewSent = trackAnalyticsEvent('project_view', {
      project_key: project.dataset.projectKey,
      project_slug: project.dataset.projectSlug,
      project_title: project.dataset.projectTitle,
      project_category: project.dataset.projectCategory,
      locale,
    });
  };

  document.addEventListener('abicaride:analytics-active', trackProjectView);
  trackProjectView();

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element
      ? event.target.closest('a[data-analytics-cv-location]')
      : null;
    if (!link) return;

    const url = new URL(link.href);
    trackAnalyticsEvent('cv_download', {
      locale,
      file_name: url.pathname.split('/').pop(),
      link_url: url.href,
      link_location: link.dataset.analyticsCvLocation,
    });
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('[data-analytics-contact-form]')) return;
    if (event.defaultPrevented || !form.checkValidity()) return;

    trackAnalyticsEvent('contact_submit', {
      locale,
      form_id: form.dataset.analyticsFormId,
    });
  });
})();
