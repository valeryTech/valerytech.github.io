"use strict";

import * as params from "@params";
import Clarity from "@microsoft/clarity";

const projectId = params.clarityProjectId;

if (projectId) {
  Clarity.init(projectId);
  Clarity.consentV2({
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });

  window.siteAnalytics?.subscribe(({ name, parameters }) => {
    if (typeof name === "string") {
      if (name === "not_found_viewed") {
        Clarity.setTag("page_kind", "404");
        for (const key of [
          "requested_path",
          "referrer_type",
          "referrer_host",
          "referrer_path",
          "site_release",
        ]) {
          const value = parameters[key];
          if (typeof value === "string" && value.length > 0) {
            Clarity.setTag(key, value.slice(0, 255));
          }
        }
      }
      Clarity.event(name);
    }
  });
}
