import { BellOutlined } from "@ant-design/icons";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useInfiniteList, useLogout, useNotification } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Button,
  Divider,
  Dropdown,
  List,
  Popover,
  Skeleton,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import React, { useContext, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { ColorModeContext } from "../../contexts/color-mode";
import { useIdentity } from "../../hooks/useIdentity";
import dayjs from "../../libs/dayjs";
import { baseURL } from "../../services/apis";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const user = useIdentity();
  const { mode, setMode } = useContext(ColorModeContext);
  const { mutate: logout } = useLogout();
  const { id } = useIdentity();
  const { open } = useNotification();
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

  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteList({
    resource: "notifications",
  });

  const allPages = (data?.pages ?? []).flatMap((page) => page.data);

  useEffect(() => {
    if (!id) return;
    const event = new EventSource(`${baseURL}/events/notifications`, {
      withCredentials: true,
    });
    event.onmessage = () => {
      console.log("onmessage");
    };
    event.addEventListener(`${id}`, (event) => {
      console.log("event", event);
      try {
        const data = JSON.parse(event.data);
        console.log("event.data", data);
        open?.({
          type: "success",
          description: "Notification",
          message: data.content,
        });
        refetch();
      } catch {
        //
      }
    });

    return () => {
      event.close();
    };
  }, [id]);

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Popover
          trigger={["click"]}
          onOpenChange={(visible) => visible && refetch()}
          content={
            <div
              id="scrollableNotification"
              className="max-h-[300px] overflow-y-scroll w-full md:w-96"
            >
              <InfiniteScroll
                dataLength={allPages.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableNotification"
              >
                <List
                  dataSource={allPages}
                  renderItem={(item: any) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={<BellOutlined />}
                            className="bg-white/10"
                          />
                        }
                        title={item.content}
                        description={dayjs(item.created_at).utc(true).fromNow()}
                      />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          }
        >
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined />}
            size="large"
          />
        </Popover>
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
