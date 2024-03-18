import { ThemedLayoutV2, ThemedSiderV2, ThemedTitleV2 } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import {
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router-v6";
import { Outlet } from "react-router-dom";
import { Header } from "../../components";
import { AppIcon } from "../../components/app-icon";

export const AuthElement = (
  <Authenticated
    key="authenticated-inner"
    fallback={<CatchAllNavigate to="/login" />}
  >
    <ThemedLayoutV2
      Header={() => <Header sticky />}
      Sider={(props) => (
        <ThemedSiderV2 {...props} fixed render={({ items }) => <>{items}</>} />
      )}
      Title={({ collapsed }) => (
        <ThemedTitleV2
          collapsed={collapsed}
          text="frontend"
          icon={<AppIcon />}
        />
      )}
    >
      <Outlet />
    </ThemedLayoutV2>
  </Authenticated>
);

export const NonAuthElement = (
  <Authenticated key="authenticated-outer" fallback={<Outlet />}>
    <NavigateToResource />
  </Authenticated>
);
