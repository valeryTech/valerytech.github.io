"use strict";

import * as params from "@params";
import posthog from "posthog-js";
import { ANALYTICS_SCHEMA_VERSION, sanitizePostHogEvent } from "./helpers.mjs";

const projectToken = params.posthogProjectToken;
const apiHost = params.posthogHost || "https://us.i.posthog.com";

if (projectToken) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    autocapture: {
      capture_copied_text: false,
      css_selector_ignorelist: [
        ".ph-no-autocapture",
        "[data-ph-no-autocapture]",
        ".ph-no-capture",
      ],
    },
    before_send: (event) => sanitizePostHogEvent(event, window.location.href),
    capture_dead_clicks: true,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    capture_heatmaps: true,
    capture_pageview: false,
    capture_pageleave: true,
    capture_performance: {
      network_timing: false,
      web_vitals: true,
      web_vitals_allowed_metrics: ["LCP", "CLS", "FCP", "INP"],
      web_vitals_attribution: ["LCP", "INP"],
    },
    disable_session_recording: true,
    person_profiles: "never",
    rageclick: true,
    respect_dnt: true,
  });

  const pageContext = {
    schema_version: ANALYTICS_SCHEMA_VERSION,
    ...(window.siteAnalytics?.context || {}),
  };
  posthog.register(pageContext);
  posthog.capture("$pageview", pageContext);

  window.siteAnalytics?.subscribe(({ name, parameters }) => {
    if (typeof name === "string") {
      posthog.capture(name, {
        schema_version: ANALYTICS_SCHEMA_VERSION,
        ...parameters,
      });
    }
  });
}
