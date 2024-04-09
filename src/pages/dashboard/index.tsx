import { FloatButton, Space, Form, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { baseURL } from "../../services/apis";
import ContributionStats from "./components/ContributionStats";
import UserStats from "./components/UserStats";
import Stats from "./components/Stats";
import FacultyStats from "./components/FacultyStats";
import SemesterStats from "./components/SemesterStats";
import { Popover } from "antd/lib";
import { ControlOutlined, SettingOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { Dayjs } from "dayjs";

type FilterForm = { date?: Dayjs[] };

const Dashboard = () => {
  const [key, setKey] = useState(0);
  const [filter, setFilter] = useState({});
  const { formProps, form } = useForm<FilterForm>();

  useEffect(() => {
    const event = new EventSource(`${baseURL}/events/dashboard`, {
      withCredentials: true,
    });
    event.addEventListener("dashboard", () => {
      try {
        console.log("hi");
        setKey((prev) => prev + 1);
      } catch {
        //
      }
    });

    return () => {
      event.close();
    };
  }, []);

  console.log(filter);
  return (
    <Space direction="vertical">
      <ContributionStats key={key} query={filter} />
      <UserStats key={key} query={filter} />
      <Stats
        title="Notifications"
        url="/dashboard/notifications-stats"
        key={key}
        query={filter}
      />
      <FacultyStats key={key} query={filter} />
      <SemesterStats key={key} query={filter} />
      <Popover
        onOpenChange={(open) => {
          if (open) return;

          const fields: FilterForm = form.getFieldsValue();
          const { date = [], ...rest } = fields;
          const [from, to] = date;

          setFilter((prev) => ({
            ...prev,
            ...rest,
            from: from?.toISOString(),
            to: to?.toISOString(),
          }));
        }}
        placement="topLeft"
        trigger="click"
        content={
          <Form {...formProps} layout="vertical">
            <Form.Item name="date" label="Data">
              <DatePicker.RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        }
      >
        <FloatButton icon={<ControlOutlined />} />
      </Popover>
    </Space>
  );
};

export default Dashboard;
