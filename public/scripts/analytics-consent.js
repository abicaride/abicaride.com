(() => {
  const STORAGE_KEY = 'abicaride.analytics-consent';
  const PREFERENCE_VERSION = 1;
  const PREFERENCE_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const root = document.querySelector('[data-analytics-consent]');

  if (!root || root.dataset.initialized === 'true') {
    return;
  }

  root.dataset.initialized = 'true';

  const measurementId = root.dataset.measurementId;
  const heading = root.querySelector('#analytics-consent-title');
  const status = root.querySelector('[data-consent-status]');
  const choiceButtons = [...root.querySelectorAll('[data-consent-choice]')];
  let settingsOpener = null;

  const consentState = (analyticsStorage) => ({
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analyticsStorage,
  });

  const readPreference = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const isValidChoice = stored?.choice === 'granted' || stored?.choice === 'denied';
      const isCurrentVersion = stored?.version === PREFERENCE_VERSION;
      const isCurrent = Date.now() - stored?.updatedAt < PREFERENCE_MAX_AGE;

      if (isValidChoice && isCurrentVersion && isCurrent) {
        return stored.choice;
      }

      localStorage.removeItem(STORAGE_KEY);
    } catch {
      return null;
    }

    return null;
  };

  const savePreference = (choice) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          choice,
          updatedAt: Date.now(),
          version: PREFERENCE_VERSION,
        }),
      );
    } catch {
      // Without local storage, the choice applies only to the current page.
    }
  };

  const setChoiceState = (choice) => {
    choiceButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.consentChoice === choice));
    });

    if (choice && status) {
      status.textContent =
        choice === 'granted' ? root.dataset.statusGranted : root.dataset.statusDenied;
      status.hidden = false;
    } else if (status) {
      status.textContent = '';
      status.hidden = true;
    }
  };

  const showSettings = (opener = null) => {
    settingsOpener = opener;
    setChoiceState(readPreference());
    root.hidden = false;

    if (opener && heading) {
      heading.focus();
    }
  };

  const hideSettings = () => {
    root.hidden = true;

    if (settingsOpener?.isConnected) {
      settingsOpener.focus();
    }

    settingsOpener = null;
  };

  const clearAnalyticsCookies = () => {
    const cookieNames = document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'));
    const domains = ['', location.hostname, `.${location.hostname}`, '.abicaride.com'];

    cookieNames.forEach((name) => {
      domains.forEach((domain) => {
        const domainAttribute = domain ? `; Domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domainAttribute}`;
      });
    });
  };

  const loadAnalytics = () => {
    if (
      window.__abicarideAnalyticsActive ||
      !measurementId ||
      !/^G-[A-Z0-9]+$/.test(measurementId)
    ) {
      return;
    }

    window.__abicarideAnalyticsActive = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'default', consentState('denied'));
    window.gtag('consent', 'update', consentState('granted'));
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_update: false,
    });

    const googleTag = document.createElement('script');
    googleTag.async = true;
    googleTag.dataset.googleAnalytics = 'true';
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(googleTag);
  };

  const grantAnalytics = () => {
    savePreference('granted');
    setChoiceState('granted');
    loadAnalytics();
    hideSettings();
  };

  const denyAnalytics = () => {
    const wasActive = Boolean(window.__abicarideAnalyticsActive);

    savePreference('denied');
    setChoiceState('denied');

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consentState('denied'));
    }

    clearAnalyticsCookies();
    hideSettings();

    if (wasActive) {
      location.reload();
    }
  };

  document.addEventListener('click', (event) => {
    const settingsLink = event.target.closest('[data-cookie-settings]');

    if (settingsLink) {
      event.preventDefault();
      showSettings(settingsLink);
    }
  });

  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.consentChoice === 'granted') {
        grantAnalytics();
      } else {
        denyAnalytics();
      }
    });
  });

  const preference = readPreference();

  if (preference === 'granted') {
    setChoiceState('granted');
    loadAnalytics();
  } else if (preference === 'denied') {
    setChoiceState('denied');
  } else {
    showSettings();
  }
})();
