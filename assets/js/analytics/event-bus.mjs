export function createAnalyticsBus(context = {}, maximumQueuedEvents = 100) {
  const events = [];
  const subscribers = new Set();

  function deliver(subscriber, event) {
    try {
      subscriber(event);
    } catch (error) {
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          throw error;
        }, 0);
      }
    }
  }

  return {
    context,
    emit(name, parameters = {}) {
      if (typeof name !== "string" || name.length === 0) return;
      const event = { name, parameters };
      events.push(event);
      if (events.length > maximumQueuedEvents) events.shift();
      subscribers.forEach((subscriber) => deliver(subscriber, event));
    },
    subscribe(subscriber) {
      if (typeof subscriber !== "function") return () => {};
      events.forEach((event) => deliver(subscriber, event));
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  };
}

if (typeof window !== "undefined") {
  window.siteAnalytics = createAnalyticsBus(
    window.__siteAnalyticsContext || {}
  );
  delete window.__siteAnalyticsContext;
}
