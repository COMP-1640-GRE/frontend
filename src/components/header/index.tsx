import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity, useLogout } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Dropdown,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext } from "../../contexts/color-mode";
import { Identity } from "../../services/types";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<Identity>();
  const { mode, setMode } = useContext(ColorModeContext);
  const { mutate: logout } = useLogout();
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                label: <Link to="/change-password">Change password</Link>,
                key: "change-password",
              },
              {
                label: <Link to="/update-profile">Update profile</Link>,
                key: "update-profile",
              },
              {
                label: "Logout",
                key: "logout",
                onClick: () => logout(),
                danger: true,
              },
            ],
          }}
        >
          <Space style={{ marginLeft: "8px" }} size="middle">
            <Avatar src={user?.avatar} alt={user?.full_name} />
            <Text strong>{user?.username}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};
