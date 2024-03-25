import { Tag } from "antd";
import { TagProps } from "antd/lib";
import { capitalize } from "lodash";
import { UserRole } from "../../enums/user.enum";
import NotSetTag from "./NotsetTag";

interface IProps extends TagProps {
  role?: UserRole;
}

const RoleTag = ({ role, ...props }: IProps) => {
  if (!role) return <NotSetTag />;

  return (
    <Tag color={TAG_COLOR[role]} {...props}>
      {capitalize(role.replaceAll("_", " "))}
    </Tag>
  );
};

export default RoleTag;

const TAG_COLOR: Record<UserRole, TagProps["color"]> = {
  administrator: "blue",
  faculty_marketing_coordinator: "orange",
  university_marketing_manager: "green",
  guest: "geekblue",
  student: "purple",
};
