import { FloatButton, Space, Form, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { baseURL } from "../../services/apis";
import ContributionStats from "./components/ContributionStats";
import UserStats from "./components/UserStats";
import Stats from "./components/Stats";
import FacultyStats from "./components/FacultyStats";
import SemesterStats from "./components/SemesterStats";
import { Popover } from "antd/lib";
import { ControlOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { Dayjs } from "dayjs";
import { useIdentity } from "../../hooks/useIdentity";
import { UserRole } from "../../enums/user.enum";
import General from "./components/General";

type FilterForm = { date?: Dayjs[] };

const Dashboard = () => {
  const { role, id, faculty } = useIdentity();

  const [key, setKey] = useState(0);
  const [filter, setFilter] = useState({
    faculty_id:
      role && [UserRole.COORDINATOR, UserRole.GUEST].includes(role)
        ? faculty?.id
        : undefined,
    user_id: role === UserRole.STUDENT ? id : undefined,
  });
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

  return (
    <>
      <Space direction="vertical">
        <ContributionStats key={`ContributionStats-${key}`} query={filter} />
        <UserStats key={`UserStats-${key}`} query={filter} />
        <Stats
          title="Notifications"
          url="/dashboard/notifications-stats"
          key={`Notifications-${key}`}
          query={filter}
        />
        <FacultyStats key={`FacultyStats-${key}`} query={filter} />
        <SemesterStats key={`SemesterStats-${key}`} query={filter} />
        <General key={`General-${key}`} query={filter} />
      </Space>
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
    </>
  );
};

export default Dashboard;
