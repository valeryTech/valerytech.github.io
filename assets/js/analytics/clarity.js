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

  window.siteAnalytics?.subscribe(({ name }) => {
    if (typeof name === "string") {
      Clarity.event(name);
    }
  });
}
