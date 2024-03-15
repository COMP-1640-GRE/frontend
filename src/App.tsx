import { ErrorComponent, useNotificationProvider } from "@refinedev/antd";
import { I18nProvider, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import nestjsxCrudDataProvider from "@refinedev/nestjsx-crud";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { authRoutes, nonAuthRoutes } from "./pages/routes";
import { AuthElement, NonAuthElement } from "./pages/routes/element";
import { resources } from "./refineResources";
import { authProvider } from "./services/authProvider";

import "@refinedev/antd/dist/reset.css";
import { useTranslation } from "react-i18next";
import { accessControlProvider } from "./services/access-control-provider";
import api, { baseURL } from "./services/apis";

function App() {
  const dataProvider = nestjsxCrudDataProvider(baseURL, api);
  const { t, i18n } = useTranslation();
  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any, defaultValue?: string) =>
      (t(key, options) as any) || defaultValue || key,
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              routerProvider={routerBindings}
              resources={resources}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              <Routes>
                <Route element={AuthElement}>
                  <Route
                    index
                    // TODO: navigate to resource based on user role
                    element={<NavigateToResource resource="blog_posts" />}
                  />
                  {authRoutes.map((route) => (
                    <Route key={route.path} {...route} />
                  ))}
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route element={NonAuthElement}>
                  {nonAuthRoutes.map((route) => (
                    <Route key={route.path} {...route} />
                  ))}
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
