import { VueQueryPlugin } from "@tanstack/vue-query";

import * as Pinia from "pinia";
import { createSSRApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import "./router";
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  app.use(i18n);
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    },
  });
  app.config.globalProperties.$t = i18n.global.t;
  return {
    app,
    Pinia,
  };
}
