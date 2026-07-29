const body = document.body;

if (body && body.dataset.internalNavLockInitialized !== "true") {
  body.dataset.internalNavLockInitialized = "true";

  const hasBlockedRegion = (anchor: HTMLAnchorElement): boolean =>
    Boolean(anchor.closest("[data-block-internal-nav-region]"));

  const isHomeMainLink = (anchor: HTMLAnchorElement): boolean =>
    body.dataset.disableHomeInternalNav === "true" && Boolean(anchor.closest("main"));

  const isBlockedContext = (anchor: HTMLAnchorElement): boolean => hasBlockedRegion(anchor) || isHomeMainLink(anchor);

  const isInternalPageNavigation = (anchor: HTMLAnchorElement): boolean => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || /^(?:tel:|mailto:|sms:|javascript:)/i.test(href)) {
      return false;
    }

    let targetUrl: URL;

    try {
      targetUrl = new URL(href, window.location.href);
    } catch {
      return false;
    }

    if (targetUrl.origin !== window.location.origin) {
      return false;
    }

    const currentUrl = new URL(window.location.href);
    return targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search;
  };

  const resolveBlockedAnchor = (target: EventTarget | null): HTMLAnchorElement | null => {
    if (!(target instanceof Element)) {
      return null;
    }

    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) {
      return null;
    }

    if (!isBlockedContext(anchor) || !isInternalPageNavigation(anchor)) {
      return null;
    }

    return anchor;
  };

  const preventInternalNavigation = (event: Event): void => {
    if (!resolveBlockedAnchor(event.target)) {
      return;
    }

    event.preventDefault();
  };

  document.addEventListener("click", preventInternalNavigation, true);
  document.addEventListener("auxclick", preventInternalNavigation, true);
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Enter") {
        return;
      }

      preventInternalNavigation(event);
    },
    true
  );
}
