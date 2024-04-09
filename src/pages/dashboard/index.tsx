import { Space } from "antd";
import { useEffect } from "react";
import { baseURL } from "../../services/apis";
import ContributionStats from "./components/ContributionStats";
import UserStats from "./components/UserStats";
import Stats from "./components/Stats";
import FacultyStats from "./components/FacultyStats";
import SemesterStats from "./components/SemesterStats";

const Dashboard = () => {
  useEffect(() => {
    const event = new EventSource(`${baseURL}/events/dashboard`, {
      withCredentials: true,
    });
    event.addEventListener("dashboard", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("dashboard", data);
      } catch {
        //
      }
    });

    return () => {
      event.close();
    };
  }, []);

  return (
    <Space direction="vertical">
      <ContributionStats />
      <UserStats />
      <Stats title="Notifications" url="/dashboard/notifications-stats" />
      <FacultyStats />
      <SemesterStats />
    </Space>
  );
};

export default Dashboard;
