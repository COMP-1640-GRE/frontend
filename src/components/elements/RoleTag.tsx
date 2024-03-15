import { Tag } from "antd";
import { TagProps } from "antd/lib";
import React from "react";
import { UserRole } from "../../enums/user.enum";
import { capitalize } from "lodash";

interface IProps extends TagProps {
  role: UserRole;
}

const RoleTag = ({ role, ...props }: IProps) => {
  console.log(role);

  return (
    <Tag color={ROLE_TAG_COLOR[role]} {...props}>
      {capitalize(role.replaceAll("_", " "))}
    </Tag>
  );
};

export default RoleTag;

const ROLE_TAG_COLOR: Record<UserRole, TagProps["color"]> = {
  administrator: "blue",
  faculty_marketing_coordinator: "orange",
  university_marketing_manager: "green",
  guest: "geekblue",
  student: "purple",
};
