// --------------------------------------------
// OFFLINE-FIRST ANALYTICS MODULE
// --------------------------------------------
import posthog from "posthog-js";

// Storage key for queued events
const QUEUE_KEY = "cq_event_queue";

// Load pseudonymous ID
function getUserId() {
  let id = localStorage.getItem("cq_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cq_user_id", id);
  }
  return id;
}

// Load existing queue
function loadQueue(): Array<Record<string, unknown>> {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save queue
function saveQueue(queue: Array<Record<string, unknown>>) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

// Add event to offline queue
function queueEvent(event: string, props: Record<string, unknown>) {
  const queue = loadQueue();
  queue.push({
    event,
    props,
    timestamp: Date.now(),
  });
  saveQueue(queue);
}

// Try to flush events when online
async function flushQueue() {
  if (!navigator.onLine) return;

  const queue = loadQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      await posthog.capture(item.event as string, item.props as Record<string, unknown>);
    } catch (err) {
      console.warn("Still offline or PostHog down. Keeping events queued:", err);
      return;
    }
  }

  // Clear queue after successful flush
  saveQueue([]);
  console.log("Offline analytics flushed successfully!");
}

// Watch for return of connectivity
window.addEventListener("online", () => {
  flushQueue();
});

/* ------------------------------------------------
   INIT ANALYTICS
--------------------------------------------------- */
export function initAnalytics() {
  posthog.init("phc_nMFO0p1ow5HUlTaiPEmXoyivOET9LJXr1w2t7r8bDDF", {
    api_host: "https://app.posthog.com",
    autocapture: false,
    capture_pageview: false,
    persistence: "localStorage",
  });

  posthog.identify(getUserId());

  // Try flush immediately on load
  flushQueue();
}

/* ------------------------------------------------
   TRACK EVENT (with offline fallback)
--------------------------------------------------- */
export function track(event: string, props: Record<string, unknown> = {}) {
  // Add internal metadata
  const payload = {
    ...props,
    deviceTime: new Date().toISOString(),
  };

  // If offline -> queue it
  if (!navigator.onLine) {
    queueEvent(event, payload);
    return;
  }

  try {
    posthog.capture(event, payload);
  } catch (error) {
    // If capture fails (PostHog down), queue it
    console.warn("PostHog capture failed:", error);
    queueEvent(event, payload);
  }
}

/* ------------------------------------------------
   PREDEFINED EVENT HELPERS
--------------------------------------------------- */
export const Analytics = {
  appStarted: () => track("app_started"),
  landingViewed: () => track("landing_viewed"),
  libraryOpened: () => track("library_opened"),

  // QR scanning
  qrSuccess: (questId: string) =>
    track("qr_scan_success", { questId }),

  qrFail: (error?: string) =>
    track("qr_scan_fail", { error }),

  // AR
  arStarted: (questId: string) =>
    track("ar_started", { questId }),

  arFailed: (questId: string, error: string) =>
    track("ar_failed", { questId, error }),

  // Quests
  questViewed: (questId: string) =>
    track("quest_viewed", { questId }),

  questStarted: (questId: string) =>
    track("quest_started", { questId }),

  questChoice: (
    questId: string,
    sceneId: string,
    choiceType: string,
    text: string
  ) =>
    track("quest_choice", { questId, sceneId, choiceType, text }),

  questCompleted: (questId: string, xp: number, badge: string) =>
    track("quest_completed", { questId, xp, badge }),

  // Help Now
  helpOpened: (country: string) =>
    track("help_opened", { country }),

  helpResourceClicked: (
    country: string,
    resourceName: string,
    contactType: string
  ) =>
    track("help_resource_click", {
      country,
      resourceName,
      contactType,
    }),

  // Reports
  reportSubmitted: (category: string, anonymous: boolean) =>
    track("report_submitted", { category, anonymous }),
};